import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Helper to generate a realistic glowing skyscraper window texture
function createSkyscraperTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Dark building facade
  ctx.fillStyle = '#060913';
  ctx.fillRect(0, 0, 128, 256);

  // Window grid
  const cols = 8;
  const rows = 24;
  const padX = 4;
  const padY = 3;
  const w = (128 - padX * (cols + 1)) / cols;
  const h = (256 - padY * (rows + 1)) / rows;

  const windowColors = [
    '#38bdf8', // Cyan
    '#ec4899', // Pink
    '#facc15', // Warm Gold
    '#a855f7', // Violet
    '#e2e8f0', // Crisp White
    '#10b981', // Emerald
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isLit = Math.random() > 0.42; // ~58% windows lit
      if (isLit) {
        const x = padX + c * (w + padX);
        const y = padY + r * (h + padY);
        const col = windowColors[Math.floor(Math.random() * windowColors.length)];
        ctx.fillStyle = col;
        ctx.globalAlpha = 0.65 + Math.random() * 0.35;
        ctx.fillRect(x, y, w, h);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export const City3DBackground = ({ activeTheme = '#38bdf8' }) => {
  const mountRef = useRef(null);
  const targetColorRef = useRef(new THREE.Color(activeTheme));

  useEffect(() => {
    targetColorRef.current.set(activeTheme);
  }, [activeTheme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060814, 0.014);

    // 2. Camera setup - framed panoramic view looking down upon the glowing metropolis
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 36, 82);
    camera.lookAt(0, 12, 0);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    container.appendChild(renderer.domElement);

    // 4. Vibrant Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1e36, 2.2);
    scene.add(ambientLight);

    // Dynamic accent light that adapts to selected persona/theme
    const themePointLight = new THREE.PointLight(new THREE.Color(activeTheme), 5.5, 90);
    themePointLight.position.set(0, 20, 10);
    scene.add(themePointLight);

    const cyanKeyLight = new THREE.DirectionalLight(0x00f2fe, 3.0);
    cyanKeyLight.position.set(50, 60, 40);
    scene.add(cyanKeyLight);

    const pinkRimLight = new THREE.DirectionalLight(0xff0080, 2.8);
    pinkRimLight.position.set(-50, 45, -30);
    scene.add(pinkRimLight);

    const purpleFillLight = new THREE.DirectionalLight(0x8b5cf6, 2.2);
    purpleFillLight.position.set(0, 65, -45);
    scene.add(purpleFillLight);

    // 5. Reflective Dark Ocean / Water Base (Simulating Arabian Sea & Powai Lake)
    const waterGeom = new THREE.PlaneGeometry(300, 300);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x050711,
      roughness: 0.1,
      metalness: 0.85,
    });
    const waterMesh = new THREE.Mesh(waterGeom, waterMat);
    waterMesh.rotation.x = -Math.PI / 2;
    waterMesh.position.y = -0.2;
    scene.add(waterMesh);

    // Ground Cyber Grid
    const gridHelper = new THREE.GridHelper(160, 80, 0xec4899, 0x38bdf8);
    gridHelper.position.y = 0.02;
    gridHelper.material.opacity = 0.45;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // 6. Glowing Skyscraper Window Texture & Materials
    const windowTexture = createSkyscraperTexture();
    windowTexture.repeat.set(1, 2);

    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0a0e1c,
      roughness: 0.3,
      metalness: 0.85,
      map: windowTexture,
      emissive: 0x1e293b,
      emissiveMap: windowTexture,
      emissiveIntensity: 0.6,
    });

    // 7. City Architecture Group - Arranged like a dramatic amphitheater
    // Flanking the sides with grand skyscrapers so the central viewing portal looks through
    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const edgeColors = [0x38bdf8, 0xec4899, 0x8b5cf6, 0x10b981, 0xf59e0b, 0x06b6d4];
    const buildingCount = 75;

    for (let i = 0; i < buildingCount; i++) {
      // Split into two main clusters (left & right flank) + background horizon
      const side = (i % 2 === 0 ? 1 : -1);
      const isFlank = i < 50;

      let x, z;
      if (isFlank) {
        // Left & Right flanking clusters (keeps center open for login card view)
        const radX = 16 + Math.random() * 38;
        x = side * radX;
        z = (Math.random() - 0.3) * 60;
      } else {
        // Distant background skyline
        x = (Math.random() - 0.5) * 80;
        z = -25 - Math.random() * 35;
      }

      const width = 3 + Math.random() * 4.2;
      const depth = 3 + Math.random() * 4.2;
      // Flanking buildings are taller, center/distant have varying heights
      const height = isFlank
        ? 20 + Math.random() * 28 + (Math.abs(x) > 25 ? 12 : 0)
        : 10 + Math.random() * 20;

      const geom = new THREE.BoxGeometry(width, height, depth);
      const mesh = new THREE.Mesh(geom, buildingMat);
      mesh.position.set(x, height / 2, z);
      cityGroup.add(mesh);

      // Neon glowing edges
      const edges = new THREE.EdgesGeometry(geom);
      const chosenColor = edgeColors[i % edgeColors.length];
      const lineMat = new THREE.LineBasicMaterial({
        color: chosenColor,
        transparent: true,
        opacity: 0.8,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.copy(mesh.position);
      cityGroup.add(wireframe);

      // Skyscraper Penthouse Beacons & Holographic Rings
      if (height > 30) {
        const beaconGeom = new THREE.SphereGeometry(0.4, 8, 8);
        const beaconMat = new THREE.MeshBasicMaterial({ color: chosenColor });
        const beacon = new THREE.Mesh(beaconGeom, beaconMat);
        beacon.position.set(x, height + 0.6, z);
        cityGroup.add(beacon);

        // Rotating rooftop halo ring
        if (Math.random() > 0.4) {
          const ringGeom = new THREE.TorusGeometry(width * 0.65, 0.08, 6, 24);
          const ringMat = new THREE.MeshBasicMaterial({
            color: chosenColor,
            transparent: true,
            opacity: 0.85,
          });
          const ring = new THREE.Mesh(ringGeom, ringMat);
          ring.rotation.x = Math.PI / 2;
          ring.position.set(x, height + 1.4, z);
          ring.userData = { rotSpeed: (Math.random() - 0.5) * 0.04 };
          cityGroup.add(ring);
        }
      }
    }

    // 8. Sweeping Neon Highway Light Trails (Expressways / Sea Link)
    const highwayGroup = new THREE.Group();
    scene.add(highwayGroup);

    const trailCurves = [
      // Left curve
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-60, 0.4, -40),
        new THREE.Vector3(-20, 0.4, 0),
        new THREE.Vector3(-45, 0.4, 50)
      ),
      // Right curve
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(60, 0.4, -40),
        new THREE.Vector3(20, 0.4, 0),
        new THREE.Vector3(45, 0.4, 50)
      ),
      // Crossing flyover
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-55, 1.2, 20),
        new THREE.Vector3(0, 3.5, 10),
        new THREE.Vector3(55, 1.2, 20)
      ),
    ];

    const trailMaterials = [];
    trailCurves.forEach((curve, idx) => {
      const points = curve.getPoints(60);
      const trailGeom = new THREE.BufferGeometry().setFromPoints(points);
      const color = idx === 0 ? 0x00f2fe : idx === 1 ? 0xff0080 : 0xfacc15;
      const trailMat = new THREE.LineDashedMaterial({
        color,
        linewidth: 2,
        scale: 1,
        dashSize: 4,
        gapSize: 2,
        transparent: true,
        opacity: 0.9,
      });
      trailMaterials.push(trailMat);
      const line = new THREE.Line(trailGeom, trailMat);
      line.computeLineDistances();
      highwayGroup.add(line);
    });

    // 9. Sweeping Volumetric Searchlights (Blade Runner / Cyberpunk Sky Beacons)
    const searchlights = [];
    for (let s = 0; s < 3; s++) {
      const coneGeom = new THREE.ConeGeometry(3.5, 45, 16, 1, true);
      coneGeom.translate(0, 22.5, 0);
      const coneMat = new THREE.MeshBasicMaterial({
        color: s === 0 ? 0x38bdf8 : s === 1 ? 0xec4899 : 0x8b5cf6,
        transparent: true,
        opacity: 0.16,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const cone = new THREE.Mesh(coneGeom, coneMat);
      cone.position.set((s - 1) * 32, 25, -20);
      scene.add(cone);
      searchlights.push(cone);
    }

    // 10. Multi-Colored Floating Embers & City Sparks (350 particles)
    const particleCount = 320;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);

    const palette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xec4899),
      new THREE.Color(0x8b5cf6),
      new THREE.Color(0xfacc15),
      new THREE.Color(0x10b981),
      new THREE.Color(0xffffff),
    ];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 1] = Math.random() * 55;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 110;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      speeds[i] = 0.05 + Math.random() * 0.08;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 11. Mouse Parallax & Dynamic Camera Motion
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

    // 12. Resize handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 13. Render Loop
    let animationFrameId;
    let clock = new THREE.Clock();
    const currentColor = new THREE.Color(activeTheme);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth color lerp to match selected active persona / theme
      currentColor.lerp(targetColorRef.current, 0.05);
      themePointLight.color.copy(currentColor);

      // Camera sway + mouse parallax
      targetX += (mouseX * 16 - targetX) * 0.04;
      targetY += (mouseY * 10 - targetY) * 0.04;

      camera.position.x = Math.sin(elapsedTime * 0.12) * 44 + targetX;
      camera.position.z = 76 + Math.cos(elapsedTime * 0.12) * 12;
      camera.position.y = 34 + targetY + Math.sin(elapsedTime * 0.35) * 2;
      camera.lookAt(0, 14, 0);

      // Rotate rooftop halo rings
      cityGroup.children.forEach((child) => {
        if (child.userData && child.userData.rotSpeed) {
          child.rotation.z += child.userData.rotSpeed;
        }
      });

      // Slowly rotate city skyline
      cityGroup.rotation.y = Math.sin(elapsedTime * 0.05) * 0.08;

      // Animate searchlights sweeping the sky
      searchlights.forEach((beam, idx) => {
        const offset = idx * 2.1;
        beam.rotation.z = Math.sin(elapsedTime * 0.6 + offset) * 0.45;
        beam.rotation.x = Math.cos(elapsedTime * 0.4 + offset) * 0.3;
      });

      // Highway dashed lines animation
      trailMaterials.forEach((mat, idx) => {
        mat.dashOffset = -elapsedTime * (6 + idx * 3);
      });

      // Animate rising ember particles
      const posAttr = particleGeom.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        let y = posAttr.getY(i) + speeds[i];
        if (y > 55) y = 0;
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
