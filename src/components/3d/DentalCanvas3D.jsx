import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * DentalCanvas3D - Interactive 3D Medical/Dental Background (Smokey Monochrome & White Edition)
 * Renders a stylized 3D Enamel Tooth model, floating silver/white bio-luminescent particles, 
 * orbital platinum crystal rings, and dynamic monochromatic studio lighting with mouse parallax.
 */
export default function DentalCanvas3D({ 
  mode = 'cinematic', // 'cinematic' | 'wireframe' | 'minimal' | 'off'
  rotationSpeed = 1,
  showControls = false 
}) {
  const containerRef = useRef(null);
  const [wireframeMode, setWireframeMode] = useState(false);
  const [particleDensity, setParticleDensity] = useState('high'); // 'high' | 'low'
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (mode === 'off' || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a0f, 0.022);

    // --- Camera Setup ---
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    // --- Renderer Setup ---
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- Smokey Monochromatic Studio Lighting ---
    const ambientLight = new THREE.AmbientLight(0x272b35, 2.0);
    scene.add(ambientLight);

    // Crisp Pure White Key Light
    const primaryLight = new THREE.PointLight(0xffffff, 4.5, 32);
    primaryLight.position.set(6, 6, 8);
    scene.add(primaryLight);

    // Platinum Silver Fill Light
    const accentLight = new THREE.PointLight(0xcbd5e1, 3.8, 30);
    accentLight.position.set(-8, -4, 6);
    scene.add(accentLight);

    // High-Contrast Studio Rim Light
    const rimLight = new THREE.DirectionalLight(0xf8fafc, 3.0);
    rimLight.position.set(0, 8, -5);
    scene.add(rimLight);

    // Soft Smokey Ground Light
    const smokeyGroundLight = new THREE.PointLight(0x64748b, 2.5, 25);
    smokeyGroundLight.position.set(0, -6, 4);
    scene.add(smokeyGroundLight);

    // --- Create Stylized Anatomical 3D Tooth Group ---
    const toothGroup = new THREE.Group();

    // 1. Crown Geometry (Organic curved composite shape)
    const crownCurve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(0, 2.2, 0),
      new THREE.Vector3(1.8, 1.8, 0),
      new THREE.Vector3(1.5, -0.2, 0),
      new THREE.Vector3(0.9, -1.0, 0)
    );
    const crownPoints = crownCurve.getPoints(24);
    const crownGeo = new THREE.LatheGeometry(crownPoints, 48);

    // Frosted Titanium Crystal Enamel Material
    const enamelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf8fafc,
      roughness: 0.15,
      metalness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transmission: 0.72, // deep glass / frosted crystal enamel depth
      ior: 1.52,
      thickness: 1.6,
      wireframe: wireframeMode,
      transparent: true,
      opacity: 0.95,
      reflectivity: 0.95
    });

    const crownMesh = new THREE.Mesh(crownGeo, enamelMaterial);
    crownMesh.position.y = 0.5;
    crownMesh.scale.set(1.4, 1.3, 1.4);
    toothGroup.add(crownMesh);

    // 2. Anatomical Cusps (4 natural molar cusps)
    const cuspPositions = [
      { x: 0.9, y: 3.1, z: 0.9, r: 0.58 },
      { x: -0.9, y: 3.1, z: 0.9, r: 0.55 },
      { x: 0.9, y: 3.1, z: -0.9, r: 0.54 },
      { x: -0.9, y: 3.1, z: -0.9, r: 0.58 }
    ];

    cuspPositions.forEach((pos) => {
      const cuspGeo = new THREE.SphereGeometry(pos.r, 32, 24);
      cuspGeo.scale(1, 1.25, 1);
      const cuspMesh = new THREE.Mesh(cuspGeo, enamelMaterial);
      cuspMesh.position.set(pos.x, pos.y, pos.z);
      toothGroup.add(cuspMesh);
    });

    // 3. Dual Tooth Roots (Mesial & Distal Roots)
    const rootPointsMesial = [
      new THREE.Vector2(0.9, -0.6),
      new THREE.Vector2(0.7, -1.8),
      new THREE.Vector2(0.35, -3.2),
      new THREE.Vector2(0.08, -4.2)
    ];
    const rootGeoMesial = new THREE.LatheGeometry(rootPointsMesial, 32);
    
    const rootMesh1 = new THREE.Mesh(rootGeoMesial, enamelMaterial);
    rootMesh1.position.set(0.9, -0.4, 0.2);
    rootMesh1.rotation.z = -0.12;
    toothGroup.add(rootMesh1);

    const rootMesh2 = new THREE.Mesh(rootGeoMesial, enamelMaterial);
    rootMesh2.position.set(-0.9, -0.4, -0.2);
    rootMesh2.rotation.z = 0.14;
    toothGroup.add(rootMesh2);

    // 4. Central Energy Core (Floating frosted white geometric core)
    const coreGeo = new THREE.IcosahedronGeometry(0.7, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.y = 1.0;
    toothGroup.add(coreMesh);

    // Initial positioning of tooth
    toothGroup.position.set(4.2, -0.2, 0);
    toothGroup.scale.set(0.85, 0.85, 0.85);
    scene.add(toothGroup);

    // --- Orbital Monochromatic Rings ---
    const ringGroup = new THREE.Group();
    const ringMat1 = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.38 
    });
    const ringMat2 = new THREE.MeshBasicMaterial({ 
      color: 0x94a3b8, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.28 
    });

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(4.6, 0.025, 16, 100), ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(5.4, 0.02, 16, 100), ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    ringGroup.add(ring2);

    toothGroup.add(ringGroup);

    // --- Dynamic Silver & White Bio-Particle Cloud ---
    const particleCount = particleDensity === 'high' ? 950 : 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    const colorPureWhite = new THREE.Color(0xffffff);
    const colorPlatinum = new THREE.Color(0xe2e8f0);
    const colorSilverMist = new THREE.Color(0x94a3b8);
    const colorSmokeySlate = new THREE.Color(0x64748b);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      scales[i] = Math.random() * 2.2 + 0.5;

      const choice = Math.random();
      let c = colorPureWhite;
      if (choice < 0.35) c = colorPlatinum;
      else if (choice < 0.7) c = colorSilverMist;
      else if (choice < 0.9) c = colorSmokeySlate;

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Monochromatic Particle Texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.35, 'rgba(226, 232, 240, 0.85)');
    grad.addColorStop(0.75, 'rgba(148, 163, 184, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const pTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.22,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- Mouse Parallax & Interaction ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouseX = (e.clientX - windowHalfX) * 0.0012;
      mouseY = (e.clientY - windowHalfY) * 0.0012;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      if (w < 900) {
        toothGroup.position.set(0, -2.5, -2);
        toothGroup.scale.set(0.65, 0.65, 0.65);
      } else {
        toothGroup.position.set(4.2, -0.2, 0);
        toothGroup.scale.set(0.85, 0.85, 0.85);
      }
    };

    window.addEventListener('resize', onResize);
    onResize();

    // --- Animation Loop ---
    let clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Mouse Smooth Damping
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 3;
      camera.position.y = -targetY * 3;
      camera.lookAt(0, 0, 0);

      // Tooth Rotation & Levitation
      if (isRotating) {
        toothGroup.rotation.y = elapsedTime * 0.35 * rotationSpeed;
        toothGroup.rotation.x = Math.sin(elapsedTime * 0.5) * 0.15;
        toothGroup.position.y = (window.innerWidth < 900 ? -2.5 : -0.2) + Math.sin(elapsedTime * 1.2) * 0.25;
      }

      // Orbital Rings Rotation
      ring1.rotation.z = elapsedTime * 0.25;
      ring2.rotation.x = -elapsedTime * 0.3;
      coreMesh.rotation.y = -elapsedTime * 0.8;

      // Organic Wave Motion on Particles
      const posArray = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = posArray[i3];
        posArray[i3 + 1] += Math.sin(elapsedTime * 0.8 + x * 0.5) * 0.003;
      }
      particleGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = elapsedTime * 0.03;

      // Studio Lights reactive movement
      primaryLight.position.x = 6 + Math.sin(elapsedTime * 0.7) * 3;
      primaryLight.position.y = 6 + Math.cos(elapsedTime * 0.5) * 2;
      accentLight.position.x = -8 + Math.cos(elapsedTime * 0.6) * 3;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      crownGeo.dispose();
      enamelMaterial.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [mode, rotationSpeed, wireframeMode, particleDensity, isRotating]);

  if (mode === 'off') return null;

  return (
    <div className="dental-3d-wrapper">
      <div ref={containerRef} className="dental-3d-canvas-container" />
      
      {/* 3D Ambient Smokey Overlay Grid & Vignette */}
      <div className="dental-3d-overlay" />

      {/* Floating 3D Interactive HUD Pill */}
      {showControls && (
        <div className="dental-3d-controls-hud">
          <button 
            type="button"
            className={`hud-btn ${wireframeMode ? 'active' : ''}`}
            onClick={() => setWireframeMode(!wireframeMode)}
            title="Toggle Hologram / Wireframe Mode"
          >
            <span className="hud-icon">◻️</span>
            <span>{wireframeMode ? 'Solid Enamel' : 'Holo Titanium'}</span>
          </button>

          <button 
            type="button"
            className={`hud-btn ${isRotating ? 'active' : ''}`}
            onClick={() => setIsRotating(!isRotating)}
            title="Pause / Resume Rotation"
          >
            <span className="hud-icon">{isRotating ? '⏸️' : '▶️'}</span>
            <span>{isRotating ? 'Live' : 'Paused'}</span>
          </button>

          <button 
            type="button"
            className="hud-btn"
            onClick={() => setParticleDensity(p => p === 'high' ? 'low' : 'high')}
            title="Toggle Particle Density"
          >
            <span className="hud-icon">✨</span>
            <span>{particleDensity === 'high' ? 'High FX' : 'Eco FX'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
