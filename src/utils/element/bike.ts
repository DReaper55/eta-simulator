import { ElementUtils } from "./elementUtils";
import * as THREE from "three";
import { store } from "../../data/redux/store/reduxStore";
import { addBike, Bike, modifyBike, removeBike } from "../../data/redux/reducers/bikeReducer";
import { gridCanvas } from "../canvas";


export class BikeElement implements ElementUtils<Bike> {
  create(data: Bike): void {
    store.dispatch(addBike(data));

    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1);
    const material = new THREE.MeshStandardMaterial({ color: "red" });
    const bike = new THREE.Mesh(geometry, material);
    bike.position.set(...data.position);
    gridCanvas.scene?.add(bike);
  }

  modify(id: string, data: Partial<Bike>): void {
    store.dispatch(modifyBike({id, data}));
  }

  destroy(id: string): void {
    store.dispatch(removeBike(id));
  }
}
