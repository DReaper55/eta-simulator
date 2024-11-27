import { ElementUtils } from "./elementUtils";
import * as THREE from "three";
import { store } from "../../data/redux/store/reduxStore";
import {
  addRoad,
  modifyRoad,
  removeRoad,
  Road,
} from "../../data/redux/reducers/roadReducer";
import { gridCanvas } from "../canvas";
import { ElementType } from "../../constants/element";
import { Building } from "../../data/redux/reducers/buildingReducer";

export class RoadElement implements ElementUtils<Road> {
  create(
    data: Road,
    isHorizontal: boolean = false,
    isCurved: boolean = false,
    curveType:
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right" = "top-left"
  ): void {
    store.dispatch(addRoad(data));

    const height = 0.4;

    // Handle straight roads (default case)
    if (!isCurved) {
      const length = Math.sqrt(
        Math.pow(data.end[0] - data.start[0], 2) +
          Math.pow(data.end[1] - data.start[1], 2) +
          Math.pow(data.end[2] - data.start[2], 2)
      );

      let geometry = new THREE.BoxGeometry(length, data.width, height);

      if (isHorizontal) {
        geometry = new THREE.BoxGeometry(data.width, height, length);
      }

      const material = new THREE.MeshStandardMaterial({ color: "gray" });
      const road = new THREE.Mesh(geometry, material);
      road.position.set(
        (data.start[0] + data.end[0]) / 2,
        height / 2,
        (data.start[2] + data.end[2]) / 2
      );
      road.userData = { info: data.info, type: ElementType.Road };

      gridCanvas.scene?.add(road);
      return;
    }

    // Handle curved roads
    const curveRadius = Math.abs(data.end[0] - data.start[0]) / 2; // Half the distance between start and end
    const geometry = new THREE.TorusGeometry(
      curveRadius,
      data.width / 2,
      16,
      32,
      Math.PI / 2
    ); // Quarter-circle curve

    // Determine rotation and position based on curveType
    let rotationY = 0;
    let positionX = (data.start[0] + data.end[0]) / 2;
    let positionZ = (data.start[2] + data.end[2]) / 2;

    switch (curveType) {
      case "top-left":
        rotationY = Math.PI; // 180 degrees
        positionX -= curveRadius;
        positionZ -= curveRadius;
        break;
      case "top-right":
        rotationY = -Math.PI / 2; // 90 degrees counterclockwise
        positionX += curveRadius;
        positionZ -= curveRadius;
        break;
      case "bottom-left":
        rotationY = Math.PI; // 90 degrees clockwise
        positionX += curveRadius;
        positionZ += curveRadius;
        break;
      case "bottom-right":
        rotationY = 0; // No rotation needed
        positionX += curveRadius;
        positionZ += curveRadius;
        break;
    }

    const material = new THREE.MeshStandardMaterial({ color: "gray" });
    const road = new THREE.Mesh(geometry, material);
    road.rotation.set(-Math.PI / 2, rotationY, 0); // Rotate to align flat on the ground
    road.position.set(positionX, height / 2, positionZ);
    road.userData = { info: data.info, type: ElementType.Road };

    gridCanvas.scene?.add(road);
  }

  connectBuildings(building1: Building, building2: Building): Road {
    const height = 0.05; // Road thickness
    const width = 1; // Road width
  
    // Calculate the center points of the two buildings
    const startX = building1.position[0];
    const startZ = building1.position[2];
  
    const endX = building2.position[0];
    const endZ = building2.position[2];
  
    // Calculate the road's length and midpoint
    const length = Math.sqrt(
      Math.pow(endX - startX, 2) + Math.pow(endZ - startZ, 2)
    );
    const midX = (startX + endX) / 2;
    const midZ = (startZ + endZ) / 2;
  
    // Create road geometry
    const geometry = new THREE.BoxGeometry(length, height, width);
    const material = new THREE.MeshStandardMaterial({ color: "gray" });
  
    const road = new THREE.Mesh(geometry, material);
  
    // Rotate road to align with the buildings
    const angle = Math.atan2(endZ - startZ, endX - startX);
    road.rotation.y = -angle;
  
    // Set road position
    road.position.set(midX, height / 2, midZ);
  
    // Optional: Add metadata for hover interaction
    road.userData = { type: ElementType.Road, info: `Road: ${building1.info} -> ${building2.info}` };
  
    // Add to the scene
    gridCanvas.scene?.add(road);
    
    const mRoad = {
      id: road.id.toString(),
      start: building1.position,
      end: building2.position,
      type: road.userData.type,
      width: width,
      info: road.userData.info,
    } as Road;

    store.dispatch(addRoad(mRoad));

    return mRoad;
  }
  

  modify(id: string, data: Partial<Road>): void {
    store.dispatch(modifyRoad({ id, data }));
  }

  destroy(id: string): void {
    store.dispatch(removeRoad(id));
  }
}
