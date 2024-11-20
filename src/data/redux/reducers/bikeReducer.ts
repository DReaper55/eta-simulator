import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Bike {
  id: string;
  position: [number, number, number];
  roadId: string;
}

interface BikePayload {
  id: string;
  data: Partial<Bike>;
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
    modifyBike: (state, action: PayloadAction<BikePayload>) => {
      state.list.map((bike) =>
        bike.id === action.payload.id
          ? { ...bike, ...action.payload.data }
          : bike
      );
    },
    removeBike: (state, action: PayloadAction<String>) => {
      state.list.map((bike) => bike.id !== action.payload && bike);
    },
  },
});

export const { addBike, modifyBike, removeBike } = bikesSlice.actions;
export default bikesSlice.reducer;
