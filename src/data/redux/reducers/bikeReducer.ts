import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Bike {
  id: string;
  position: [number, number];
}

interface BikesState {
  list: Bike[];
}

const initialState: BikesState = {
  list: [],
};

const bikesSlice = createSlice({
  name: "bikes",
  initialState,
  reducers: {
    addBike: (state, action: PayloadAction<Bike>) => {
      state.list.push(action.payload);
    },
  },
});

export const { addBike } = bikesSlice.actions;
export default bikesSlice.reducer;