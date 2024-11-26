import { ActionType } from "../../constants/actions";
import { store } from "../../data/redux/store/reduxStore";
import { GridCanvas, gridCanvas } from "../canvas";
import * as THREE from "three";
import { handleNewOrder } from "../handleNewOrder";

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
    if(this.isMouseDown && store.getState().world.actionMode === ActionType.Test){
      handleNewOrder(e, this);
    }
  }

  setSpaceKeyDownState(isSpaceKeyDown: boolean) {
    this.isSpaceKeyDown = isSpaceKeyDown;
  }
}
