import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SkillItem } from '../../types.ts';
import { isWebGLAvailable } from '../../utils/webglCheck.ts';

interface SkillGalaxyCanvasProps {
  skills: SkillItem[];
  selectedSkillId: string | null;
  onSelectSkill: (skillId: string) => void;
  onHoverSkill?: (skillId: string | null) => void;
}

export const SkillGalaxyCanvas: React.FC<SkillGalaxyCanvasProps> = ({
  skills,
  selectedSkillId,
  onSelectSkill,
  onHoverSkill,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const selectedRef = useRef(selectedSkillId);
  selectedRef.current = selectedSkillId;

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const clock = new THREE.Clock();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const isMobile = width < 768;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a12, 0.05);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3.5, 9.5);
    camera.lookAt(0, 0, 0);

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
    const ambientLight = new THREE.AmbientLight(0x221835, 1.6);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xaa78ef, 4, 15);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const greenLight = new THREE.PointLight(0xc3d7ae, 3, 12);
    greenLight.position.set(2, 2, 2);
    scene.add(greenLight);

    // Central Core Sphere & Energy Halo
    const galaxyGroup = new THREE.Group();
    scene.add(galaxyGroup);

    const coreGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xaa78ef,
      emissive: 0x7d4ac7,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.6,
      wireframe: false,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    galaxyGroup.add(coreMesh);

    // Core Wireframe Cage
    const coreWireGeo = new THREE.IcosahedronGeometry(1.05, 1);
    const coreWireMat = new THREE.MeshBasicMaterial({
      color: 0xc3d7ae,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreWire = new THREE.Mesh(coreWireGeo, coreWireMat);
    galaxyGroup.add(coreWire);

    // Create Text Sprite Helper
    const createTextSprite = (text: string, colorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(15, 15, 26, 0.85)';
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(4, 4, 248, 56, 12);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 24px "Helvetica Neue", Helvetica, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 32);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.8, 0.45, 1);
      return { sprite, texture, material: spriteMat };
    };

    // Build the 7 Skill Nodes
    const nodeMeshes: THREE.Mesh[] = [];
    const nodeDataList: Array<{
      mesh: THREE.Mesh;
      skill: SkillItem;
      radius: number;
      speed: number;
      angle: number;
      yOffset: number;
      line: THREE.Line;
      lineGeo: THREE.BufferGeometry;
      sprite: THREE.Sprite;
      disposables: Array<{ dispose: () => void }>;
    }> = [];

    const baseRadii = isMobile
      ? [2.1, 2.4, 2.7, 3.0, 3.3, 3.6, 2.3, 2.6, 2.9, 3.4]
      : [3.0, 3.5, 4.0, 4.5, 5.0, 5.4, 3.2, 3.8, 4.3, 4.9];

    skills.forEach((skill, i) => {
      const radius = baseRadii[i % baseRadii.length];
      const angle = (i / skills.length) * Math.PI * 2;
      const yOffset = Math.sin(i * 1.6) * (isMobile ? 0.6 : 1.2);
      const speed = 0.12 + (i % 3) * 0.05;

      const sphereGeo = new THREE.SphereGeometry(isMobile ? 0.32 : 0.42, 24, 24);
      const hexColor = skill.color === '#C3D7AE' || skill.color === '#9AB088' ? 0xc3d7ae : 0xaa78ef;

      const sphereMat = new THREE.MeshPhysicalMaterial({
        color: hexColor,
        emissive: hexColor,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        transmission: 0.8,
        thickness: 0.8,
        clearcoat: 1.0,
      });

      const nodeMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeMesh.userData = { skillId: skill.id };
      nodeMeshes.push(nodeMesh);
      galaxyGroup.add(nodeMesh);

      // Orbital Halo Ring around the node
      const haloGeo = new THREE.TorusGeometry(isMobile ? 0.45 : 0.6, 0.02, 12, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color: hexColor, transparent: true, opacity: 0.6 });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2;
      nodeMesh.add(haloMesh);

      // Connecting Energy Line to Core
      const linePositions = new Float32Array(6); // 2 points (x,y,z)
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: hexColor,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      galaxyGroup.add(line);

      // Text Sprite Label
      const spriteObj = createTextSprite(skill.name, skill.color);
      spriteObj.sprite.position.set(0, isMobile ? 0.6 : 0.75, 0);
      nodeMesh.add(spriteObj.sprite);

      nodeDataList.push({
        mesh: nodeMesh,
        skill,
        radius,
        speed,
        angle,
        yOffset,
        line,
        lineGeo,
        sprite: spriteObj.sprite,
        disposables: [
          sphereGeo,
          sphereMat,
          haloGeo,
          haloMat,
          lineGeo,
          lineMat,
          spriteObj.texture,
          spriteObj.material,
        ],
      });
    });

    // Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-100, -100);
    let hoveredNodeId: string | null = null;

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes, false);

      if (intersects.length > 0) {
        const id = intersects[0].object.userData.skillId;
        if (id !== hoveredNodeId) {
          hoveredNodeId = id;
          if (onHoverSkill) onHoverSkill(id);
        }
        renderer.domElement.style.cursor = 'pointer';
      } else {
        if (hoveredNodeId !== null) {
          hoveredNodeId = null;
          if (onHoverSkill) onHoverSkill(null);
        }
        renderer.domElement.style.cursor = 'grab';
      }
    };

    const onClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes, false);
      if (intersects.length > 0) {
        const id = intersects[0].object.userData.skillId;
        onSelectSkill(id);
      }
    };

    renderer.domElement.addEventListener('mousemove', onPointerMove, { passive: true });
    renderer.domElement.addEventListener('click', onClick);

    // Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Rotate core
      coreMesh.rotation.y += delta * 0.5;
      coreMesh.rotation.x += delta * 0.2;
      coreWire.rotation.y -= delta * 0.3;
      coreWire.rotation.z += delta * 0.25;

      // Rotate whole galaxy gently
      galaxyGroup.rotation.y = elapsed * 0.06;

      // Update node positions and connecting lines
      nodeDataList.forEach((item) => {
        const currentAngle = item.angle + elapsed * item.speed;
        const isSelected = selectedRef.current === item.skill.id;
        const isHovered = hoveredNodeId === item.skill.id;

        const effectiveRadius = isSelected ? item.radius * 0.85 : item.radius;
        const px = Math.cos(currentAngle) * effectiveRadius;
        const pz = Math.sin(currentAngle) * effectiveRadius;
        const py = item.yOffset + Math.sin(elapsed * 1.5 + item.angle) * 0.2;

        item.mesh.position.set(px, py, pz);

        // Scale up if selected or hovered
        const targetScale = isSelected ? 1.5 : isHovered ? 1.25 : 1.0;
        item.mesh.scale.set(
          THREE.MathUtils.damp(item.mesh.scale.x, targetScale, 6, delta),
          THREE.MathUtils.damp(item.mesh.scale.y, targetScale, 6, delta),
          THREE.MathUtils.damp(item.mesh.scale.z, targetScale, 6, delta)
        );

        // Update connecting energy lines
        const posAttr = item.lineGeo.getAttribute('position') as THREE.BufferAttribute;
        // Point 0 (Core: 0,0,0)
        posAttr.setXYZ(0, 0, 0, 0);
        // Point 1 (Node: px, py, pz)
        posAttr.setXYZ(1, px, py, pz);
        posAttr.needsUpdate = true;

        // Line brightness
        const lineMat = item.line.material as THREE.LineBasicMaterial;
        lineMat.opacity = isSelected ? 0.9 : isHovered ? 0.75 : 0.25;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onPointerMove);
      renderer.domElement.removeEventListener('click', onClick);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      coreGeo.dispose();
      coreMat.dispose();
      coreWireGeo.dispose();
      coreWireMat.dispose();

      nodeDataList.forEach((item) => {
        item.disposables.forEach((d) => d.dispose());
      });

      renderer.dispose();
    };
  }, [skills, onSelectSkill, onHoverSkill]);

  if (!hasWebGL) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-center p-6 text-slate-400">
        <p>Interactive 3D Galaxy initialized in lightweight mode.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden glass-panel border border-purple-500/20 shadow-2xl">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute top-4 left-6 pointer-events-none flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest text-[#AA78EF] font-semibold">
          3D Interactive Orbit
        </span>
        <span className="text-xs text-slate-400">· Click any skill orb to inspect syllabus</span>
      </div>
    </div>
  );
};
