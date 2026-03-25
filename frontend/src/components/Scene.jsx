import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Dot from './Dot';
import users from '../data/users';

function AutoRotate() {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {users.map((user) => (
        <Dot key={user.id} user={user} />
      ))}
    </group>
  );
}

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 60 }}
      style={{ background: '#050510', width: '100vw', height: '100vh' }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#ffffff" />

      <AutoRotate />

      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={9}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        makeDefault
      />
    </Canvas>
  );
}
