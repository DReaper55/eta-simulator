import { ElementUtils } from "./elementUtils";
import * as THREE from "three";
import { store } from "../../data/redux/store/reduxStore";
import { addBike, Bike, modifyBike, removeBike } from "../../data/redux/reducers/bikeReducer";
import { gridCanvas } from "../canvas";
import { ElementType } from "../../constants/element";


export class BikeElement implements ElementUtils<Bike> {
  create(data: Bike): void {
    store.dispatch(addBike(data));

    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    const material = new THREE.MeshStandardMaterial({ color: "red" });
    const bike = new THREE.Mesh(geometry, material);
    bike.name = data.id;
    bike.position.set(...data.position);
    bike.userData = {info: data.info, type: ElementType.Bike}
    gridCanvas.scene?.add(bike);
  }

  modify(id: string, data: Partial<Bike>): void {
    store.dispatch(modifyBike({id, data}));
  }

  destroy(id: string): void {
    store.dispatch(removeBike(id));
  }

  animateBike(start: [number, number, number], end: [number, number, number], speed: number, bikeId?: string) {
    if (!gridCanvas.scene || !gridCanvas.camera || !gridCanvas.renderer) return;

    // Find the bike in the scene
  let bike = gridCanvas.scene.children.find((obj) => obj.name === bikeId);
  if (!bike) {
    const bikeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const bikeMaterial = new THREE.MeshStandardMaterial({ color: "red" });
    bike = new THREE.Mesh(bikeGeometry, bikeMaterial);
    gridCanvas.scene.add(bike);
  }

    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const direction = new THREE.Vector3().subVectors(endVec, startVec).normalize();
    const distance = startVec.distanceTo(endVec);
    let progress = 0;

    const animate = () => {
      if (progress < distance) {
        progress += speed;
        const newPosition = startVec.clone().add(direction.clone().multiplyScalar(progress));
        bike.position.set(newPosition.x, (newPosition.y + .5), newPosition.z);

        // Update bike's position in database
        const bikeDB = store.getState().bikes.list.find(b => b.id === bikeId);
        store.dispatch(modifyBike({id: bikeId!, data: {...bikeDB, position: [newPosition.x, newPosition.y, newPosition.z]}}))

        gridCanvas.renderer?.render(gridCanvas.scene!, gridCanvas.camera!);
        requestAnimationFrame(animate);
      }
    };

    animate();
  }
}
