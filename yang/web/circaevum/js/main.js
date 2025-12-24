/**
 * Circaevum Main Application
 * Three.js-based planetary time visualization
 * 
 * This module contains:
 * - Scene initialization and rendering
 * - Planet and worldline creation
 * - Time marker systems
 * - Navigation and controls
 * - Animation loop
 * 
 * Dependencies: Three.js, config.js
 */

// ============================================
// GLOBAL VARIABLES
// ============================================
// Note: Date/time variables are now in datetime.js
// Note: Configuration constants are now in config.js

let scene, camera, renderer;
let planetMeshes = [];
let orbitLines = [];
let worldlines = [];
let timeMarkers = [];
let currentZoom = 2;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let cameraRotation = { x: Math.PI / 6, y: 0 };
let time = 0;
let focusPoint = null; // Initialized in initScene after THREE is loaded
let targetFocusPoint = null; // Initialized in initScene after THREE is loaded
let targetCameraDistance = 800;
let currentCameraDistance = 800;
let cameraTransitionSpeed = 0.15; // Camera transition speed for zoom level changes
let isLightMode = false;
let viewMode = 0; // 0 = angled, 1 = top-down (looking into future), 2 = bottom-up (looking into past)
let stars = null;
let showTimeMarkers = true;
let showMoonWorldline = false; // Toggle for moon worldline
let moonWorldlines = []; // Store moon worldline meshes
let selectionArcs = []; // Store selection arc meshes
let sunMesh = null; // Store sun mesh for position updates
let sunGlow = null; // Store sun glow for position updates
let sunLight = null; // Store sun light for position updates

// Function to get current selection offset in height units (universal across all zoom levels)
function getCurrentSelectionOffset() {
    const currentDateHeight = getHeightForYear(currentYear, 1);
    let offset = 0;
    
    if (currentZoom === 2) { // Decade
        offset = selectedDecadeOffset * (10 * 100);
    } else if (currentZoom === 3) { // Year
        offset = selectedYearOffset * 100;
    } else if (currentZoom === 4) { // Quarter
        const quarterHeight = ZOOM_LEVELS[4].timeYears * 100;
        const monthHeight = quarterHeight / 3;
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
        if (isLeapYear) daysInMonth[1] = 29;
        const dayHeight = monthHeight / daysInMonth[currentMonthInYear];
        const currentMonthInQuarter = currentMonth; // Use actual current month within quarter
        // Include full precision: months within quarter + days within month
        offset = (selectedQuarterOffset * quarterHeight) + (currentMonth * monthHeight) + (currentDayOfMonth * dayHeight) - (currentMonthInQuarter * monthHeight) - (currentDayOfMonth * dayHeight);
    } else if (currentZoom === 5) { // Month
        const monthHeight = ZOOM_LEVELS[5].timeYears * 100;
        const weekHeight = monthHeight / 4;
        const dayHeight = weekHeight / 7;
        offset = (selectedWeekOffset * monthHeight) + (currentWeekInMonth * weekHeight) + (currentDayInWeek * dayHeight) - (currentWeekInMonth * weekHeight) - (currentDayInWeek * dayHeight);
    } else if (currentZoom === 6) { // Lunar
        const lunarHeight = ZOOM_LEVELS[6].timeYears * 100;
        const weekHeight = lunarHeight / 4;
        const currentWeekInLunar = 1;
        offset = (selectedLunarOffset * lunarHeight) + (currentWeekInMonth * weekHeight) - (currentWeekInLunar * weekHeight);
    } else if (currentZoom === 7) { // Week
        const weekHeight = ZOOM_LEVELS[7].timeYears * 100;
        const dayHeight = weekHeight / 7;
        const hourHeight = dayHeight / 24;
        offset = (selectedDayOffset * weekHeight) + (currentDayInWeek * dayHeight) + (currentHourInDay * hourHeight) - (currentDayInWeek * dayHeight) - (currentHourInDay * hourHeight);
    } else if (currentZoom === 8 || currentZoom === 9) { // Day/Clock
        const dayHeight = ZOOM_LEVELS[8].timeYears * 100;
        const hourHeight = dayHeight / 24;
        offset = (selectedHourOffset * dayHeight) + (currentHourInDay * hourHeight) - (14 * hourHeight);
    }
    
    return offset;
}

// Function to apply a height offset to all zoom level variables
function applyOffsetToAllZoomLevels(heightOffset) {
    // Reset all navigation variables to match this height offset
    // This is approximate - we're converting a single height to all the different unit systems
    
    // Decade (10 years = 1000 units)
    selectedDecadeOffset = Math.round(heightOffset / 1000);
    
    // Year (1 year = 100 units)
    selectedYearOffset = Math.round(heightOffset / 100);
    
    // Quarter (0.25 years = 25 units)
    const quarterHeight = ZOOM_LEVELS[4].timeYears * 100;
    const totalQuarterOffset = heightOffset / quarterHeight;
    // Use Math.round for small values, Math.floor/ceil for larger values
    // This prevents tiny floating point errors from causing -1 or +1 jumps
    selectedQuarterOffset = Math.abs(totalQuarterOffset) < 0.5 ? 0 : Math.round(totalQuarterOffset);
    
    // Calculate month within the quarter (0-2)
    // When offset is close to 0 (at current time), use actual system month
    const now = new Date();
    if (Math.abs(heightOffset) < 1) {
        // At or near current time - use actual system month within quarter
        currentMonth = now.getMonth() % 3;
    } else {
        const fractionalQuarter = totalQuarterOffset - selectedQuarterOffset;
        const monthWithinQuarter = Math.floor(Math.abs(fractionalQuarter) * 3);
        currentMonth = Math.max(0, Math.min(2, monthWithinQuarter));
    }
    
    // Month
    const monthHeight = ZOOM_LEVELS[5].timeYears * 100;
    selectedWeekOffset = Math.round(heightOffset / monthHeight);
    
    // Lunar
    const lunarHeight = ZOOM_LEVELS[6].timeYears * 100;
    selectedLunarOffset = Math.round(heightOffset / lunarHeight);
    
    // Week
    const weekHeight = ZOOM_LEVELS[7].timeYears * 100;
    selectedDayOffset = Math.round(heightOffset / weekHeight);
    
    // Day/Hour
    const dayHeight = ZOOM_LEVELS[8].timeYears * 100;
    selectedHourOffset = Math.round(heightOffset / dayHeight);
}

// Format a date for display
function formatDateTime(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return `${month} ${day}, ${year} ${hours}:${mins}`;
}

// Calculate the selected date/time based on navigation variables and current zoom level
function getSelectedDateTime() {
    const now = new Date();
    const selected = new Date(now);
    const actualYear = now.getFullYear();
    const actualMonth = now.getMonth();
    const actualDayInWeek = now.getDay();
    const actualHour = now.getHours();
    
    // Apply offsets based on current zoom level
    switch(currentZoom) {
        case 1: // Century view - year changes by 25-year increments
            // currentYear is modified directly by navigateUnit
            selected.setFullYear(currentYear);
            break;
            
        case 2: // Decade view - currentYear is the selected year
            selected.setFullYear(currentYear);
            break;
            
        case 3: // Year view - selectedYearOffset + currentMonthInYear
            selected.setFullYear(actualYear + selectedYearOffset);
            selected.setMonth(currentMonthInYear);
            break;
            
        case 4: // Quarter view - selectedQuarterOffset + currentMonth
            // currentMonth is 0-2 (month within quarter), selectedQuarterOffset is quarter offset
            // Calculate the absolute selected month
            const systemQuarter = Math.floor(actualMonth / 3); // Current quarter (0-3)
            const selectedQuarter = systemQuarter + selectedQuarterOffset;
            const selectedAbsoluteMonth = (selectedQuarter * 3) + currentMonth;
            // Handle year rollover for months outside 0-11
            const yearAdjust4 = Math.floor(selectedAbsoluteMonth / 12);
            const adjustedMonth4 = ((selectedAbsoluteMonth % 12) + 12) % 12;
            selected.setFullYear(actualYear + yearAdjust4);
            selected.setMonth(adjustedMonth4);
            break;
            
        case 5: // Month view - selectedWeekOffset + currentWeekInMonth + currentDayInWeek
            selected.setMonth(selected.getMonth() + selectedWeekOffset);
            // Calculate day based on week position
            const weekDiff5 = currentWeekInMonth - Math.floor((now.getDate() - 1) / 7);
            const dayDiff5 = currentDayInWeek - actualDayInWeek;
            selected.setDate(selected.getDate() + (weekDiff5 * 7) + dayDiff5);
            break;
            
        case 6: // Lunar view
            // Lunar offset in ~29.5 day cycles
            selected.setDate(selected.getDate() + (selectedLunarOffset * 29));
            break;
            
        case 7: // Week view - selectedDayOffset + currentDayInWeek
            // Calculate the actual selected date:
            // 1. Start from current date
            // 2. Go to Sunday of current week: subtract actualDayInWeek days
            // 3. Go to Sunday of selected week: add (selectedDayOffset * 7) days
            // 4. Go to selected day within that week: add currentDayInWeek days
            const sundayOfCurrentWeek = now.getDate() - actualDayInWeek;
            const sundayOfSelectedWeek = sundayOfCurrentWeek + (selectedDayOffset * 7);
            const selectedDay7 = sundayOfSelectedWeek + currentDayInWeek;
            selected.setDate(selectedDay7);
            break;
            
        case 8: // Day view
        case 9: // Clock view
            const hourDiff = currentHourInDay - actualHour;
            selected.setHours(selected.getHours() + hourDiff + (selectedHourOffset * 24));
            break;
            
        default:
            // For other zoom levels, apply general offsets
            selected.setFullYear(selected.getFullYear() + selectedYearOffset);
            break;
    }
    
    return selected;
}

// Update the time displays in the info panel
function updateTimeDisplays() {
    const now = new Date();
    const selected = getSelectedDateTime();
    
    const currentTimeEl = document.getElementById('current-time');
    const selectedTimeEl = document.getElementById('selected-time');
    
    if (currentTimeEl) {
        currentTimeEl.textContent = formatDateTime(now);
    }
    if (selectedTimeEl) {
        selectedTimeEl.textContent = formatDateTime(selected);
    }
}

let ghostEarth = null; // Ghost version of Earth at current/actual position
let ghostOrbitLine = null; // Ghost version of orbit line
let isRotated = false; // Track if system is rotated 90 degrees
let targetCameraUp = null; // Target camera up vector - initialized in initScene
let currentCameraUp = null; // Current camera up vector - initialized in initScene
let targetCameraPosition = null; // Target camera position offset - initialized in initScene
let isPolarView = false; // Track if in polar view mode

// Initialize scene
function initScene() {
    // Initialize THREE.Vector3 objects now that THREE is loaded
    focusPoint = new THREE.Vector3(0, 0, 0);
    targetFocusPoint = new THREE.Vector3(0, 0, 0);
    targetCameraUp = new THREE.Vector3(0, 1, 0);
    currentCameraUp = new THREE.Vector3(0, 1, 0);
    targetCameraPosition = new THREE.Vector3(0, 0, 0);
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(SCENE_CONFIG.backgroundColor);
    // Remove fog for better visibility at all distances
    // scene.fog = new THREE.FogExp2(SCENE_CONFIG.backgroundColor, SCENE_CONFIG.fogDensity);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 20000);
    // Position camera to view current time (2025) - will adjust based on zoom
    const currentYearHeight = getHeightForYear(currentYear, 1);
    camera.position.set(0, currentYearHeight + 400, 800);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Limit pixel ratio on mobile for better performance (max 2)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Position sun light at current date height so it illuminates planets
    const currentDateHeight = getHeightForYear(currentYear, 1);
    sunLight = new THREE.PointLight(SCENE_CONFIG.sunColor, 3, 5000);
    sunLight.position.set(0, currentDateHeight, 0);
    scene.add(sunLight);

    createStarField();

    // Create Sun at origin (it extends vertically through all time)
    const sunGeometry = new THREE.SphereGeometry(SCENE_CONFIG.sunSize, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: SCENE_CONFIG.sunColor
    });
    sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(0, currentDateHeight, 0); // Position at current date
    scene.add(sunMesh);

    // Add sun glow
    const glowGeometry = new THREE.SphereGeometry(SCENE_CONFIG.sunGlowSize, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: SCENE_CONFIG.sunColor,
        transparent: true,
        opacity: 0.3
    });
    sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    sunGlow.position.set(0, currentDateHeight, 0); // Position at current date
    scene.add(sunGlow);
    
    // Create Sun's worldline (vertical line through time)
    createSunWorldline();

    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
}

// Create the Sun's worldline (vertical axis through time)
function createSunWorldline() {
    const points = [
        0, getHeightForYear(2000, 1), 0,  // Start at 2000
        0, getHeightForYear(2100, 1), 0   // End at 2100
    ];
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    
    const material = new THREE.LineBasicMaterial({
        color: SCENE_CONFIG.sunColor,
        transparent: true,
        opacity: 0.4,
        linewidth: 1
    });
    
    const sunWorldline = new THREE.Line(geometry, material);
    scene.add(sunWorldline);
}

function createStarField() {
    // Remove existing stars if any
    if (stars) {
        scene.remove(stars);
    }
    
    // Don't show stars in Century view (too far out)
    if (currentZoom === 1) {
        return;
    }
    
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
        color: isLightMode ? 0x333333 : 0x8ecae6,
        size: 2,
        transparent: true,
        opacity: isLightMode ? 0.3 : 0.8
    });
    
    const starVertices = [];
    // Center stars vertically around year 2050 (height 5000)
    const centuryMidHeight = getHeightForYear(2050, 1);
    
    for (let i = 0; i < SCENE_CONFIG.starCount; i++) {
        const x = (Math.random() - 0.5) * SCENE_CONFIG.starFieldSize;
        // Spread stars vertically across the full century range
        const y = centuryMidHeight + (Math.random() - 0.5) * SCENE_CONFIG.starFieldHeight;
        const z = (Math.random() - 0.5) * SCENE_CONFIG.starFieldSize;
        starVertices.push(x, y, z);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Get marker color based on light mode
function getMarkerColor() {
    return isLightMode ? 0x000000 : 0xffffff;
}

// Note: getHeightForYear is now in datetime.js

// Create selection arc to highlight selected time period
// currentDateHeight: the height of the current date (for accurate angle calculation)
function createSelectionArc(startHeight, endHeight, earthDistance, innerRadiusFactor = 0.8, outerRadiusFactor = 1.2, currentDateHeight = null) {
    // Remove old selection arcs
    selectionArcs.forEach(arc => scene.remove(arc));
    selectionArcs = [];
    
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    const spanHeight = endHeight - startHeight;
    
    // Calculate Earth's angle at start of selection
    // Use currentDateHeight if provided, otherwise fall back to year start
    const referenceHeight = currentDateHeight !== null ? currentDateHeight : getHeightForYear(currentYear, 1);
    const startYearsFromCurrent = (startHeight - referenceHeight) / 100;
    const startOrbitsFromCurrent = startYearsFromCurrent / earth.orbitalPeriod;
    const startAngleFromCurrent = startOrbitsFromCurrent * Math.PI * 2;
    const startAngle = earth.startAngle - startAngleFromCurrent;
    
    // Calculate how much angle Earth travels during this span
    const spanYears = spanHeight / 100;
    const orbitsInSpan = spanYears / earth.orbitalPeriod;
    const angleSpan = orbitsInSpan * Math.PI * 2;
    
    const segments = 64;
    
    // Create INNER helical arc (smaller radius)
    const innerRadius = earthDistance * innerRadiusFactor;
    const innerPoints = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const height = startHeight + (t * spanHeight);
        const angle = startAngle - (t * angleSpan); // Counter-clockwise
        
        const x = Math.cos(angle) * innerRadius;
        const z = Math.sin(angle) * innerRadius;
        innerPoints.push(x, height, z);
    }
    
    const innerGeom = new THREE.BufferGeometry();
    innerGeom.setAttribute('position', new THREE.Float32BufferAttribute(innerPoints, 3));
    const innerArc = new THREE.Line(innerGeom, new THREE.LineBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.8,
        linewidth: 4
    }));
    scene.add(innerArc);
    selectionArcs.push(innerArc);
    timeMarkers.push(innerArc);
    
    // Create OUTER helical arc (larger radius)
    const outerRadius = earthDistance * outerRadiusFactor;
    const outerPoints = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const height = startHeight + (t * spanHeight);
        const angle = startAngle - (t * angleSpan); // Counter-clockwise
        
        const x = Math.cos(angle) * outerRadius;
        const z = Math.sin(angle) * outerRadius;
        outerPoints.push(x, height, z);
    }
    
    const outerGeom = new THREE.BufferGeometry();
    outerGeom.setAttribute('position', new THREE.Float32BufferAttribute(outerPoints, 3));
    const outerArc = new THREE.Line(outerGeom, new THREE.LineBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.8,
        linewidth: 4
    }));
    scene.add(outerArc);
    selectionArcs.push(outerArc);
    timeMarkers.push(outerArc);
    
    // Return start and end angles and radii for connecting lines
    return {
        startAngle,
        endAngle: startAngle - angleSpan,
        startHeight,
        endHeight,
        innerRadius,
        outerRadius
    };
}

