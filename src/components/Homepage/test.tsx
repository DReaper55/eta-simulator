import { useFrame } from '@react-three/fiber';
import { useState, useEffect } from 'react';

const Bike = ({ path }: { path: [number, number][] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState<[number, number, number]>(
    path.length > 0 ? gridToWorld(path[0][0], path[0][1]) : [0, 0.5, 0]
  );

  useEffect(() => {
    if (path.length > 0) {
      setPosition(gridToWorld(path[0][0], path[0][1]));
      setCurrentIndex(0);
    }
  }, [path]);

  useFrame(() => {
    if (path.length === 0) return;

    const target = gridToWorld(path[currentIndex][0], path[currentIndex][1]);
    const [x, y, z] = position;

    // Calculate step toward target
    const dx = target[0] - x;
    const dz = target[2] - z;

    if (Math.abs(dx) > 0.1 || Math.abs(dz) > 0.1) {
      // Move stepwise toward the target
      setPosition([
        x + Math.sign(dx) * 0.1,
        y,
        z + Math.sign(dz) * 0.1,
      ]);
    } else {
      // Target reached, move to the next point
      const nextIndex = currentIndex + 1;
      if (nextIndex < path.length) {
        setCurrentIndex(nextIndex);
      } else {
        // Loop back to the start of the path
        setCurrentIndex(0);
        setPosition(gridToWorld(path[0][0], path[0][1]));
      }
    }
  });

  return (
    <mesh position={position}>
      <boxGeometry args={[0.5, 0.5, 1]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

const gridToWorld = (row: number, col: number): [number, number, number] => [
  col,    // x-coordinate
  0.5,    // y-coordinate (elevation)
  row,    // z-coordinate
];

export default Bike;
