import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { gridCanvas } from "../../utils/canvas";
import * as THREE from "three";


const SceneManipulator: React.FC = () => {  
    const { scene, camera, gl: renderer } = useThree();

    useEffect(()=>{
        gridCanvas.initCanvas(scene, camera, renderer)
    })

    useEffect(() => {
      // Example manipulation: changing the background color of the scene
      scene.background = new THREE.Color(0x000000);
  
      // Example manipulation: moving the camera
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
  
      // Example manipulation: changing the renderer settings
      renderer.setClearColor(0xffffff, 1);
    }, [scene, camera, renderer]);
  
    return null; // This component does not render anything
  };

  
const CanvasScene: React.FC = () => {
  return (
    <Canvas style={{height: '90vh'}} camera={{ position: [5, 10, 10] }}>
      <SceneManipulator />
    </Canvas>
  );
};

export default CanvasScene;
