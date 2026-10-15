import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isWebGLAvailable } from '../../utils/webglCheck.ts';

interface CommunityBadgeCanvasProps {
  isHovered: boolean;
}

export const CommunityBadgeCanvas: React.FC<CommunityBadgeCanvasProps> = ({ isHovered }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);
  const hoverRef = useRef(isHovered);
  hoverRef.current = isHovered;

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setHasWebGL(false);
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    let animId: number;
    const clock = new THREE.Clock();

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

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
    const ambientLight = new THREE.AmbientLight(0x191428, 1.8);
    scene.add(ambientLight);

    const emeraldLight = new THREE.PointLight(0x9ab088, 3.5, 12);
    emeraldLight.position.set(0, 1.5, 2);
    scene.add(emeraldLight);

    const violetRim = new THREE.DirectionalLight(0xaa78ef, 4.0);
    violetRim.position.set(-2, -2, -1);
    scene.add(violetRim);

    // Badge Group
    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    // 1. Center Glass Disc
    const centerDiscGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 48);
    const centerDiscMat = new THREE.MeshPhysicalMaterial({
      color: 0x18201a,
      emissive: 0x0f1813,
      roughness: 0.15,
      metalness: 0.3,
      transmission: 0.75,
      thickness: 0.8,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.9,
    });
    const centerDisc = new THREE.Mesh(centerDiscGeo, centerDiscMat);
    centerDisc.rotation.x = Math.PI / 2;
    badgeGroup.add(centerDisc);

    // 2. Chat / WhatsApp Stylized Center Emblem
    const emblemCanvas = document.createElement('canvas');
    emblemCanvas.width = 256;
    emblemCanvas.height = 256;
    const eCtx = emblemCanvas.getContext('2d');
    if (eCtx) {
      // Glow circle
      const grad = eCtx.createRadialGradient(128, 128, 20, 128, 128, 110);
      grad.addColorStop(0, 'rgba(154, 176, 136, 0.9)');
      grad.addColorStop(0.7, 'rgba(125, 74, 199, 0.6)');
      grad.addColorStop(1, 'rgba(15, 15, 26, 0)');
      eCtx.fillStyle = grad;
      eCtx.fillRect(0, 0, 256, 256);

      // WhatsApp Chat Icon Glyph
      eCtx.fillStyle = '#FFFFFF';
      eCtx.beginPath();
      // Speech bubble shape
      eCtx.arc(128, 120, 60, 0.2 * Math.PI, 1.8 * Math.PI);
      eCtx.lineTo(95, 178);
      eCtx.lineTo(112, 160);
      eCtx.closePath();
      eCtx.fill();

      // Inner phone silhouette
      eCtx.fillStyle = '#161e17';
      eCtx.font = 'bold 44px sans-serif';
      eCtx.textAlign = 'center';
      eCtx.textBaseline = 'middle';
      eCtx.fillText('VIP', 128, 120);
    }
    const emblemTexture = new THREE.CanvasTexture(emblemCanvas);
    emblemTexture.colorSpace = THREE.SRGBColorSpace;
    const emblemMat = new THREE.MeshBasicMaterial({
      map: emblemTexture,
      transparent: true,
      depthWrite: false,
    });
    const emblemGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
    emblemMesh.position.set(0, 0, 0.05);
    badgeGroup.add(emblemMesh);

    // 3. Counter-Rotating Concentric Rings
    const ring1Geo = new THREE.TorusGeometry(1.45, 0.025, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xc3d7ae,
      emissive: 0x9ab088,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    badgeGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.85, 0.02, 16, 80);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xaa78ef,
      emissive: 0x7d4ac7,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    badgeGroup.add(ring2);

    const ring3Geo = new THREE.TorusGeometry(2.25, 0.015, 16, 80);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xc3d7ae,
      transparent: true,
      opacity: 0.5,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    badgeGroup.add(ring3);

    // 4. Orbiting Dots
    const dotGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const dotMat1 = new THREE.MeshBasicMaterial({ color: 0xc3d7ae });
    const dotMat2 = new THREE.MeshBasicMaterial({ color: 0xaa78ef });
    const dot1 = new THREE.Mesh(dotGeo, dotMat1);
    const dot2 = new THREE.Mesh(dotGeo, dotMat2);
    const dot3 = new THREE.Mesh(dotGeo, dotMat1);
    badgeGroup.add(dot1);
    badgeGroup.add(dot2);
    badgeGroup.add(dot3);

    // 5. Floating text badges in 3D orbit
    const createPillSprite = (text: string, colorHex: string) => {
      const cvs = document.createElement('canvas');
      cvs.width = 160;
      cvs.height = 60;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(15, 15, 26, 0.9)';
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(4, 4, 152, 52, 26);
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 22px "Helvetica Neue", Helvetica, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 80, 30);
      }
      const tex = new THREE.CanvasTexture(cvs);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(1.0, 0.38, 1);
      return { sprite, tex, mat };
    };

    const tags = [
      { text: 'FREE', color: '#C3D7AE', angle: 0 },
      { text: 'LIVE 1:1', color: '#AA78EF', angle: Math.PI * 0.5 },
      { text: 'MENTORSHIP', color: '#C3D7AE', angle: Math.PI },
      { text: 'COMMUNITY', color: '#AA78EF', angle: Math.PI * 1.5 },
    ];

    const tagSprites: Array<{
      sprite: THREE.Sprite;
      tex: THREE.CanvasTexture;
      mat: THREE.SpriteMaterial;
      angle: number;
    }> = [];

    tags.forEach((t) => {
      const pill = createPillSprite(t.text, t.color);
      badgeGroup.add(pill.sprite);
      tagSprites.push({ ...pill, angle: t.angle });
    });

    // Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let rotSpeed = 0.5;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const targetSpeed = hoverRef.current ? 1.6 : 0.5;
      rotSpeed = THREE.MathUtils.damp(rotSpeed, targetSpeed, 3, delta);

      // Rotate concentric rings in alternating directions
      ring1.rotation.z += delta * rotSpeed * 0.8;
      ring2.rotation.z -= delta * rotSpeed * 0.6;
      ring3.rotation.z += delta * rotSpeed * 0.4;

      // Orbit dots
      const a1 = elapsed * rotSpeed * 1.2;
      dot1.position.set(Math.cos(a1) * 1.45, Math.sin(a1) * 1.45, 0.05);

      const a2 = -elapsed * rotSpeed * 0.9;
      dot2.position.set(Math.cos(a2) * 1.85, Math.sin(a2) * 1.85, 0.05);

      const a3 = elapsed * rotSpeed * 0.7 + Math.PI;
      dot3.position.set(Math.cos(a3) * 2.25, Math.sin(a3) * 2.25, 0.05);

      // Orbit floating tag sprites
      tagSprites.forEach((item) => {
        const curAngle = item.angle + elapsed * rotSpeed * 0.35;
        const rad = 2.45 + (hoverRef.current ? 0.2 : 0);
        item.sprite.position.set(Math.cos(curAngle) * rad, Math.sin(curAngle) * rad, 0.1);
      });

      // Subtle wobble of the whole badge
      badgeGroup.rotation.x = Math.sin(elapsed * 1.2) * 0.12;
      badgeGroup.rotation.y = Math.cos(elapsed * 1.0) * 0.14;

      // Camera distance on hover
      const targetCamZ = hoverRef.current ? 5.8 : 6.2;
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4, delta);

      emeraldLight.intensity = hoverRef.current ? 5.5 : 3.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      centerDiscGeo.dispose();
      centerDiscMat.dispose();
      emblemGeo.dispose();
      emblemMat.dispose();
      emblemTexture.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      dotGeo.dispose();
      dotMat1.dispose();
      dotMat2.dispose();

      tagSprites.forEach((t) => {
        t.tex.dispose();
        t.mat.dispose();
      });

      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-64 h-64 mx-auto rounded-full border-2 border-[#9AB088]/40 flex items-center justify-center p-4 bg-emerald-950/20 backdrop-blur-md">
        <span className="text-sm font-semibold text-[#C3D7AE] text-center">
          VIP Community Badge · Live 1:1
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[420px] h-[380px] sm:h-[420px] mx-auto flex items-center justify-center pointer-events-none">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};