// Create time marker ticks at specific heights
function createTimeMarkers(zoomLevel) {
    // Clear existing markers
    timeMarkers.forEach(m => scene.remove(m));
    timeMarkers.length = 0;

    console.log('Creating time markers for zoom level:', zoomLevel);

    const config = ZOOM_LEVELS[zoomLevel];
    const markers = TIME_MARKERS[zoomLevel];
    
    if (!markers) return;

    // Get Earth's position for Earth-focused views
    const earthPlanet = planetMeshes.find(p => p.userData.name === 'Earth');
    const earthDistance = earthPlanet ? earthPlanet.userData.distance : 50;

    // Calculate selected position offset (same logic as in createPlanets)
    // For zoom levels 3+ (Year, Quarter, etc.), use precise date; for 1-2 use year start
    // For Zoom 4, we need to use ACTUAL system date to avoid issues with navigated variables
    let currentDateHeight;
    if (zoomLevel === 4) {
        // Calculate actual system date height directly (bypass navigated variables)
        const nowActual = new Date();
        const actualYear = nowActual.getFullYear();
        const actualMonth = nowActual.getMonth();
        const actualDay = nowActual.getDate();
        const actualHour = nowActual.getHours();
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const isLeap = (actualYear % 4 === 0 && actualYear % 100 !== 0) || (actualYear % 400 === 0);
        if (isLeap) daysInMonth[1] = 29;
        const yearProgress = (actualMonth + (actualDay - 1) / daysInMonth[actualMonth] + actualHour / (24 * daysInMonth[actualMonth])) / 12;
        currentDateHeight = ((actualYear - 2000) * 100) + (yearProgress * 100);
    } else if (zoomLevel >= 3) {
        currentDateHeight = calculateCurrentDateHeight();
    } else {
        currentDateHeight = getHeightForYear(currentYear, 1);
    }
    let selectedHeightOffset = 0;
    
    if (zoomLevel === 2) { // Decade view
        const yearHeight = 100; // 100 units per year
        selectedHeightOffset = selectedDecadeOffset * (10 * yearHeight); // Full decade offset
    } else if (zoomLevel === 3) { // Year view
        const yearHeight = 100;
        const monthHeight = yearHeight / 12;
        // Get ACTUAL system month (not navigation-modified)
        const now3 = new Date();
        const actualMonthInYear = now3.getMonth();
        // currentMonthInYear changes with A/D, actualMonthInYear is fixed
        selectedHeightOffset = (selectedYearOffset * yearHeight) + (currentMonthInYear * monthHeight) - (actualMonthInYear * monthHeight);
    } else if (zoomLevel === 4) { // Quarter view
        const quarterHeight = config.timeYears * 100;
        const monthHeight = quarterHeight / 3;
        // Get ACTUAL current month within quarter from system time
        const now4 = new Date();
        const actualMonthInQuarter = now4.getMonth() % 3;
        // currentMonth changes with A/D (0-2), actualMonthInQuarter is the actual system month in quarter
        // When currentMonth === actualMonthInQuarter and selectedQuarterOffset === 0, offset should be 0
        selectedHeightOffset = (selectedQuarterOffset * quarterHeight) + ((currentMonth - actualMonthInQuarter) * monthHeight);
    } else if (zoomLevel === 5) { // Month view
        const monthHeight = config.timeYears * 100;
        const weekHeight = monthHeight / 4;
        const dayHeight = weekHeight / 7;
        // Get ACTUAL system week/day (not navigation-modified)
        const now5 = new Date();
        const actualWeekInMonth = Math.floor((now5.getDate() - 1) / 7);
        const actualDayInWeek = now5.getDay();
        // currentWeekInMonth/currentDayInWeek change with A/D, actual values are fixed
        selectedHeightOffset = (selectedWeekOffset * monthHeight) + (currentWeekInMonth * weekHeight) + (currentDayInWeek * dayHeight) - (actualWeekInMonth * weekHeight) - (actualDayInWeek * dayHeight);
    } else if (zoomLevel === 6) { // Lunar view
        const lunarHeight = config.timeYears * 100;
        const weekHeight = lunarHeight / 4; // 4 weeks per lunar cycle
        const currentWeekInLunar = 1; // Assume week 1 of current cycle
        selectedHeightOffset = (selectedLunarOffset * lunarHeight) + (currentWeekInMonth * weekHeight) - (currentWeekInLunar * weekHeight);
    } else if (zoomLevel === 7) { // Week view
        const weekHeight = config.timeYears * 100;
        const dayHeight = weekHeight / 7;
        const hourHeight = dayHeight / 24;
        // Get ACTUAL system day/hour (not navigation-modified)
        const now7 = new Date();
        const actualDayInWeek = now7.getDay();
        const actualHourInDay = now7.getHours();
        // currentDayInWeek/currentHourInDay change with A/D, actual values are fixed
        selectedHeightOffset = (selectedDayOffset * weekHeight) + (currentDayInWeek * dayHeight) + (currentHourInDay * hourHeight) - (actualDayInWeek * dayHeight) - (actualHourInDay * hourHeight);
    } else if (zoomLevel === 8 || zoomLevel === 9) { // Day/Clock view
        const dayHeight = config.timeYears * 100;
        const hourHeight = dayHeight / 24;
        selectedHeightOffset = (selectedHourOffset * dayHeight) + (currentHourInDay * hourHeight) - (14 * hourHeight);
    }
    
    const selectedDateHeight = currentDateHeight + selectedHeightOffset;

    // Create major and minor markers based on zoom level
    if (zoomLevel <= 2) {
        // Sun-centered views (Century, Decade)
        createSunCenteredMarkers(zoomLevel, markers, config);
    } else if (zoomLevel === 3) {
        // Year view - radial lines from Sun to Earth's orbital position for each month
        createYearMarkers(earthDistance, config, selectedYearOffset, currentDateHeight);
    } else if (zoomLevel === 4) {
        // Quarter view - show monthly radial lines
        createQuarterMarkers(earthDistance, config, selectedQuarterOffset, currentDateHeight);
    } else if (zoomLevel === 5) {
        // Month view - show weekly radial lines
        // Pass only the MONTH offset (selectedWeekOffset), not the week position within month
        createMonthMarkers(earthDistance, config, selectedWeekOffset, currentDateHeight);
    } else if (zoomLevel === 6) {
        // Lunar cycle - show moon orbit and weekly markers
        createLunarCycleMarkers(earthDistance, config, selectedLunarOffset, currentDateHeight);
    } else if (zoomLevel === 7) {
        // Week view - show daily radial lines
        // Pass only the WEEK offset (selectedDayOffset), not the day position within week
        createWeekMarkers(earthDistance, config, selectedDayOffset, currentDateHeight);
    } else if (zoomLevel === 8 || zoomLevel === 9) {
        // Day view (8) and Clock view (9) - same hourly markers, different camera angle
        console.log('Calling createDayMarkers for zoom', zoomLevel);
        // Pass only the DAY offset (selectedHourOffset), not the hour position within day
        createDayMarkers(earthDistance, config, selectedHourOffset, currentDateHeight);
        console.log('After createDayMarkers, timeMarkers.length:', timeMarkers.length);
    }
}

// Helper function to create faint context markers for adjacent time periods
function createContextMarkers(earthDistance, config, offsetMultiplier) {
    const currentDateHeight = getHeightForYear(currentYear, 1);
    const spanHeight = config.timeYears * 100;
    const contextHeight = currentDateHeight + (offsetMultiplier * spanHeight);
    
    console.log('Creating context marker:', {
        offsetMultiplier,
        currentDateHeight,
        spanHeight,
        contextHeight,
        earthDistance
    });
    
    // Get Earth's orbital data
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    
    // Calculate angles
    const timeSpanYears = spanHeight / 100;
    const orbitsInSpan = timeSpanYears / earth.orbitalPeriod;
    const yearsFromCurrent = offsetMultiplier * timeSpanYears;
    const orbitsOffset = yearsFromCurrent / earth.orbitalPeriod;
    const angleOffset = orbitsOffset * Math.PI * 2;
    const contextAngle = earth.startAngle - angleOffset;
    
    // Create faint marker line
    const points = [
        0, contextHeight, 0,
        Math.cos(contextAngle) * earthDistance, contextHeight, Math.sin(contextAngle) * earthDistance
    ];
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    
    const material = new THREE.LineBasicMaterial({
        color: 0x888888, // Gray for context markers
        transparent: true,
        opacity: 0.3,
        linewidth: 1
    });
    
    const line = new THREE.Line(geometry, material);
    line.visible = showTimeMarkers;
    scene.add(line);
    timeMarkers.push(line);
    
    console.log('Context marker added to scene:', {
        visible: line.visible,
        position: points,
        timeMarkersCount: timeMarkers.length
    });
}

// Sun-centered marker ticks (Century, Decade, Year)
function createSunCenteredMarkers(zoomLevel, markers, config) {
    const currentDateHeight = getHeightForYear(currentYear, 1);
    const spanHeight = config.timeYears * 100;
    const startHeight = currentDateHeight - (spanHeight / 2);
    
    // Add context markers for periods before and after current span
    // For sun-centered views, we'll add faint radial markers
    const contextColor = 0x666666;
    const contextOpacity = 0.15;
    
    // Previous period marker
    const prevHeight = currentDateHeight - spanHeight;
    createRadialTick(prevHeight, 0, 0, false, null, zoomLevel, false, contextColor, contextOpacity);
    
    // Next period marker
    const nextHeight = currentDateHeight + spanHeight;
    createRadialTick(nextHeight, 0, 0, false, null, zoomLevel, false, contextColor, contextOpacity);
    
    // Add period label at top, offset to the side
    const labelHeight = startHeight + spanHeight;
    let periodLabel = '';
    let labelDistance = 150; // Distance from Sun
    let labelAngle = Math.PI / 4; // 45 degrees to the side
    if (zoomLevel === 1) {
        periodLabel = '21st Century'; // Century view
        labelDistance = 300; // Further out to avoid overlap
        labelAngle = Math.PI / 3; // 60 degrees to the side
    } else if (zoomLevel === 2) {
        periodLabel = '2020-2030'; // Decade view
        labelDistance = 200;
        labelAngle = Math.PI / 4;
    }
    if (periodLabel) {
        createTextLabel(periodLabel, labelHeight, labelDistance, zoomLevel, labelAngle);
    }
    
    // Major markers (labeled)
    markers.major.forEach((label, index) => {
        let height;
        if (zoomLevel === 1 || zoomLevel === 2) {
            height = getHeightForYear(label, zoomLevel);
        } else if (zoomLevel === 3) {
            // Year view: distribute months evenly through the year
            // Jan, Apr, Jul, Oct are at indices 0, 1, 2, 3
            const monthPositions = [0, 3, 6, 9]; // Months 0-11 (Jan=0)
            const monthFraction = monthPositions[index] / 12;
            height = startHeight + (monthFraction * spanHeight);
        } else {
            height = (index / (markers.major.length - 1)) * spanHeight;
        }
        
        createRadialTick(height, 0, 0, true, label, zoomLevel);
    });
    
    // Minor markers (unlabeled)
    markers.minor.forEach((label, index) => {
        let height;
        if (zoomLevel === 1 || zoomLevel === 2) {
            height = getHeightForYear(label, zoomLevel);
        } else if (zoomLevel === 3) {
            // Year view minor markers: remaining months
            // Feb, Mar, May, Jun, Aug, Sep, Nov, Dec at indices 1, 2, 4, 5, 7, 8, 10, 11
            const monthPositions = [1, 2, 4, 5, 7, 8, 10, 11];
            const monthFraction = monthPositions[index] / 12;
            height = startHeight + (monthFraction * spanHeight);
        } else {
            height = ((index + 1) / (markers.major.length + markers.minor.length)) * spanHeight;
        }
        
        createRadialTick(height, 0, 0, false, null, zoomLevel);
    });
    
    // Tick marks (smallest, for every 5 years in Century view)
    if (markers.ticks) {
        markers.ticks.forEach((label, index) => {
            const height = (zoomLevel === 1 || zoomLevel === 2)
                ? getHeightForYear(label, zoomLevel)
                : 0;
            
            createRadialTick(height, 0, 0, false, null, zoomLevel, true); // Pass true for smallest tick
        });
    }
}

