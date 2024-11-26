import { ElementType } from "../constants/element";
import { modifyWorld, World } from "../data/redux/reducers/worldReducer";
import { store } from "../data/redux/store/reduxStore";
import { gridCanvas } from "./canvas";
import * as THREE from "three";
import { CanvasClickEvent } from "./event/clickEvent";
import { Bike } from "../data/redux/reducers/bikeReducer";


export function handleNewOrder(e: MouseEvent, context: CanvasClickEvent) {
  if (!gridCanvas || !gridCanvas.scene) return;

  const buildings = store.getState().buildings.list;

  if (!buildings || buildings.length < 1) return;

  const raycaster = context.raycaster;
  const mouse = context.mouse;

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

        const features = getFeatures();

        features.forEach((key) => {
            makePrediction(key.get('feature') as number[]);
        })

        return;
      }
    }
  }
}

function makePrediction(features: number[]) {
    console.log(features);
}

function getFeatures(): Map<string, number[] | Bike>[] {
    const features = [] as Map<string, number[] | Bike>[];

    const bikes = store.getState().bikes.list;
    const world = store.getState().world;

    bikes.forEach(bike => {
        const accDistanceFromHereToPickup = getAccDistanceFromHereToPickup(bike, world);
        const currentOrders = bike.orders.length;
        const distanceToDropOff = calculateDistance(world.orderPickupBuilding?.position!, world.orderDropOffBuilding?.position!);

        const feature = new Map();

        feature.set('feature', [accDistanceFromHereToPickup, currentOrders, distanceToDropOff]);
        feature.set('bike', bike);

        features.push(feature)
    });

    return features;
}

function getAccDistanceFromHereToPickup(bike: Bike, world: World): number {
    let totalDistance = 0;

    for(let i = 0; i < bike.orders.length; i++) {
        if(i === 0) {
            // Calculate distance from bike's current location to
            // the rider's current order's dropoff location
            totalDistance += calculateDistance(bike.position, bike.orders[i].dropOff.position);
        } else {
            totalDistance += calculateDistance(bike.orders[i].pickup.position, bike.orders[i].dropOff.position);
        }

        if((i + 1) < bike.orders.length){
            // Calculate the distance from the current order's
            // dropoff location to the next order's pickup
            totalDistance += calculateDistance(bike.orders[i].dropOff.position, bike.orders[i + 1].pickup.position);
        }

        if(i === bike.orders.length){
            // Calculate the distance from the last order
            // to the new order's pickup location
            totalDistance += calculateDistance(bike.orders[i].dropOff.position, world.orderPickupBuilding?.position!);
        }
    }

    return totalDistance;
}

function calculateDistance(start: number[], end: number[]): number {
    const startVec = new THREE.Vector3(...start);
      const endVec = new THREE.Vector3(...end);
      return startVec.distanceTo(endVec);
}
