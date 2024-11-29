import { GridCanvas, gridCanvas } from "../canvas";
import * as THREE from "three";
import { getClickedObject } from "./clickEvent";

export class CanvasMoveEvent {
  mouse: THREE.Vector2;
  hoveredObject: THREE.Object3D | null = null;
  raycaster: THREE.Raycaster;
  canvas: GridCanvas;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.canvas = gridCanvas;

    this.initMoveEvent();
  }

  initMoveEvent() {
    // Add event listener for mouse movement
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  removeMoveEvent() {
    // Add event listener for mouse movement
    window.removeEventListener("mousemove", this.onMouseMove);
  }

  onMouseMove(event: MouseEvent) {
    if (!this.mouse) return;

    this.hoveredObject = getClickedObject(event) as THREE.Mesh;
  }
}