// Year view - radial lines from Sun to Earth's orbital path for each month
function createYearMarkers(earthDistance, config, yearOffset, currentDateHeight) {
    const spanHeight = config.timeYears * 100; // 100 units for year
    
    // Get Earth's orbital data
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    const timeSpanYears = spanHeight / 100;
    const orbitsInSpan = timeSpanYears / earth.orbitalPeriod;
    
    // Get ACTUAL system time values (not navigation-modified variables)
    // Markers stay FIXED at system time year - only red highlighting moves with selection
    const now = new Date();
    const actualYear = now.getFullYear();
    const actualMonthInYear = now.getMonth();
    const actualDayOfMonth = now.getDate();
    
    // Calculate the START of the selected year (Jan 1)
    // Calculate current progress through year from ACTUAL date (not navigated)
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Check for leap year
    const isLeapYear = (actualYear % 4 === 0 && actualYear % 100 !== 0) || (actualYear % 400 === 0);
    if (isLeapYear) daysInMonth[1] = 29;
    
    const actualProgressThroughYear = (actualMonthInYear + actualDayOfMonth / daysInMonth[actualMonthInYear]) / 12;
    const yearHeight = 100;
    
    // The height of Jan 1 of the selected year
    const selectedYearStartHeight = currentDateHeight + (yearOffset * yearHeight) - (actualProgressThroughYear * yearHeight);
    
    // Calculate Earth's angle at Jan 1 of selected year
    const yearsFromCurrentToYearStart = ((yearOffset * yearHeight) - (actualProgressThroughYear * yearHeight)) / 100;
    const orbitsFromCurrentToYearStart = yearsFromCurrentToYearStart / earth.orbitalPeriod;
    const angleFromCurrentToYearStart = orbitsFromCurrentToYearStart * Math.PI * 2;
    const yearStartAngle = earth.startAngle - angleFromCurrentToYearStart;
    
    // Add context markers for previous and next year
    createContextMarkers(earthDistance, config, -1); // Previous year
    createContextMarkers(earthDistance, config, 1);  // Next year
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Calculate which year we're displaying (actual year + offset for fixed markers)
    const selectedYear = actualYear + yearOffset;
    
    // Add year label at center of the year
    const yearLabelHeight = selectedYearStartHeight + (spanHeight / 2);
    const yearsToCenter = (yearLabelHeight - selectedYearStartHeight) / 100;
    const orbitsToCenter = yearsToCenter / earth.orbitalPeriod;
    const angleToCenter = orbitsToCenter * Math.PI * 2;
    const yearLabelAngle = yearStartAngle - angleToCenter;
    createTextLabel(selectedYear.toString(), yearLabelHeight, earthDistance * 1.4, 3, yearLabelAngle);
    
    // Create radial line for each month (13 lines = 12 month boundaries)
    for (let month = 0; month <= 12; month++) {
        const t = month / 12;
        const angle = yearStartAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = selectedYearStartHeight + (t * spanHeight);
        
        // Create radial line from sun to Earth's orbit
        const points = [
            0, height, 0,  // Sun
            Math.cos(angle) * earthDistance, height, Math.sin(angle) * earthDistance  // Earth orbit
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        // Highlight START and END of current month in red
        const isCurrentMonthStart = (month === currentMonthInYear);
        const isCurrentMonthEnd = (month === currentMonthInYear + 1);
        const isCurrentMonthBoundary = isCurrentMonthStart || isCurrentMonthEnd;
        
        const isMajor = month % 3 === 0; // Jan, Apr, Jul, Oct
        const material = new THREE.LineBasicMaterial({
            color: isCurrentMonthBoundary ? 0xFF0000 : getMarkerColor(),
            transparent: true,
            opacity: isCurrentMonthBoundary ? 0.9 : (isMajor ? 0.7 : 0.4),
            linewidth: isCurrentMonthBoundary ? 3 : (isMajor ? 2 : 1)
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
        
        // Add label at CENTER of month (bisecting it) rather than at start
        if (month < 12) {
            const labelT = (month + 0.5) / 12; // Center of this month
            const labelAngle = yearStartAngle - (labelT * orbitsInSpan * Math.PI * 2);
            const labelHeight = selectedYearStartHeight + (labelT * spanHeight);
            createTextLabel(monthNames[month], labelHeight, earthDistance * 1.15, 3, labelAngle);
        }
    }
}

// Quarter view - radial lines from Sun to Earth's orbital path for each month
function createQuarterMarkers(earthDistance, config, quarterOffset, passedCurrentDateHeight) {
    // Quarter view should show the CURRENT quarter (Q4 for Dec 9)
    // Markers stay FIXED at system time quarter - only red highlighting moves with selection
    
    // Get ACTUAL system time values (not navigation-modified variables)
    const now = new Date();
    const actualYear = now.getFullYear();
    const actualMonthInYear = now.getMonth();
    const actualDayOfMonth = now.getDate();
    const actualHourInDay = now.getHours();
    const actualMonthInQuarter = actualMonthInYear % 3;
    const actualQuarter = Math.floor(actualMonthInYear / 3);
    
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const isLeapYear = (actualYear % 4 === 0 && actualYear % 100 !== 0) || (actualYear % 400 === 0);
    if (isLeapYear) daysInMonth[1] = 29;
    
    const spanHeight = config.timeYears * 100; // 25 units for quarter
    const quarterHeight = spanHeight;
    const monthsInQuarter = 3;
    
    // Get Earth's orbital data
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    const timeSpanYears = spanHeight / 100;
    const orbitsInSpan = timeSpanYears / earth.orbitalPeriod;
    
    // Calculate actual current date height from fresh system time
    const yearHeight = 100;
    const monthHeight_year = yearHeight / 12;
    const dayHeight_year = monthHeight_year / daysInMonth[actualMonthInYear];
    const hourHeight_year = dayHeight_year / 24;
    const baseYearHeight = (actualYear - CENTURY_START) * yearHeight;
    const actualCurrentDateHeight = baseYearHeight 
        + (actualMonthInYear * monthHeight_year)
        + ((actualDayOfMonth - 1) * dayHeight_year)
        + (actualHourInDay * hourHeight_year);
    
    // Calculate the START of the current quarter working backwards from actual system time
    const monthHeight = quarterHeight / 3;
    const dayHeight = monthHeight / daysInMonth[actualMonthInYear];
    const hourHeight = dayHeight / 24;
    
    // Start from actual current date, work backwards to start of current day
    const currentDayStartHeight = actualCurrentDateHeight - ((actualHourInDay / 24) * dayHeight);
    
    // Work backwards to start of current month
    const currentMonthStartHeight = currentDayStartHeight - ((actualDayOfMonth - 1) * dayHeight);
    
    // Work backwards to start of current quarter using ACTUAL month in quarter
    const currentQuarterStartHeight = currentMonthStartHeight - (actualMonthInQuarter * monthHeight);
    
    // Markers always show the CURRENT quarter (Q4 for Dec 9)
    // quarterOffset does NOT shift the markers - only Earth moves (via updateEarthPosition)
    const selectedQuarterStartHeight = currentQuarterStartHeight; // No offset applied to markers
    
    // Debug logging
    console.log('Quarter view - markers at CURRENT quarter, Earth moves via offset');
    console.log('  actualCurrentDateHeight:', actualCurrentDateHeight);
    console.log('  currentQuarterStartHeight:', currentQuarterStartHeight);
    console.log('  quarterOffset (NOT applied to markers):', quarterOffset);
    
    // Calculate Earth's angle at START of current quarter (not selected)
    const yearsFromCurrentToQuarterStart = (selectedQuarterStartHeight - actualCurrentDateHeight) / 100;
    const orbitsFromCurrentToQuarterStart = yearsFromCurrentToQuarterStart / earth.orbitalPeriod;
    const angleFromCurrentToQuarterStart = orbitsFromCurrentToQuarterStart * Math.PI * 2;
    const startAngle = earth.startAngle - angleFromCurrentToQuarterStart;
    
    const startHeight = selectedQuarterStartHeight;
    
    // Calculate center for label placement
    const selectedQuarterCenterHeight = startHeight + (spanHeight / 2);
    const yearsFromStartToCenter = (selectedQuarterCenterHeight - startHeight) / 100;
    const orbitsFromStartToCenter = yearsFromStartToCenter / earth.orbitalPeriod;
    const angleFromStartToCenter = orbitsFromStartToCenter * Math.PI * 2;
    const selectedQuarterCenterAngle = startAngle - angleFromStartToCenter;
    
    // Add context markers for previous and next quarter
    createContextMarkers(earthDistance, config, -1); // Previous quarter
    createContextMarkers(earthDistance, config, 1);  // Next quarter
    
    // Always display the ACTUAL SYSTEM quarter (markers don't shift with navigation)
    const quarterNumber = actualQuarter + 1; // Convert 0-indexed to 1-indexed (Q1-Q4)
    const displayYear = actualYear;
    
    // Calculate starting month of current quarter
    const quarterStartMonth = (quarterNumber - 1) * 3; // Q1=0, Q2=3, Q3=6, Q4=9
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Add quarter label at center
    const quarterLabelHeight = selectedQuarterCenterHeight;
    const quarterLabelAngle = selectedQuarterCenterAngle;
    createTextLabel(`Q${quarterNumber} ${displayYear}`, quarterLabelHeight, earthDistance * 1.4, 4, quarterLabelAngle);
    
    // For a quarter (3 months), Earth moves through part of its orbit (4 lines = 3 month boundaries)
    for (let month = 0; month <= monthsInQuarter; month++) {
        const t = month / monthsInQuarter;
        // Counter-clockwise orbit (negative angle change)
        const angle = startAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        // Create radial line from sun to orbit
        const points = [
            0, height, 0,  // Sun
            Math.cos(angle) * earthDistance, height, Math.sin(angle) * earthDistance  // Earth orbit
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        // Highlight START and END of current month in red
        const isCurrentMonthStart = (month === currentMonth);
        const isCurrentMonthEnd = (month === currentMonth + 1);
        const isCurrentMonthBoundary = isCurrentMonthStart || isCurrentMonthEnd;
        
        const material = new THREE.LineBasicMaterial({
            color: isCurrentMonthBoundary ? 0xFF0000 : getMarkerColor(),
            transparent: true,
            opacity: isCurrentMonthBoundary ? 0.9 : 0.7,
            linewidth: isCurrentMonthBoundary ? 3 : 2
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
        
        // Add label at CENTER of month (bisecting it) rather than at start
        if (month < monthsInQuarter) {
            const labelT = (month + 0.5) / monthsInQuarter; // Center of this month
            const labelAngle = startAngle - (labelT * orbitsInSpan * Math.PI * 2);
            const labelHeight = startHeight + (labelT * spanHeight);
            const actualMonthName = monthNames[quarterStartMonth + month];
            createTextLabel(actualMonthName, labelHeight, earthDistance * 1.15, 4, labelAngle);
        }
    }
    
    // Add extra boundary lines at start and end of current quarter (thicker to show quarter bounds)
    const quarterBoundaryMaterial = new THREE.LineBasicMaterial({
        color: getMarkerColor(),
        transparent: true,
        opacity: 0.8,
        linewidth: 4
    });
    
    // Quarter start boundary
    const quarterStartAngle = startAngle;
    const quarterStartHeight = startHeight;
    const quarterStartPoints = [
        0, quarterStartHeight, 0,
        Math.cos(quarterStartAngle) * earthDistance, quarterStartHeight, Math.sin(quarterStartAngle) * earthDistance
    ];
    const quarterStartGeom = new THREE.BufferGeometry();
    quarterStartGeom.setAttribute('position', new THREE.Float32BufferAttribute(quarterStartPoints, 3));
    const quarterStartLine = new THREE.Line(quarterStartGeom, quarterBoundaryMaterial);
    scene.add(quarterStartLine);
    timeMarkers.push(quarterStartLine);
    
    // Quarter end boundary
    const quarterEndAngle = startAngle - orbitsInSpan * Math.PI * 2;
    const quarterEndHeight = startHeight + spanHeight;
    const quarterEndPoints = [
        0, quarterEndHeight, 0,
        Math.cos(quarterEndAngle) * earthDistance, quarterEndHeight, Math.sin(quarterEndAngle) * earthDistance
    ];
    const quarterEndGeom = new THREE.BufferGeometry();
    quarterEndGeom.setAttribute('position', new THREE.Float32BufferAttribute(quarterEndPoints, 3));
    const quarterEndLine = new THREE.Line(quarterEndGeom, quarterBoundaryMaterial);
    scene.add(quarterEndLine);
    timeMarkers.push(quarterEndLine);
    
    // Create ghost quarter markers if offset from current
    if (quarterOffset !== 0) {
        // Calculate current quarter position
        const currentQuarterHeight = ZOOM_LEVELS[4].timeYears * 100;
        const ghostStartHeight = currentDateHeight - (currentQuarterHeight / 2);
        const ghostYearsFromStart = (currentDateHeight - ghostStartHeight) / 100;
        const ghostOrbitsFromStart = ghostYearsFromStart / earth.orbitalPeriod;
        const ghostAngleFromStart = ghostOrbitsFromStart * Math.PI * 2;
        const ghostStartAngle = earth.startAngle + ghostAngleFromStart;
        
        // Ghost month markers (semi-transparent)
        for (let month = 0; month <= 3; month++) {
            const t = month / 3;
            const angle = ghostStartAngle - (t * orbitsInSpan * Math.PI * 2);
            const height = ghostStartHeight + (t * currentQuarterHeight);
            
            const points = [
                0, height, 0,
                Math.cos(angle) * earthDistance, height, Math.sin(angle) * earthDistance
            ];
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            
            const material = new THREE.LineBasicMaterial({
                color: getMarkerColor(),
                transparent: true,
                opacity: 0.2,
                linewidth: 1
            });
            
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            timeMarkers.push(line);
        }
    }
    
    // Add weekly ticks (12 weeks in a quarter)
    for (let week = 0; week < 12; week++) {
        const t = week / 12;
        const angle = startAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        // Shorter tick
        const tickStart = earthDistance * 0.9;
        const tickEnd = earthDistance;
        
        const points = [
            Math.cos(angle) * tickStart, height, Math.sin(angle) * tickStart,
            Math.cos(angle) * tickEnd, height, Math.sin(angle) * tickEnd
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: getMarkerColor(),
            transparent: true,
            opacity: 0.3,
            linewidth: 1
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
    }
}

// Month view - radial lines for each week
function createMonthMarkers(earthDistance, config, monthOffset, currentDateHeight) {
    const spanHeight = config.timeYears * 100; // ~8.33 units for month
    const dayHeight = ZOOM_LEVELS[8].timeYears * 100; // One day in height units
    
    // Get ACTUAL system time values (not navigation-modified variables)
    const now = new Date();
    const actualYear = now.getFullYear();
    const actualMonthInYear = now.getMonth();
    const actualDayOfMonth = now.getDate();
    const actualHourInDay = now.getHours();
    
    // Get Earth's orbital data
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    
    // Calculate the displayed month
    const displayedDate = new Date(actualYear, actualMonthInYear + monthOffset, 1);
    const displayedMonth = displayedDate.getMonth();
    const displayedYear = displayedDate.getFullYear();
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
    const selectedMonthName = monthNames[displayedMonth];
    
    // Get days in the displayed month
    const daysInDisplayedMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
    
    // Calculate the height of the 1st of the displayed month
    const daysFromToday = Math.floor((displayedDate - now) / (1000 * 60 * 60 * 24));
    const monthFirstHeight = currentDateHeight + (daysFromToday * dayHeight);
    
    // Find all Sundays in and around this month
    const sundays = [];
    // Start from the Sunday before the 1st (or the 1st if it's a Sunday)
    const firstOfMonth = new Date(displayedYear, displayedMonth, 1);
    const firstSundayOffset = -firstOfMonth.getDay(); // Days to go back to get Sunday
    
    // Collect Sundays from before the month starts to after it ends
    for (let weekNum = -1; weekNum <= 5; weekNum++) {
        const sundayDay = 1 + firstSundayOffset + (weekNum * 7);
        const sundayDate = new Date(displayedYear, displayedMonth, sundayDay);
        
        // Only include Sundays that fall within our view range
        if (sundayDay >= -6 && sundayDay <= daysInDisplayedMonth + 7) {
            sundays.push({
                date: sundayDate,
                dayOfMonth: sundayDay,
                isInMonth: sundayDay >= 1 && sundayDay <= daysInDisplayedMonth
            });
        }
    }
    
    // Calculate height for the month center (15th)
    const monthCenterHeight = monthFirstHeight + (14 * dayHeight); // Roughly middle of month
    const heightDiffCenter = monthCenterHeight - currentDateHeight;
    const yearsFromCurrentCenter = heightDiffCenter / 100;
    const orbitsFromCurrentCenter = yearsFromCurrentCenter / earth.orbitalPeriod;
    const monthCenterAngle = earth.startAngle - (orbitsFromCurrentCenter * Math.PI * 2);
    
    // Add month name label
    createTextLabel(`${selectedMonthName} ${displayedYear}`, monthCenterHeight, earthDistance * 1.4, 5, monthCenterAngle);
    
    // Add context markers for previous and next month
    createContextMarkers(earthDistance, config, -1);
    createContextMarkers(earthDistance, config, 1);
    
    // Find the currently selected Sunday based on currentWeekInMonth
    // currentWeekInMonth tracks which week we're in (0, 1, 2, 3, 4...)
    const selectedSundayIndex = Math.min(currentWeekInMonth, sundays.length - 2);
    
    // Create selection arcs around the selected week
    if (selectedSundayIndex >= 0 && selectedSundayIndex < sundays.length - 1) {
        const selectedWeekStart = sundays[selectedSundayIndex];
        const selectedWeekEnd = sundays[selectedSundayIndex + 1];
        
        const startHeight = monthFirstHeight + ((selectedWeekStart.dayOfMonth - 1) * dayHeight);
        const endHeight = monthFirstHeight + ((selectedWeekEnd.dayOfMonth - 1) * dayHeight);
        
        const arcInfo = createSelectionArc(startHeight, endHeight, earthDistance, 0.8, 1.2, currentDateHeight);
        
        // Create markers for each Sunday
        for (let i = 0; i < sundays.length; i++) {
            const sunday = sundays[i];
            const height = monthFirstHeight + ((sunday.dayOfMonth - 1) * dayHeight);
            
            // Calculate angle at this height
            const heightDiff = height - currentDateHeight;
            const yearsFromCurrent = heightDiff / 100;
            const orbitsFromCurrent = yearsFromCurrent / earth.orbitalPeriod;
            const angle = earth.startAngle - (orbitsFromCurrent * Math.PI * 2);
            
            // Check if this is a boundary of the selected week
            const isSelectedWeekStart = (i === selectedSundayIndex);
            const isSelectedWeekEnd = (i === selectedSundayIndex + 1);
            const isSelectedWeekBoundary = isSelectedWeekStart || isSelectedWeekEnd;
            
            const endRadius = isSelectedWeekBoundary ? arcInfo.outerRadius : earthDistance;
            
            const points = [
                0, height, 0,
                Math.cos(angle) * endRadius, height, Math.sin(angle) * endRadius
            ];
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            
            const material = new THREE.LineBasicMaterial({
                color: isSelectedWeekBoundary ? 0xFF0000 : getMarkerColor(),
                transparent: true,
                opacity: isSelectedWeekBoundary ? 0.9 : 0.6,
                linewidth: isSelectedWeekBoundary ? 3 : 2
            });
            
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            timeMarkers.push(line);
            
            // Add week label at the center of each week
            if (i < sundays.length - 1) {
                const nextSunday = sundays[i + 1];
                const weekCenterDay = (sunday.dayOfMonth + nextSunday.dayOfMonth - 1) / 2;
                const labelHeight = monthFirstHeight + ((weekCenterDay - 1) * dayHeight);
                
                const labelHeightDiff = labelHeight - currentDateHeight;
                const labelYearsFromCurrent = labelHeightDiff / 100;
                const labelOrbitsFromCurrent = labelYearsFromCurrent / earth.orbitalPeriod;
                const labelAngle = earth.startAngle - (labelOrbitsFromCurrent * Math.PI * 2);
                
                // Show date range (e.g., "8-14" or "Dec 29-Jan 3")
                const weekStartDate = sunday.date.getDate();
                const weekEndDate = new Date(nextSunday.date);
                weekEndDate.setDate(weekEndDate.getDate() - 1); // Saturday
                const weekEndDay = weekEndDate.getDate();
                
                let weekLabel;
                if (sunday.date.getMonth() === weekEndDate.getMonth()) {
                    // Same month: just show "8-14"
                    weekLabel = `${weekStartDate}-${weekEndDay}`;
                } else {
                    // Week spans two months: show "Dec 29-Jan 3"
                    const startMonthShort = monthNames[sunday.date.getMonth()].substring(0, 3);
                    const endMonthShort = monthNames[weekEndDate.getMonth()].substring(0, 3);
                    weekLabel = `${startMonthShort} ${weekStartDate}-${endMonthShort} ${weekEndDay}`;
                }
                
                const isSelectedWeek = (i === selectedSundayIndex);
                createTextLabel(weekLabel, labelHeight, earthDistance * 1.15, 5, labelAngle, isSelectedWeek);
            }
        }
    }
    
    // Create ghost markers at actual current month if offset
    if (monthOffset !== 0) {
        const ghostStartHeight = currentDateHeight - (spanHeight / 2);
        const ghostYearsFromStart = (currentDateHeight - ghostStartHeight) / 100;
        const ghostOrbitsFromStart = ghostYearsFromStart / earth.orbitalPeriod;
        const ghostAngleFromStart = ghostOrbitsFromStart * Math.PI * 2;
        const ghostStartAngle = earth.startAngle + ghostAngleFromStart;
        
        // Add ghost month name label at CENTER
        const ghostLabelHeight = currentDateHeight; // Center, not top
        const ghostLabelAngle = earth.startAngle; // Current Earth angle
        const currentMonthName = monthNames[currentMonthIndex];
        
        // Create semi-transparent label for ghost month
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        const textColor = isLightMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)';
        context.fillStyle = textColor;
        context.font = 'bold 60px Orbitron';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(currentMonthName, 256, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.3
        });
        
        const sprite = new THREE.Sprite(spriteMaterial);
        const labelX = Math.cos(ghostLabelAngle) * earthDistance * 1.4;
        const labelZ = Math.sin(ghostLabelAngle) * earthDistance * 1.4;
        sprite.position.set(labelX, ghostLabelHeight, labelZ);
        
        const scale = 20;
        sprite.scale.set(scale, scale * 0.25, 1);
        
        scene.add(sprite);
        timeMarkers.push(sprite);
        
        for (let week = 0; week <= weeksInMonth; week++) {
            const t = week / weeksInMonth;
            const angle = ghostStartAngle - (t * orbitsInSpan * Math.PI * 2);
            const height = ghostStartHeight + (t * spanHeight);
            
            const points = [
                0, height, 0,
                Math.cos(angle) * earthDistance, height, Math.sin(angle) * earthDistance
            ];
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            
            const material = new THREE.LineBasicMaterial({
                color: getMarkerColor(),
                transparent: true,
                opacity: 0.2,
                linewidth: 1
            });
            
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            timeMarkers.push(line);
        }
    }
    
    // Add daily tick marks (30 days in a month)
    const daysInMonth = 30;
    for (let day = 0; day <= daysInMonth; day++) {
        const t = day / daysInMonth;
        const angle = startAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        // Shorter tick line
        const tickStart = earthDistance * 0.95;
        const tickEnd = earthDistance;
        
        const points = [
            Math.cos(angle) * tickStart, height, Math.sin(angle) * tickStart,
            Math.cos(angle) * tickEnd, height, Math.sin(angle) * tickEnd
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: getMarkerColor(),
            transparent: true,
            opacity: 0.3,
            linewidth: 1
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
    }
}

// Lunar cycle view - show moon's orbit around Earth
function createLunarCycleMarkers(earthDistance, config, lunarOffset, passedCurrentDateHeight) {
    const spanHeight = config.timeYears * 100; // ~7.67 units for lunar cycle
    
    // Calculate selected lunar cycle position based on offset
    const lunarHeight = spanHeight; // One lunar cycle height
    const selectedHeightOffset = lunarOffset * lunarHeight;
    const selectedDateHeight = passedCurrentDateHeight + selectedHeightOffset;
    const startHeight = selectedDateHeight - (spanHeight / 2);
    const moonDistance = 15; // Moon distance from Earth
    const lunarPeriod = 0.0767; // ~28 days in years
    const segments = 200;
    
    // Add context markers for previous and next lunar cycle
    createContextMarkers(earthDistance, config, -1); // Previous cycle
    createContextMarkers(earthDistance, config, 1);  // Next cycle
    
    // Get Earth's orbital data
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    
    // Calculate Earth's angles using same method as worldline
    const timeSpanYears = spanHeight / 100;
    const earthOrbitsInSpan = timeSpanYears / earth.orbitalPeriod;
    const yearsBeforeCurrent = (selectedDateHeight - startHeight) / 100;
    const earthOrbitsBeforeCurrent = yearsBeforeCurrent / earth.orbitalPeriod;
    const earthAngleBeforeCurrent = earthOrbitsBeforeCurrent * Math.PI * 2;
    const earthStartAngle = earth.startAngle + earthAngleBeforeCurrent;
    
    // Calculate moon's orbital parameters
    const moonOrbitsInSpan = timeSpanYears / lunarPeriod;
    
    // Add lunar cycle label at top
    const cycleLabelHeight = startHeight + spanHeight;
    const cycleLabelAngle = earthStartAngle - earthOrbitsInSpan * Math.PI * 2;
    createTextLabel('Lunar Cycle', cycleLabelHeight, earthDistance * 1.4, 6, cycleLabelAngle);
    
    // Create moon worldline using Sun-relative phase positions
    // Moon orbits Earth but we position it based on lunar phases relative to Sun
    const moonPoints = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const earthAngle = earthStartAngle - (t * earthOrbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        // Earth position
        const earthX = Math.cos(earthAngle) * earthDistance;
        const earthZ = Math.sin(earthAngle) * earthDistance;
        
        // Sun to Earth direction
        const sunToEarthAngle = Math.atan2(earthZ, earthX);
        
        // Moon completes ~1 orbit per lunar cycle
        // Position moon relative to Sun-Earth line
        // New Moon at start (between Earth and Sun): sunToEarth + π
        // Full Moon at end (opposite Sun): sunToEarth
        const moonPhaseProgress = (t * moonOrbitsInSpan) % 1; // 0 to 1 for one lunar cycle
        const moonAngleRelativeToSun = sunToEarthAngle + Math.PI - (moonPhaseProgress * Math.PI * 2);
        
        // Moon position relative to Earth
        const moonX = earthX + Math.cos(moonAngleRelativeToSun) * moonDistance;
        const moonZ = earthZ + Math.sin(moonAngleRelativeToSun) * moonDistance;
        
        moonPoints.push(moonX, height, moonZ);
    }
    
    const moonGeometry = new THREE.BufferGeometry();
    moonGeometry.setAttribute('position', new THREE.Float32BufferAttribute(moonPoints, 3));
    
    const moonMaterial = new THREE.LineBasicMaterial({
        color: 0xaaaaaa,
        transparent: true,
        opacity: 0.7,
        linewidth: 2
    });
    
    const moonWorldline = new THREE.Line(moonGeometry, moonMaterial);
    scene.add(moonWorldline);
    timeMarkers.push(moonWorldline);
    
    // Add lunar phase markers with proper full cycle
    // New Moon (0) -> Waxing Crescent -> First Quarter -> Waxing Gibbous -> Full Moon (0.5) -> Waning Gibbous -> Last Quarter -> Waning Crescent -> New Moon (1.0)
    const lunarPhases = [
        'New Moon',           // 0.0 - between Earth and Sun
        'Waxing Crescent',    // 0.125
        'First Quarter',      // 0.25 - 90° from Sun-Earth line
        'Waxing Gibbous',     // 0.375
        'Full Moon',          // 0.5 - opposite Sun
        'Waning Gibbous',     // 0.625
        'Last Quarter',       // 0.75 - 270° from Sun-Earth line
        'Waning Crescent'     // 0.875
    ];
    const numPhases = 8;
    
    for (let phase = 0; phase <= numPhases; phase++) {
        const t = phase / numPhases;
        const earthAngle = earthStartAngle - (t * earthOrbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        // Earth position
        const earthX = Math.cos(earthAngle) * earthDistance;
        const earthZ = Math.sin(earthAngle) * earthDistance;
        
        // Sun to Earth direction
        const sunToEarthAngle = Math.atan2(earthZ, earthX);
        
        // Use same moon positioning as worldline
        const moonPhaseProgress = (t * moonOrbitsInSpan) % 1;
        const moonAngleRelativeToSun = sunToEarthAngle + Math.PI - (moonPhaseProgress * Math.PI * 2);
        
        // Moon position relative to Earth
        const moonX = earthX + Math.cos(moonAngleRelativeToSun) * moonDistance;
        const moonZ = earthZ + Math.sin(moonAngleRelativeToSun) * moonDistance;
        
        const points = [
            earthX, height, earthZ,  // Earth position
            moonX, height, moonZ     // Moon position
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        // Highlight current "week" (each week = 2 phases)
        // currentWeekInMonth: 0-3 maps to phases 0-1, 2-3, 4-5, 6-7
        const weekStartPhase = currentWeekInMonth * 2;
        const weekEndPhase = weekStartPhase + 2;
        const isCurrentWeekBoundary = (phase >= weekStartPhase && phase <= weekEndPhase);
        
        const material = new THREE.LineBasicMaterial({
            color: isCurrentWeekBoundary ? 0xFF0000 : getMarkerColor(),
            transparent: true,
            opacity: isCurrentWeekBoundary ? 0.9 : 0.5,
            linewidth: isCurrentWeekBoundary ? 3 : 1
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
        
        // Add lunar phase label at moon's actual worldline position
        if (phase < lunarPhases.length) {
            // Position label slightly beyond moon's position (1.3x from Earth center)
            const moonRelX = moonX - earthX;
            const moonRelZ = moonZ - earthZ;
            const labelX = earthX + moonRelX * 1.3;
            const labelZ = earthZ + moonRelZ * 1.3;
            
            // Create label at absolute position
            const sprite = createLunarLabel(lunarPhases[phase], height, labelX, labelZ);
            scene.add(sprite);
            timeMarkers.push(sprite);
        }
    }
    
    // Add radial markers from Earth's worldline at each New Moon
    // New Moon occurs when Moon is between Earth and Sun (phase = 0 in each cycle)
    // In a 28-day lunar cycle view, we show markers at the New Moon positions
    const numNewMoons = Math.ceil(moonOrbitsInSpan); // Number of New Moons in the span
    
    for (let moonCycle = 0; moonCycle <= numNewMoons; moonCycle++) {
        // Each New Moon is at the start of a lunar cycle
        const t = moonCycle / moonOrbitsInSpan;
        if (t > 1) break; // Don't go beyond the span
        
        const earthAngle = earthStartAngle - (t * earthOrbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        // Earth position
        const earthX = Math.cos(earthAngle) * earthDistance;
        const earthZ = Math.sin(earthAngle) * earthDistance;
        
        // Radial line from Sun through Earth (marking New Moon time)
        const points = [
            0, height, 0,  // Sun center
            earthX, height, earthZ  // Earth position
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: getMarkerColor(),
            transparent: true,
            opacity: 0.4,
            linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
    }
    
    // Add daily tick marks (28 days in lunar cycle)
    const daysInCycle = 28;
    for (let day = 0; day <= daysInCycle; day++) {
        const t = day / daysInCycle;
        const earthAngle = earthStartAngle - (t * earthOrbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        // Earth position
        const earthX = Math.cos(earthAngle) * earthDistance;
        const earthZ = Math.sin(earthAngle) * earthDistance;
        
        // Sun to Earth direction
        const sunToEarthAngle = Math.atan2(earthZ, earthX);
        
        // Moon position
        const moonPhaseProgress = (t * moonOrbitsInSpan) % 1;
        const moonAngleRelativeToSun = sunToEarthAngle + Math.PI - (moonPhaseProgress * Math.PI * 2);
        
        const moonX = earthX + Math.cos(moonAngleRelativeToSun) * moonDistance;
        const moonZ = earthZ + Math.sin(moonAngleRelativeToSun) * moonDistance;
        
        // Shorter tick from Earth toward Moon
        const tickT = 0.85;
        const tickX = earthX + (moonX - earthX) * tickT;
        const tickZ = earthZ + (moonZ - earthZ) * tickT;
        
        const points = [
            earthX, height, earthZ,
            tickX, height, tickZ
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: getMarkerColor(),
            transparent: true,
            opacity: 0.25,
            linewidth: 1
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
    }
}

// Create lunar label positioned at absolute coordinates
function createLunarLabel(text, height, x, z) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    const textColor = isLightMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    context.fillStyle = textColor;
    context.font = 'bold 60px Orbitron';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 256, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, height, z);
    
    const scale = 15; // Lunar cycle text size
    sprite.scale.set(scale, scale * 0.25, 1);
    
    return sprite;
}

// Week view - daily radial markers
function createWeekMarkers(earthDistance, config, weekOffset, currentDateHeight) {
    const spanHeight = config.timeYears * 100; // ~1.92 units for week
    const daysInWeek = 7;
    
    // Get ACTUAL system time values (not navigation-modified variables)
    // Markers stay FIXED at system time week - only red highlighting moves with selection
    const now = new Date();
    const actualDayOfMonth = now.getDate();
    const actualDayInWeek = now.getDay();
    const actualHourInDay = now.getHours();
    
    // Get Earth's orbital data
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    const timeSpanYears = spanHeight / 100;
    const orbitsInSpan = timeSpanYears / earth.orbitalPeriod;
    
    // Calculate the START of the current day (at midnight) using ACTUAL system time
    const dayHeight = ZOOM_LEVELS[8].timeYears * 100; // One day in height units
    const actualDayStartHeight = currentDateHeight - ((actualHourInDay / 24) * dayHeight);
    
    // Calculate the START of the selected week (accounting for offset)
    const weekHeight = spanHeight;
    const weekStartHeight = actualDayStartHeight - (actualDayInWeek * dayHeight) + (weekOffset * weekHeight);
    
    // Calculate Earth's angle at START of selected week
    const yearsFromCurrentToWeekStart = (weekStartHeight - currentDateHeight) / 100;
    const orbitsFromCurrentToWeekStart = yearsFromCurrentToWeekStart / earth.orbitalPeriod;
    const angleFromCurrentToWeekStart = orbitsFromCurrentToWeekStart * Math.PI * 2;
    const weekStartAngle = earth.startAngle - angleFromCurrentToWeekStart;
    
    // Add context markers for previous and next week
    createContextMarkers(earthDistance, config, -1); // Previous week
    createContextMarkers(earthDistance, config, 1);  // Next week
    
    // currentDayInWeek is the selected day within the week (0=Sunday, 6=Saturday)
    // It's modified directly by navigateUnit() when pressing A/D
    const displayedDayIndex = currentDayInWeek;
    
    // Create selection arcs around the actually selected day
    const selectionDayStartHeight = weekStartHeight + (displayedDayIndex / daysInWeek) * spanHeight;
    const selectionDayEndHeight = weekStartHeight + ((displayedDayIndex + 1) / daysInWeek) * spanHeight;
    const arcInfo = createSelectionArc(selectionDayStartHeight, selectionDayEndHeight, earthDistance, 0.8, 1.2, currentDateHeight);
    
    // Calculate which day of the month we're starting at for the SELECTED week
    // Use actual system date to find current week's Sunday, then add week offset
    const actualWeekStartDayOfMonth = actualDayOfMonth - actualDayInWeek; // Sunday of current week
    const weekStartDayOfMonth = actualWeekStartDayOfMonth + (selectedDayOffset * 7); // Sunday of selected week
    
    // Get month name for the week - calculate from the selected week's date
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const selectedWeekDate = new Date(now);
    selectedWeekDate.setDate(weekStartDayOfMonth + 3); // Middle of week to get correct month
    const weekMonthName = monthNames[selectedWeekDate.getMonth()];
    const weekYear = selectedWeekDate.getFullYear();
    
    // Calculate month midpoint height (not week midpoint)
    // Find the 15th of the current month as the midpoint
    const monthMidpointDate = new Date(selectedWeekDate.getFullYear(), selectedWeekDate.getMonth(), 15);
    const daysFromWeekStartToMonthMid = (monthMidpointDate - selectedWeekDate) / (1000 * 60 * 60 * 24);
    const monthMidHeight = weekStartHeight + (spanHeight / 2) + (daysFromWeekStartToMonthMid / 7) * spanHeight;
    
    // Calculate angle at month midpoint
    const heightDiffFromCurrent = monthMidHeight - currentDateHeight;
    const yearsFromCurrent = heightDiffFromCurrent / 100;
    const orbitsFromCurrent = yearsFromCurrent / earth.orbitalPeriod;
    const monthMidAngle = earth.startAngle - (orbitsFromCurrent * Math.PI * 2);
    
    // Add month name label at center of MONTH, outside orbit, using large format
    createTextLabel(`${weekMonthName} ${weekYear}`, monthMidHeight, earthDistance * 1.45, 7, monthMidAngle, false, true);
    
    // Create markers for all days in the selected week (8 markers = 7 day boundaries)
    for (let day = 0; day <= daysInWeek; day++) {
        const t = day / daysInWeek;
        const angle = weekStartAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = weekStartHeight + (t * spanHeight);
        
        // Highlight START and END of actually selected day in red
        const isSelectedDayStart = (day === displayedDayIndex);
        const isSelectedDayEnd = (day === displayedDayIndex + 1);
        const isSelectedDayBoundary = isSelectedDayStart || isSelectedDayEnd;
        
        // For red boundaries, extend from Sun to outer arc
        const endRadius = isSelectedDayBoundary ? arcInfo.outerRadius : earthDistance;
        
        const points = [
            0, height, 0,
            Math.cos(angle) * endRadius, height, Math.sin(angle) * endRadius
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        const material = new THREE.LineBasicMaterial({
            color: isSelectedDayBoundary ? 0xFF0000 : getMarkerColor(),
            transparent: true,
            opacity: isSelectedDayBoundary ? 0.9 : 0.6,
            linewidth: isSelectedDayBoundary ? 3 : 2
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
        
        // Add labels at CENTER of day (bisecting it) rather than at start
        if (day < daysInWeek) {
            const labelT = (day + 0.5) / daysInWeek; // Center of this day
            const labelAngle = weekStartAngle - (labelT * orbitsInSpan * Math.PI * 2);
            const labelHeight = weekStartHeight + (labelT * spanHeight);
            
            const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayOfMonth = weekStartDayOfMonth + day;
            const isSelectedDay = (day === displayedDayIndex);
            
            if (isSelectedDay) {
                // Selected day: full name in RED outside, number in RED inside
                const fullDayName = dayNamesFull[day];
                createTextLabel(fullDayName, labelHeight, earthDistance * 1.15, 7, labelAngle, true); // Red, outside
                createTextLabel(dayOfMonth.toString(), labelHeight, earthDistance * 0.75, 7, labelAngle, true); // Red, inside (same radius as white ones)
            } else {
                // Other days: abbreviated name outside, number inside
                createTextLabel(dayNamesShort[day], labelHeight, earthDistance * 1.1, 7, labelAngle); // Outside orbit
                createTextLabel(dayOfMonth.toString(), labelHeight, earthDistance * 0.75, 7, labelAngle); // Inside orbit
            }
        }
    }
    
    // Create ghost markers at actual current week if offset
    if (weekOffset !== 0) {
        const ghostStartHeight = currentDateHeight - (spanHeight / 2);
        const ghostYearsFromStart = (currentDateHeight - ghostStartHeight) / 100;
        const ghostOrbitsFromStart = ghostYearsFromStart / earth.orbitalPeriod;
        const ghostAngleFromStart = ghostOrbitsFromStart * Math.PI * 2;
        const ghostStartAngle = earth.startAngle + ghostAngleFromStart;
        
        for (let day = 0; day <= daysInWeek; day++) {
            const t = day / daysInWeek;
            const angle = ghostStartAngle - (t * orbitsInSpan * Math.PI * 2);
            const height = ghostStartHeight + (t * spanHeight);
            
            const points = [
                0, height, 0,
                Math.cos(angle) * earthDistance, height, Math.sin(angle) * earthDistance
            ];
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            
            const material = new THREE.LineBasicMaterial({
                color: getMarkerColor(),
                transparent: true,
                opacity: 0.2,
                linewidth: 1
            });
            
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            timeMarkers.push(line);
        }
    }
}

// Day view - hourly radial markers around Earth relative to Sun
function createDayMarkers(earthDistance, config, dayOffset, currentDateHeight) {
    const spanHeight = config.timeYears * 100; // ~0.27 units for day
    const hoursInDay = 24;
    const rotationRadius = 8;
    
    // Get Earth's orbital data
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    const timeSpanYears = spanHeight / 100;
    const orbitsInSpan = timeSpanYears / earth.orbitalPeriod;
    
    // Calculate the CENTER of the selected day based ONLY on dayOffset
    const dayHeight = spanHeight;
    const selectedDayCenterHeight = currentDateHeight + (dayOffset * dayHeight);
    
    // Calculate Earth's angle at the CENTER of selected day
    const yearsOffsetFromCurrent = (dayOffset * dayHeight) / 100;
    const orbitsOffsetFromCurrent = yearsOffsetFromCurrent / earth.orbitalPeriod;
    const angleOffsetFromCurrent = orbitsOffsetFromCurrent * Math.PI * 2;
    const selectedDayCenterAngle = earth.startAngle - angleOffsetFromCurrent;
    
    // Start of selected day
    const startHeight = selectedDayCenterHeight - (spanHeight / 2);
    const yearsFromStartToCenter = (selectedDayCenterHeight - startHeight) / 100;
    const orbitsFromStartToCenter = yearsFromStartToCenter / earth.orbitalPeriod;
    const angleFromStartToCenter = orbitsFromStartToCenter * Math.PI * 2;
    const earthStartAngle = selectedDayCenterAngle + angleFromStartToCenter;
    
    // Add context markers for previous and next day (relative to selected)
    createContextMarkers(earthDistance, config, -1); // Previous day
    createContextMarkers(earthDistance, config, 1);  // Next day
    
    for (let hour = 0; hour < 24; hour += 3) {
        const t = hour / 24;
        const earthAngle = earthStartAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        // Earth's orbital position
        const earthX = Math.cos(earthAngle) * earthDistance;
        const earthZ = Math.sin(earthAngle) * earthDistance;
        
        // Direction from Sun to Earth
        const sunToEarthAngle = Math.atan2(earthZ, earthX);
        
        // Full rotation over 24 hours
        // rotationOffset = π - (hour/24) * 2π
        // But this is 180° off, so add π to flip it
        const rotationOffset = Math.PI - (hour / 24) * 2 * Math.PI + Math.PI;
        const actualAngle = sunToEarthAngle + rotationOffset;
        
        const pointX = earthX + Math.cos(actualAngle) * rotationRadius;
        const pointZ = earthZ + Math.sin(actualAngle) * rotationRadius;
        
        const points = [
            earthX, height, earthZ,
            pointX, height, pointZ
        ];
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        
        // Highlight current hour in red (check if within 3-hour range)
        const isCurrentHour = (hour <= currentHourInDay && currentHourInDay < hour + 3);
        const material = new THREE.LineBasicMaterial({
            color: isCurrentHour ? 0xFF0000 : getMarkerColor(),
            transparent: true,
            opacity: isCurrentHour ? 0.9 : 0.6,
            linewidth: isCurrentHour ? 3 : 2
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        timeMarkers.push(line);
        
        // Position label at CENTER of 3-hour period (bisecting it) rather than at start
        const labelHour = hour + 1.5; // Center of 3-hour period
        const labelT = labelHour / 24;
        const labelEarthAngle = earthStartAngle - (labelT * orbitsInSpan * Math.PI * 2);
        const labelHeight = startHeight + (labelT * spanHeight);
        
        const labelEarthX = Math.cos(labelEarthAngle) * earthDistance;
        const labelEarthZ = Math.sin(labelEarthAngle) * earthDistance;
        const labelSunToEarthAngle = Math.atan2(labelEarthZ, labelEarthX);
        const labelRotationOffset = Math.PI - (labelHour / 24) * 2 * Math.PI + Math.PI;
        const labelActualAngle = labelSunToEarthAngle + labelRotationOffset;
        
        const labelDistance = rotationRadius * 1.5;
        const labelX = labelEarthX + Math.cos(labelActualAngle) * labelDistance;
        const labelZ = labelEarthZ + Math.sin(labelActualAngle) * labelDistance;
        
        const hourLabel = hour === 0 ? '0' : hour.toString();
        const sprite = createDayLabel(hourLabel, labelHeight, labelX, labelZ);
        scene.add(sprite);
        timeMarkers.push(sprite);
    }
    
    // Create hour ring connecting all hour positions around Earth
    const ringPoints = [];
    const ringSegments = 24; // One point per hour
    for (let hour = 0; hour <= ringSegments; hour++) {
        const t = hour / 24;
        const earthAngle = earthStartAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * spanHeight);
        
        const earthX = Math.cos(earthAngle) * earthDistance;
        const earthZ = Math.sin(earthAngle) * earthDistance;
        
        const sunToEarthAngle = Math.atan2(earthZ, earthX);
        const rotationOffset = Math.PI - (hour / 24) * 2 * Math.PI + Math.PI;
        const actualAngle = sunToEarthAngle + rotationOffset;
        
        const ringX = earthX + Math.cos(actualAngle) * rotationRadius;
        const ringZ = earthZ + Math.sin(actualAngle) * rotationRadius;
        
        ringPoints.push(ringX, height, ringZ);
    }
    
    const ringGeometry = new THREE.BufferGeometry();
    ringGeometry.setAttribute('position', new THREE.Float32BufferAttribute(ringPoints, 3));
    
    const ringMaterial = new THREE.LineBasicMaterial({
        color: getMarkerColor(),
        transparent: true,
        opacity: 0.5,
        linewidth: 2
    });
    
    const hourRing = new THREE.Line(ringGeometry, ringMaterial);
    scene.add(hourRing);
    timeMarkers.push(hourRing);
    
    // Create ghost markers at actual current day if offset
    if (dayOffset !== 0) {
        const ghostStartHeight = currentDateHeight - (spanHeight / 2);
        const ghostYearsFromStart = (currentDateHeight - ghostStartHeight) / 100;
        const ghostOrbitsFromStart = ghostYearsFromStart / earth.orbitalPeriod;
        const ghostAngleFromStart = ghostOrbitsFromStart * Math.PI * 2;
        const ghostEarthStartAngle = earth.startAngle + ghostAngleFromStart;
        
        for (let hour = 0; hour < 24; hour += 3) {
            const t = hour / 24;
            const earthAngle = ghostEarthStartAngle - (t * orbitsInSpan * Math.PI * 2);
            const height = ghostStartHeight + (t * spanHeight);
            
            const earthX = Math.cos(earthAngle) * earthDistance;
            const earthZ = Math.sin(earthAngle) * earthDistance;
            const sunToEarthAngle = Math.atan2(earthZ, earthX);
            const rotationOffset = Math.PI - (hour / 24) * 2 * Math.PI + Math.PI;
            const actualAngle = sunToEarthAngle + rotationOffset;
            
            const pointX = earthX + Math.cos(actualAngle) * rotationRadius;
            const pointZ = earthZ + Math.sin(actualAngle) * rotationRadius;
            
            const points = [
                earthX, height, earthZ,
                pointX, height, pointZ
            ];
            
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
            
            const material = new THREE.LineBasicMaterial({
                color: getMarkerColor(),
                transparent: true,
                opacity: 0.2,
                linewidth: 1
            });
            
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            timeMarkers.push(line);
        }
    }
}

// Create day label positioned at absolute coordinates (not using angle/radius)
function createDayLabel(text, height, x, z) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 128;
    
    const textColor = isLightMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    context.fillStyle = textColor;
    context.font = 'bold 60px Orbitron';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, 256, 64);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(x, height, z);
    
    const scale = 18; // 3x larger than before (was 6)
    sprite.scale.set(scale, scale * 0.25, 1);
    
    return sprite;
}

// Create a simple tick mark along the vertical axis
function createRadialTick(height, outerRadius, innerRadius, isMajor, label, zoomLevel = 1, isSmallest = false, customColor = null, customOpacity = null) {
    // Create a single horizontal line at the given height (across the axis)
    let tickLength;
    if (isSmallest) {
        tickLength = 25; // Smallest for 5-year ticks
    } else if (isMajor) {
        tickLength = 100; // Major ticks
    } else {
        tickLength = 50; // Minor ticks (10 years)
    }
    
    // Horizontal line
    const hPoints = [
        -tickLength, height, 0,
        tickLength, height, 0
    ];
    
    const hGeometry = new THREE.BufferGeometry();
    hGeometry.setAttribute('position', new THREE.Float32BufferAttribute(hPoints, 3));
    
    let opacity;
    if (customOpacity !== null) {
        opacity = customOpacity;
    } else if (isSmallest) {
        opacity = 0.2;
    } else if (isMajor) {
        opacity = 0.8;
    } else {
        opacity = 0.4;
    }
    
    const material = new THREE.LineBasicMaterial({
        color: customColor !== null ? customColor : getMarkerColor(),
        transparent: true,
        opacity: opacity,
        linewidth: isMajor ? 2 : 1
    });
    
    const hLine = new THREE.Line(hGeometry, material);
    scene.add(hLine);
    timeMarkers.push(hLine);
    
    // For Century and Decade views (1 and 2), add perpendicular lines to make crosses/X's
    // But not for smallest ticks
    if ((zoomLevel === 1 || zoomLevel === 2) && !isSmallest) {
        // Perpendicular line (z-axis)
        const vPoints = [
            0, height, -tickLength,
            0, height, tickLength
        ];
        
        const vGeometry = new THREE.BufferGeometry();
        vGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vPoints, 3));
        
        const vLine = new THREE.Line(vGeometry, material);
        scene.add(vLine);
        timeMarkers.push(vLine);
    }
    
    // Add label for major ticks
    if (isMajor && label) {
        createTextLabel(label.toString(), height, tickLength * 2, zoomLevel);
    }
}

// Create 3D text label (using sprites for simplicity)
// isLarge: if true, uses wider canvas and larger scale for month/year labels
function createTextLabel(text, height, radius, zoomLevel, angle = 0, isRed = false, isLarge = false) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Use wider canvas for large labels (like "December 2025")
    if (isLarge) {
        canvas.width = 1536; // Extra wide for month names
        canvas.height = 256;
    } else {
        canvas.width = 512;
        canvas.height = 128;
    }
    
    // Use red color if specified, otherwise use default
    const textColor = isRed ? 'rgba(255, 0, 0, 0.9)' : (isLightMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)');
    context.fillStyle = textColor;
    context.font = isLarge ? 'bold 80px Orbitron' : 'bold 60px Orbitron';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    // Position sprite at the given angle and radius
    sprite.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
    
    // Scale based on zoom level - larger for zoomed out views, smaller for zoomed in
    let scale;
    if (zoomLevel === 1) {
        scale = 3000; // Century - larger for far distance
    } else if (zoomLevel === 2) {
        scale = 200; // Decade - larger
    } else if (zoomLevel === 3) {
        scale = 37.5; // Year - reduced by 2x (was 75)
    } else if (zoomLevel === 4) {
        scale = 50; // Quarter - smaller (was 100)
    } else if (zoomLevel === 5) {
        scale = 16.5; // Month - half size (was 33)
    } else if (zoomLevel === 6) {
        scale = 15; // Lunar - much smaller (was 60)
    } else if (zoomLevel === 7) {
        scale = isLarge ? 15 : 5; // Week - much larger for month label
    } else {
        scale = 6; // Day
    }
    
    sprite.scale.set(scale, scale * 0.25, 1);
    
    scene.add(sprite);
    timeMarkers.push(sprite);
}

function createWorldline(planetData, timeYears, zoomLevel) {
    const points = [];
    // Increase segments for higher zoom levels for better detail
    const segments = zoomLevel >= 4 ? 400 : 200;
    const orbits = timeYears / planetData.orbitalPeriod;
    const config = ZOOM_LEVELS[zoomLevel];
    
    // For zoom levels 3+ use precise current date; for 1-2 use year start
    const currentDateHeight = (zoomLevel >= 3) 
        ? calculateCurrentDateHeight() 
        : getHeightForYear(currentYear, 1);
    
    // Calculate worldline span based on zoom level
    let startHeight, endHeight;
    
    if (zoomLevel === 1) { // Century - show full 2000-2100
        startHeight = getHeightForYear(2000, 1);
        endHeight = getHeightForYear(2100, 1);
    } else if (zoomLevel === 2) { // Decade - show 2020-2030
        startHeight = getHeightForYear(2020, 1);
        endHeight = getHeightForYear(2030, 1);
    } else if (zoomLevel === 3) { // Year - show full year with current date
        const yearHeight = 100; // 100 units per year
        // Calculate progress dynamically
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
        if (isLeapYear) daysInMonth[1] = 29;
        const yearProgress = (currentMonthInYear + currentDayOfMonth / daysInMonth[currentMonthInYear]) / 12;
        startHeight = currentDateHeight - (yearProgress * yearHeight);
        endHeight = startHeight + yearHeight;
    } else { // Higher zooms - show time span around current date
        // timeYears is the span (e.g., 0.25 for quarter = 3 months)
        // Use 100 units per year, so for a quarter that's 25 units
        const spanHeight = timeYears * 100;
        // Extend worldlines beyond the visible time markers for context
        const extensionFactor = 2.5; // Show 2.5x the span (1.25x before and after)
        startHeight = currentDateHeight - (spanHeight * extensionFactor / 2);
        endHeight = currentDateHeight + (spanHeight * extensionFactor / 2);
    }
    
    const totalHeight = endHeight - startHeight;
    
    // Calculate how much time this height span represents
    const timeSpanYears = totalHeight / 100;
    
    // Calculate what fraction of an orbit occurs in this time span
    const orbitsInSpan = timeSpanYears / planetData.orbitalPeriod;
    
    // Calculate the starting angle based on how far back in time we're going from current date
    const yearsBeforeCurrent = (currentDateHeight - startHeight) / 100;
    const orbitsBeforeCurrent = yearsBeforeCurrent / planetData.orbitalPeriod;
    const angleBeforeCurrent = orbitsBeforeCurrent * Math.PI * 2;
    
    // Start angle is the current angle plus the angle that will be subtracted (counter-clockwise)
    const startAngle = planetData.startAngle + angleBeforeCurrent;
    
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        // Negative angle for counter-clockwise rotation (when viewed from North/above)
        const angle = startAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * totalHeight);
        
        const x = Math.cos(angle) * planetData.distance;
        const y = height;
        const z = Math.sin(angle) * planetData.distance;
        
        points.push(x, y, z);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    
    // Make Earth's worldline more prominent at higher zoom levels
    const isEarth = planetData.name === 'Earth';
    const opacity = (isEarth && zoomLevel >= 3) ? 0.9 : SCENE_CONFIG.worldlineOpacity;
    const lineWidth = (isEarth && zoomLevel >= 3) ? 3 : 2;
    
    // Adjust colors for light mode visibility - make them more saturated/vibrant
    let worldlineColor = planetData.color;
    if (isLightMode) {
        // Increase saturation and slightly darken for better contrast on light background
        const saturationBoost = 1.3; // Boost saturation
        const darkenFactor = 0.7; // Slight darkening (was 0.4, too dark)
        let r = ((worldlineColor >> 16) & 0xFF);
        let g = ((worldlineColor >> 8) & 0xFF);
        let b = (worldlineColor & 0xFF);
        
        // Find max and boost others relative to it for more saturation
        const max = Math.max(r, g, b);
        if (max > 0) {
            r = Math.min(255, r * saturationBoost * darkenFactor);
            g = Math.min(255, g * saturationBoost * darkenFactor);
            b = Math.min(255, b * saturationBoost * darkenFactor);
        }
        worldlineColor = (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
    }
    
    const material = new THREE.LineBasicMaterial({
        color: worldlineColor,
        transparent: true,
        opacity: isLightMode ? 0.95 : opacity, // Higher opacity in light mode
        linewidth: isLightMode ? lineWidth + 1 : lineWidth // Thicker in light mode
    });
    
    return new THREE.Line(geometry, material);
}

function createPlanets(zoomLevel) {
    planetMeshes.forEach(p => scene.remove(p));
    orbitLines.forEach(o => scene.remove(o));
    worldlines.forEach(w => scene.remove(w));
    
    // Remove ghost elements
    if (ghostEarth) {
        scene.remove(ghostEarth);
        ghostEarth = null;
    }
    if (ghostOrbitLine) {
        scene.remove(ghostOrbitLine);
        ghostOrbitLine = null;
    }
    
    planetMeshes.length = 0;
    orbitLines.length = 0;
    worldlines.length = 0;
    
    const config = ZOOM_LEVELS[zoomLevel];
    const focusOnEarth = config.focusTarget === 'earth';
    
    // The orbital plane is at the current date
    // For zoom levels 3+ (Year, Quarter, etc.), use precise date; for 1-2 use year start
    // For Zoom 4, we need to use ACTUAL system date to avoid issues with navigated variables
    let currentDateHeight;
    if (zoomLevel === 4) {
        // Calculate actual system date height directly (bypass navigated variables)
        const nowActual = new Date();
        const actualYear = nowActual.getFullYear();
        const actualMonth = nowActual.getMonth();
        const actualDay = nowActual.getDate();
        const actualHour = nowActual.getHours();
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const isLeap = (actualYear % 4 === 0 && actualYear % 100 !== 0) || (actualYear % 400 === 0);
        if (isLeap) daysInMonth[1] = 29;
        const yearProgress = (actualMonth + (actualDay - 1) / daysInMonth[actualMonth] + actualHour / (24 * daysInMonth[actualMonth])) / 12;
        currentDateHeight = ((actualYear - 2000) * 100) + (yearProgress * 100);
    } else if (zoomLevel >= 3) {
        currentDateHeight = calculateCurrentDateHeight();
    } else {
        currentDateHeight = getHeightForYear(currentYear, 1);
    }
    
    // Calculate selected position offset based on zoom level
    let selectedHeightOffset = 0;
    if (zoomLevel === 2) { // Decade view
        const yearHeight = 100; // 100 units per year
        selectedHeightOffset = selectedDecadeOffset * (10 * yearHeight); // Full decade offset
    } else if (zoomLevel === 3) { // Year view
        const yearHeight = 100;
        const monthHeight = yearHeight / 12;
        // Get ACTUAL system month (not navigation-modified)
        const nowP3 = new Date();
        const actualMonthInYear = nowP3.getMonth();
        // currentMonthInYear changes with A/D, actualMonthInYear is fixed
        selectedHeightOffset = (selectedYearOffset * yearHeight) + (currentMonthInYear * monthHeight) - (actualMonthInYear * monthHeight);
    } else if (zoomLevel === 4) { // Quarter view
        const quarterHeight = config.timeYears * 100;
        const monthHeight = quarterHeight / 3;
        // Get ACTUAL current month within quarter from system time
        const nowP4 = new Date();
        const actualMonthInQuarter = nowP4.getMonth() % 3;
        // currentMonth changes with A/D (0-2), actualMonthInQuarter is the actual system month in quarter
        // When currentMonth === actualMonthInQuarter and selectedQuarterOffset === 0, offset should be 0
        selectedHeightOffset = (selectedQuarterOffset * quarterHeight) + ((currentMonth - actualMonthInQuarter) * monthHeight);
    } else if (zoomLevel === 5) { // Month view
        const monthHeight = config.timeYears * 100;
        const weekHeight = monthHeight / 4;
        const dayHeight = weekHeight / 7;
        // Get ACTUAL system week/day (not navigation-modified)
        const nowP5 = new Date();
        const actualWeekInMonth = Math.floor((nowP5.getDate() - 1) / 7);
        const actualDayInWeek = nowP5.getDay();
        // currentWeekInMonth/currentDayInWeek change with A/D, actual values are fixed
        selectedHeightOffset = (selectedWeekOffset * monthHeight) + (currentWeekInMonth * weekHeight) + (currentDayInWeek * dayHeight) - (actualWeekInMonth * weekHeight) - (actualDayInWeek * dayHeight);
    } else if (zoomLevel === 6) { // Lunar view
        const lunarHeight = config.timeYears * 100;
        const weekHeight = lunarHeight / 4; // 4 weeks per lunar cycle
        const currentWeekInLunar = 1; // Assume week 1 of current cycle
        selectedHeightOffset = (selectedLunarOffset * lunarHeight) + (currentWeekInMonth * weekHeight) - (currentWeekInLunar * weekHeight);
    } else if (zoomLevel === 7) { // Week view
        const weekHeight = config.timeYears * 100;
        const dayHeight = weekHeight / 7;
        const hourHeight = dayHeight / 24;
        // Get ACTUAL system day/hour (not navigation-modified)
        const nowP7 = new Date();
        const actualDayInWeek = nowP7.getDay();
        const actualHourInDay = nowP7.getHours();
        // currentDayInWeek/currentHourInDay change with A/D, actual values are fixed
        selectedHeightOffset = (selectedDayOffset * weekHeight) + (currentDayInWeek * dayHeight) + (currentHourInDay * hourHeight) - (actualDayInWeek * dayHeight) - (actualHourInDay * hourHeight);
    } else if (zoomLevel === 8 || zoomLevel === 9) { // Day/Clock view
        const dayHeight = config.timeYears * 100;
        const hourHeight = dayHeight / 24;
        // Offset from current day + position within selected day
        selectedHeightOffset = (selectedHourOffset * dayHeight) + (currentHourInDay * hourHeight) - (14 * hourHeight); // 14 is current hour (2 PM)
    }
    
    const selectedDateHeight = currentDateHeight + selectedHeightOffset;
    
    // Update target focus point to follow selected position (will be smoothly interpolated)
    // For earth-focused zooms, focus on Earth's X,Z position at selected height
    // For sun-focused zooms, focus on Sun at selected height
    if (config.focusTarget === 'earth') {
        // Calculate Earth's position at selected time
        const earth = PLANET_DATA.find(p => p.name === 'Earth');
        if (selectedHeightOffset !== 0) {
            // Calculate Earth's angle at selected time
            const yearsOffset = selectedHeightOffset / 100;
            const orbitsOffset = yearsOffset / earth.orbitalPeriod;
            const angleOffset = orbitsOffset * Math.PI * 2;
            const earthAngle = earth.startAngle - angleOffset;
            
            targetFocusPoint.set(
                Math.cos(earthAngle) * earth.distance,
                selectedDateHeight,
                Math.sin(earthAngle) * earth.distance
            );
        } else {
            // Use current Earth position
            targetFocusPoint.set(
                Math.cos(earth.startAngle) * earth.distance,
                selectedDateHeight,
                Math.sin(earth.startAngle) * earth.distance
            );
        }
    } else {
        // Sun-focused: just update Y
        targetFocusPoint.y = selectedDateHeight;
    }
    
    console.log('createPlanets - zoom:', zoomLevel, 'offset:', selectedHeightOffset, 'selectedHeight:', selectedDateHeight, 'currentHeight:', currentDateHeight);
    
    // Update Sun position to match selected date height
    if (sunMesh) {
        sunMesh.position.y = selectedDateHeight;
    }
    if (sunGlow) {
        sunGlow.position.y = selectedDateHeight;
    }
    if (sunLight) {
        sunLight.position.y = selectedDateHeight;
    }
    
    // Calculate scale factor for all planets based on zoom level
    let planetScaleFactor = 1.0;
    if (zoomLevel >= 7) {
        planetScaleFactor = 0.3; // 30% size for Week and Day views
    }
    
    PLANET_DATA.forEach(planetData => {
        // Show all planets at all zoom levels
        // Scale all planets proportionally at close zoom levels
        let planetSize = planetData.size * planetScaleFactor;
        
        const geometry = new THREE.SphereGeometry(planetSize, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: planetData.color,
            metalness: 0.3,
            roughness: 0.7
        });
        const planet = new THREE.Mesh(geometry, material);
        
        // Calculate angle at selected height based on orbital motion
        let planetAngle = planetData.startAngle;
        if (selectedHeightOffset !== 0) {
            const yearsOffset = selectedHeightOffset / 100;
            const orbitsOffset = yearsOffset / planetData.orbitalPeriod;
            const angleOffset = orbitsOffset * Math.PI * 2;
            planetAngle = planetData.startAngle - angleOffset; // Counter-clockwise
        }
        
        // Position planet at selected date height
        planet.position.x = Math.cos(planetAngle) * planetData.distance;
        planet.position.y = selectedDateHeight;
        planet.position.z = Math.sin(planetAngle) * planetData.distance;
        
        planet.userData = {
            distance: planetData.distance,
            speed: planetData.speed,
            angle: planetAngle,
            name: planetData.name,
            baseHeight: selectedDateHeight
        };
        
        scene.add(planet);
        planetMeshes.push(planet);
        
        // Create ghost Earth at actual current position if offset
        if (planetData.name === 'Earth' && selectedHeightOffset !== 0) {
            const ghostGeometry = new THREE.SphereGeometry(planetSize, 32, 32);
            const ghostMaterial = new THREE.MeshStandardMaterial({
                color: planetData.color,
                metalness: 0.3,
                roughness: 0.7,
                transparent: true,
                opacity: 0.3
            });
            ghostEarth = new THREE.Mesh(ghostGeometry, ghostMaterial);
            
            // Position at actual current date
            ghostEarth.position.x = Math.cos(planetData.startAngle) * planetData.distance;
            ghostEarth.position.y = currentDateHeight;
            ghostEarth.position.z = Math.sin(planetData.startAngle) * planetData.distance;
            
            scene.add(ghostEarth);
        }
        
        // Create orbit line at selected date height
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        const segments = 128;
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            orbitPoints.push(
                Math.cos(angle) * planetData.distance,
                selectedDateHeight,
                Math.sin(angle) * planetData.distance
            );
        }
        
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: SCENE_CONFIG.orbitLineColor,
            transparent: true,
            opacity: SCENE_CONFIG.orbitLineOpacity
        });
        const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
        scene.add(orbitLine);
        orbitLines.push(orbitLine);
        
        // Create ghost orbit line at actual current position if offset
        if (planetData.name === 'Earth' && selectedHeightOffset !== 0) {
            const ghostOrbitGeometry = new THREE.BufferGeometry();
            const ghostOrbitPoints = [];
            
            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * Math.PI * 2;
                ghostOrbitPoints.push(
                    Math.cos(angle) * planetData.distance,
                    currentDateHeight,
                    Math.sin(angle) * planetData.distance
                );
            }
            
            ghostOrbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(ghostOrbitPoints, 3));
            const ghostOrbitMaterial = new THREE.LineBasicMaterial({
                color: SCENE_CONFIG.orbitLineColor,
                transparent: true,
                opacity: SCENE_CONFIG.orbitLineOpacity * 0.3
            });
            ghostOrbitLine = new THREE.Line(ghostOrbitGeometry, ghostOrbitMaterial);
            scene.add(ghostOrbitLine);
        }
        
        // Create worldline
        const worldline = createWorldline(planetData, config.timeYears, zoomLevel);
        scene.add(worldline);
        worldlines.push(worldline);
        
        // Create connector worldline if viewing a different time than present
        if (selectedHeightOffset !== 0) {
            const connectorWorldline = createConnectorWorldline(planetData, currentDateHeight, selectedDateHeight);
            scene.add(connectorWorldline);
            worldlines.push(connectorWorldline);
        }
    });

    // Create time markers for this zoom level
    createTimeMarkers(zoomLevel);
}

// Create a worldline connecting selected time to current time
function createConnectorWorldline(planetData, currentHeight, selectedHeight) {
    const points = [];
    const segments = 100;
    
    // Determine start and end heights
    const startHeight = Math.min(currentHeight, selectedHeight);
    const endHeight = Math.max(currentHeight, selectedHeight);
    const totalHeight = endHeight - startHeight;
    
    // Calculate angles
    const timeSpanYears = totalHeight / 100;
    const orbitsInSpan = timeSpanYears / planetData.orbitalPeriod;
    
    // Calculate starting angle
    const yearsFromCurrent = (currentHeight - startHeight) / 100;
    const orbitsFromCurrent = yearsFromCurrent / planetData.orbitalPeriod;
    const angleFromCurrent = orbitsFromCurrent * Math.PI * 2;
    const startAngle = planetData.startAngle + angleFromCurrent;
    
    // Create helical path from start to end
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = startAngle - (t * orbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * totalHeight);
        
        const x = Math.cos(angle) * planetData.distance;
        const y = height;
        const z = Math.sin(angle) * planetData.distance;
        
        points.push(x, y, z);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    
    // Distinct color for connector - slightly transparent
    const material = new THREE.LineBasicMaterial({
        color: 0x00FFFF, // Cyan to distinguish from main worldline
        transparent: true,
        opacity: 0.5,
        linewidth: 2
    });
    
    return new THREE.Line(geometry, material);
}

function initControls() {
    // Mouse events for desktop
    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            cameraRotation.y -= deltaX * 0.005;
            cameraRotation.x -= deltaY * 0.005;
            cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.x));
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    renderer.domElement.addEventListener('mouseup', () => { isDragging = false; });
    renderer.domElement.addEventListener('mouseleave', () => { isDragging = false; });
    
    // Touch events for mobile
    let lastTouchDistance = 0;
    
    renderer.domElement.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            // Single touch - rotate camera
            isDragging = true;
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            // Two fingers - pinch to zoom
            isDragging = false;
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
        }
        e.preventDefault();
    }, { passive: false });
    
    renderer.domElement.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            // Single touch drag - rotate camera
            const deltaX = e.touches[0].clientX - previousMousePosition.x;
            const deltaY = e.touches[0].clientY - previousMousePosition.y;
            
            cameraRotation.y -= deltaX * 0.005;
            cameraRotation.x -= deltaY * 0.005;
            cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.x));
            
            previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.touches.length === 2) {
            // Pinch to zoom
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (lastTouchDistance > 0) {
                const zoomFactor = lastTouchDistance / distance;
                targetCameraDistance *= zoomFactor;
                // Clamp to reasonable limits
                const config = ZOOM_LEVELS[currentZoom];
                targetCameraDistance = Math.max(config.distance * 0.3, Math.min(config.distance * 3, targetCameraDistance));
            }
            lastTouchDistance = distance;
        }
        e.preventDefault();
    }, { passive: false });
    
    renderer.domElement.addEventListener('touchend', (e) => {
        isDragging = false;
        lastTouchDistance = 0;
    });
    
    renderer.domElement.addEventListener('touchcancel', (e) => {
        isDragging = false;
        lastTouchDistance = 0;
    });

    document.addEventListener('keydown', (e) => {
        // Check if user is typing in a text field
        const activeElement = document.activeElement;
        const isTyping = activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' || 
            activeElement.isContentEditable
        );
        
        // Disable all keyboard shortcuts when typing in form fields
        if (isTyping) {
            return;
        }
        
        // Disable WASD navigation on landing page (Zoom 0)
        const isLandingPage = currentZoom === 0;
        
        const key = parseInt(e.key);
        if (key >= 0 && key <= 9) {
            setZoomLevel(key);
        } else if (e.key.toLowerCase() === 'w' && !isLandingPage) {
            // Zoom in (increase zoom level), skip Lunar view (6)
            if (currentZoom < 9) {
                let nextZoom = currentZoom + 1;
                // Skip Lunar view (6) unless we're already at 6
                if (nextZoom === 6 && currentZoom !== 6) {
                    nextZoom = 7;
                }
                setZoomLevel(nextZoom);
            }
        } else if (e.key.toLowerCase() === 's' && !isLandingPage) {
            // Zoom out (decrease zoom level), skip Lunar view (6)
            if (currentZoom > 1) {
                let prevZoom = currentZoom - 1;
                // Skip Lunar view (6) unless we're already at 6
                if (prevZoom === 6 && currentZoom !== 6) {
                    prevZoom = 5;
                }
                setZoomLevel(prevZoom);
            }
        } else if (e.key.toLowerCase() === 'a' && !isLandingPage) {
            navigateUnit(-1); // Navigate down one unit (previous week, day, hour, etc.)
        } else if (e.key.toLowerCase() === 'd' && !isLandingPage) {
            navigateUnit(1); // Navigate up one unit (next week, day, hour, etc.)
        } else if (e.key.toLowerCase() === 'n' && !isLandingPage) {
            returnToPresent(); // Return selection to current date/time
        } else if (e.key.toLowerCase() === 'm' && !isLandingPage) {
            toggleMoonWorldline(); // Toggle moon worldline visibility
        } else if (e.key.toLowerCase() === 't' && !isLandingPage) {
            toggleTimeRotation(); // Toggle time axis rotation (horizontal view)
        } else if (e.key.toLowerCase() === 'r' && !isLandingPage) {
            rotate90Right(); // Rotate system 90 degrees clockwise
        } else if (e.code === 'Space' && !isLandingPage) {
            e.preventDefault(); // Prevent page scroll
            smoothReturnToPresent(); // Smoothly animate back to current time
        }
    });
    
    // Mouse wheel zoom within current zoom level
    renderer.domElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
        targetCameraDistance *= zoomFactor;
        // Clamp to reasonable limits
        const config = ZOOM_LEVELS[currentZoom];
        targetCameraDistance = Math.max(config.distance * 0.3, Math.min(config.distance * 3, targetCameraDistance));
    });

    document.querySelectorAll('.zoom-option').forEach(option => {
        option.addEventListener('click', () => {
            const zoom = parseInt(option.dataset.zoom);
            if (!isNaN(zoom)) {
                setZoomLevel(zoom);
            }
        });
    });
    
    // Time markers toggle
    document.getElementById('markers-toggle').addEventListener('click', toggleTimeMarkers);
    
    // Light mode toggle
    document.getElementById('light-mode-toggle').addEventListener('click', toggleLightMode);
}

