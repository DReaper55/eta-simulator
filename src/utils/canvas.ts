import * as THREE from "three";

export class GridCanvas {
    scene: THREE.Scene | undefined;
    camera: THREE.Camera | undefined;
    renderer: THREE.WebGLRenderer | undefined;

    initCanvas(scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
        return new Promise<boolean>((resolve) => {
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            // Example: Change background color
            // this.scene.background = new THREE.Color(0x61470e);
            this.renderer.setClearColor("blue", 1);
      
            resolve(true);
        });
    }
}

export const gridCanvas = new GridCanvas();
