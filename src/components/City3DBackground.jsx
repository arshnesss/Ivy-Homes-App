import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Minimalist, ultra-clean 3D aesthetic background using lines, geometric shapes,
 * an undulating architectural topographic wireframe grid, connected nodes,
 * AND an interactive 3D mouse tracker where the terrain ripples, shapes rotate
 * towards the cursor, and a floating 3D gyroscope reticle follows the mouse in real time.
 */
export const City3DBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090e1a); // Deep modern obsidian-slate
    scene.fog = new THREE.FogExp2(0x090e1a, 0.008);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 22, 65);
    camera.lookAt(0, 2, 0);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Undulating Topographic Architectural Wireframe Mesh (Elevation Terrain)
    const terrainWidth = 150;
    const terrainDepth = 150;
    const segmentsX = 50;
    const segmentsZ = 50;

    const planeGeom = new THREE.PlaneGeometry(terrainWidth, terrainDepth, segmentsX, segmentsZ);
    planeGeom.rotateX(-Math.PI / 2);

    const terrainWireframeMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });
    const terrainMesh = new THREE.Mesh(planeGeom, terrainWireframeMat);
    terrainMesh.position.y = -10;
    scene.add(terrainMesh);

    const originalPositions = planeGeom.attributes.position.clone();

    // 5. Floating Architectural Geometric Wireframes (Cubes, Icosahedrons, Octahedrons, Rings)
    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    const shapeGeometries = [
      new THREE.IcosahedronGeometry(3.6, 0),
      new THREE.OctahedronGeometry(4.2, 0),
      new THREE.BoxGeometry(4.5, 4.5, 4.5),
      new THREE.TorusGeometry(3.4, 0.5, 8, 24),
      new THREE.DodecahedronGeometry(3.8, 0),
    ];

    const floatingObjects = [];
    const shapePositions = [
      { x: -32, y: 12, z: -8 },
      { x: 34, y: 16, z: -6 },
      { x: -28, y: -2, z: 12 },
      { x: 28, y: -3, z: 12 },
      { x: -44, y: 22, z: -20 },
      { x: 42, y: 22, z: -18 },
      { x: 0, y: 26, z: -25 },
    ];

    shapePositions.forEach((cfg, idx) => {
      const geom = shapeGeometries[idx % shapeGeometries.length];
      const edges = new THREE.EdgesGeometry(geom);

      const lineMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x60a5fa : 0x94a3b8,
        transparent: true,
        opacity: 0.6,
      });

      const lineWireframe = new THREE.LineSegments(edges, lineMat);
      lineWireframe.position.set(cfg.x, cfg.y, cfg.z);
      shapesGroup.add(lineWireframe);

      // Delicate glowing core node inside each shape
      const coreGeom = new THREE.BufferGeometry();
      coreGeom.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
      const coreMat = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2.5,
        transparent: true,
        opacity: 0.85,
      });
      const corePoint = new THREE.Points(coreGeom, coreMat);
      lineWireframe.add(corePoint);

      floatingObjects.push({
        mesh: lineWireframe,
        basePos: new THREE.Vector3(cfg.x, cfg.y, cfg.z),
        speed: 0.8 + Math.random() * 0.5,
      });
    });

    // 6. Interactive 3D Gyroscope Mouse Reticle (Directly follows cursor in 3D space)
    const mouseReticle = new THREE.Group();
    scene.add(mouseReticle);

    // Outer ring
    const outerRingGeom = new THREE.RingGeometry(2.4, 2.55, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const outerRing = new THREE.Mesh(outerRingGeom, ringMat);
    mouseReticle.add(outerRing);

    // Inner ring
    const innerRingGeom = new THREE.RingGeometry(1.4, 1.55, 24);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const innerRing = new THREE.Mesh(innerRingGeom, innerRingMat);
    innerRing.rotation.x = Math.PI / 3;
    mouseReticle.add(innerRing);

    // Center glowing crosshair point
    const centerPointGeom = new THREE.BufferGeometry();
    centerPointGeom.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    const centerPointMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3.5,
      transparent: true,
      opacity: 0.95,
    });
    const centerPoint = new THREE.Points(centerPointGeom, centerPointMat);
    mouseReticle.add(centerPoint);

    // 7. Constellation Network Nodes & Lines
    const nodeCount = 55;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeVelocities = [];

    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3] = (Math.random() - 0.5) * 95;
      nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 45 + 8;
      nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 60;

      nodeVelocities.push({
        vx: (Math.random() - 0.5) * 0.035,
        vy: (Math.random() - 0.5) * 0.035,
        vz: (Math.random() - 0.5) * 0.035,
      });
    }

    const nodeGeom = new THREE.BufferGeometry();
    nodeGeom.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    const nodeMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 1.8,
      transparent: true,
      opacity: 0.7,
    });
    const nodePoints = new THREE.Points(nodeGeom, nodeMat);
    scene.add(nodePoints);

    const maxLineSegments = 160;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const dynamicLineGeom = new THREE.BufferGeometry();
    dynamicLineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const dynamicLineMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.28,
    });
    const constellationLines = new THREE.LineSegments(dynamicLineGeom, dynamicLineMat);
    scene.add(constellationLines);

    // 8. Mouse Coordinate Tracking & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouseNDC = new THREE.Vector2(0, 0);
    const targetMouseWorld = new THREE.Vector3(0, 4, 0);
    const currentMouseWorld = new THREE.Vector3(0, 4, 0);
    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Z=0 plane

    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = 0;
    let targetCamY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseNDC.set(x, y);
      mouseX = x;
      mouseY = y;

      // Project mouse into 3D world space
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(interactionPlane, targetMouseWorld);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Smoothly interpolate 3D mouse position (spring effect)
      currentMouseWorld.lerp(targetMouseWorld, 0.08);

      // Move 3D Gyroscope reticle to mouse position
      mouseReticle.position.copy(currentMouseWorld);
      mouseReticle.rotation.z = time * 1.2;
      outerRing.rotation.y = time * 0.8;
      innerRing.rotation.x = time * 1.4;

      // Dynamic Camera Parallax with smooth damping
      targetCamX += (mouseX * 18 - targetCamX) * 0.04;
      targetCamY += (mouseY * 12 - targetCamY) * 0.04;

      camera.position.x = Math.sin(time * 0.08) * 8 + targetCamX;
      camera.position.y = 22 + targetCamY + Math.sin(time * 0.1) * 1.5;
      camera.lookAt(currentMouseWorld.x * 0.25, 2 + currentMouseWorld.y * 0.25, 0);

      // 1. Interactive Undulating Terrain (Wave + Interactive Ripple around Mouse)
      const posAttr = planeGeom.attributes.position;
      const origAttr = originalPositions;
      const mouse3DX = currentMouseWorld.x;
      const mouse3DZ = currentMouseWorld.y; // mapped to plane depth

      for (let i = 0; i < posAttr.count; i++) {
        const u = origAttr.getX(i);
        const w = origAttr.getZ(i);

        // Base harmonic wave
        let elevation = 
          Math.sin(u * 0.08 + time * 0.8) * 2.5 +
          Math.cos(w * 0.08 + time * 0.6) * 2.5;

        // Interactive ripple from mouse position
        const distToMouse = Math.sqrt((u - mouse3DX) * (u - mouse3DX) + (w - mouse3DZ) * (w - mouse3DZ));
        if (distToMouse < 28) {
          const ripple = Math.sin((distToMouse - time * 6) * 0.6) * (1 - distToMouse / 28) * 3.2;
          elevation += ripple;
        }

        posAttr.setY(i, elevation);
      }
      posAttr.needsUpdate = true;

      // 2. Floating Shapes: Tilt & Orient smoothly towards the cursor
      floatingObjects.forEach((obj, idx) => {
        // Continuous rotation
        obj.mesh.rotation.x += 0.006;
        obj.mesh.rotation.y += 0.008;

        // Subtle float
        obj.mesh.position.y = obj.basePos.y + Math.sin(time * obj.speed + idx) * 2.2;

        // Interactive attraction: pull slightly towards cursor
        const dir = new THREE.Vector3().subVectors(currentMouseWorld, obj.basePos);
        const dist = dir.length();
        if (dist < 40) {
          const pullFactor = (1 - dist / 40) * 2.5;
          obj.mesh.position.x = obj.basePos.x + dir.x * (pullFactor / dist);
          obj.mesh.position.z = obj.basePos.z + dir.z * (pullFactor / dist);
        } else {
          obj.mesh.position.x += (obj.basePos.x - obj.mesh.position.x) * 0.05;
          obj.mesh.position.z += (obj.basePos.z - obj.mesh.position.z) * 0.05;
        }
      });

      // 3. Constellation Nodes: Swirl & Gravitate around cursor
      const nPos = nodeGeom.attributes.position;
      for (let i = 0; i < nodeCount; i++) {
        let px = nPos.getX(i) + nodeVelocities[i].vx;
        let py = nPos.getY(i) + nodeVelocities[i].vy;
        let pz = nPos.getZ(i) + nodeVelocities[i].vz;

        // Mouse proximity swirl
        const dx = px - currentMouseWorld.x;
        const dy = py - currentMouseWorld.y;
        const dSq = dx * dx + dy * dy;
        if (dSq < 250 && dSq > 1) {
          // Gentle orbital swirl around cursor
          const force = 0.04 * (1 - Math.sqrt(dSq) / 16);
          px += -dy * force;
          py += dx * force;
        }

        // Boundary bounce
        if (px > 50 || px < -50) nodeVelocities[i].vx *= -1;
        if (py > 35 || py < -10) nodeVelocities[i].vy *= -1;
        if (pz > 32 || pz < -32) nodeVelocities[i].vz *= -1;

        nPos.setXYZ(i, px, py, pz);
      }
      nPos.needsUpdate = true;

      // Connecting lines between nearby nodes
      let lineIdx = 0;
      const maxDistSq = 18 * 18;
      const linePosArray = dynamicLineGeom.attributes.position.array;

      for (let i = 0; i < nodeCount && lineIdx < maxLineSegments * 6; i++) {
        const x1 = nPos.getX(i);
        const y1 = nPos.getY(i);
        const z1 = nPos.getZ(i);

        for (let j = i + 1; j < nodeCount && lineIdx < maxLineSegments * 6; j++) {
          const dx = x1 - nPos.getX(j);
          const dy = y1 - nPos.getY(j);
          const dz = z1 - nPos.getZ(j);
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDistSq) {
            linePosArray[lineIdx++] = x1;
            linePosArray[lineIdx++] = y1;
            linePosArray[lineIdx++] = z1;

            linePosArray[lineIdx++] = nPos.getX(j);
            linePosArray[lineIdx++] = nPos.getY(j);
            linePosArray[lineIdx++] = nPos.getZ(j);
          }
        }
      }

      for (let k = lineIdx; k < linePosArray.length; k++) {
        linePosArray[k] = 0;
      }
      dynamicLineGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};
export default City3DBackground;