function returnToPresent() {
    // Reset all offset variables to zero
    selectedYearOffset = 0;
    selectedQuarterOffset = 0;
    selectedWeekOffset = 0;
    selectedDayOffset = 0;
    selectedHourOffset = 0;
    selectedLunarOffset = 0;
    selectedDecadeOffset = 0;
    
    // Re-initialize from system time
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonthInYear = now.getMonth();
    currentDayOfMonth = now.getDate();
    currentHourInDay = now.getHours();
    currentQuarter = Math.floor(currentMonthInYear / 3);
    currentMonth = currentMonthInYear % 3;
    currentWeekInMonth = Math.floor((currentDayOfMonth - 1) / 7);
    currentDayInWeek = now.getDay();
    
    // Recreate planets and markers at current position
    createPlanets(currentZoom);
    updateTimeDisplays(); // Update time displays after returning to present
}

// Smoothly animate back to current time
let isAnimatingToPresent = false;
function smoothReturnToPresent() {
    if (isAnimatingToPresent) return; // Prevent multiple simultaneous animations
    
    // Calculate the target height (current system time)
    const presentHeight = calculateCurrentDateHeight();
    
    // Set the target focus point to the present
    targetFocusPoint.y = presentHeight;
    
    // Start animation flag
    isAnimatingToPresent = true;
    
    // Animate the offsets to zero over time
    const animationDuration = 1500; // ms - slower for smoother animation
    const startTime = performance.now();
    
    // Store starting values
    const startOffsets = {
        selectedYearOffset,
        selectedQuarterOffset,
        selectedWeekOffset,
        selectedDayOffset,
        selectedHourOffset,
        selectedLunarOffset,
        selectedDecadeOffset,
        currentYear: currentYear,
        currentMonthInYear: currentMonthInYear,
        currentMonth: currentMonth,
        currentWeekInMonth: currentWeekInMonth,
        currentDayInWeek: currentDayInWeek,
        currentHourInDay: currentHourInDay
    };
    
    // Target values (current system time)
    const now = new Date();
    const targetValues = {
        currentYear: now.getFullYear(),
        currentMonthInYear: now.getMonth(),
        currentMonth: now.getMonth() % 3,
        currentWeekInMonth: Math.floor((now.getDate() - 1) / 7),
        currentDayInWeek: now.getDay(),
        currentHourInDay: now.getHours()
    };
    
    function animateStep() {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Ease-in-out quintic for very smooth acceleration and deceleration
        const eased = progress < 0.5
            ? 16 * Math.pow(progress, 5)
            : 1 - Math.pow(-2 * progress + 2, 5) / 2;
        
        // Interpolate offsets toward zero (use floor for smooth continuous movement)
        selectedYearOffset = Math.floor(startOffsets.selectedYearOffset * (1 - eased) + 0.5);
        selectedQuarterOffset = Math.floor(startOffsets.selectedQuarterOffset * (1 - eased) + 0.5);
        selectedWeekOffset = Math.floor(startOffsets.selectedWeekOffset * (1 - eased) + 0.5);
        selectedDayOffset = Math.floor(startOffsets.selectedDayOffset * (1 - eased) + 0.5);
        selectedHourOffset = Math.floor(startOffsets.selectedHourOffset * (1 - eased) + 0.5);
        selectedLunarOffset = Math.floor(startOffsets.selectedLunarOffset * (1 - eased) + 0.5);
        selectedDecadeOffset = Math.floor(startOffsets.selectedDecadeOffset * (1 - eased) + 0.5);
        
        // Interpolate navigation variables toward current time
        currentYear = Math.floor(startOffsets.currentYear + (targetValues.currentYear - startOffsets.currentYear) * eased + 0.5);
        currentMonthInYear = Math.floor(startOffsets.currentMonthInYear + (targetValues.currentMonthInYear - startOffsets.currentMonthInYear) * eased + 0.5);
        currentMonth = Math.floor(startOffsets.currentMonth + (targetValues.currentMonth - startOffsets.currentMonth) * eased + 0.5);
        currentWeekInMonth = Math.floor(startOffsets.currentWeekInMonth + (targetValues.currentWeekInMonth - startOffsets.currentWeekInMonth) * eased + 0.5);
        currentDayInWeek = Math.floor(startOffsets.currentDayInWeek + (targetValues.currentDayInWeek - startOffsets.currentDayInWeek) * eased + 0.5);
        currentHourInDay = Math.floor(startOffsets.currentHourInDay + (targetValues.currentHourInDay - startOffsets.currentHourInDay) * eased + 0.5);
        
        // Update the scene
        createPlanets(currentZoom);
        updateTimeDisplays();
        
        if (progress < 1) {
            requestAnimationFrame(animateStep);
        } else {
            // Animation complete - ensure we're exactly at present
            isAnimatingToPresent = false;
            returnToPresent(); // Final cleanup to ensure exact values
        }
    }
    
    requestAnimationFrame(animateStep);
}

