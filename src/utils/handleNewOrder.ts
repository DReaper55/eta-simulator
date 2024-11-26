import { ElementType } from "../constants/element";
import { Building } from "../data/redux/reducers/buildingReducer";
import { store } from "../data/redux/store/reduxStore";
import { gridCanvas } from "./canvas";
import * as THREE from "three";

let pickupBuilding: Building | undefined;
let dropOffBuilding: Building | undefined;

function addNewOrder() {
  if (!gridCanvas || !gridCanvas.scene) return;

    const buildings = store.getState().buildings.list;

    if(!buildings || buildings.length < 1) return;

  alert("Click on a building to choose the pickup location.");

  // Setup click listener for building selection
  gridCanvas.scene.children.forEach((object) => {
    if (object instanceof THREE.Mesh) {
      // Check if the object is a Mesh
      const mesh = object as THREE.Mesh; // Typecast to Mesh
      mesh.userData.originalColor = (
        mesh.material as THREE.MeshStandardMaterial
      ).color.getHex(); // Save original color
      (mesh.material as THREE.MeshStandardMaterial).color.set(0x00ff00); // Highlight building

      mesh.onClick = () => {
        if (!pickupBuilding) {
          pickupBuilding = buildings.find(b => b.id === mesh.userData.id); // Save as pickup
          alert("Pickup location selected. Now choose a drop-off location.");
          (mesh.material as THREE.MeshStandardMaterial).color.set(
            mesh.userData.originalColor
          ); // Reset color
        } else if (!dropOffBuilding) {
          dropOffBuilding = buildings.find(b => b.id === mesh.userData.id); // Save as drop-off
          alert("Drop-off location selected.");

          //   finalizeOrder(pickupBuilding, dropOffBuilding);

          // Reset colors and remove listeners
          gridCanvas.scene!.children.forEach((b) => {
            if (b instanceof THREE.Mesh) {
              b.material.color.set(b.userData.originalColor || 0xffffff);
              b.onClick = null;
            }
          });

          pickupBuilding = undefined;
          dropOffBuilding = undefined;
        }
      };
    }
  });
}
