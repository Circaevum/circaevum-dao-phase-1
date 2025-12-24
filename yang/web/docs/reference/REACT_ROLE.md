# React's Role in Circaevum Architecture

## Overview

React is used in the **wrapper layer** (`circaevum-data`), NOT in the visualization layer (`circaevum-three`).

---

## Architecture Layers

### Layer 1: Visualization (`circaevum-three`) - NO React

**Technology**: Vanilla JavaScript + Three.js

**Why No React**:
- ✅ **Framework-agnostic**: Can be used with any framework (React, Vue, Angular, vanilla)
- ✅ **Lightweight**: No React dependency = smaller bundle
- ✅ **Simple**: Pure JavaScript, easy to understand
- ✅ **Portable**: Works anywhere (CDN, NPM, embedded)

**Code**:
```javascript
// circaevum-three/js/main.js
// Pure JavaScript, no React
let scene, camera, renderer;
// Three.js code...
```

---

### Layer 2: Wrapper (`circaevum-data`) - Uses React

**Technology**: Next.js (React) + REST API

**Why React**:
- ✅ **UI Components**: Event table, file upload, settings
- ✅ **State Management**: User auth, event loading, UI state
- ✅ **Form Handling**: Login, file upload, event creation
- ✅ **Modern Web**: Standard React patterns

**Code**:
```tsx
// circaevum-data/src/components/EventTable.tsx
import { useState, useEffect } from 'react'

export function EventTable() {
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    // Load events from REST API
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        setEvents(data.events)
        // Pass to visualization
        window.CircaevumAPI.setEvents(data.events)
      })
  }, [])
  
  return (
    <table>
      {events.map(event => (
        <tr key={event.id}>
          <td>{event.title}</td>
          <td>{event.start}</td>
        </tr>
      ))}
    </table>
  )
}
```

---

## React Components in Wrapper

### 1. Event Management UI

```tsx
// src/components/EventUpload.tsx
export function EventUpload() {
  const [file, setFile] = useState(null)
  
  const handleUpload = async () => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const { events } = await response.json()
    // Update visualization
    window.CircaevumAPI.addEvents(events)
  }
  
  return (
    <div>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload ICS</button>
    </div>
  )
}
```

### 2. Event Table/List

```tsx
// src/components/EventTable.tsx
export function EventTable() {
  const [events, setEvents] = useState([])
  
  return (
    <div>
      <h2>Events</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start</th>
            <th>End</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr 
              key={event.id}
              onClick={() => window.CircaevumAPI.navigateToEvent(event.id)}
            >
              <td>{event.title}</td>
              <td>{new Date(event.start).toLocaleString()}</td>
              <td>{event.end ? new Date(event.end).toLocaleString() : '-'}</td>
              <td>{event.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

### 3. Visualization Wrapper

```tsx
// src/components/CircaevumViewer.tsx
'use client'

import { useEffect, useRef } from 'react'

export function CircaevumViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Load CircaevumAPI script
    const script = document.createElement('script')
    script.src = '/circaevum-three.js'
    script.onload = () => {
      // Initialize visualization (vanilla JS)
      window.CircaevumAPI.init({
        container: containerRef.current,
        onReady: () => {
          console.log('Visualization ready')
        }
      })
    }
    document.head.appendChild(script)
    
    return () => {
      // Cleanup
      if (window.CircaevumAPI) {
        window.CircaevumAPI.destroy()
      }
    }
  }, [])
  
  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
}
```

### 4. Authentication UI

```tsx
// src/components/Login.tsx
export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleLogin = async () => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (response.ok) {
      // Redirect to dashboard
      window.location.href = '/dashboard'
    }
  }
  
  return (
    <form onSubmit={handleLogin}>
      <input 
        type="email" 
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input 
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
```

---

## Data Flow: React → Visualization

```
┌─────────────────┐
│  React UI       │
│  (Next.js)      │
└────────┬────────┘
         │
         │ fetch('/api/events')
         ▼
┌─────────────────┐
│  REST API       │
│  (Next.js API)  │
└────────┬────────┘
         │
         │ Prisma query
         ▼
┌─────────────────┐
│  PostgreSQL     │
└─────────────────┘

┌─────────────────┐
│  React UI       │
│  (EventTable)   │
└────────┬────────┘
         │
         │ window.CircaevumAPI.setEvents(events)
         ▼
┌─────────────────┐
│ circaevum-three │
│  (Vanilla JS)   │
└─────────────────┘
```

---

## Why This Separation?

### Visualization Layer (No React)
- ✅ **Framework-agnostic**: Works with React, Vue, Angular, vanilla
- ✅ **Lightweight**: No framework overhead
- ✅ **Reusable**: Can be embedded anywhere
- ✅ **Open-source**: Simple, no dependencies

### Wrapper Layer (React)
- ✅ **Modern UI**: React components for forms, tables, etc.
- ✅ **State Management**: React hooks for UI state
- ✅ **Next.js**: Server-side rendering, API routes
- ✅ **Ecosystem**: Rich React component libraries

---

## Example: Complete Integration

```tsx
// src/app/dashboard/page.tsx (Next.js)
'use client'

import { useState, useEffect } from 'react'
import { CircaevumViewer } from '@/components/CircaevumViewer'
import { EventTable } from '@/components/EventTable'
import { EventUpload } from '@/components/EventUpload'

export default function Dashboard() {
  const [events, setEvents] = useState([])
  
  useEffect(() => {
    // Load events from REST API
    fetch('/api/events')
      .then(r => r.json())
      .then(data => {
        setEvents(data.events)
        // Pass to visualization (vanilla JS)
        if (window.CircaevumAPI) {
          window.CircaevumAPI.setEvents(data.events)
        }
      })
  }, [])
  
  return (
    <div className="dashboard">
      <h1>Circaevum Dashboard</h1>
      
      {/* React component for file upload */}
      <EventUpload />
      
      <div className="layout">
        {/* React component wrapping vanilla JS visualization */}
        <div className="visualization">
          <CircaevumViewer />
        </div>
        
        {/* React component for event table */}
        <div className="sidebar">
          <EventTable events={events} />
        </div>
      </div>
    </div>
  )
}
```

---

## Summary

**React's Role**:
- ✅ **Wrapper layer** (`circaevum-data`): UI components, forms, state management
- ❌ **Visualization layer** (`circaevum-three`): Pure JavaScript, no React

**Benefits**:
- ✅ Visualization is framework-agnostic (can use with any framework)
- ✅ React handles UI complexity (forms, tables, state)
- ✅ Clean separation of concerns
- ✅ Easy to maintain and extend

**Result**: React provides the UI wrapper around the vanilla JS visualization!