function toggleMoonWorldline() {
    showMoonWorldline = !showMoonWorldline;
    
    if (showMoonWorldline) {
        createMoonWorldline();
    } else {
        // Remove all moon worldline meshes
        moonWorldlines.forEach(mesh => {
            scene.remove(mesh);
        });
        moonWorldlines = [];
    }
}

function createMoonWorldline() {
    // Remove existing moon worldlines
    moonWorldlines.forEach(mesh => {
        scene.remove(mesh);
    });
    moonWorldlines = [];
    
    // Create extended moon worldline (beyond time marker frame)
    const currentDateHeight = getHeightForYear(currentYear, 1);
    const extensionFactor = 5; // Extend 5x beyond current view
    const baseSpan = ZOOM_LEVELS[currentZoom].timeYears * 100;
    const totalSpan = baseSpan * extensionFactor;
    const startHeight = currentDateHeight - (totalSpan / 2);
    
    const moonDistance = 15; // Moon distance from Earth
    const lunarPeriod = 0.0767; // ~28 days in years
    const segments = 1000; // More segments for smoother line
    
    // Get Earth's orbital data
    const earth = PLANET_DATA.find(p => p.name === 'Earth');
    
    // Calculate Earth's angles
    const timeSpanYears = totalSpan / 100;
    const earthOrbitsInSpan = timeSpanYears / earth.orbitalPeriod;
    const yearsBeforeCurrent = (currentDateHeight - startHeight) / 100;
    const earthOrbitsBeforeCurrent = yearsBeforeCurrent / earth.orbitalPeriod;
    const earthAngleBeforeCurrent = earthOrbitsBeforeCurrent * Math.PI * 2;
    const earthStartAngle = earth.startAngle + earthAngleBeforeCurrent;
    
    // Calculate moon's orbital parameters
    const moonOrbitsInSpan = timeSpanYears / lunarPeriod;
    
    // Create moon worldline
    const moonPoints = [];
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const earthAngle = earthStartAngle - (t * earthOrbitsInSpan * Math.PI * 2);
        const height = startHeight + (t * totalSpan);
        
        // Earth position
        const earthX = Math.cos(earthAngle) * earth.distance;
        const earthZ = Math.sin(earthAngle) * earth.distance;
        
        // Sun to Earth direction
        const sunToEarthAngle = Math.atan2(earthZ, earthX);
        
        // Moon phase progress
        const moonPhaseProgress = (t * moonOrbitsInSpan) % 1;
        const moonAngleRelativeToSun = sunToEarthAngle + Math.PI - (moonPhaseProgress * Math.PI * 2);
        
        // Moon position relative to Earth
        const moonX = earthX + Math.cos(moonAngleRelativeToSun) * moonDistance;
        const moonZ = earthZ + Math.sin(moonAngleRelativeToSun) * moonDistance;
        
        moonPoints.push(moonX, height, moonZ);
    }
    
    const moonGeometry = new THREE.BufferGeometry();
    moonGeometry.setAttribute('position', new THREE.Float32BufferAttribute(moonPoints, 3));
    
    const moonMaterial = new THREE.LineBasicMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 0.4,
        linewidth: 1
    });
    
    const moonWorldline = new THREE.Line(moonGeometry, moonMaterial);
    scene.add(moonWorldline);
    moonWorldlines.push(moonWorldline);
}

