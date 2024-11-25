import { configureStore } from "@reduxjs/toolkit";
import citiesReducer from "../reducers/cityReducer";
import roadsReducer from "../reducers/roadReducer";
import bikesReducer from "../reducers/bikeReducer";
import buildingReducer from "../reducers/buildingReducer";
import animationReducer from "../reducers/animationReducer";

export const store = configureStore({
  reducer: {
    cities: citiesReducer,
    roads: roadsReducer,
    bikes: bikesReducer,
    buildings: buildingReducer,
    animations: animationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;