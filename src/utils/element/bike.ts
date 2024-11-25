import { ElementUtils } from "./elementUtils";
import * as THREE from "three";
import { store } from "../../data/redux/store/reduxStore";
import {
  addBike,
  Bike,
  modifyBike,
  removeBike,
} from "../../data/redux/reducers/bikeReducer";
import { gridCanvas } from "../canvas";
import { ElementType } from "../../constants/element";
import { buildGraph, findShortestPath } from "../buildPathGraph";
import { Building } from "../../data/redux/reducers/buildingReducer";

export class BikeElement implements ElementUtils<Bike> {
  create(data: Bike): void {
    store.dispatch(addBike(data));

    const geometry = new THREE.SphereGeometry(0.2, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: "red" });
    const bike = new THREE.Mesh(geometry, material);
    bike.name = data.id;
    bike.position.set(...data.position);
    bike.userData = { info: data.info, type: ElementType.Bike };
    gridCanvas.scene?.add(bike);
  }

  modify(id: string, data: Partial<Bike>): void {
    store.dispatch(modifyBike({ id, data }));
  }

  destroy(id: string): void {
    store.dispatch(removeBike(id));
  }

  private animateBike(
    start: [number, number, number],
    end: [number, number, number],
    speed: number,
    bikeId: string
  ) {
    if (!gridCanvas.scene || !gridCanvas.camera || !gridCanvas.renderer) return;

    // Find the bike in the scene
    const bike = gridCanvas.scene.children.find((obj) => obj.name === bikeId);
    // if (!bike) {
    //   const bikeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    //   const bikeMaterial = new THREE.MeshStandardMaterial({ color: "red" });
    //   bike = new THREE.Mesh(bikeGeometry, bikeMaterial);
    //   gridCanvas.scene.add(bike);
    // }

    if(!bike) return;

    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = new THREE.Vector3()
      .subVectors(endVec, startVec)
      .normalize();
    const distance = startVec.distanceTo(endVec);
    let progress = 0;

    const animate = () => {
      if(store.getState().animations.isPaused){
        requestAnimationFrame(animate);
        return;
      }

      if (progress < distance) {
        progress += speed;
        const newPosition = startVec
          .clone()
          .add(direction.clone().multiplyScalar(progress));
        bike.position.set(newPosition.x, newPosition.y + 0.5, newPosition.z);

        // Update bike's position in database
        const bikeDB = store.getState().bikes.list.find((b) => b.id === bikeId);
        store.dispatch(
          modifyBike({
            id: bikeId!,
            data: {
              ...bikeDB,
              position: [newPosition.x, (newPosition.y + 0.5), newPosition.z],
            },
          })
        );

        gridCanvas.renderer?.render(gridCanvas.scene!, gridCanvas.camera!);
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  moveBikeAlongPath(
    buildingA: Building,
    buildingB: Building,
    speed: number,
    bikeId: string
  ) {
    if (!gridCanvas.scene || !gridCanvas.camera || !gridCanvas.renderer) return;

    const building1 = `${buildingA.position[0]}_${buildingA.position[2]}`;
    const building2 = `${buildingB.position[0]}_${buildingB.position[2]}`;

    const graph = buildGraph();
    const path = findShortestPath(graph, building1, building2);

    if (path.length < 2) return; // No movement if path has less than 2 points

    const splitPath = [] as [number, number, number][];
    path.forEach(p => {
      const [x,z] = p.split('_').map(Number);
      const y = 0;

      splitPath.push([x, y, z])
    });

    let currentIndex = 0;

    const moveToNextSegment = () => {
      if (currentIndex >= splitPath.length - 1) return; // Reached the end of the path

      const start = splitPath[currentIndex];
      const end = splitPath[currentIndex + 1];

      this.animateBike(start, end, speed, bikeId);

      currentIndex++;

      // Wait until the current segment animation completes before starting the next
      const distance = new THREE.Vector3(...start).distanceTo(
        new THREE.Vector3(...end)
      );
      const duration = distance / speed; // Estimate time required to complete this segment

      setTimeout(moveToNextSegment, duration * 20); // Call next segment after `duration`
    };

    moveToNextSegment(); // Start moving
  }
}
