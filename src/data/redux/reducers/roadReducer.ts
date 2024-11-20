import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Road {
  id: string;
  startCity: string;
  endCity: string;
}

interface RoadsState {
  list: Road[];
}

const initialState: RoadsState = {
  list: [],
};

const roadsSlice = createSlice({
  name: "roads",
  initialState,
  reducers: {
    addRoad: (state, action: PayloadAction<Road>) => {
      state.list.push(action.payload);
    },
  },
});

export const { addRoad } = roadsSlice.actions;
export default roadsSlice.reducer;