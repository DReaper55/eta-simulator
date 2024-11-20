import { ElementUtils } from "./elementUtils";
import * as THREE from "three";
import { store } from "../../data/redux/store/reduxStore";
import { addRoad, modifyRoad, removeRoad, Road } from "../../data/redux/reducers/roadReducer";
import { gridCanvas } from "../canvas";


export class RoadElement implements ElementUtils<Road> {
  create(data: Road): void {
    store.dispatch(addRoad(data));

    const geometry = new THREE.PlaneGeometry(
      data.width,
      new THREE.Vector3().subVectors(new THREE.Vector3(...data.end), new THREE.Vector3(...data.start)).length()
    );
    const material = new THREE.MeshStandardMaterial({ color: "gray" });
    const road = new THREE.Mesh(geometry, material);
    road.position.set(
      (data.start[0] + data.end[0]) / 2,
      (data.start[1] + data.end[1]) / 2,
      (data.start[2] + data.end[2]) / 2
    );
    gridCanvas.scene?.add(road);
  }

  modify(id: string, data: Partial<Road>): void {
    store.dispatch(modifyRoad({ id, data }));
  }

  destroy(id: string): void {
    store.dispatch(removeRoad(id));
  }
}
