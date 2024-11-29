import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorldMode } from "../../../constants/world";
import { Building } from "./buildingReducer";

export interface World {
  worldMode: string;
  actionMode: string | null;
  orderPickupBuilding: Building | undefined;
  orderDropOffBuilding: Building | undefined;
}

const initialState: World = {
  actionMode: null,
  worldMode: WorldMode.Test,
  orderPickupBuilding: undefined,
  orderDropOffBuilding: undefined
};

const worldSlice = createSlice({
  name: "world",
  initialState,
  reducers: {
    modifyWorld: (state, action: PayloadAction<World>) => {
      state = {...state, ...action.payload};
      return state;
    },
  },
});

export const { modifyWorld } = worldSlice.actions;
export default worldSlice.reducer;