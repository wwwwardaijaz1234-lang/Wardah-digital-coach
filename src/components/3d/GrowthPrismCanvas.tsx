import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils/webglCheck.ts';

interface GrowthPrismCanvasProps {
  activeStep: number;
  onStepChange?: (stepIndex: number) => void;
}

export const GrowthPrismCanvas: React.FC<GrowthPrismCanvasProps> = ({
  activeStep,
  onStepChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const activeStepRef = useRef(activeStep);
  activeStepRef.current = activeStep;

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const clock = new THREE.Clock();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a12, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x191426, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xc3d7ae, 3.0);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const violetRim = new THREE.DirectionalLight(0xaa78ef, 4.0);
    violetRim.position.set(-3, -2, -2);
    scene.add(violetRim);

    const corePoint = new THREE.PointLight(0xaa78ef, 3, 10);
    scene.add(corePoint);

    // Main Crystal Prism Group
    const prismGroup = new THREE.Group();
    scene.add(prismGroup);

    // Outer Crystal Geometry: Multi-faceted Octahedron
    const crystalGeo = new THREE.OctahedronGeometry(2.1, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xaa78ef,
      emissive: 0x2d1740,
      emissiveIntensity: 0.35,
      roughness: 0.08,
      metalness: 0.15,
      transmission: 0.9,
      ior: 1.65,
      thickness: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      attenuationColor: new THREE.Color(0xc3d7ae),
      attenuationDistance: 2.5,
      transparent: true,
      opacity: 0.9,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    prismGroup.add(crystalMesh);

    // Inner Glowing Core (representing the spark of knowledge)
    const innerCoreGeo = new THREE.OctahedronGeometry(1.0, 1);
    const innerCoreMat = new THREE.MeshStandardMaterial({
      color: 0xc3d7ae,
      emissive: 0x9ab088,
      emissiveIntensity: 0.85,
      roughness: 0.3,
      metalness: 0.7,
      wireframe: true,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    prismGroup.add(innerCoreMesh);

    // Crystal Wireframe Rim Edges
    const edgesGeo = new THREE.EdgesGeometry(crystalGeo);
    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xc3d7ae,
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
    prismGroup.add(edgesMesh);

    // Slicing Light Beams
    const beamGeo = new THREE.CylinderGeometry(0.04, 0.04, 8, 16);
    const beamMat1 = new THREE.MeshBasicMaterial({
      color: 0xaa78ef,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const beam1 = new THREE.Mesh(beamGeo, beamMat1);
    beam1.rotation.z = Math.PI / 4;
    prismGroup.add(beam1);

    const beamMat2 = new THREE.MeshBasicMaterial({
      color: 0xc3d7ae,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const beam2 = new THREE.Mesh(beamGeo, beamMat2);
    beam2.rotation.x = Math.PI / 3;
    beam2.rotation.y = Math.PI / 6;
    prismGroup.add(beam2);

    // Mouse tilt
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    renderer.domElement.addEventListener('mousemove', onMouseMove, { passive: true });

    // Click on prism cycles the active step
    const onClick = () => {
      if (onStepChange) {
        const next = (activeStepRef.current + 1) % 4;
        onStepChange(next);
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    // Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Target rotation per step
    const stepRotations = [
      { y: 0, x: 0.2 },
      { y: Math.PI / 2, x: -0.2 },
      { y: Math.PI, x: 0.3 },
      { y: (3 * Math.PI) / 2, x: -0.1 },
    ];

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      mouse.x = THREE.MathUtils.damp(mouse.x, mouse.targetX, 4, delta);
      mouse.y = THREE.MathUtils.damp(mouse.y, mouse.targetY, 4, delta);

      const targetRot = stepRotations[activeStepRef.current % 4];

      // Blend continuous rotation with active step angle and mouse tilt
      prismGroup.rotation.y = THREE.MathUtils.damp(
        prismGroup.rotation.y,
        targetRot.y + elapsed * 0.25 + mouse.x * 0.4,
        3.0,
        delta
      );
      prismGroup.rotation.x = THREE.MathUtils.damp(
        prismGroup.rotation.x,
        targetRot.x + Math.sin(elapsed * 0.8) * 0.15 - mouse.y * 0.3,
        3.0,
        delta
      );

      // Inner core counter-rotation
      innerCoreMesh.rotation.y -= delta * 0.7;
      innerCoreMesh.rotation.z += delta * 0.5;

      // Pulse inner light
      corePoint.intensity = 2.5 + Math.sin(elapsed * 3.0) * 1.0;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('click', onClick);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      crystalGeo.dispose();
      crystalMat.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      edgesGeo.dispose();
      edgesMat.dispose();
      beamGeo.dispose();
      beamMat1.dispose();
      beamMat2.dispose();
      renderer.dispose();
    };
  }, [onStepChange]);

  if (!hasWebGL) {
    return (
      <div className="w-full h-72 flex items-center justify-center">
        <div className="w-40 h-40 border-2 border-[#AA78EF] rounded-2xl rotate-45 flex items-center justify-center bg-purple-900/20 backdrop-blur-md">
          <span className="text-2xl font-bold text-white -rotate-45">0{activeStep + 1}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-pointer" />
      <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
        <span className="text-xs tracking-wider text-slate-400">
          Click crystal or scroll to rotate through pillars
        </span>
      </div>
    </div>
  );
};
