import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionType } from "../../../constants/actions";

export interface World {
  actionMode: string;
}

interface WorldState {
  actionMode: string;
}

const initialState: WorldState = {
  actionMode: ActionType.Explore,
};

const worldSlice = createSlice({
  name: "world",
  initialState,
  reducers: {
    modifyCity: (state, action: PayloadAction<string>) => {
      state.actionMode = action.payload;
    },
  },
});

export const { modifyCity } = worldSlice.actions;
export default worldSlice.reducer;
