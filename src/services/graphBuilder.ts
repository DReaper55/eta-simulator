import { Road } from "../data/redux/reducers/roadReducer";
import { store } from "../data/redux/store/reduxStore";


// ..............................................
// This function constructs a graph representation 
// of the roads in the application. The graph is 
// represented as an adjacency list, where the 
// keys are string identifiers for road nodes, 
// and the values are objects representing 
// connected nodes and their distances.
// ..............................................
export function buildGraph() {
    // Retrieve the list of roads from the Redux store
    const roads = store.getState().roads.list;
  
    // Initialize an empty graph as an adjacency list
    const graph: { [key: string]: { [key: string]: number } } = {};
  
    // Loop through each road to populate the graph
    roads.forEach((road: Road) => {
      // Create string representations of the start and end points of the road
      const start = `${road.start[0]}_${road.start[2]}`;
      const end = `${road.end[0]}_${road.end[2]}`;
  
      // Ensure both nodes (start and end) exist in the graph
      if (!graph[start]) graph[start] = {};
      if (!graph[end]) graph[end] = {};
  
      // Extract coordinates for easier reference
      const endX = road.end[0];
      const startX = road.start[0];
      const endZ = road.end[2];
      const startZ = road.start[2];
  
      // Calculate the length of the road using the Euclidean distance formula
      const length = Math.sqrt(
        Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2)
      );
  
      // Add bidirectional edges between the start and end points
      graph[start][end] = length; // Edge from start to end
      graph[end][start] = length; // Edge from end to start
    });
  
    // Return the constructed graph
    return graph;
}
  

// ..............................................
// This function implements Dijkstra's Algorithm 
// to find the shortest path between two nodes 
// (start and end) in a weighted graph. The graph 
// is represented as an adjacency list where each 
// node points to its neighbors with associated 
// edge weights.
// ..............................................
export function findShortestPath(
    graph: { [key: string]: { [key: string]: number } }, 
    start: string, 
    end: string
  ) {
      // Store the shortest distance to each node from the start
      const distances: { [key: string]: number } = {};
  
      // Store the previous node for reconstructing the shortest path
      const previous: { [key: string]: string | null } = {};
  
      // Set of nodes that have already been processed
      const visited: Set<string> = new Set();
  
      // Nodes to process, initialized with the starting node
      const queue: string[] = [];
  
      // Initialize distances and previous for all nodes
      Object.keys(graph).forEach((node) => {
          distances[node] = Infinity; // Default to infinity
          previous[node] = null;     // No previous node yet
      });
  
      // Distance to the starting node is 0
      distances[start] = 0;
      queue.push(start);
  
      // While there are nodes left to process
      while (queue.length > 0) {
          // Sort the queue based on distances (shortest distance first)
          const current = queue.sort((a, b) => distances[a] - distances[b]).shift()!;
  
          // If the current node is the destination, stop processing
          if (current === end) break;
  
          // Mark the current node as visited
          visited.add(current);
  
          // Process each neighbor of the current node
          Object.entries(graph[current]).forEach(([neighbor, weight]) => {
              // Skip if the neighbor has already been visited
              if (visited.has(neighbor)) return;
  
              // Calculate the new distance to the neighbor
              const newDist = distances[current] + weight;
  
              // If this distance is shorter than the known distance, update it
              if (newDist < distances[neighbor]) {
                  distances[neighbor] = newDist;  // Update the shortest distance
                  previous[neighbor] = current;  // Set the current node as the predecessor
              }
  
              // Add the neighbor to the queue if it's not already in it
              if (!queue.includes(neighbor)) queue.push(neighbor);
          });
      }
  
      // Reconstruct the shortest path by backtracking from the end node
      const path: string[] = [];
      let currentNode: string | null = end;
  
      while (currentNode) {
          path.unshift(currentNode);           // Add the current node to the path
          currentNode = previous[currentNode]; // Move to the previous node
      }
  
      return path; // Return the reconstructed path as an array of node keys
  }  
  