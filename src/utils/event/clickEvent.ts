import { WorldMode } from "../../constants/world";
import { store } from "../../data/redux/store/reduxStore";
import { GridCanvas, gridCanvas } from "../canvas";
import * as THREE from "three";
import { handleNewOrder } from "../../services/orderHandler";
import { ActionType } from "../../constants/action";
import { Building } from "../../data/redux/reducers/buildingReducer";
import { ElementType } from "../../constants/element";
import { generateUUID } from "three/src/math/MathUtils.js";
import { replaceBuildings } from "../../services/modelAssetLoader";
import { AssetPaths } from "../../assets";

export class CanvasClickEvent {
  isMouseDown = false;
  isSpaceKeyDown = false;
  startPoint: { x: number; y: number } | undefined;
  mouse: THREE.Vector2;
  hoveredObject: THREE.Object3D | null = null;
  raycaster: THREE.Raycaster;
  canvas: GridCanvas;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.canvas = gridCanvas;

    this.initClickEvent();
  }

  initClickEvent() {
    window.addEventListener("mousedown", this.handleMouseDown.bind(this));
    window.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  handleMouseDown() {
    this.isMouseDown = true;
  }

  handleMouseUp(e: MouseEvent) {
    if(this.isMouseDown && store.getState().world.worldMode === WorldMode.Test){
      if(store.getState().world.actionMode === ActionType.Order){
        handleNewOrder(e);
      }

      if(store.getState().world.actionMode === ActionType.Building){
        const point = getClickedObject(e, true);

        if(point instanceof THREE.Vector3){
          const b = {
            id: generateUUID(),
            position: [point.x, point.y, point.z],
            size: [2, 5, 2],
            color: "blue",
            info: `Building ${store.getState().buildings.list.length - 1}`,
            type: ElementType.Building,
          } as Building;
  
          gridCanvas.buildingElement.create(b);

          replaceBuildings([{position: b.position, model: AssetPaths.BUILDING_MODEL, id: b.id, info: b.info, type: b.type}])
        }
      }
    }
  }

  setSpaceKeyDownState(isSpaceKeyDown: boolean) {
    this.isSpaceKeyDown = isSpaceKeyDown;
  }
}

export function getClickedObject(e: MouseEvent, getPoint = false): THREE.Mesh | THREE.Vector3 | null {
  const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Calculate mouse position in normalized device coordinates (-1 to +1)
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the camera and mouse position
  raycaster.setFromCamera(mouse, gridCanvas.camera!);

  // Find intersected objects in the scene
  const intersects = raycaster.intersectObjects(
    gridCanvas.scene!.children,
    true
  );

  if(intersects.length > 0){
    if(getPoint) return intersects[0].point as THREE.Vector3;
    return intersects[0].object as THREE.Mesh;
  }

  return null;
}
