
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const RotatingBasketball = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle rotation and floating motion
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.015;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
    
    if (lightRef.current) {
      // Pulsing glow effect
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <group>
      {/* Main basketball */}
      <mesh ref={meshRef}>
        <Sphere args={[1.5, 32, 32]}>
          <meshStandardMaterial 
            color="#ff6b35"
            roughness={0.4}
            metalness={0.1}
            emissive="#ff4400"
            emissiveIntensity={0.1}
          />
        </Sphere>
      </mesh>
      
      {/* Basketball lines */}
      <mesh position={[0, 0, 1.51]}>
        <ringGeometry args={[0.1, 0.12, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Glow light */}
      <pointLight 
        ref={lightRef}
        position={[0, 0, 3]} 
        color="#F7D046" 
        intensity={2}
        distance={10}
      />
    </group>
  );
};

const Basketball3D = () => {
  return (
    <motion.div 
      className="w-full h-96 flex items-center justify-center relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Glow effect background */}
      <div className="absolute inset-0 bg-gradient-radial from-baseline-yellow/20 via-transparent to-transparent rounded-full blur-xl" />
      
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RotatingBasketball />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
        />
      </Canvas>
    </motion.div>
  );
};

export default Basketball3D;
