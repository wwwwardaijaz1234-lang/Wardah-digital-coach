import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { isWebGLAvailable } from '../../utils/webglCheck.ts';

interface HeroPortalCanvasProps {
  heroImageUrl: string;
}

export const HeroPortalCanvas: React.FC<HeroPortalCanvasProps> = ({ heroImageUrl }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const imageTextureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const clock = new THREE.Clock();

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a12, 0.04);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Studio Environment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback gracefully without room environment
    }

    // Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x1a1228, 1.2);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xaa78ef, 0x121e14, 1.4);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xc3d7ae, 2.4);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimViolet = new THREE.DirectionalLight(0x7d4ac7, 3.2);
    rimViolet.position.set(-5, -2, -3);
    scene.add(rimViolet);

    const emeraldPoint = new THREE.PointLight(0x9ab088, 3.5, 12);
    emeraldPoint.position.set(1.5, 0.5, 1.5);
    scene.add(emeraldPoint);

    // Group for the entire portal system placed on the right side on desktop
    const portalGroup = new THREE.Group();
    // Slightly offset to the right on wide viewports
    const isMobile = width < 768;
    portalGroup.position.set(isMobile ? 0 : 2.2, isMobile ? -0.2 : 0.1, 0);
    scene.add(portalGroup);

    // 1. Main Glass Portal Arch / Torus
    const glassGeometry = new THREE.TorusGeometry(2.35, 0.14, 32, 120);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xaa78ef,
      emissive: 0x3d1b54,
      emissiveIntensity: 0.45,
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.88,
      ior: 1.52,
      thickness: 1.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      attenuationColor: new THREE.Color(0x9ab088),
      attenuationDistance: 2.0,
      transparent: true,
      opacity: 0.95,
    });
    const glassRing = new THREE.Mesh(glassGeometry, glassMaterial);
    portalGroup.add(glassRing);

    // 2. Metallic Rim Accents
    const metallicRimGeo = new THREE.TorusGeometry(2.52, 0.025, 16, 120);
    const metallicMaterial = new THREE.MeshStandardMaterial({
      color: 0xc3d7ae,
      roughness: 0.2,
      metalness: 0.92,
      emissive: 0x9ab088,
      emissiveIntensity: 0.25,
    });
    const metallicRim = new THREE.Mesh(metallicRimGeo, metallicMaterial);
    portalGroup.add(metallicRim);

    const innerRimGeo = new THREE.TorusGeometry(2.18, 0.02, 16, 100);
    const innerRim = new THREE.Mesh(innerRimGeo, metallicMaterial);
    portalGroup.add(innerRim);

    // 3. Orbiting Rings with moving nodes
    const orbitRing1Geo = new THREE.TorusGeometry(2.8, 0.015, 12, 100);
    const orbitRing1Mat = new THREE.MeshBasicMaterial({
      color: 0xaa78ef,
      transparent: true,
      opacity: 0.45,
    });
    const orbitRing1 = new THREE.Mesh(orbitRing1Geo, orbitRing1Mat);
    orbitRing1.rotation.x = Math.PI / 3;
    orbitRing1.rotation.y = Math.PI / 6;
    portalGroup.add(orbitRing1);

    const orbitRing2Geo = new THREE.TorusGeometry(3.05, 0.015, 12, 100);
    const orbitRing2Mat = new THREE.MeshBasicMaterial({
      color: 0x9ab088,
      transparent: true,
      opacity: 0.4,
    });
    const orbitRing2 = new THREE.Mesh(orbitRing2Geo, orbitRing2Mat);
    orbitRing2.rotation.x = -Math.PI / 4;
    orbitRing2.rotation.y = -Math.PI / 5;
    portalGroup.add(orbitRing2);

    // Orbiting glowing nodes
    const nodeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const nodeMatViolet = new THREE.MeshBasicMaterial({ color: 0xaa78ef });
    const nodeMatEmerald = new THREE.MeshBasicMaterial({ color: 0xc3d7ae });

    const node1 = new THREE.Mesh(nodeGeo, nodeMatViolet);
    const node2 = new THREE.Mesh(nodeGeo, nodeMatEmerald);
    const node3 = new THREE.Mesh(nodeGeo, nodeMatViolet);
    portalGroup.add(node1);
    portalGroup.add(node2);
    portalGroup.add(node3);

    // 4. Portrait Canvas inside the Portal
    const textureLoader = new THREE.TextureLoader();
    const portraitGeo = new THREE.PlaneGeometry(3.2, 3.2, 32, 32);

    // Create a circular mask / soft blend shader or alpha mapped plane
    const portraitMat = new THREE.MeshStandardMaterial({
      roughness: 0.45,
      metalness: 0.05,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const loadTexture = (url: string) => {
      textureLoader.load(
        url,
        (loadedTex) => {
          loadedTex.colorSpace = THREE.SRGBColorSpace;
          portraitMat.map = loadedTex;
          portraitMat.needsUpdate = true;
          imageTextureRef.current = loadedTex;
        },
        undefined,
        () => {
          // If custom URL fails, try to fallback gracefully
          portraitMat.color.set(0x1d1733);
        }
      );
    };

    loadTexture(heroImageUrl);

    const portraitMesh = new THREE.Mesh(portraitGeo, portraitMat);
    portraitMesh.position.set(0, 0, -0.05);
    portalGroup.add(portraitMesh);

    // 5. Surrounding Volumetric Particle Field
    const particleCount = isMobile ? 350 : 750;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colorViolet = new THREE.Color(0xaa78ef);
    const colorSage = new THREE.Color(0xc3d7ae);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Spread across camera view with focal concentration around portal
      particlePositions[idx] = (Math.random() - 0.3) * 16;
      particlePositions[idx + 1] = (Math.random() - 0.5) * 12;
      particlePositions[idx + 2] = (Math.random() - 0.5) * 10 - 1;

      const mixedColor = Math.random() > 0.5 ? colorViolet : Math.random() > 0.5 ? colorSage : colorWhite;
      particleColors[idx] = mixedColor.r;
      particleColors[idx + 1] = mixedColor.g;
      particleColors[idx + 2] = mixedColor.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    // Particle sprite using canvas
    const particleCanvas = document.createElement('canvas');
    particleCanvas.width = 32;
    particleCanvas.height = 32;
    const pctx = particleCanvas.getContext('2d');
    if (pctx) {
      const grad = pctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(200,220,255,0.7)');
      grad.addColorStop(1, 'rgba(125,74,199,0)');
      pctx.fillStyle = grad;
      pctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(particleCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Reusable mouse interaction vectors
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const mobileNow = w < 768;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      portalGroup.position.set(mobileNow ? 0 : 2.2, mobileNow ? -0.2 : 0.1, 0);
    };
    window.addEventListener('resize', handleResize);

    // Animation Render Loop
    let nodeAngle1 = 0;
    let nodeAngle2 = Math.PI / 2;
    let nodeAngle3 = Math.PI;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Exponential damping on mouse movement
      mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 3.5, delta);
      mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 3.5, delta);

      // Camera parallax
      camera.position.x = mouse.x * 0.7;
      camera.position.y = mouse.y * 0.5;
      camera.lookAt(0, 0, 0);

      // Portal floating and breathing
      portalGroup.position.y = (isMobile ? -0.2 : 0.1) + Math.sin(elapsedTime * 1.1) * 0.12;
      portalGroup.rotation.y = mouse.x * 0.15 + Math.sin(elapsedTime * 0.5) * 0.05;
      portalGroup.rotation.x = -mouse.y * 0.15 + Math.cos(elapsedTime * 0.6) * 0.04;

      // Orbit rings rotation
      orbitRing1.rotation.z += delta * 0.35;
      orbitRing2.rotation.z -= delta * 0.28;
      glassRing.rotation.z += delta * 0.08;

      // Moving nodes along elliptical paths
      nodeAngle1 += delta * 0.9;
      nodeAngle2 += delta * 0.7;
      nodeAngle3 += delta * 0.85;

      const r1 = 2.8;
      node1.position.set(
        Math.cos(nodeAngle1) * r1 * Math.cos(Math.PI / 6),
        Math.sin(nodeAngle1) * r1 * Math.cos(Math.PI / 3),
        Math.sin(nodeAngle1) * r1 * Math.sin(Math.PI / 3)
      );

      const r2 = 3.05;
      node2.position.set(
        Math.cos(nodeAngle2) * r2 * Math.cos(-Math.PI / 5),
        Math.sin(nodeAngle2) * r2 * Math.cos(-Math.PI / 4),
        Math.sin(nodeAngle2) * r2 * Math.sin(-Math.PI / 4)
      );

      node3.position.set(
        Math.cos(nodeAngle3 + Math.PI) * r1 * 0.95,
        Math.sin(nodeAngle3 + Math.PI) * r1 * 0.95 * 0.5,
        Math.cos(nodeAngle3) * 0.4
      );

      // Particles subtle movement
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      glassGeometry.dispose();
      glassMaterial.dispose();
      metallicRimGeo.dispose();
      metallicMaterial.dispose();
      innerRimGeo.dispose();
      orbitRing1Geo.dispose();
      orbitRing1Mat.dispose();
      orbitRing2Geo.dispose();
      orbitRing2Mat.dispose();
      nodeGeo.dispose();
      nodeMatViolet.dispose();
      nodeMatEmerald.dispose();
      portraitGeo.dispose();
      portraitMat.dispose();
      if (imageTextureRef.current) {
        imageTextureRef.current.dispose();
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, [heroImageUrl]);

  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-20 pointer-events-none">
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full p-2 bg-gradient-to-tr from-[#7D4AC7] via-[#AA78EF] to-[#9AB088] shadow-2xl shadow-purple-950/60 animate-pulse">
          <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20 backdrop-blur-xl">
            <img
              src={heroImageUrl}
              alt="Wardah Ijaz"
              className="w-full h-full object-cover object-top"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
