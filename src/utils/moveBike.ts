import { Graph, astar } from "javascript-astar";

const cityGrid = [
  [1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1],
];

const graph = new Graph(cityGrid);
const start = graph.grid[0][0];
const end = graph.grid[4][4];
const path = astar.search(graph, start, end);

console.log("Path:", path);

const worldPath = path.map(node => [node.x * 10, 0, node.y * 10]); // Convert to world coordinates

const bike = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshStandardMaterial({ color: "red" })
);

scene.add(bike);

const moveBike = (path, speed) => {
  let currentIndex = 0;
  const animate = () => {
    if (currentIndex < path.length - 1) {
      const current = path[currentIndex];
      const next = path[currentIndex + 1];

      const progress = (Date.now() % 1000) / 1000;
      const x = current[0] + progress * (next[0] - current[0]);
      const z = current[2] + progress * (next[2] - current[2]);

      bike.position.set(x, 0, z);

      if (progress >= 1) currentIndex++;
    }
    requestAnimationFrame(animate);
  };

  animate();
};

moveBike(worldPath, 0.01);