function toggleTimeMarkers() {
    showTimeMarkers = !showTimeMarkers;
    
    const button = document.getElementById('markers-toggle');
    button.classList.toggle('active', showTimeMarkers);
    
    // Toggle visibility of all time markers
    timeMarkers.forEach(marker => {
        marker.visible = showTimeMarkers;
    });
}

function toggleLightMode() {
    isLightMode = !isLightMode;
    
    // Toggle body class
    document.body.classList.toggle('light-mode', isLightMode);
    
    // Update button state
    const button = document.getElementById('light-mode-toggle');
    button.classList.toggle('active', isLightMode);
    
    // Update scene background based on current view mode
    let bgColor;
    if (isLightMode) {
        // Light mode colors
        if (viewMode === 0) {
            bgColor = 0xe8f4f8; // Original light mode (neutral)
        } else if (viewMode === 1) {
            bgColor = 0xf8e8e8; // Slight red tinge (looking down from above)
        } else {
            bgColor = 0xe8e8f8; // Slight blue tinge (looking up from below)
        }
    } else {
        // Dark mode colors
        if (viewMode === 0) {
            bgColor = 0x000814; // Original dark mode (neutral)
        } else if (viewMode === 1) {
            bgColor = 0x140808; // Slight red tinge (looking down from above)
        } else {
            bgColor = 0x080814; // Slight blue tinge (looking up from below)
        }
    }
    scene.background = new THREE.Color(bgColor);
    // No fog for better visibility
    // scene.fog = new THREE.FogExp2(bgColor, SCENE_CONFIG.fogDensity);
    
    // Update stars
    createStarField();
    
    // Recreate planets to update colors
    createPlanets(currentZoom);
}

