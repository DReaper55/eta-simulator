import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface City {
  id: string;
  grid: number[][];
  position: [number, number];
}

interface CitiesState {
  list: City[];
}

const initialState: CitiesState = {
  list: [],
};

const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<City>) => {
      state.list.push(action.payload);
    },
    clearCities(state) {
        state.list = [];
    },
  },
});

export const { addCity, clearCities } = citiesSlice.actions;
export default citiesSlice.reducer;