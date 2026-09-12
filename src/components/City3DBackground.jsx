import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Procedural skyscraper texture with realistic architectural window lights
function createArchitecturalTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Deep matte slate facade
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, 128, 256);

  // Soft architectural window lights
  const cols = 8;
  const rows = 28;
  const padX = 3;
  const padY = 2;
  const w = (128 - padX * (cols + 1)) / cols;
  const h = (256 - padY * (rows + 1)) / rows;

  const warmHues = ['#f8fafc', '#fde68a', '#93c5fd', '#e2e8f0', '#fed7aa'];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (Math.random() > 0.45) {
        const x = padX + c * (w + padX);
        const y = padY + r * (h + padY);
        ctx.fillStyle = warmHues[Math.floor(Math.random() * warmHues.length)];
        ctx.globalAlpha = 0.35 + Math.random() * 0.45;
        ctx.fillRect(x, y, w, h);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export const City3DBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060913, 0.018);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      1,
      1000
    );
    camera.position.set(0, 30, 75);
    camera.lookAt(0, 10, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 4. Subtle, Warm Architectural Lighting (no garish neon)
    const ambientLight = new THREE.AmbientLight(0x1e2640, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x94a3b8, 2.2);
    keyLight.position.set(40, 50, 30);
    scene.add(keyLight);

    const warmFill = new THREE.DirectionalLight(0x38bdf8, 1.2);
    warmFill.position.set(-40, 30, -20);
    scene.add(warmFill);

    // 5. Dark Reflective Ground Plane
    const groundGeom = new THREE.PlaneGeometry(240, 240);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x05070e,
      roughness: 0.2,
      metalness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    scene.add(ground);

    // Subtle dark grid
    const grid = new THREE.GridHelper(160, 60, 0x1e293b, 0x0f172a);
    grid.position.y = 0.02;
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    scene.add(grid);

    // 6. Skyscraper Buildings
    const facadeTexture = createArchitecturalTexture();
    facadeTexture.repeat.set(1, 2);

    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0x0d1322,
      roughness: 0.35,
      metalness: 0.7,
      map: facadeTexture,
      emissive: 0x111827,
      emissiveMap: facadeTexture,
      emissiveIntensity: 0.5,
    });

    const cityGroup = new THREE.Group();
    scene.add(cityGroup);

    const count = 55;
    for (let i = 0; i < count; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const isFlank = i < 40;

      let x, z;
      if (isFlank) {
        // Flanked on left and right
        x = side * (16 + Math.random() * 34);
        z = (Math.random() - 0.3) * 55;
      } else {
        // Distant horizon
        x = (Math.random() - 0.5) * 80;
        z = -20 - Math.random() * 30;
      }

      const w = 3.2 + Math.random() * 3.8;
      const d = 3.2 + Math.random() * 3.8;
      const h = isFlank ? 18 + Math.random() * 26 : 10 + Math.random() * 18;

      const geom = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geom, buildingMat);
      mesh.position.set(x, h / 2, z);
      cityGroup.add(mesh);

      // Subtle edge line
      const edges = new THREE.EdgesGeometry(geom);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.4,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);
      wireframe.position.copy(mesh.position);
      cityGroup.add(wireframe);
    }

    // 7. Subtle Ambient Floating Dust Particles (no disco sparkles)
    const pCount = 120;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pSpeeds = new Float32Array(pCount);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 90;
      pPos[i * 3 + 1] = Math.random() * 45;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 90;
      pSpeeds[i] = 0.02 + Math.random() * 0.03;
    }

    pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.6,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(pGeom, pMat);
    scene.add(particles);

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

    // 9. Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetX += (mouseX * 8 - targetX) * 0.03;
      targetY += (mouseY * 5 - targetY) * 0.03;

      camera.position.x = Math.sin(elapsed * 0.08) * 20 + targetX;
      camera.position.z = 74 + Math.cos(elapsed * 0.08) * 8;
      camera.position.y = 28 + targetY;
      camera.lookAt(0, 10, 0);

      cityGroup.rotation.y = Math.sin(elapsed * 0.04) * 0.04;

      const pos = pGeom.attributes.position;
      for (let i = 0; i < pCount; i++) {
        let y = pos.getY(i) + pSpeeds[i];
        if (y > 45) y = 0;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;

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
