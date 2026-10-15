import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils/webglCheck.ts';

export const GlobalAtmosphereCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isWebGLAvailable()) return;

    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const clock = new THREE.Clock();

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a12, 0.035);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // background optimization
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 1. Distant Starfield & Dust Particles
    const starCount = 600;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const c1 = new THREE.Color(0xaa78ef); // soft violet
    const c2 = new THREE.Color(0x9ab088); // sage
    const c3 = new THREE.Color(0x5b2c6f); // deep violet

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = (Math.random() - 0.5) * 45;
      starPositions[idx + 1] = (Math.random() - 0.5) * 45;
      starPositions[idx + 2] = (Math.random() - 0.5) * 35 - 5;

      const pick = Math.random();
      const col = pick < 0.4 ? c1 : pick < 0.8 ? c2 : c3;
      starColors[idx] = col.r;
      starColors[idx + 1] = col.g;
      starColors[idx + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Particle sprite texture
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 16;
    starCanvas.height = 16;
    const sCtx = starCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(0.4, 'rgba(170, 120, 239, 0.4)');
      grad.addColorStop(1, 'rgba(9, 10, 18, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 16, 16);
    }
    const starTex = new THREE.CanvasTexture(starCanvas);

    const starMat = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      map: starTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 2. Subtle Horizon Grid in Space
    const gridHelper = new THREE.GridHelper(50, 40, 0x5b2c6f, 0x1f1930);
    gridHelper.position.set(0, -6, -5);
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.25;
    scene.add(gridHelper);

    // 3. Dual Volumetric Aurora Glow Planes
    const auroraGeo = new THREE.PlaneGeometry(35, 25);
    const auroraCanvas = document.createElement('canvas');
    auroraCanvas.width = 256;
    auroraCanvas.height = 256;
    const aCtx = auroraCanvas.getContext('2d');
    if (aCtx) {
      const g = aCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      g.addColorStop(0, 'rgba(125, 74, 199, 0.28)');
      g.addColorStop(0.5, 'rgba(154, 176, 136, 0.15)');
      g.addColorStop(1, 'rgba(9, 10, 18, 0)');
      aCtx.fillStyle = g;
      aCtx.fillRect(0, 0, 256, 256);
    }
    const auroraTex = new THREE.CanvasTexture(auroraCanvas);
    const auroraMat1 = new THREE.MeshBasicMaterial({
      map: auroraTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const auroraPlane1 = new THREE.Mesh(auroraGeo, auroraMat1);
    auroraPlane1.position.set(-6, 3, -10);
    scene.add(auroraPlane1);

    const auroraMat2 = new THREE.MeshBasicMaterial({
      map: auroraTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const auroraPlane2 = new THREE.Mesh(auroraGeo, auroraMat2);
    auroraPlane2.position.set(8, -2, -12);
    scene.add(auroraPlane2);

    // Scroll tracking
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Window Resize
    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let currentScrollNormalized = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Normalize scroll between 0 and 1
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetScrollNorm = Math.min(1, Math.max(0, scrollY / maxScroll));
      currentScrollNormalized = THREE.MathUtils.damp(currentScrollNormalized, targetScrollNorm, 2.5, delta);

      // Camera smooth travel along Z & Y based on scroll
      camera.position.y = -currentScrollNormalized * 3.5;
      camera.position.z = 10 - currentScrollNormalized * 2.0;

      // Aurora slow breathing and translation
      auroraPlane1.position.x = -6 + Math.sin(elapsed * 0.4) * 2.5;
      auroraPlane1.position.y = 3 - currentScrollNormalized * 2.0 + Math.cos(elapsed * 0.3) * 1.5;

      auroraPlane2.position.x = 8 + Math.cos(elapsed * 0.35) * 2.0;
      auroraPlane2.position.y = -2 - currentScrollNormalized * 2.5 + Math.sin(elapsed * 0.45) * 1.8;

      // Rotate starfield very gently
      starField.rotation.y = elapsed * 0.015;
      starField.rotation.x = currentScrollNormalized * 0.2;

      gridHelper.position.y = -6 - currentScrollNormalized * 2.0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      starGeo.dispose();
      starMat.dispose();
      starTex.dispose();
      gridHelper.dispose();
      auroraGeo.dispose();
      auroraMat1.dispose();
      auroraMat2.dispose();
      auroraTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1]"
      aria-hidden="true"
    />
  );
};
