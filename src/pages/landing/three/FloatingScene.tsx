import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

const TEAL = "#168aad";
const TEAL_BRIGHT = "#52b69a";
const DEEP_BLUE = "#1e6091";
const LIME = "#d9ed92";
const MINT = "#99d98c";

interface PanelDef {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

const PANELS: PanelDef[] = [
  { position: [-1.6, 0.6, 0.2], size: [1.5, 1, 0.06], color: TEAL },
  { position: [1.5, -0.4, -0.4], size: [1.7, 1.1, 0.06], color: DEEP_BLUE },
  { position: [0.2, 1.3, -0.8], size: [1.2, 0.8, 0.06], color: LIME },
  { position: [-0.6, -1.2, 0.3], size: [1.3, 0.9, 0.06], color: MINT },
  { position: [1.9, 1.1, 0.6], size: [0.9, 0.9, 0.06], color: TEAL_BRIGHT },
];

const NODES: [number, number, number][] = [
  [-1.6, 0.6, 0.25],
  [1.5, -0.4, -0.35],
  [0.2, 1.3, -0.75],
  [-0.6, -1.2, 0.35],
  [1.9, 1.1, 0.65],
  [0, 0, 0],
];

const CONNECTIONS: [number, number][] = [
  [0, 5],
  [1, 5],
  [2, 5],
  [3, 5],
  [4, 5],
];

function GlassPanel({ position, size, color }: PanelDef) {
  return (
    <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.8} floatingRange={[-0.08, 0.08]}>
      <RoundedBox position={position} args={size} radius={0.07} smoothness={4}>
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={0.16}
          roughness={0.15}
          metalness={0.1}
          transmission={0.4}
          thickness={0.4}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </RoundedBox>
      <lineSegments position={position}>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color={color} transparent opacity={0.5} />
      </lineSegments>
    </Float>
  );
}

function DataNodes() {
  return (
    <>
      {NODES.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color={i === 5 ? TEAL_BRIGHT : LIME} />
        </mesh>
      ))}
      {CONNECTIONS.map(([a, b], i) => (
        <Line
          key={i}
          points={[NODES[a], NODES[b]]}
          color={TEAL_BRIGHT}
          lineWidth={0.6}
          transparent
          opacity={0.35}
        />
      ))}
    </>
  );
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const target = useMemo(() => new THREE.Vector2(0, 0), []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;

    target.x += (pointer.x - target.x) * 0.03;
    target.y += (pointer.y - target.y) * 0.03;
    group.current.rotation.x = target.y * 0.15;
    group.current.rotation.z = -target.x * 0.06;
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 3]} intensity={30} color={TEAL_BRIGHT} />
      <pointLight position={[-3, -2, 2]} intensity={18} color={LIME} />

      {PANELS.map((panel, i) => (
        <GlassPanel key={i} {...panel} />
      ))}
      <DataNodes />
      <Sparkles count={70} scale={5} size={1.6} speed={0.25} color={TEAL_BRIGHT} opacity={0.5} />
    </group>
  );
}

function FloatingScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 5.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene />
    </Canvas>
  );
}

export default FloatingScene;
