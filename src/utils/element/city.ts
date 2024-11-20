import { ElementUtils } from "./elementUtils";
import { BuildingElement } from "./building";
import { store } from "../../data/redux/store/reduxStore";
import { addCity, City, modifyCity, removeCity } from "../../data/redux/reducers/cityReducer";


export class CityElement implements ElementUtils<City> {
  buildingElement = new BuildingElement();

  create(data: City): void {
    store.dispatch(addCity(data));
  }

  modify(id: string, data: Partial<City>): void {
    store.dispatch(modifyCity({ id, data }));
  }

  destroy(id: string): void {
    const city = store.getState().cities.list.find((c) => c.id === id);
    if (city) {
      city.buildings.forEach((buildingId) => this.buildingElement.destroy(buildingId));
    }
    store.dispatch(removeCity(id));
  }
}
