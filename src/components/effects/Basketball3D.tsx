
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import * as THREE from 'three';

const RotatingBasketball = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <motion.mesh
      ref={meshRef}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1 }}
    >
      <Sphere args={[2, 32, 32]}>
        <meshStandardMaterial
          color="#ff6b35"
          roughness={0.3}
          metalness={0.1}
        />
      </Sphere>
    </motion.mesh>
  );
};

const Basketball3D = () => {
  return (
    <div className="w-full h-96">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <RotatingBasketball />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Basketball3D;
