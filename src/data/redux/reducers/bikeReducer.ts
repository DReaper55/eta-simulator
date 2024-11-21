import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ElementType } from "../../../constants/element";

export interface Bike {
  id: string;
  position: [number, number, number];
  roadId: string;
  info?: string;
  type: string;
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
      state.list.push({...action.payload, type: ElementType.Bike});
    },
    modifyBike: (state, action: PayloadAction<BikePayload>) => {
      state.list.map((bike) =>
        bike.id === action.payload.id
          ? { ...bike, ...action.payload.data, type: ElementType.Bike }
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
