import { ElementType } from "../constants/element";
import { modifyWorld, World } from "../data/redux/reducers/worldReducer";
import { store } from "../data/redux/store/reduxStore";
import { gridCanvas } from "../utils/canvas";
import * as THREE from "three";
import { CanvasClickEvent } from "../utils/event/clickEvent";
import { Bike } from "../data/redux/reducers/bikeReducer";
import { predictETA } from "./etaPredictor";
import { Vector3, Camera } from 'three';


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

      if (mesh.userData.type !== ElementType.Building) {
        alert("Choose a Building object");
        return;
      }

      if (!store.getState().world.orderPickupBuilding) {
        store.dispatch(
          modifyWorld({
            orderPickupBuilding: buildings.find(
              (b) => b.id === mesh.userData.id
            ),
          } as World)
        );
        alert("Pickup location selected. Now choose a drop-off location.");
        (mesh.material as THREE.MeshStandardMaterial).color.set(0x00ff00); // Highlight
        clickedObject.material = mesh.material;
        return;
      }

      if (store.getState().world.orderPickupBuilding) {
        store.dispatch(
          modifyWorld({
            orderDropOffBuilding: buildings.find(
              (b) => b.id === mesh.userData.id
            ),
          } as World)
        );
        alert("Drop-off location selected, hold on to calculate ETA");
        (mesh.material as THREE.MeshStandardMaterial).color.set(0x00ff00); // Highlight

        const features = getFeatures();

        features.forEach(async (key) => {
          const feature = key.get("feature") as number[];
          const bike = key.get("bike") as Bike;

          const eta = await predictETA(feature);
          // console.log(bike.id, feature, eta);

          displayETAPopup(bike, eta);
        });

        return;
      }
    }
  }
}

async function displayETAPopup(bike: Bike, eta: number) {
  // Get the bike object in the scene
  const bikeMesh = gridCanvas.scene?.children.find((obj) => obj.userData.id === bike.id);
  if (!bikeMesh) return;

  // Convert bike's 3D position to 2D screen coordinates
  const position3D = new Vector3();
  bikeMesh.getWorldPosition(position3D);

  const position2D = toScreenPosition(position3D, gridCanvas.camera!);

  // Create a pop-up container
  const popup = document.createElement("div");
  // popup.classList.add("eta-popup");
  popup.textContent = `ETA: ${eta.toFixed(2)} mins`;
  popup.style.position = "absolute";
  popup.style.left = `${position2D.x}px`;
  popup.style.top = `${position2D.y}px`;
  popup.style.padding = "5px 10px";
  popup.style.background = "rgba(0, 0, 0, 0.7)";
  popup.style.color = "white";
  popup.style.borderRadius = "5px";
  popup.style.pointerEvents = "none";
  popup.style.fontSize = "12px";
  document.body.appendChild(popup);

  // Update the pop-up position on render
  const updatePopup = () => {
    const updated2D = toScreenPosition(position3D, gridCanvas.camera!);
    popup.style.left = `${updated2D.x}px`;
    popup.style.top = `${updated2D.y}px`;
  };

  // Add the update function to the render loop
  const renderer = gridCanvas.renderer!;
  const originalRender = renderer.render.bind(renderer);

  renderer.render = (scene, camera) => {
    updatePopup();
    originalRender(scene, camera);
  };
}

// Utility function to convert 3D world position to 2D screen position
function toScreenPosition(position: Vector3, camera: Camera): { x: number; y: number } {
  const vector = position.clone().project(camera);
  const canvas = gridCanvas.renderer!.domElement;

  return {
    x: ((vector.x + 1) / 2) * canvas.clientWidth,
    y: (-(vector.y - 1) / 2) * canvas.clientHeight,
  };
}

function getFeatures(): Map<string, number[] | Bike>[] {
  const features = [] as Map<string, number[] | Bike>[];

  const bikes = store.getState().bikes.list;
  const world = store.getState().world;

  bikes.forEach((bike) => {
    const accDistanceFromHereToPickup = getAccDistanceFromHereToPickup(
      bike,
      world
    );
    const currentOrders = bike.orders.length;
    const distanceToDropOff = calculateDistance(
      world.orderPickupBuilding?.position!,
      world.orderDropOffBuilding?.position!
    );

    const feature = new Map();

    feature.set("feature", [
      accDistanceFromHereToPickup,
      currentOrders,
      distanceToDropOff,
    ]);
    feature.set("bike", bike);

    features.push(feature);
  });

  return features;
}

function getAccDistanceFromHereToPickup(bike: Bike, world: World): number {
  let totalDistance = 0;

  for (let i = 0; i < bike.orders.length; i++) {
    if (i === 0) {
      // Calculate distance from bike's current location to
      // the rider's current order's dropoff location
      totalDistance += calculateDistance(
        bike.position,
        bike.orders[i].dropOff.position
      );
    } else {
      totalDistance += calculateDistance(
        bike.orders[i].pickup.position,
        bike.orders[i].dropOff.position
      );
    }

    if (i + 1 < bike.orders.length) {
      // Calculate the distance from the current order's
      // dropoff location to the next order's pickup
      totalDistance += calculateDistance(
        bike.orders[i].dropOff.position,
        bike.orders[i + 1].pickup.position
      );
    }

    if (i === bike.orders.length) {
      // Calculate the distance from the last order
      // to the new order's pickup location
      totalDistance += calculateDistance(
        bike.orders[i].dropOff.position,
        world.orderPickupBuilding?.position!
      );
    }
  }

  return totalDistance;
}

function calculateDistance(start: number[], end: number[]): number {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  return startVec.distanceTo(endVec);
}
