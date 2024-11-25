import * as THREE from "three";
import { CityElement } from "./element/city";
import { City } from "../data/redux/reducers/cityReducer";
import { Building } from "../data/redux/reducers/buildingReducer";
import { BuildingElement } from "./element/building";
import { RoadElement } from "./element/road";
import { BikeElement } from "./element/bike";
import { Road } from "../data/redux/reducers/roadReducer";
import { Bike } from "../data/redux/reducers/bikeReducer";
import { CanvasEvent } from "./event";

export class GridCanvas {
  scene: THREE.Scene | undefined;
  camera: THREE.Camera | undefined;
  renderer: THREE.WebGLRenderer | undefined;
  
  event: CanvasEvent | undefined;

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

      this.event = new CanvasEvent();

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
    const buildings = this.generateBuildings(cityData)

    // Add roads connecting buildings
    this.generateRoads(buildings);

    // Add a bike on the road
    const bike1 = {
      id: "bike1",
      position: [0, 0, 0],
      roadId: "road1",
      info: 'Bike 1'
    } as Bike;
    this.bikeElement.create(bike1);

    // Move a bike along a path
    this.bikeElement.moveBikeAlongPath(buildings[1], buildings[4], .08, bike1.id)
  }

  private generateBuildings(cityData: City): Building[] {
    const buildings = [] as Building[]
    
    buildings[0] = {
      id: '1',
      position: [0, 0, 0],
      size: [2, 3, 2],
      color: "blue",
      info: "Building 0"
    } as Building;

    buildings[1] = {
      id: '2',
      position: [5, 0, 0],
      size: [2, 8, 2],
      color: "blue",
      info: "Building 1"
    } as Building;

    buildings[2] = {
      id: '3',
      position: [0, 0, 5],
      size: [3, 4, 2],
      color: "blue",
      info: "Building 2"
    } as Building;

    buildings[3] = {
      id: '4',
      position: [0, 0, -5],
      size: [3, 4, 2],
      color: "blue",
      info: "Building 3"
    } as Building;

    buildings[4] = {
      id: '5',
      position: [-8, 0, 0],
      size: [3, 5, 5],
      color: "blue",
      info: "Building 4"
    } as Building;

    // Add buildings to scene
    this.buildingElement.create(buildings[0]);
    this.buildingElement.create(buildings[1]);
    this.buildingElement.create(buildings[2]);
    this.buildingElement.create(buildings[3]);
    this.buildingElement.create(buildings[4]);

    // Add buildings to city
    this.cityElement.modify(cityData.id, {
      ...cityData,
      buildings: [...cityData.buildings, buildings[0].id, buildings[1].id, buildings[2].id, buildings[3].id, buildings[4].id],
    });

    return buildings
  }

  private generateRoads(buildings: Building[]): Road[] {
    const building1 = buildings.find(b => b.id === '1');
    const building2 = buildings.find(b => b.id === '2');
    const building3 = buildings.find(b => b.id === '3');
    const building4 = buildings.find(b => b.id === '4');
    const building5 = buildings.find(b => b.id === '5');

    const roads = [] as Road[]

    roads[0] = this.roadElement.connectBuildings(building1!, building2!);
    roads[1] = this.roadElement.connectBuildings(building1!, building3!);
    roads[2] = this.roadElement.connectBuildings(building1!, building4!);
    roads[3] = this.roadElement.connectBuildings(building1!, building5!);

    roads[4] = this.roadElement.connectBuildings(building2!, building3!);
    roads[5] = this.roadElement.connectBuildings(building2!, building4!);

    roads[6] = this.roadElement.connectBuildings(building3!, building5!);
    roads[7] = this.roadElement.connectBuildings(building4!, building5!);

    return roads;
  }
}

export const gridCanvas = new GridCanvas();
