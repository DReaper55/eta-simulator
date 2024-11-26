import { ElementType } from "../constants/element";
import { modifyWorld, World } from "../data/redux/reducers/worldReducer";
import { store } from "../data/redux/store/reduxStore";
import { gridCanvas } from "./canvas";
import * as THREE from "three";


export function handleNewOrder(e: MouseEvent, context: any) {
  if (!gridCanvas || !gridCanvas.scene) return;

  const buildings = store.getState().buildings.list;

  if (!buildings || buildings.length < 1) return;

  const raycaster = context.raycaster as THREE.Raycaster;
  const mouse = context.mouse as THREE.Vector2;

  // Calculate mouse position in normalized device coordinates (-1 to +1)
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, gridCanvas.camera!);

  // Find intersected objects in the scene
  const intersects = raycaster.intersectObjects(
    gridCanvas.scene.children,
    true
  );

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    if (clickedObject instanceof THREE.Mesh) {
      const mesh = clickedObject as THREE.Mesh;

      if(mesh.userData.type !== ElementType.Building) {
        alert("Choose a Building object");
        return;
      };
 
      if(!store.getState().world.orderPickupBuilding) {
        store.dispatch(modifyWorld({
            orderPickupBuilding: buildings.find((b) => b.id === mesh.userData.id),
        } as World));
        alert("Pickup location selected. Now choose a drop-off location.");
        (mesh.material as THREE.MeshStandardMaterial).color.set(0x00ff00); // Highlight
        clickedObject.material = mesh.material;
        return;
      }

      if(store.getState().world.orderPickupBuilding) {
        store.dispatch(modifyWorld({
            orderDropOffBuilding: buildings.find((b) => b.id === mesh.userData.id),
        } as World));
        alert("Drop-off location selected, hold on to calculate ETA");
        (mesh.material as THREE.MeshStandardMaterial).color.set(0x00ff00); // Highlight
        return;
      }
    }
  }
}
