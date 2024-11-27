import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { gridCanvas } from '../utils/canvas';

// Function to load a building model
async function loadBuildingModel(url: string, position: [number, number, number], info?: string, type?: string, id?: string) {
  const loader = new GLTFLoader();

  return new Promise<THREE.Object3D>((resolve, reject) => {
    loader.load(
      url,
      (gltf) => {
        gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                child.userData = {info: info, type: type, id: id}
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });


        const model = gltf.scene;
        model.position.set(...position);
        model.scale.set(.2, .2, .2);

        gridCanvas.scene!.add(model); // Add to the Three.js scene
        resolve(model);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
        reject(error);
      }
    );
  });
}

export async function replaceBuildings(elements: any) {
    for (const element of elements) {
        const oldElement = gridCanvas.scene!.children.find(c => c.userData.id === element.id);

        if (oldElement) {
            gridCanvas.scene!.remove(oldElement);
            // oldBuilding.geometry?.dispose();
            // if (Array.isArray(oldBuilding.material)) {
            //     oldBuilding.material.forEach(mat => mat.dispose());
            // } else {
            //     oldBuilding.material?.dispose();
            // }
        }

      await loadBuildingModel(element.model, element.position, element.info, element.type, element.id);
    }
}
