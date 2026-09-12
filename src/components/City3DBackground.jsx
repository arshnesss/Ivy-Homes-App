import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const City3DBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c1a, 0.016);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 32, 75);
    camera.lookAt(0, 8, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. Vibrant Multi-Colored Lighting
    const ambientLight = new THREE.AmbientLight(0x241d3b, 2.0);
    scene.add(ambientLight);

    // Cyan key light
    const cyanLight = new THREE.DirectionalLight(0x06b6d4, 3.2);
    cyanLight.position.set(45, 55, 30);
    scene.add(cyanLight);

    // Magenta / Rose rim light
    const magentaLight = new THREE.DirectionalLight(0xf43f5e, 2.8);
    magentaLight.position.set(-45, 45, -30);
    scene.add(magentaLight);

    // Purple / Indigo fill light
    const purpleLight = new THREE.DirectionalLight(0x8b5cf6, 2.5);
    purpleLight.position.set(0, 60, -40);
    scene.add(purpleLight);

    // Central pulsing multi-color core
    const coreLight1 = new THREE.PointLight(0xec4899, 4, 70);
    coreLight1.position.set(0, 18, 0);
    scene.add(coreLight1);

    const coreLight2 = new THREE.PointLight(0x38bdf8, 3.5, 60);
    coreLight2.position.set(0, 10, 0);
    scene.add(coreLight2);

    // 5. Stylized Glowing Ground Grid
    const gridHelper = new THREE.GridHelper(130, 65, 0xec4899, 0x38bdf8);
    gridHelper.position.y = 0;
    gridHelper.material.opacity = 0.55;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Radial ground disc glow
    const discGeom = new THREE.RingGeometry(1, 60, 64);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    });
    const discMesh = new THREE.Mesh(discGeom, discMat);
    discMesh.rotation.x = Math.PI / 2;
    discMesh.position.y = 0.05;
    scene.add(discMesh);

    // 6. City Group
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    // Colorful neon edge palettes
    const edgeColorHex = [0x38bdf8, 0xec4899, 0x8b5cf6, 0x10b981, 0xf59e0b];

    // Building material with metallic iridescent sheen
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x090b16,
      roughness: 0.2,
      metalness: 0.9,
    });

    const buildingCount = 65;
    const cityRadius = 40;

    for (let i = 0; i < buildingCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 7 + Math.random() * cityRadius;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      const width = 2.4 + Math.random() * 3.6;
      const depth = 2.4 + Math.random() * 3.6;
      const height = (1 - dist / (cityRadius + 10)) * 32 + Math.random() * 16 + 6;

      const geom = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geom, buildingMat);
      mesh.position.set(x, height / 2, z);
      cityGroup.add(mesh);

      // Glowing multi-color edge wireframe
      const edges = new THREE.EdgesGeometry(geom);
      const chosenColor = edgeColorHex[i % edgeColorHex.length];
      const lineMat = new THREE.LineBasicMaterial({
        color: chosenColor,
        transparent: true,
        opacity: 0.75,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.copy(mesh.position);
      cityGroup.add(wireframe);

      // Penthouse beacon or rooftop accent
      if (Math.random() > 0.5) {
        const beaconGeom = new THREE.SphereGeometry(0.35, 10, 10);
        const beaconMat = new THREE.MeshBasicMaterial({ color: chosenColor });
        const beacon = new THREE.Mesh(beaconGeom, beaconMat);
        beacon.position.set(x, height + 0.4, z);
        cityGroup.add(beacon);
      }

      // Floating holographic light rings above prime towers
      if (Math.random() > 0.75) {
        const ringGeom = new THREE.TorusGeometry(width * 0.7, 0.08, 8, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: chosenColor, transparent: true, opacity: 0.8 });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(x, height + 1.2, z);
        cityGroup.add(ring);
      }
    }

    // 7. Multi-Colored Floating Embers & Stardust (300 particles)
    const particleCount = 280;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const palette = [
      new THREE.Color(0x38bdf8), // Cyan
      new THREE.Color(0xec4899), // Magenta
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0xf59e0b), // Amber Gold
      new THREE.Color(0x10b981), // Emerald
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 1] = Math.random() * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      speeds[i] = 0.04 + Math.random() * 0.06;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.85,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 8. Mouse Parallax
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

    // 10. Render Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Camera sway
      targetX += (mouseX * 14 - targetX) * 0.035;
      targetY += (mouseY * 9 - targetY) * 0.035;

      camera.position.x = Math.sin(elapsedTime * 0.14) * 52 + targetX;
      camera.position.z = Math.cos(elapsedTime * 0.14) * 52;
      camera.position.y = 29 + targetY + Math.sin(elapsedTime * 0.45) * 2.5;
      camera.lookAt(0, 10, 0);

      // Slow majestic city rotation
      cityGroup.rotation.y = elapsedTime * 0.045;

      // Color light pulses
      coreLight1.intensity = 3 + Math.sin(elapsedTime * 2.4) * 2;
      coreLight2.intensity = 3 + Math.cos(elapsedTime * 2.1) * 1.8;

      // Animate floating embers upward
      const posAttr = particleGeom.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) + speeds[i];
        if (y > 52) y = 0;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

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
