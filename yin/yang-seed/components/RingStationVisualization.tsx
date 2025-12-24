import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const RingSpaceStationVR = () => {
  const containerRef = useRef(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentRing, setCurrentRing] = useState('hub');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTrails, setShowTrails] = useState(true);
  const [vrSupported, setVrSupported] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const distance = 100;
    const height = distance * Math.sin(Math.PI / 4);
    const horizontalDistance = distance * Math.cos(Math.PI / 4);
    camera.position.set(0, height, horizontalDistance);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Enable WebXR
    renderer.xr.enabled = true;
    
    containerRef.current.appendChild(renderer.domElement);

    // Check for VR support and add VR button
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setVrSupported(supported);
        if (supported) {
          const vrButton = document.createElement('button');
          vrButton.textContent = 'ENTER VR';
          vrButton.className = 'absolute bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg cursor-pointer z-50';
          
          vrButton.onclick = () => {
            if (renderer.xr.isPresenting) {
              renderer.xr.getSession().end();
            } else {
              navigator.xr.requestSession('immersive-vr', {
                optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking']
              }).then((session) => {
                renderer.xr.setSession(session);
              });
            }
          };
          
          containerRef.current.appendChild(vrButton);
        }
      });
    }

    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 50, 0);
    scene.add(topLight);

    const starsGeometry = new THREE.BufferGeometry();
    const starsVertices = [];
    for (let i = 0; i < 2000; i++) {
      starsVertices.push(
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600,
        (Math.random() - 0.5) * 600
      );
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.6
    })));

    const stationGroup = new THREE.Group();
    scene.add(stationGroup);

    const serviceRingRadius = 25;
    const apiRingRadius = 45;

    const createRingGuide = (radius, color) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.1, 16, 100),
        new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.3
        })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.2;
      return ring;
    };

    stationGroup.add(createRingGuide(serviceRingRadius, 0x00d4ff));
    stationGroup.add(createRingGuide(apiRingRadius, 0xff4488));

    const createCube = (size, color, emissiveIntensity = 0.3) => {
      return new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshStandardMaterial({
          color: color,
          emissive: color,
          emissiveIntensity: emissiveIntensity,
          roughness: 0.4,
          metalness: 0.6
        })
      );
    };

    const createConnection = (start, end, color) => {
      return new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([start, end]),
        new THREE.LineBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4
        })
      );
    };

    const createTrail = (x, z, color, count = 5) => {
      const trail = [];
      const angle = Math.atan2(z, x);
      for (let i = 1; i <= count; i++) {
        const trailCube = createCube(0.4, color, 0.2);
        const dist = apiRingRadius + (i * 3);
        trailCube.position.set(Math.cos(angle) * dist, 0, Math.sin(angle) * dist);
        trailCube.material.opacity = 0.6 - (i * 0.1);
        trailCube.material.transparent = true;
        trail.push(trailCube);
        stationGroup.add(trailCube);
      }
      return trail;
    };

    const services = [
      {
        name: 'Google',
        color: 0xff4444,
        apis: [
          { name: 'Gmail', color: 0xff6b6b },
          { name: 'Calendar', color: 0xff8888 },
          { name: 'Drive', color: 0xffaaaa }
        ]
      },
      {
        name: 'AWS',
        color: 0xff9900,
        apis: [
          { name: 'S3', color: 0xffaa44 },
          { name: 'Lambda', color: 0xffbb66 }
        ]
      },
      {
        name: 'Stripe',
        color: 0x6772e5,
        apis: [
          { name: 'Payments', color: 0x8899ff }
        ]
      },
      {
        name: 'Twilio',
        color: 0xf22f46,
        apis: [
          { name: 'SMS', color: 0xff5566 }
        ]
      },
      {
        name: 'Auth0',
        color: 0xeb5424,
        apis: [
          { name: 'OAuth', color: 0xff7744 }
        ]
      }
    ];

    const centralHub = createCube(4, 0x00d4ff, 0.6);
    centralHub.userData = { type: 'hub', label: 'Core App', ring: 'hub', index: 0 };
    stationGroup.add(centralHub);

    const ringStructure = { hub: [centralHub], service: [], api: [] };
    const allModules = [centralHub];
    const trails = [];

    const serviceCount = services.length;
    services.forEach((service, index) => {
      const angle = (index / serviceCount) * Math.PI * 2;
      const x = Math.cos(angle) * serviceRingRadius;
      const z = Math.sin(angle) * serviceRingRadius;

      const serviceCube = createCube(2.8, service.color, 0.4);
      serviceCube.position.set(x, 0, z);
      serviceCube.userData = {
        type: 'service',
        label: service.name,
        ring: 'service',
        index: index,
        color: service.color
      };
      stationGroup.add(serviceCube);
      allModules.push(serviceCube);
      ringStructure.service.push(serviceCube);
      stationGroup.add(createConnection(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 0, z), service.color));

      const apiStartIndex = ringStructure.api.length;
      const serviceAngleSpan = (Math.PI * 2) / serviceCount;
      
      service.apis.forEach((api, apiIndex) => {
        const numApis = service.apis.length;
        const maxSpread = serviceAngleSpan * 0.7;
        const angleOffset = numApis === 1 ? 0 : ((apiIndex / (numApis - 1)) * 2 - 1) * (maxSpread / 2);
        const apiAngle = angle + angleOffset;
        const apiX = Math.cos(apiAngle) * apiRingRadius;
        const apiZ = Math.sin(apiAngle) * apiRingRadius;

        const apiCube = createCube(1.6, api.color, 0.3);
        apiCube.position.set(apiX, 0, apiZ);
        apiCube.userData = {
          type: 'api',
          label: api.name,
          parent: service.name,
          ring: 'api',
          index: apiStartIndex + apiIndex,
          serviceIndex: index,
          color: api.color
        };
        stationGroup.add(apiCube);
        allModules.push(apiCube);
        ringStructure.api.push(apiCube);
        stationGroup.add(createConnection(new THREE.Vector3(x, 0, z), new THREE.Vector3(apiX, 0, apiZ), api.color));
        trails.push({ cubes: createTrail(apiX, apiZ, api.color), visible: showTrails });
      });
    });

    const selector = new THREE.Mesh(
      new THREE.TorusGeometry(2.5, 0.25, 16, 100),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xffffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.8
      })
    );
    selector.rotation.x = Math.PI / 2;
    selector.position.set(0, 0.1, 0);
    stationGroup.add(selector);

    const hoverDisplay = new THREE.Group();
    hoverDisplay.position.set(0, 40, 0);
    scene.add(hoverDisplay);

    const createDataViz = (moduleData) => {
      while (hoverDisplay.children.length) hoverDisplay.remove(hoverDisplay.children[0]);
      if (!moduleData) return;

      const container = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshStandardMaterial({
          color: moduleData.userData.color || 0xffffff,
          transparent: true,
          opacity: 0.15,
          roughness: 0.2,
          metalness: 0.8
        })
      );
      hoverDisplay.add(container);
      hoverDisplay.add(new THREE.LineSegments(
        new THREE.EdgesGeometry(container.geometry),
        new THREE.LineBasicMaterial({ color: moduleData.userData.color || 0xffffff, transparent: true, opacity: 0.6 })
      ));

      const requestGroup = new THREE.Group();
      requestGroup.position.x = -6;
      hoverDisplay.add(requestGroup);

      const responseGroup = new THREE.Group();
      responseGroup.position.x = 6;
      hoverDisplay.add(responseGroup);

      for (let i = 0; i < 3; i++) {
        const reqBox = new THREE.Mesh(
          new THREE.BoxGeometry(3, 0.8, 0.5),
          new THREE.MeshStandardMaterial({ color: 0xff6666, emissive: 0xff4444, emissiveIntensity: 0.4, transparent: true, opacity: 0.8 })
        );
        reqBox.position.y = 3 - i * 1.5;
        requestGroup.add(reqBox);
      }

      for (let i = 0; i < 3; i++) {
        const resBox = new THREE.Mesh(
          new THREE.BoxGeometry(3, 0.8, 0.5),
          new THREE.MeshStandardMaterial({ color: 0x66ff66, emissive: 0x44ff44, emissiveIntensity: 0.4, transparent: true, opacity: 0.8 })
        );
        resBox.position.y = 3 - i * 1.5;
        responseGroup.add(resBox);
      }
    };

    let targetRing = 'hub';
    let targetIndex = 0;
    let lastSelectedModule = null;

    const updateSelection = () => {
      const module = ringStructure[targetRing][targetIndex];
      if (module) {
        const label = module.userData.parent ? `${module.userData.parent} > ${module.userData.label}` : module.userData.label;
        setSelectedModule(label);
        setCurrentRing(targetRing);
        setCurrentIndex(targetIndex);
        if (lastSelectedModule !== module) {
          lastSelectedModule = module;
          createDataViz(module);
        }
      }
    };

    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (!['w', 'a', 's', 'd'].includes(key)) return;

      if (key === 'w') {
        if (targetRing === 'api') {
          const currentApi = ringStructure.api[targetIndex];
          targetRing = 'service';
          targetIndex = currentApi.userData.serviceIndex;
        } else if (targetRing === 'service') {
          targetRing = 'hub';
          targetIndex = 0;
        }
      } else if (key === 's') {
        if (targetRing === 'hub') {
          targetRing = 'service';
          targetIndex = 0;
        } else if (targetRing === 'service') {
          const firstApiOfService = ringStructure.api.findIndex(api => api.userData.serviceIndex === targetIndex);
          if (firstApiOfService !== -1) {
            targetRing = 'api';
            targetIndex = firstApiOfService;
          }
        }
      } else if (key === 'a') {
        const ringSize = ringStructure[targetRing].length;
        targetIndex = (targetIndex + 1) % ringSize;
      } else if (key === 'd') {
        const ringSize = ringStructure[targetRing].length;
        targetIndex = (targetIndex - 1 + ringSize) % ringSize;
      }
      updateSelection();
    };

    window.addEventListener('keydown', onKeyDown);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObject = null;

    const onMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allModules);

      if (hoveredObject) {
        const baseInt = hoveredObject.userData.type === 'hub' ? 0.6 : hoveredObject.userData.type === 'service' ? 0.4 : 0.3;
        hoveredObject.material.emissiveIntensity = baseInt;
        hoveredObject = null;
      }

      if (intersects.length > 0) {
        hoveredObject = intersects[0].object;
        hoveredObject.material.emissiveIntensity = 0.8;
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    };

    const onClick = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(allModules);

      if (intersects.length > 0) {
        const clicked = intersects[0].object;
        targetRing = clicked.userData.ring;
        targetIndex = clicked.userData.index;
        updateSelection();
      }
    };

    containerRef.current.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('click', onClick);

    let time = 0;
    
    // Use setAnimationLoop instead of requestAnimationFrame for VR support
    renderer.setAnimationLoop(() => {
      time += 0.01;

      const targetModule = ringStructure[targetRing][targetIndex];
      if (targetModule) {
        const targetAngle = Math.atan2(targetModule.position.x, targetModule.position.z);
        const desiredRotation = -targetAngle;
        let normalizedDiff = desiredRotation - stationGroup.rotation.y;
        while (normalizedDiff > Math.PI) normalizedDiff -= Math.PI * 2;
        while (normalizedDiff < -Math.PI) normalizedDiff += Math.PI * 2;
        stationGroup.rotation.y += normalizedDiff * 0.08;

        selector.position.x += (targetModule.position.x - selector.position.x) * 0.15;
        selector.position.z += (targetModule.position.z - selector.position.z) * 0.15;
        const targetScale = targetRing === 'hub' ? 1.2 : targetRing === 'service' ? 1.0 : 0.7;
        const newScale = selector.scale.x + (targetScale - selector.scale.x) * 0.15;
        selector.scale.set(newScale, newScale, newScale);

        const basePulse = targetModule.userData.type === 'hub' ? 0.6 : targetModule.userData.type === 'service' ? 0.4 : 0.3;
        targetModule.material.emissiveIntensity = basePulse + Math.sin(time * 3) * 0.2;
      }

      selector.rotation.z += 0.02;
      hoverDisplay.rotation.y += 0.008;
      hoverDisplay.rotation.x = Math.sin(time * 0.3) * 0.1;

      allModules.forEach(module => module.rotation.y += 0.005);
      trails.forEach(trail => trail.cubes.forEach(cube => cube.visible = showTrails));

      renderer.render(scene, camera);
    });

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    updateSelection();

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', onKeyDown);
      containerRef.current?.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeEventListener('click', onClick);
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      document.body.style.cursor = 'default';
    };
  }, [showTrails]);

  return (
    <div className="w-full h-screen bg-black relative">
      <div ref={containerRef} className="w-full h-full" />
      
      <div className="absolute top-6 left-6 bg-slate-900/95 backdrop-blur-sm rounded-lg p-5 max-w-sm border border-cyan-500/30">
        <h1 className="text-xl font-bold text-cyan-400 mb-2">Ring Architecture - VR Ready</h1>
        <p className="text-slate-300 text-sm mb-3">
          Navigate with WASD or click. {vrSupported ? 'VR headset detected!' : 'Use desktop mode or connect VR headset.'}
        </p>
        <div className="space-y-2 text-xs mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400"></div>
            <span className="text-slate-300">Center = Core App</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500"></div>
            <span className="text-slate-300">Inner Ring = Services</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-pink-400"></div>
            <span className="text-slate-300">Outer Ring = APIs</span>
          </div>
        </div>
        <div className="pt-3 border-t border-slate-700 space-y-2">
          <div className="text-xs text-slate-400 font-mono">
            Ring: <span className="text-cyan-400">{currentRing}</span> | Index: <span className="text-cyan-400">{currentIndex}</span>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showTrails}
              onChange={(e) => setShowTrails(e.target.checked)}
              className="w-4 h-4"
            />
            Show History Trails
          </label>
        </div>
      </div>

      {selectedModule && (
        <div className="absolute top-6 right-6 bg-slate-900/95 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
          <div className="text-xs text-cyan-400 mb-1">SELECTED</div>
          <h3 className="text-base font-semibold text-white">{selectedModule}</h3>
        </div>
      )}

      <div className="absolute bottom-6 left-6 bg-slate-900/95 backdrop-blur-sm rounded-lg px-6 py-4 border border-cyan-500/30">
        <div className="space-y-2">
          <div className="text-xs text-slate-400 mb-1">Navigation</div>
          <div className="text-sm text-slate-300 font-mono">
            <div className="grid grid-cols-3 gap-1 w-32 mb-2">
              <div></div>
              <kbd className="px-3 py-2 bg-slate-700 rounded text-center">W</kbd>
              <div></div>
              <kbd className="px-3 py-2 bg-slate-700 rounded text-center">A</kbd>
              <kbd className="px-3 py-2 bg-slate-700 rounded text-center">S</kbd>
              <kbd className="px-3 py-2 bg-slate-700 rounded text-center">D</kbd>
            </div>
            <div className="text-xs text-slate-400">
              W/S: In/Out rings<br/>
              A/D: Rotate around ring
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RingSpaceStationVR;