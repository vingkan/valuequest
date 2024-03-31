import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MOUSE, Mesh } from 'three'
import { Html, OrbitControls } from '@react-three/drei';
import '../styles/GameMap.css';

type GameTooltipProps = {
  text: string
  height: number
}

function GameTooltip({ text, height = 0 }: GameTooltipProps) {
  const position: [number, number, number] = [0, 0, height]
  const rotation: [number, number, number] = [Math.PI / 2, Math.PI / 4, 0]
  return (
    <Html position={position} rotation={rotation} transform occlude>
      <div className="game-tooltip">{text}</div>
    </Html>
  )
}

function MeshWithTooltip({ children, position, text, height }) {
  const { gl } = useThree()
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    gl.domElement.style.cursor = hovered ? 'pointer' : 'auto'

    return () => {
      gl.domElement.style.cursor = 'auto'
    }
  }, [gl, hovered])

  return (
    <mesh
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child
        return React.cloneElement(child, {...{ hovered }})
      })}
      {hovered && <GameTooltip text={text} height={height} />}
    </mesh>
  )
}

enum Axis {
  X = "x",
  Y = "y",
}

type PacingBoxProps = {
  size: [number, number, number]
  position: [number, number, number]
  color: string
  initialIsGoingForward: boolean
  axis: Axis
  range: [number, number]
  speed: number
}

function clampValue(value: number, current: number, next: number) {
  const max = Math.max(current, next)
  const min = Math.min(current, next)
  return Math.min(Math.max(value, min), max)
}

function PacingBox({
  size,
  position,
  color,
  initialIsGoingForward,
  axis,
  range,
  speed,
}: PacingBoxProps) {
  const meshRef = useRef<Mesh>(null);
  const [isGoingForward, setIsGoingForward] = useState<boolean>(
    initialIsGoingForward
  );

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const value = meshRef.current.position?.[axis]
    if (value <= range[0]) {
      setIsGoingForward(true)
    } else if (value >= range[1]) {
      setIsGoingForward(false)
    }
    const rate = speed * delta
    const progress = isGoingForward ? rate : -rate
    const newValue = value + progress
    const clampedValue = clampValue(newValue, range[0], range[1])
    meshRef.current.position[axis] = clampedValue
  });

  return (
    <mesh ref={meshRef} position={position} >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

enum Direction {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right"
}

type LappingBoxProps = {
  size: [number, number, number]
  position: [number, number, number]
  color: string
  initialDirection: Direction
  lapSize: number
  speed: number
}

function LappingBox({
  size,
  position,
  color,
  initialDirection,
  lapSize,
  speed,
}: LappingBoxProps) {
  const meshRef = useRef<Mesh>(null)
  const [direction, setDirection] = useState<Direction>(initialDirection)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    switch (direction) {
      case Direction.RIGHT:
        meshRef.current.position.x = clampValue(
          meshRef.current.position.x + speed * delta, -lapSize, lapSize)
        if (meshRef.current.position.x >= lapSize) setDirection(Direction.DOWN)
        break
      case Direction.DOWN:
        meshRef.current.position.y = clampValue(
          meshRef.current.position.y - speed * delta, -lapSize, lapSize)
        if (meshRef.current.position.y <= -lapSize) setDirection(Direction.LEFT)
        break;
      case Direction.LEFT:
        meshRef.current.position.x = clampValue(
          meshRef.current.position.x - speed * delta, -lapSize, lapSize)
        if (meshRef.current.position.x <= -lapSize) setDirection(Direction.UP)
        break
      case Direction.UP:
        meshRef.current.position.y = clampValue(
          meshRef.current.position.y + speed * delta, -lapSize, lapSize)
        if (meshRef.current.position.y >= lapSize) setDirection(Direction.RIGHT)
        break
      default:
        setDirection(initialDirection)
    }
  })

  return (
    <mesh ref={meshRef} position={position} >
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Hospital({ hovered = false }) {
  const buildingColor = hovered ? "lightblue" : "white"
  return (
    <>
      {/* Main building */}
      <mesh position={[0, 0, 0.75]}>
        <boxGeometry args={[2, 2, 1.5]} />
        <meshStandardMaterial color={buildingColor} />
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
  const speed = 3
  const boxSize = 0.25

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
      <MeshWithTooltip position={[0, 0, 0]} text={"Hospital"} height={2.5} >
        <Hospital />
      </MeshWithTooltip>
      <Tree position={[1.5, -1.5, 0]} />
      <Tree position={[-1.5, -1.5, 0]} />
      <PacingBox
        position={[0, -2, boxSize / 2]}
        size={[boxSize, boxSize, boxSize]}
        color={"#05477d"}
        initialIsGoingForward={true}
        axis={Axis.Y}
        range={[-4.5, 0]}
        speed={speed}
      />
      <LappingBox
        position={[-4, 4, boxSize / 2]}
        size={[boxSize, boxSize, boxSize]}
        color={"#05477d"}
        initialDirection={Direction.RIGHT}
        lapSize={4}
        speed={speed}
      />
      <Ground position={[0, 0, 0]} size={[10, 10]} color={"#97fa61"} />
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={false}
        mouseButtons={{ LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY }}
        enableDamping={false}
        zoomSpeed={1}
        panSpeed={1}
      />
    </Canvas>
  );
};
