import { Building } from "../data/redux/reducers/buildingReducer";

export interface Order {
    id: string;
    pickup: Building;
    dropOff: Building
}