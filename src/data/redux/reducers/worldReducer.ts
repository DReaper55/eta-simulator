import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionType } from "../../../constants/actions";
import { Building } from "./buildingReducer";

export interface World {
  actionMode: string;
  orderPickupBuilding: Building | undefined;
  orderDropOffBuilding: Building | undefined;
}

const initialState: World = {
  actionMode: ActionType.Test,
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
