import { ElementUtils } from "./elementUtils";
import * as THREE from "three";
import { store } from "../../data/redux/store/reduxStore";
import { addBuilding, Building, modifyBuilding, removeBuilding } from "../../data/redux/reducers/buildingReducer";
import { gridCanvas } from "../canvas";
import { ElementType } from "../../constants/element";


export class BuildingElement implements ElementUtils<Building> {
  create(data: Building): void {
    // Add to Redux store
    store.dispatch(addBuilding(data));

    // Add to canvas
    const geometry = new THREE.BoxGeometry(...data.size);
    const material = new THREE.MeshStandardMaterial({ color: data.color });
    const building = new THREE.Mesh(geometry, material);
    building.position.set(...data.position);
    building.userData = {info: data.info, type: ElementType.Building, id: data.id}
    gridCanvas.scene?.add(building);
  }

  modify(id: string, data: Partial<Building>): void {
    store.dispatch(modifyBuilding({ id, data }));

    // Update canvas (requires stored reference to the building object)
    // This implementation assumes you store references to created THREE objects.
  }

  destroy(id: string): void {
    store.dispatch(removeBuilding(id));

    // Remove from canvas
    // Logic to find and remove the associated THREE object from the scene.
  }
}
