import { useEffect, useRef, useState } from "react";
import { getPath } from "../../utils/getBikePath";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface BikeSimulationProps {
  stateGrid: {
    name: string;
    grid: number[][];
    position: number[];
  }[];
}

const BikeSimulation: React.FC<BikeSimulationProps> = ({ stateGrid }) => {
  const bikeRef = useRef<THREE.Mesh>(null);
  const [path, setPath] = useState<number[][]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Example: Compute path between two cities
    const startCity = stateGrid[0]; // City1
    const endCity = stateGrid[1];   // City2

    // Calculate path based on grid
    const gridPath = getPath(
      startCity.grid,
      [0, 0], // Start in City1 grid
      [4, 4]  // End in City2 grid
    );

    // Offset path to match city positions
    const offsetPath = gridPath.map(([x, z]) => [
      x + startCity.position[0],
      z + startCity.position[1],
    ]);

    setPath(offsetPath);
  }, [stateGrid]);

  // Animate bike along the path
  useFrame(() => {
    if (!bikeRef.current || path.length === 0 || currentIndex >= path.length - 1) return;

    const currentPos = path[currentIndex];
    const nextPos = path[currentIndex + 1];
    const position = bikeRef.current.position;

    position.x += (nextPos[0] - currentPos[0]) * 0.1;
    position.z += (nextPos[1] - currentPos[1]) * 0.1;

    if (Math.abs(position.x - nextPos[0]) < 0.1 && Math.abs(position.z - nextPos[1]) < 0.1) {
      setCurrentIndex((prev) => prev + 1);
    }
  });

  return (
    <mesh ref={bikeRef} position={[path[0]?.[0] || 0, 0, path[0]?.[1] || 0]}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default BikeSimulation;
