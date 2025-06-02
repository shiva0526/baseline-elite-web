import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const BasketballMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Create enhanced basketball texture with dark theme
  const createBasketballTexture = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;

    if (ctx) {
      // Create radial gradient for depth
      const gradient = ctx.createRadialGradient(400, 300, 50, 512, 512, 500);
      gradient.addColorStop(0, '#B8621F'); // Lighter orange in center
      gradient.addColorStop(0.6, '#8B4513'); // Main dark orange
      gradient.addColorStop(1, '#5D2F0A'); // Darker edges

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);

      // Add basketball seam pattern
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      
      // Main vertical seams
      ctx.beginPath();
      ctx.moveTo(512, 0);
      ctx.lineTo(512, 1024);
      ctx.stroke();

      // Horizontal center seam
      ctx.beginPath();
      ctx.moveTo(0, 512);
      ctx.lineTo(1024, 512);
      ctx.stroke();

      // Curved seams for authentic basketball look
      ctx.beginPath();
      ctx.arc(512, 512, 300, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(512, 512, 200, 0, Math.PI * 2);
      ctx.stroke();

      // Add smaller curved lines for detail
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = 512 + Math.cos(angle) * 100;
        const y1 = 512 + Math.sin(angle) * 100;
        const x2 = 512 + Math.cos(angle) * 250;
        const y2 = 512 + Math.sin(angle) * 250;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Add realistic texture dots for grip
      ctx.fillStyle = '#3D1A07';
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = Math.random() * 1.5 + 0.5;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add subtle brand color highlights
      ctx.fillStyle = 'rgba(247, 208, 70, 0.1)';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 1024;
        const radius = Math.random() * 2 + 1;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  const basketballTexture = createBasketballTexture();

  // Enhanced animations and interactions
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      
      // Continuous slow rotation
      if (!clicked) {
        meshRef.current.rotation.y += 0.008;
        meshRef.current.rotation.x += 0.003;
      }

      // Gentle floating animation
      const baseY = hovered ? 0.2 : 0;
      meshRef.current.position.y = baseY + Math.sin(time * 1.5) * 0.1;

      // Scale effect on hover
      const targetScale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Faster spin when clicked
      if (clicked) {
        meshRef.current.rotation.y += 0.15;
        meshRef.current.rotation.x += 0.08;
      }
    }
  });

  // Reset click effect after animation
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => setClicked(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  return (
    <>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.3} color="#ffffff" />
      
      {/* Main directional light with shadows */}
      <directionalLight
        position={[8, 8, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* BaseLine brand yellow rim light */}
      <pointLight
        position={[-4, 3, 6]}
        color="#F7D046"
        intensity={0.8}
        distance={10}
      />

      {/* Additional orange accent light */}
      <pointLight
        position={[6, -2, 4]}
        color="#FF8C00"
        intensity={0.4}
        distance={8}
      />

      {/* Basketball mesh with enhanced material */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'grab';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          setClicked(true);
          document.body.style.cursor = 'grabbing';
        }}
        onPointerUp={(e) => {
          e.stopPropagation();
          document.body.style.cursor = hovered ? 'grab' : 'default';
        }}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshPhongMaterial
          map={basketballTexture}
          shininess={8}
          specular={new THREE.Color(0x222222)}
          bumpMap={basketballTexture}
          bumpScale={0.02}
        />
      </mesh>

      {/* Enhanced shadow plane */}
      <mesh
        position={[0, -3, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[12, 12]} />
        <shadowMaterial opacity={0.3} color="#000000" />
      </mesh>

      {/* Orbit Controls with enhanced settings */}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        autoRotate={false}
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.2}
        rotateSpeed={0.8}
      />
    </>
  );
};

const Basketball3D = () => {
  return (
    <div className="w-full h-96 relative">
      <Canvas
        shadows
        camera={{ 
          position: [0, 2, 7], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true
        }}
        dpr={[1, 2]}
      >
        <BasketballMesh />
      </Canvas>
    </div>
  );
};

export default Basketball3D;
