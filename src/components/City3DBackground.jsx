import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const City3DBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 30, 75);
    camera.lookAt(0, 10, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.5);
    dirLight1.position.set(40, 60, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 1.8);
    dirLight2.position.set(-40, 40, -20);
    scene.add(dirLight2);

    const pulseLight = new THREE.PointLight(0x6366f1, 3, 60);
    pulseLight.position.set(0, 15, 0);
    scene.add(pulseLight);

    // 5. Ground Grid
    const grid = new THREE.GridHelper(120, 60, 0x3b82f6, 0x1e293b);
    grid.position.y = 0;
    grid.material.opacity = 0.4;
    grid.material.transparent = true;
    scene.add(grid);

    // 6. City Group
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Building materials
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.15,
      metalness: 0.85,
    });

    const edgeColors = [0x38bdf8, 0x10b981, 0x60a5fa, 0x818cf8];

    // Generate procedural cityscape
    const buildingCount = 55;
    const cityRadius = 38;

    for (let i = 0; i < buildingCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 6 + Math.random() * cityRadius;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      // Varied skyscraper dimensions
      const width = 2.2 + Math.random() * 3.5;
      const depth = 2.2 + Math.random() * 3.5;
      // Taller buildings toward center
      const height = (1 - dist / (cityRadius + 10)) * 28 + Math.random() * 14 + 5;

      const geom = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geom, buildingMat);
      mesh.position.set(x, height / 2, z);
      cityGroup.add(mesh);

      // Glowing edges
      const edges = new THREE.EdgesGeometry(geom);
      const edgeColor = edgeColors[Math.floor(Math.random() * edgeColors.length)];
      const lineMat = new THREE.LineBasicMaterial({
        color: edgeColor,
        transparent: true,
        opacity: 0.7,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.copy(mesh.position);
      cityGroup.add(wireframe);

      // Random penthouse beacon light
      if (Math.random() > 0.65) {
        const beaconGeom = new THREE.SphereGeometry(0.25, 8, 8);
        const beaconMat = new THREE.MeshBasicMaterial({ color: edgeColor });
        const beacon = new THREE.Mesh(beaconGeom, beaconMat);
        beacon.position.set(x, height + 0.3, z);
        cityGroup.add(beacon);
      }
    }

    // 7. Floating particles (golden embers / ambient dust)
    const particleCount = 200;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
      speeds[i] = 0.03 + Math.random() * 0.05;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.6,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 8. Mouse parallax interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 9. Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      targetX += (mouseX * 12 - targetX) * 0.03;
      targetY += (mouseY * 8 - targetY) * 0.03;

      camera.position.x = Math.sin(elapsedTime * 0.12) * 50 + targetX;
      camera.position.z = Math.cos(elapsedTime * 0.12) * 50;
      camera.position.y = 28 + targetY + Math.sin(elapsedTime * 0.4) * 2;
      camera.lookAt(0, 10, 0);

      // Rotate city gently
      cityGroup.rotation.y = elapsedTime * 0.04;

      // Pulse beacon light
      pulseLight.intensity = 2 + Math.sin(elapsedTime * 2) * 1.5;

      // Animate floating particles
      const posAttr = particleGeom.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) + speeds[i];
        if (y > 45) y = 0;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
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
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    />
  );
};
