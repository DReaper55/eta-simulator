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
import { buildGraph, findShortestPath } from "../../services/graphBuilder";
import { Building } from "../../data/redux/reducers/buildingReducer";

export class BikeElement implements ElementUtils<Bike> {
  create(data: Bike): void {
    store.dispatch(addBike(data));

    const geometry = new THREE.SphereGeometry(0.2, 16, 16);

    let color = "green";

    if (data.orders.length === 2) {
      color = "blue";
    }

    if (data.orders.length === 3) {
      color = "red";
    }

    const material = new THREE.MeshStandardMaterial({ color: color });
    const bike = new THREE.Mesh(geometry, material);
    bike.name = data.id;
    bike.position.set(...data.position);
    bike.userData = { info: data.info, id: data.id, type: ElementType.Bike };
    gridCanvas.scene?.add(bike);
  }

  modify(id: string, data: Partial<Bike>): void {
    store.dispatch(modifyBike({ id, data }));
  }

  destroy(id: string): void {
    store.dispatch(removeBike(id));
  }

  private async animateBike(
    start: [number, number, number],
    end: [number, number, number],
    speed: number,
    bikeId: string
  ): Promise<void> {
    if (!gridCanvas.scene || !gridCanvas.camera || !gridCanvas.renderer) return;

    const bike = gridCanvas.scene.children.find((obj) => obj.name === bikeId);
    if (!bike) return;

    return new Promise((resolve) => {
      const startVec = new THREE.Vector3(...start);
      const endVec = new THREE.Vector3(...end);
      const direction = new THREE.Vector3()
        .subVectors(endVec, startVec)
        .normalize();
      const distance = startVec.distanceTo(endVec);
      let progress = 0;

      const animate = () => {
        if (store.getState().animations.isPaused) {
          requestAnimationFrame(animate);
          return;
        }

        if (progress < distance) {
          progress += speed;
          const newPosition = startVec
            .clone()
            .add(direction.clone().multiplyScalar(progress));

          bike.position.set(newPosition.x, newPosition.y + 0.5, newPosition.z);

          const updatedPosition = [
            newPosition.x,
            newPosition.y + 0.5,
            newPosition.z,
          ] as [number, number, number];
          store.dispatch(
            modifyBike({
              id: bikeId,
              data: {
                position: updatedPosition,
              },
            })
          );

          gridCanvas.renderer?.render(gridCanvas.scene!, gridCanvas.camera!);
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      animate();
    });
  }

  private async moveBikeAlongPath(
    buildingA: Building,
    buildingB: Building,
    speed: number,
    bikeId: string
  ): Promise<void> {
    if (!gridCanvas.scene || !gridCanvas.camera || !gridCanvas.renderer) return;

    const graph = buildGraph();
    const path = findShortestPath(
      graph,
      `${buildingA.position[0]}_${buildingA.position[2]}`,
      `${buildingB.position[0]}_${buildingB.position[2]}`
    );

    if (path.length < 2) return; // No movement if path has less than 2 points

    const splitPath: [number, number, number][] = path.map((p) => {
      const [x, z] = p.split("_").map(Number);
      return [x, 0, z];
    });

    for (let i = 0; i < splitPath.length - 1; i++) {
      const start = splitPath[i];
      const end = splitPath[i + 1];
      await this.animateBike(start, end, speed, bikeId);
    }
  }

  async moveBikeThroughOrders(bike: Bike, speed: number): Promise<void> {
    if (!bike.orders || bike.orders.length === 0) return;

    for (const [index, order] of bike.orders.entries()) {
      // Move to pickup location
      await this.moveBikeAlongPath(
        { position: bike.position } as Building,
        order.pickup,
        speed,
        bike.id
      );
      bike.position = order.pickup.position;

      // Move to drop-off location
      await this.moveBikeAlongPath(order.pickup, order.dropOff, speed, bike.id);
      bike.position = order.dropOff.position;

      console.log(`Order ${index + 1} completed.`);
    }

    console.log(`${bike.info} has completed all orders!`);
  }
}
