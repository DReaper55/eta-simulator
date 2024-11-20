import * as THREE from "three";
import { CityElement } from "./element/city";
import { City } from "../data/redux/reducers/cityReducer";
import getRandomId from "./randomIdGenerator";
import { Building } from "../data/redux/reducers/buildingReducer";
import { BuildingElement } from "./element/building";
import { RoadElement } from "./element/road";
import { BikeElement } from "./element/bike";
import { Road } from "../data/redux/reducers/roadReducer";
import { Bike } from "../data/redux/reducers/bikeReducer";

export class GridCanvas {
  scene: THREE.Scene | undefined;
  camera: THREE.Camera | undefined;
  renderer: THREE.WebGLRenderer | undefined;

  cityElement = new CityElement();
  buildingElement = new BuildingElement();
  roadElement = new RoadElement();
  bikeElement = new BikeElement();

  initCanvas(
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
  ) {
    return new Promise<boolean>((resolve) => {
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;

      // Set lightinh
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 7.5);
      this.scene.add(directionalLight);

      // Add city and elements to the canvas
      this.addInitialStructures();

      resolve(true);
    });
  }

  private addInitialStructures() {
    if (!this.scene) return;

    // Example: Create a city
    const cityData = {
      id: "city1",
      position: [0, 0, 0],
      buildings: [] as string[],
    } as City;
    this.cityElement.create(cityData);

    // Example: Add buildings to the city
    const building1ID = getRandomId();
    const building2ID = getRandomId();

    const building1 = {
      id: building1ID,
      position: [0, 0, 0],
      size: [2, 3, 2],
      color: "blue",
    } as Building;
    const building2 = {
      id: building2ID,
      position: [5, 0, 0],
      size: [2, 8, 2],
      color: "blue",
    } as Building;
    this.buildingElement.create(building1);
    this.buildingElement.create(building2);

    this.cityElement.modify(cityData.id, {
      ...cityData,
      buildings: [...cityData.buildings, building1ID, building2ID],
    });

    // Example: Add roads connecting buildings
    const road1 = {
      id: "road1",
      start: [0, 0.2, 0],
      end: [5, 0.2, 0],
      width: .3,
    } as Road;
    this.roadElement.create(road1);

    // Example: Add a bike on the road
    const bike1 = {
      id: "bike1",
      position: [3.5, 0, 0],
      roadId: "road1",
    } as Bike;
    this.bikeElement.create(bike1);

    this.bikeElement.animateBike(road1.end, road1.start, .05, bike1.id);
  }
}

export const gridCanvas = new GridCanvas();