// Center on Sun and remove all visual elements (WASD keys)
function centerOnSun() {
    // Clear all visual elements
    planetMeshes.forEach(p => scene.remove(p));
    planetMeshes.length = 0;
    
    orbitLines.forEach(o => scene.remove(o));
    orbitLines.length = 0;
    
    worldlines.forEach(w => scene.remove(w));
    worldlines.length = 0;
    
    timeMarkers.forEach(m => scene.remove(m));
    timeMarkers.length = 0;
    
    if (stars) {
        scene.remove(stars);
        stars = null;
    }
    
    // Center camera on Sun
    targetFocusPoint.set(0, getHeightForYear(currentYear, 1), 0);
    targetCameraDistance = 500;
}

// Toggle rotation between vertical and horizontal orientation (R key)
function navigateUnit(direction) {
    // Navigate within the current zoom level's units
    // direction: -1 for previous (A key), +1 for next (D key)
    
    console.log('BEFORE navigation - zoom:', currentZoom, 'direction:', direction);
    
    switch(currentZoom) {
        case 1: // Century view - navigate by 25 years
            console.log('  Century year before:', currentYear);
            currentYear += direction * 25;
            console.log('  Century year after:', currentYear);
            break;
            
        case 2: // Decade view - navigate years
            console.log('  Year before:', currentYear, 'offset:', selectedDecadeOffset);
            // Years within current decade (2020-2029)
            const yearInDecade = currentYear % 10;
            const newYearInDecade = yearInDecade + direction;
            
            if (newYearInDecade < 0) {
                selectedDecadeOffset--;
                currentYear = currentYear - (yearInDecade + 1) + 9; // Go to last year of previous decade
            } else if (newYearInDecade > 9) {
                selectedDecadeOffset++;
                currentYear = currentYear - yearInDecade + 10; // Go to first year of next decade
            } else {
                currentYear += direction;
            }
            
            console.log('  Year after:', currentYear, 'offset:', selectedDecadeOffset);
            break;
            
        case 3: // Year view - navigate months
            console.log('  Month before:', currentMonthInYear, 'year:', currentYear, 'offset:', selectedYearOffset);
            currentMonthInYear += direction;
            
            if (currentMonthInYear < 0) {
                selectedYearOffset--;
                currentYear--; // Also update currentYear for calculateCurrentDateHeight()
                currentMonthInYear = 11; // Go to December of previous year
            } else if (currentMonthInYear > 11) {
                selectedYearOffset++;
                currentYear++; // Also update currentYear for calculateCurrentDateHeight()
                currentMonthInYear = 0; // Go to January of next year
            }
            
            console.log('  Month after:', currentMonthInYear, 'year:', currentYear, 'offset:', selectedYearOffset);
            break;
            
        case 4: // Quarter view - navigate months
            console.log('  Month before:', currentMonth, 'offset:', selectedQuarterOffset);
            currentMonth += direction;
            
            // Wrap to adjacent quarters if needed (each quarter = 3 months)
            if (currentMonth < 0) {
                selectedQuarterOffset--;
                currentMonth = 2; // Go to last month of previous quarter
            } else if (currentMonth > 2) {
                selectedQuarterOffset++;
                currentMonth = 0; // Go to first month of next quarter
            }
            
            console.log('  Month after:', currentMonth, 'offset:', selectedQuarterOffset);
            break;
            
        case 5: // Month view - navigate weeks (real calendar weeks, typically 4-5 per month)
            console.log('  Week before:', currentWeekInMonth, 'offset:', selectedWeekOffset);
            currentWeekInMonth += direction;
            
            // Wrap to adjacent months if needed (most months have 4-5 weeks)
            if (currentWeekInMonth < 0) {
                selectedWeekOffset--;
                currentWeekInMonth = 4; // Go to last week of previous month (could be week 4 or 5)
            } else if (currentWeekInMonth > 4) {
                selectedWeekOffset++;
                currentWeekInMonth = 0; // Go to first week of next month
            }
            
            console.log('  Week after:', currentWeekInMonth, 'offset:', selectedWeekOffset);
            break;
            
        case 6: // Lunar view - navigate weeks within lunar cycle
            console.log('  Lunar week before:', currentWeekInMonth, 'offset:', selectedLunarOffset);
            currentWeekInMonth += direction;
            
            // Wrap to adjacent lunar cycles if needed (4 weeks per cycle)
            if (currentWeekInMonth < 0) {
                selectedLunarOffset--;
                currentWeekInMonth = 3; // Go to last week of previous cycle
            } else if (currentWeekInMonth > 3) {
                selectedLunarOffset++;
                currentWeekInMonth = 0; // Go to first week of next cycle
            }
            
            console.log('  Lunar week after:', currentWeekInMonth, 'offset:', selectedLunarOffset);
            break;
            
        case 7: // Week view - navigate days
            console.log('  Day before:', currentDayInWeek, 'offset:', selectedDayOffset);
            currentDayInWeek += direction;
            
            // Wrap to adjacent weeks if needed
            if (currentDayInWeek < 0) {
                selectedDayOffset--;
                currentDayInWeek = 6; // Go to Saturday of previous week
            } else if (currentDayInWeek > 6) {
                selectedDayOffset++;
                currentDayInWeek = 0; // Go to Sunday of next week
            }
            
            console.log('  Day after:', currentDayInWeek, 'offset:', selectedDayOffset);
            break;
            
        case 8: // Day view - navigate hours
        case 9: // Clock view - navigate hours
            console.log('  Hour before:', currentHourInDay, 'offset:', selectedHourOffset);
            currentHourInDay += direction * 3; // Move in 3-hour increments to match markers
            
            // Wrap to adjacent days if needed
            if (currentHourInDay < 0) {
                selectedHourOffset--;
                currentHourInDay = 21; // Go to 21:00 of previous day
            } else if (currentHourInDay > 23) {
                selectedHourOffset++;
                currentHourInDay = 0; // Go to 00:00 of next day
            }
            
            console.log('  Hour after:', currentHourInDay, 'offset:', selectedHourOffset);
            break;
    }
    
    // Recreate planets and markers to show new selection
    createPlanets(currentZoom);
    updateTimeDisplays(); // Update time displays after navigation
}

