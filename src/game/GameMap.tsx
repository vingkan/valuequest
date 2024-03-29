import React from 'react';
import { Canvas } from '@react-three/fiber';

function Hospital() {
  return (
    <>
      {/* Main building */}
      <mesh position={[0, 0, 0.75]}>
        <boxGeometry args={[2, 2, 1.5]} />
        <meshStandardMaterial color="white" />
      </mesh>
      {/* Red cross */}
      <mesh position={[0, 0, 1.52]}>
        <boxGeometry args={[0.4, 0.1, 0.1]} />
        <meshStandardMaterial color="#ff1764" />
      </mesh>
      <mesh position={[0, 0, 1.52]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#ff1764" />
      </mesh>
      {/* Entrance */}
      <mesh position={[0, -1, 0.5]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#b6f7fc" />
      </mesh>
      {/* Hospital sign */}
      <mesh position={[0, -1, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.05]} />
        <meshStandardMaterial color="#ff1764" />
      </mesh>
      {/* Windows */}
      {/* ... (Add meshes for windows here) */}
    </>
  )
}

function Tree({ position }) {
  const [x, y, z] = position
  return (
    <>
      <mesh position={[x, y, z + 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.25, 0.5, 32]} />
        <meshStandardMaterial color="darkgreen" />
      </mesh>
      <mesh position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 32]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </>
  )
}

function Ground({ position, size, color }) {
  const [x, y, z] = position
  return (
    <mesh receiveShadow rotation={[0, 0, 0]} position={[x, y, z - 0.1]}>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export const IsometricGameMap: React.FC = () => {
  return (
    <Canvas
      orthographic
      camera={{
        position: [5, -5, 5],
        zoom: 50,
        up: [0, 0, 1],
        near: -100,
        far: 100,
      }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
      <Hospital />
      <Tree position={[1.5, -1.5, 0]} />
      <Tree position={[-1.5, -1.5, 0]} />
      <Ground position={[0, 0, 0]} size={[10, 10]} color={"#97fa61"} />
    </Canvas>
  );
};
