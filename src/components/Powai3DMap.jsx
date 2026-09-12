import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import powaiMapData from '../data/powaiMapData.json';
import { AlertTriangle, Flame, CheckCircle2, RotateCw, ZoomIn, ZoomOut, Layers, Eye } from 'lucide-react';

export const Powai3DMap = () => {
  const mountRef = useRef(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'corrupt' | 'fake' | 'valid'
  const [autoRotate, setAutoRotate] = useState(true);

  // Store refs for Three.js objects
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const nodesGroupRef = useRef(null);
  const pulseRingsRef = useRef([]);

  // Coordinate normalizer for Powai region (lat: ~19.04 to 19.16, lng: ~72.87 to 72.99)
  const CENTER_LAT = 19.1176;
  const CENTER_LNG = 72.9060;
  const SCALE_FACTOR = 450; // Map scaling factor

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0a0f24, 0.015);

    // 2. Camera Setup - isometric perspective
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      500
    );
    camera.position.set(0, 36, 46);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 2.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.8);
    keyLight.position.set(30, 40, 25);
    scene.add(keyLight);

    const redWarningLight = new THREE.DirectionalLight(0xef4444, 2.0);
    redWarningLight.position.set(-30, 30, -25);
    scene.add(redWarningLight);

    // 5. Low-Poly Powai Terrain
    // Terrain base
    const terrainGeom = new THREE.PlaneGeometry(80, 80, 32, 32);
    // Add subtle low-poly elevation for foothills surrounding Powai
    const posAttr = terrainGeom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const distFromCenter = Math.sqrt(vx * vx + vy * vy);
      // Elevate the edges (foothills / Sanjay Gandhi Park mountains)
      if (distFromCenter > 20) {
        const elevation = (distFromCenter - 20) * 0.25 + Math.sin(vx * 0.4) * Math.cos(vy * 0.4) * 1.5;
        posAttr.setZ(i, elevation);
      }
    }
    terrainGeom.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x090e1f,
      roughness: 0.8,
      metalness: 0.2,
      flatShading: true,
    });
    const terrain = new THREE.Mesh(terrainGeom, terrainMat);
    terrain.rotation.x = -Math.PI / 2;
    scene.add(terrain);

    // Cyber Grid overlay on terrain
    const grid = new THREE.GridHelper(80, 40, 0x38bdf8, 0x1e293b);
    grid.position.y = 0.05;
    grid.material.opacity = 0.35;
    grid.material.transparent = true;
    scene.add(grid);

    // 6. Powai Lake - Low-Poly Glowing Water Body in Center
    const lakeGeom = new THREE.CylinderGeometry(8.5, 9.5, 0.4, 24);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      roughness: 0.1,
      metalness: 0.9,
      transparent: true,
      opacity: 0.85,
    });
    const lakeMesh = new THREE.Mesh(lakeGeom, lakeMat);
    lakeMesh.position.set(0, 0.1, 0);
    lakeMesh.scale.set(1.4, 1, 0.9); // Oval shape like Powai Lake
    scene.add(lakeMesh);

    // Lake Shoreline Neon Ring
    const shoreRingGeom = new THREE.TorusGeometry(10, 0.12, 6, 32);
    const shoreRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.8 });
    const shoreRing = new THREE.Mesh(shoreRingGeom, shoreRingMat);
    shoreRing.rotation.x = Math.PI / 2;
    shoreRing.position.y = 0.2;
    shoreRing.scale.set(1.3, 0.85, 1);
    scene.add(shoreRing);

    // 7. Road Arteries (JVLR & Saki Vihar Road Splines)
    const jvlrCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-38, 0.2, -8),
      new THREE.Vector3(-15, 0.2, -10),
      new THREE.Vector3(12, 0.2, -12),
      new THREE.Vector3(38, 0.2, -15),
    ]);
    const jvlrPoints = jvlrCurve.getPoints(50);
    const jvlrGeom = new THREE.BufferGeometry().setFromPoints(jvlrPoints);
    const jvlrMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const jvlrLine = new THREE.Line(jvlrGeom, jvlrMat);
    scene.add(jvlrLine);

    // 8. Plotting Property Nodes from Dataset
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);
    nodesGroupRef.current = nodesGroup;

    const interactiveMeshes = [];
    const pulseRings = [];

    powaiMapData.forEach((prop) => {
      // Project lat/long to X/Z relative to Powai center
      const rawX = (prop.lng - CENTER_LNG) * SCALE_FACTOR;
      const rawZ = -(prop.lat - CENTER_LAT) * SCALE_FACTOR;

      // Clamp within map bounds
      const x = Math.max(-36, Math.min(36, rawX));
      const z = Math.max(-36, Math.min(36, rawZ));

      const isCorrupt = prop.status === 'corrupt';
      const isFake = prop.status === 'fake';

      let nodeColorHex = 0x38bdf8; // Valid: Cool Blue
      let height = 3.5;
      let radius = 0.45;

      if (isCorrupt) {
        nodeColorHex = 0xef4444; // Corrupt: Neon Red
        height = 6.0;
        radius = 0.75;
      } else if (isFake) {
        nodeColorHex = 0xf59e0b; // Fake: Neon Orange/Amber
        height = 5.0;
        radius = 0.65;
      }

      // Vertical 3D pillar node
      const pillarGeom = new THREE.CylinderGeometry(radius * 0.7, radius, height, 8);
      pillarGeom.translate(0, height / 2, 0);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: nodeColorHex,
        emissive: nodeColorHex,
        emissiveIntensity: isCorrupt ? 0.9 : 0.4,
        roughness: 0.2,
        metalness: 0.8,
      });
      const pillar = new THREE.Mesh(pillarGeom, pillarMat);
      pillar.position.set(x, 0.2, z);
      pillar.userData = { property: prop, originalColor: nodeColorHex, height };
      nodesGroup.add(pillar);
      interactiveMeshes.push(pillar);

      // Top floating beacon
      const beaconGeom = new THREE.SphereGeometry(radius * 0.9, 10, 10);
      const beaconMat = new THREE.MeshBasicMaterial({ color: nodeColorHex });
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.set(x, height + radius, z);
      nodesGroup.add(beacon);

      // For Corrupt & Fake: Add aggressive pulsing shockwave rings
      if (isCorrupt || isFake) {
        const ringGeom = new THREE.RingGeometry(0.5, 1.8, 16);
        const ringMat = new THREE.MeshBasicMaterial({
          color: nodeColorHex,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
        });
        const pulseRing = new THREE.Mesh(ringGeom, ringMat);
        pulseRing.rotation.x = Math.PI / 2;
        pulseRing.position.set(x, 0.25, z);
        pulseRing.userData = { baseScale: 1, speed: isCorrupt ? 0.04 : 0.025, isCorrupt };
        nodesGroup.add(pulseRing);
        pulseRings.push(pulseRing);

        // Add warning exclamation marker above corrupt beacons
        if (isCorrupt) {
          const markerGeom = new THREE.ConeGeometry(0.35, 1.2, 4);
          markerGeom.rotateX(Math.PI);
          const markerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
          const marker = new THREE.Mesh(markerGeom, markerMat);
          marker.position.set(x, height + radius + 1.2, z);
          nodesGroup.add(marker);
        }
      }
    });

    pulseRingsRef.current = pulseRings;

    // 9. Raycaster & Pointer Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        setHoveredProperty(hit.userData.property);
        container.style.cursor = 'pointer';
      } else {
        setHoveredProperty(null);
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mousemove', handlePointerMove);

    // 10. Mouse Drag Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleDrag = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      nodesGroup.rotation.y += deltaX * 0.008;
      terrain.rotation.z += deltaX * 0.008;
      grid.rotation.y += deltaX * 0.008;
      lakeMesh.rotation.y += deltaX * 0.008;
      shoreRing.rotation.z += deltaX * 0.008;
    };

    // Zoom on wheel
    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.y = Math.max(16, Math.min(65, camera.position.y + e.deltaY * 0.05));
      camera.position.z = Math.max(22, Math.min(75, camera.position.z + e.deltaY * 0.06));
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleDrag);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // 11. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 12. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Slow majestic auto-rotation if enabled and not dragging
      if (autoRotate && !isDragging) {
        nodesGroup.rotation.y += 0.003;
        terrain.rotation.z += 0.003;
        grid.rotation.y += 0.003;
        lakeMesh.rotation.y += 0.003;
        shoreRing.rotation.z += 0.003;
      }

      // Pulse the warning shockwave rings aggressively
      pulseRings.forEach((ring) => {
        let scale = ring.scale.x + ring.userData.speed;
        if (scale > 3.0) {
          scale = 1.0;
        }
        ring.scale.set(scale, scale, 1);
        ring.material.opacity = Math.max(0, 1 - (scale - 1) / 2);
      });

      // Subtle water shimmer
      lakeMat.emissiveIntensity = 0.5 + Math.sin(elapsed * 2.5) * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleDrag);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  // Handle filter visibility
  useEffect(() => {
    if (!nodesGroupRef.current) return;
    nodesGroupRef.current.children.forEach((child) => {
      if (child.userData && child.userData.property) {
        const prop = child.userData.property;
        if (selectedFilter === 'all') {
          child.visible = true;
        } else if (selectedFilter === 'corrupt') {
          child.visible = prop.status === 'corrupt';
        } else if (selectedFilter === 'fake') {
          child.visible = prop.status === 'fake';
        } else if (selectedFilter === 'valid') {
          child.visible = prop.status === 'valid';
        }
      }
    });
  }, [selectedFilter]);

  const resetCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 36, 46);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y = 0;
    }
  };

  return (
    <div
      className="glass-panel"
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        background: 'linear-gradient(180deg, rgba(10, 15, 30, 0.85) 0%, rgba(5, 7, 18, 0.95) 100%)',
        marginBottom: 32,
      }}
    >
      {/* Top Map Header & Controls */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Low-Poly 3D Map: Assigned Locality (Powai)
            </h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '3px 0 0 16px' }}>
            Interactive topographic node cluster centered on Powai Lake (19.1176° N, 72.9060° E) • Drag to rotate, scroll to zoom
          </p>
        </div>

        {/* Filters & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: 3, borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                background: selectedFilter === 'all' ? '#38bdf8' : 'transparent',
                color: selectedFilter === 'all' ? '#0f172a' : '#94a3b8',
                transition: 'all 0.2s',
              }}
            >
              All (100)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('corrupt')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                background: selectedFilter === 'corrupt' ? '#ef4444' : 'transparent',
                color: selectedFilter === 'corrupt' ? '#ffffff' : '#ef4444',
                transition: 'all 0.2s',
              }}
            >
              Corrupt (5)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('fake')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                background: selectedFilter === 'fake' ? '#f59e0b' : 'transparent',
                color: selectedFilter === 'fake' ? '#0f172a' : '#f59e0b',
                transition: 'all 0.2s',
              }}
            >
              Bait (11)
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('valid')}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.75rem',
                fontWeight: 700,
                background: selectedFilter === 'valid' ? '#38bdf8' : 'transparent',
                color: selectedFilter === 'valid' ? '#0f172a' : '#38bdf8',
                transition: 'all 0.2s',
              }}
            >
              Valid (84)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? 'Pause Rotation' : 'Auto Rotate'}
            style={{
              padding: '7px 10px',
              borderRadius: 8,
              background: autoRotate ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: autoRotate ? '#38bdf8' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.74rem',
            }}
          >
            <RotateCw size={14} className={autoRotate ? 'spin' : ''} />
            <span>{autoRotate ? 'Spinning' : 'Static'}</span>
          </button>

          <button
            type="button"
            onClick={resetCamera}
            title="Reset Perspective"
            style={{
              padding: '7px 10px',
              borderRadius: 8,
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              fontSize: '0.74rem',
            }}
          >
            Reset View
          </button>
        </div>
      </div>

      {/* 3D Canvas Viewport */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: 480,
          position: 'relative',
          background: 'radial-gradient(ellipse at 50% 50%, #0c1228 0%, #060914 100%)',
        }}
      >
        {/* Floating Detective HUD Tooltip */}
        {hoveredProperty && (
          <div
            className="animate-fade-in"
            style={{
              position: 'absolute',
              top: 16,
              left: 16,
              zIndex: 30,
              maxWidth: 340,
              background: 'rgba(10, 16, 32, 0.92)',
              backdropFilter: 'blur(20px)',
              borderRadius: 14,
              padding: 16,
              border: `1px solid ${
                hoveredProperty.status === 'corrupt'
                  ? '#ef4444'
                  : hoveredProperty.status === 'fake'
                  ? '#f59e0b'
                  : '#38bdf8'
              }`,
              boxShadow: `0 12px 30px rgba(0, 0, 0, 0.8), 0 0 20px ${
                hoveredProperty.status === 'corrupt'
                  ? 'rgba(239, 68, 68, 0.4)'
                  : hoveredProperty.status === 'fake'
                  ? 'rgba(245, 158, 11, 0.4)'
                  : 'rgba(56, 189, 248, 0.4)'
              }`,
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  padding: '2px 8px',
                  borderRadius: 4,
                  background:
                    hoveredProperty.status === 'corrupt'
                      ? 'rgba(239, 68, 68, 0.2)'
                      : hoveredProperty.status === 'fake'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(56, 189, 248, 0.2)',
                  color:
                    hoveredProperty.status === 'corrupt'
                      ? '#ef4444'
                      : hoveredProperty.status === 'fake'
                      ? '#f59e0b'
                      : '#38bdf8',
                  textTransform: 'uppercase',
                }}
              >
                {hoveredProperty.status === 'corrupt'
                  ? '⚠️ Corrupt Anomaly'
                  : hoveredProperty.status === 'fake'
                  ? '🔥 Bait / Fake'
                  : '✓ Valid Verified'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                ID: {hoveredProperty.id}
              </span>
            </div>

            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', marginBottom: 4 }}>
              {hoveredProperty.name}
            </h4>

            {hoveredProperty.reason && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {hoveredProperty.reason}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, fontSize: '0.74rem', background: 'rgba(15, 23, 42, 0.6)', padding: 8, borderRadius: 8 }}>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem' }}>PRICE</span>
                <strong style={{ color: hoveredProperty.price < 0 ? '#ef4444' : '#38bdf8' }}>
                  {hoveredProperty.price < 0
                    ? `-₹${Math.abs(hoveredProperty.price).toLocaleString('en-IN')}`
                    : `₹${(hoveredProperty.price || 0).toLocaleString('en-IN')}`}
                </strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem' }}>BEDROOMS</span>
                <strong style={{ color: '#e2e8f0' }}>{hoveredProperty.bedroom || '—'} BHK</strong>
              </div>
              <div>
                <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.65rem' }}>CARPET</span>
                <strong style={{ color: '#e2e8f0' }}>{hoveredProperty.carpet_area || '—'} sqft</strong>
              </div>
            </div>

            <div style={{ marginTop: 8, fontSize: '0.68rem', color: '#64748b', fontFamily: 'monospace' }}>
              GPS: {hoveredProperty.lat.toFixed(4)}° N, {hoveredProperty.lng.toFixed(4)}° E
            </div>
          </div>
        )}

        {/* Map Watermark & Center Pin */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            right: 18,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontFamily: 'monospace',
            fontSize: '0.72rem',
            color: '#64748b',
            background: 'rgba(8, 12, 24, 0.7)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid rgba(255, 255, 255, 0.06)',
            pointerEvents: 'none',
          }}
        >
          <span>POWAI LAKE RADAR GRID</span>
          <span>•</span>
          <span>100 PLOTTED SPECIMENS</span>
        </div>
      </div>

      {/* Legend Footer */}
      <div
        style={{
          padding: '12px 20px',
          background: 'rgba(10, 15, 30, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          fontSize: '0.78rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
            <span style={{ color: '#94a3b8' }}>Valid Properties (Cool Cyan Nodes)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444', animation: 'pulse 1s infinite' }} />
            <span style={{ color: '#fca5a5', fontWeight: 700 }}>Corrupt Physical Impossibilities (Aggressive Red Pulses)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <span style={{ color: '#fde68a' }}>Bait / Fake Rental Listings (Amber Pulses)</span>
          </div>
        </div>

        <div style={{ color: '#64748b', fontSize: '0.72rem', fontFamily: 'monospace' }}>
          *Click & Drag on terrain to orbit 360°
        </div>
      </div>
    </div>
  );
};