function toggleTimeRotation() {
    // Cycle through view modes: angled -> top-down -> bottom-up -> angled
    viewMode = (viewMode + 1) % 3;
    
    // Update background color based on view mode
    let bgColor;
    if (isLightMode) {
        // Light mode colors
        if (viewMode === 0) {
            bgColor = 0xe8f4f8; // Original light mode (neutral)
        } else if (viewMode === 1) {
            bgColor = 0xf8e8e8; // Slight red tinge (looking down from above)
        } else {
            bgColor = 0xe8e8f8; // Slight blue tinge (looking up from below)
        }
    } else {
        // Dark mode colors
        if (viewMode === 0) {
            bgColor = 0x000814; // Original dark mode (neutral)
        } else if (viewMode === 1) {
            bgColor = 0x140808; // Slight red tinge (looking down from above)
        } else {
            bgColor = 0x080814; // Slight blue tinge (looking up from below)
        }
    }
    scene.background = new THREE.Color(bgColor);
    
    // Adjust camera rotation based on view mode
    if (viewMode === 0) {
        // Angled view (default)
        cameraRotation.x = Math.PI / 6;
    } else if (viewMode === 1) {
        // Top-down view: looking down at system from above (into future)
        cameraRotation.x = Math.PI / 2; // 90 degrees
    } else {
        // Bottom-up view: looking up at system from below (into past)
        cameraRotation.x = -Math.PI / 2; // -90 degrees
    }
}

function rotate90Right() {
    // Rotate the entire scene 90 degrees clockwise around Z axis (viewing from front)
    // This makes things pointing up now point to the right
    scene.rotation.z -= Math.PI / 2; // Subtract 90 degrees (clockwise)
}

// Navigate forward/backward one time frame (W/S keys)
function navigateTimeFrame(direction) {
    const config = ZOOM_LEVELS[currentZoom];
    
    switch(currentZoom) {
        case 1: // Century
            currentYear += direction * 100;
            break;
        case 2: // Decade
            currentYear += direction * 10;
            break;
        case 3: // Year
            currentYear += direction * 1;
            break;
        case 4: // Quarter
            currentQuarter += direction;
            if (currentQuarter > 3) {
                currentQuarter = 0;
                currentYear += 1;
            } else if (currentQuarter < 0) {
                currentQuarter = 3;
                currentYear -= 1;
            }
            break;
        case 5: // Month
            currentMonth += direction;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
        case 6: // Lunar Cycle (~1 month)
            currentMonth += direction;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
        case 7: // Week
            // Move by ~7 days
            currentMonth += direction * 0.25; // Rough approximation
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
        case 8: // Day
            currentMonth += direction * 0.033; // ~1/30th of month
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
    }
    
    // Update visualization
    updateVisualization();
}

// Navigate to next/previous time marker (A/D keys)
function navigateToMarker(direction) {
    // This moves Earth to the next visible time marker
    // For simplicity, we'll move by one marker unit in each zoom level
    switch(currentZoom) {
        case 1: // Century - move by 25 years (major markers)
            currentYear += direction * 25;
            break;
        case 2: // Decade - move by year
            currentYear += direction * 1;
            break;
        case 3: // Year - move by month
            currentMonth += direction;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
        case 4: // Quarter - move by month
            currentMonth += direction;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            currentQuarter = Math.floor(currentMonth / 3);
            break;
        case 5: // Month - move by week
            currentMonth += direction * 0.25;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
        case 6: // Lunar - move by phase
            currentMonth += direction * 0.2;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
        case 7: // Week - move by day
            currentMonth += direction * 0.033;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
        case 8: // Day - move by 3 hours
            currentMonth += direction * 0.004; // ~3 hours
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear += 1;
            } else if (currentMonth < 0) {
                currentMonth = 11;
                currentYear -= 1;
            }
            break;
    }
    
    updateVisualization();
}

// Update visualization after time navigation
function updateVisualization() {
    // Recreate all visual elements with new time
    createPlanets();
    createWorldlines(currentZoom);
    createTimeMarkers(currentZoom);
    
    // Update info panel
    document.getElementById('current-zoom').textContent = ZOOM_LEVELS[currentZoom].name;
}

function setZoomLevel(level) {
    currentZoom = level;
    const config = ZOOM_LEVELS[level];
    
    // Play transition sound
    if (typeof playTransitionSound === 'function') {
        playTransitionSound();
    }
    
    const landingPage = document.getElementById('landing-page');
    const hud = document.getElementById('hud');
    const controls = document.querySelector('.controls');
    
    // Show/hide landing page
    if (level === 0) {
        landingPage.classList.add('active');
        // Move controls to top
        controls.style.top = '30px';
        controls.style.bottom = 'auto';
    } else {
        landingPage.classList.remove('active');
        // Move controls back to bottom
        controls.style.top = 'auto';
        controls.style.bottom = '30px';
    }
    
    // Set target camera distance for smooth transition
    targetCameraDistance = config.distance;
    
    document.getElementById('current-zoom').textContent = config.name;
    document.getElementById('time-span').textContent = config.span;
    document.getElementById('focus-target').textContent = config.focusTarget.toUpperCase();
    document.getElementById('worldline-height').textContent = (config.timeYears * 100).toFixed(1) + ' AU';
    
    document.querySelectorAll('.zoom-option').forEach(opt => {
        opt.classList.remove('active');
        if (parseInt(opt.dataset.zoom) === level) {
            opt.classList.add('active');
        }
    });
    
    // Preserve current selection offset when changing zoom levels
    const currentOffset = getCurrentSelectionOffset();
    applyOffsetToAllZoomLevels(currentOffset);
    
    createStarField(); // Update star visibility based on zoom level
    createPlanets(currentZoom);
    updateTimeDisplays(); // Update time displays after zoom change
}

function getFocusPoint() {
    const config = ZOOM_LEVELS[currentZoom];
    
    // Set vertical offset based on zoom level
    let verticalOffset = 0;
    if (currentZoom === 1) {
        // Century view centers at 2050
        verticalOffset = getHeightForYear(2050, 1);
    } else {
        // All other views center at current date (2025)
        verticalOffset = getHeightForYear(currentYear, 1);
    }
    
    if (config.focusTarget === 'earth') {
        const earthPlanet = planetMeshes.find(p => p.userData.name === 'Earth');
        if (earthPlanet) {
            const earthPos = earthPlanet.position.clone();
            earthPos.y = verticalOffset;
            return earthPos;
        }
    }
    
    return new THREE.Vector3(0, verticalOffset, 0);
}

function animate() {
    requestAnimationFrame(animate);
    
    time += 0.01;
    
    // Planets stay at rest at their accurate positions
    // No orbital animation
    
    // Smooth focus point transition (targetFocusPoint is set in createPlanets)
    focusPoint.x += (targetFocusPoint.x - focusPoint.x) * cameraTransitionSpeed;
    focusPoint.y += (targetFocusPoint.y - focusPoint.y) * cameraTransitionSpeed;
    focusPoint.z += (targetFocusPoint.z - focusPoint.z) * cameraTransitionSpeed;
    
    // Smooth camera distance transition
    currentCameraDistance += (targetCameraDistance - currentCameraDistance) * cameraTransitionSpeed;
    
    const config = ZOOM_LEVELS[currentZoom];
    const distance = currentCameraDistance;
    
    // Set target camera orientation based on zoom level
    if (currentZoom === 9) {
        isPolarView = true;
        
        // Get Earth's position
        const earth = PLANET_DATA.find(p => p.name === 'Earth');
        const earthX = Math.cos(earth.startAngle) * 50;
        const earthZ = Math.sin(earth.startAngle) * 50;
        
        // Sun to Earth angle (where noon points)
        const sunToEarthAngle = Math.atan2(earthZ, earthX);
        
        // Target: Camera below Earth looking up (rotated 180°)
        targetCameraPosition.set(0, -distance, 0);
        
        // Target: Up vector points toward noon (toward Sun), rotated 180°
        targetCameraUp.set(
            -Math.cos(sunToEarthAngle), // Negated for 180° rotation
            0,
            -Math.sin(sunToEarthAngle)  // Negated for 180° rotation
        );
        
        // Debug: Log once per second
        if (Math.floor(time) % 100 === 0) {
            console.log('Zoom 9 - Camera distance:', distance, 'Focus point:', focusPoint.y, 'Markers visible:', timeMarkers.length);
        }
    } else {
        isPolarView = false;
        
        // Target: Normal camera positioning
        const cameraX = Math.sin(cameraRotation.y) * Math.cos(cameraRotation.x) * distance;
        const cameraY = Math.sin(cameraRotation.x) * distance;
        const cameraZ = Math.cos(cameraRotation.y) * Math.cos(cameraRotation.x) * distance;
        
        targetCameraPosition.set(cameraX, cameraY, cameraZ);
        
        // Target: Default up vector
        targetCameraUp.set(0, 1, 0);
    }
    
    // Smoothly interpolate camera position
    const currentPos = new THREE.Vector3(
        camera.position.x - focusPoint.x,
        camera.position.y - focusPoint.y,
        camera.position.z - focusPoint.z
    );
    
    currentPos.lerp(targetCameraPosition, cameraTransitionSpeed);
    
    camera.position.set(
        focusPoint.x + currentPos.x,
        focusPoint.y + currentPos.y,
        focusPoint.z + currentPos.z
    );
    
    // Smoothly interpolate camera up vector
    currentCameraUp.lerp(targetCameraUp, cameraTransitionSpeed);
    camera.up.copy(currentCameraUp);
    
    camera.lookAt(focusPoint);
    
    renderer.render(scene, camera);
}

// Check for WebGL support
function webGLSupported() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch(e) {
        return false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const loadingElement = document.getElementById('loading');
    const loadingText = document.querySelector('.loading-text');
    
    // Check if Three.js loaded
    if (typeof THREE === 'undefined') {
        if (loadingText) {
            loadingText.textContent = 'Failed to load 3D library. Check your connection.';
        }
        console.error('Three.js failed to load from CDN');
        return;
    }
    
    // Check WebGL support
    if (!webGLSupported()) {
        if (loadingText) {
            loadingText.textContent = 'WebGL not supported. Please use a modern browser.';
        }
        console.error('WebGL is not supported on this device/browser');
        return;
    }
    
    try {
        initScene();
        
        // Initialize camera distance
        const config = ZOOM_LEVELS[currentZoom];
        targetCameraDistance = config.distance;
        currentCameraDistance = config.distance;
        
        // Initialize focus point to current date
        const currentDateHeight = getHeightForYear(currentYear, 1);
        focusPoint.y = currentDateHeight;
        targetFocusPoint.y = currentDateHeight;
        
        createPlanets(currentZoom);
        initControls();
        updateTimeDisplays(); // Initialize time displays
        animate();
        
        setTimeout(() => {
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }, 1500);
        
    } catch (error) {
        console.error('Failed to initialize Circaevum:', error);
        if (loadingText) {
            loadingText.textContent = 'Failed to load. Check console for details.';
        }
    }
});
