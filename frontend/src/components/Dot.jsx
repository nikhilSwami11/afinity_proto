import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { DOMAIN_COLORS } from '../data/users';
import useStore from '../store/useStore';

export default function Dot({ user }) {
  const meshRef = useRef();
  const ringRef = useRef();
  const pointLightRef = useRef();
  const [hovered, setHovered] = useState(false);
  const setSelectedUser = useStore((s) => s.setSelectedUser);

  const color = user.isYou ? '#FFFFFF' : DOMAIN_COLORS[user.domain];
  const baseScale = user.isYou ? 1.5 : 1;

  // Per-dot random float offsets (stable across renders)
  const floatRef = useRef({
    offset: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.4,
    amp: 0.04 + Math.random() * 0.04,
  });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const { offset, speed, amp } = floatRef.current;

    // Subtle float
    meshRef.current.position.y = user.xyz[1] + Math.sin(t * speed + offset) * amp;
    meshRef.current.position.x = user.xyz[0] + Math.cos(t * speed * 0.7 + offset) * amp * 0.5;

    // Pulse for "You" dot
    if (user.isYou) {
      const pulse = 1 + Math.sin(t * 1.5) * 0.08;
      meshRef.current.scale.setScalar(baseScale * pulse * (hovered ? 1.3 : 1));
      if (ringRef.current) {
        ringRef.current.scale.setScalar(pulse * 1.1);
      }
    } else {
      const targetScale = hovered ? baseScale * 1.35 : baseScale;
      meshRef.current.scale.setScalar(
        meshRef.current.scale.x + (targetScale - meshRef.current.scale.x) * 0.12
      );
    }
  });

  return (
    <group position={user.xyz}>
      {/* Point light for glow feel */}
      <pointLight
        ref={pointLightRef}
        color={color}
        intensity={hovered ? 2.5 : 1.2}
        distance={1.2}
      />

      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
        onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
      >
        <sphereGeometry args={[0.055, 20, 20]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.9 : 0.5}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>

      {/* Purple ring for "You" */}
      {user.isYou && (
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.008, 12, 60]} />
          <meshStandardMaterial
            color="#7F77DD"
            emissive="#7F77DD"
            emissiveIntensity={0.8}
            transparent
            opacity={0.75}
          />
        </mesh>
      )}

      {/* Hover label */}
      {hovered && (
        <Html
          center
          distanceFactor={6}
          style={{ pointerEvents: 'none' }}
          position={[0, 0.14, 0]}
        >
          <div
            style={{
              background: 'rgba(13, 13, 26, 0.85)',
              border: `1px solid ${color}55`,
              borderRadius: '6px',
              padding: '4px 10px',
              color: color,
              fontSize: '11px',
              fontFamily: 'system-ui, sans-serif',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(4px)',
              letterSpacing: '0.03em',
            }}
          >
            {user.name}
          </div>
        </Html>
      )}
    </group>
  );
}
