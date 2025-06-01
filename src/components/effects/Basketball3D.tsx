
import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const BasketballMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Create basketball texture programmatically
  const createBasketballTexture = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;

    if (ctx) {
      // Base orange color
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 0, 512, 512);

      // Draw basketball seams
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      
      // Vertical seam
      ctx.beginPath();
      ctx.moveTo(256, 0);
      ctx.lineTo(256, 512);
      ctx.stroke();

      // Horizontal seam
      ctx.beginPath();
      ctx.moveTo(0, 256);
      ctx.lineTo(512, 256);
      ctx.stroke();

      // Curved seams
      ctx.beginPath();
      ctx.arc(256, 256, 200, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(256, 256, 150, 0, Math.PI * 2);
      ctx.stroke();

      // Add texture dots for grip
      ctx.fillStyle = '#654321';
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  const basketballTexture = createBasketballTexture();

  // Auto-rotation and interactions
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle auto-rotation
      if (!clicked) {
        meshRef.current.rotation.y += 0.005;
        meshRef.current.rotation.x += 0.002;
      }

      // Bounce animation on hover
      if (hovered) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1;
      } else {
        meshRef.current.position.y = 0;
      }

      // Spin faster when clicked (brief effect)
      if (clicked) {
        meshRef.current.rotation.y += 0.1;
        meshRef.current.rotation.x += 0.05;
      }
    }
  });

  // Reset click effect after 2 seconds
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => setClicked(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={0.4} />
      
      {/* Main Directional Light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      
      {/* Yellow rim light for BaseLine branding */}
      <pointLight
        position={[-3, 2, 4]}
        color="#FFD700"
        intensity={0.3}
      />

      {/* Basketball */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(true)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhongMaterial
          map={basketballTexture}
          shininess={10}
          specular={new THREE.Color(0x111111)}
        />
      </mesh>

      {/* Subtle shadow plane */}
      <mesh
        position={[0, -2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[8, 8]} />
        <shadowMaterial opacity={0.2} />
      </mesh>

      {/* Orbit Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate={false}
        autoRotateSpeed={1}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
      />
    </>
  );
};

const Basketball3D = () => {
  return (
    <div className="w-full h-96 relative">
      <Canvas
        shadows
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <BasketballMesh />
      </Canvas>
    </div>
  );
};

export default Basketball3D;
