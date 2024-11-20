import { Graph, astar } from "javascript-astar";

export const getPath = (
  grid: number[][],
  start: [number, number],
  end: [number, number]
): [number, number][] => {
  const graph = new Graph(grid); // Convert grid to graph
  const startNode = graph.grid[start[0]][start[1]];
  const endNode = graph.grid[end[0]][end[1]];
  
  // Compute path
  const path = astar.search(graph, startNode, endNode);

  // Return path coordinates
  return path.map((node) => [node.x, node.y]);
};
