import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls, Plane } from "@react-three/drei";
import BikeSimulation from "./Bike";

const stateGrid = [
  {
    name: "City1",
    grid: [
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1],
    ],
    position: [0, 0],
  },
  {
    name: "City2",
    grid: [
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
    ],
    position: [10, 0],
  },
  {
    name: "City3",
    grid: [
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
    position: [0, 10],
  },
  {
    name: "City4",
    grid: [
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
    position: [10, 10],
  },
];

// Create roads dynamically between cities
const Roads = ({ cities }: { cities: { name: string; position: number[] }[] }) => {
    const roads = [];
    for (let i = 0; i < cities.length; i++) {
      for (let j = i + 1; j < cities.length; j++) {
        const [x1, z1] = cities[i].position;
        const [x2, z2] = cities[j].position;
        if (Math.abs(x1 - x2) === 10 || Math.abs(z1 - z2) === 10) {
          // Horizontal or vertical roads
          const isHorizontal = x1 !== x2;
          const roadWidth = isHorizontal ? Math.abs(x1 - x2) : 1;
          const roadHeight = isHorizontal ? 1 : Math.abs(z1 - z2);
          const midX = (x1 + x2) / 2;
          const midZ = (z1 + z2) / 2;
  
          roads.push(
            <Plane
              key={`${i}-${j}`}
              position={[midX, -0.5, midZ]}
              rotation={isHorizontal ? [-Math.PI / 2, 0, 0] : [-Math.PI / 2, 0, Math.PI / 2]}
              args={[roadWidth, roadHeight]}
            >
              <meshStandardMaterial color="gray" />
            </Plane>
          );
        }
      }
    }
    return <>{roads}</>;
  };
  
  const City = ({
    grid,
    offset,
  }: {
    grid: number[][];
    offset: [number, number];
  }) => {
    return (
      <>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            cell === 1 ? (
              <Box
                key={`${rowIndex}-${colIndex}`}
                position={[colIndex + offset[0], 0, rowIndex + offset[1]]}
                args={[1, 1, 1]}
              >
                <meshStandardMaterial color="blue" />
              </Box>
            ) : null
          )
        )}
      </>
    );
  };

const StateGrid = () => {
  return (
    <Canvas
      style={{ height: "90vh" }}
      camera={{ position: [5, 10, 10], fov: 50 }}
    >
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* Controls */}
      <OrbitControls />

      {stateGrid.map((city, index) => (
        <City
          key={index}
          grid={city.grid}
          offset={city.position as [number, number]}
        />
      ))}

    <Roads cities={stateGrid} />

    <BikeSimulation stateGrid={stateGrid} />

    </Canvas>
  );
};

export default StateGrid;
