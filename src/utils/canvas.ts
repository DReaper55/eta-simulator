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

    // Create a city
    const cityData = {
      id: "city1",
      position: [0, 0, 0],
      buildings: [] as string[],
    } as City;
    this.cityElement.create(cityData);

    // Add buildings to the city
    this.generateBuildings(cityData)

    // Add roads connecting buildings
    const roads = this.generateRoads();

    // Add a bike on the road
    // const bike1 = {
    //   id: "bike1",
    //   position: [3.5, 0, 0],
    //   roadId: "road1",
    // } as Bike;
    // this.bikeElement.create(bike1);

    // Add bike
    this.bikeElement.animateBike(roads[0].end, roads[0].start, .05);
    this.bikeElement.animateBike(roads[1].end, roads[1].start, .05);
    this.bikeElement.animateBike(roads[2].end, roads[2].start, .05);
    this.bikeElement.animateBike(roads[3].end, roads[3].start, .05);
  }

  private generateBuildings(cityData: City) {
    const building1 = {
      id: getRandomId(),
      position: [0, 0, 0],
      size: [2, 3, 2],
      color: "blue",
    } as Building;

    const building2 = {
      id: getRandomId(),
      position: [5, 0, 0],
      size: [2, 8, 2],
      color: "blue",
    } as Building;

    const building3 = {
      id: getRandomId(),
      position: [0, 0, 5],
      size: [3, 4, 2],
      color: "blue",
    } as Building;

    const building4 = {
      id: getRandomId(),
      position: [0, 0, -5],
      size: [3, 4, 2],
      color: "blue",
    } as Building;

    const building5 = {
      id: getRandomId(),
      position: [-8, 0, 0],
      size: [3, 5, 5],
      color: "blue",
    } as Building;

    // Add buildings to scene
    this.buildingElement.create(building1);
    this.buildingElement.create(building2);
    this.buildingElement.create(building3);
    this.buildingElement.create(building4);
    this.buildingElement.create(building5);


    // Add buildings to city
    this.cityElement.modify(cityData.id, {
      ...cityData,
      buildings: [...cityData.buildings, building1.id, building2.id, building3.id, building4.id, building5.id],
    });
  }

  private generateRoads(): Road[] {
    const road1 = {
      id: "road1",
      start: [0, 0.2, 0], // building1
      end: [5, 0.2, 0], // building2
      width: .3,
    } as Road;

    const road2 = {
      id: "road2",
      start: [0, 0.2, 0], // building1
      end: [0, 0.2, 5], // building3
      width: .3,
    } as Road;

    const road4 = {
      id: "road4",
      start: [0, 0.2, 0], // building1
      end: [0, 0.2, -5], // building4
      width: .3,
    } as Road;

    const road3 = {
      id: "road3",
      start: [0, 0.2, 0], // building1
      end: [-8, 0.2, 0], // building5
      width: .3,
    } as Road;

    this.roadElement.create(road1);
    this.roadElement.create(road2, true);
    this.roadElement.create(road4, true);
    this.roadElement.create(road3);

    return [road1, road2, road3, road4]
  }
}

export const gridCanvas = new GridCanvas();
