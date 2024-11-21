import { GridCanvas, gridCanvas } from "../canvas";
import * as THREE from "three";

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

    // Convert mouse position to normalized device coordinates (-1 to +1)
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Perform raycasting
    if (this.canvas?.scene && this.canvas?.camera) {
      this.raycaster.setFromCamera(this.mouse, this.canvas?.camera);
      const intersects = this.raycaster.intersectObjects(
        this.canvas?.scene.children,
        true
      );

      if (intersects.length > 0) {
        this.hoveredObject = intersects[0].object;
      } else {
        this.hoveredObject = null;
      }
    }
  }
}
