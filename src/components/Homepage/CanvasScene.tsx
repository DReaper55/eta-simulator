import React, { useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { gridCanvas } from "../../utils/canvas";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const SceneManipulator: React.FC = () => {
  const { scene, camera, gl: renderer } = useThree();

  useEffect(() => {
    gridCanvas.initCanvas(scene, camera, renderer);
  }, [scene, camera, renderer]);

  return null; // This component does not render anything
};

const CanvasScene: React.FC = () => {
  return (
    <Canvas style={{ height: "90vh" }}>
      {/* Add Orbit Controls */}
      <OrbitControls
        enableZoom={true}
        maxPolarAngle={Math.PI / 2} // Prevent camera from flipping below the ground
        minPolarAngle={0}
      />

      <SceneManipulator />

      <gridHelper
        args={[30, 10, new THREE.Color("gray"), new THREE.Color("gray")]}
      />
    </Canvas>
  );
};

export default CanvasScene;
