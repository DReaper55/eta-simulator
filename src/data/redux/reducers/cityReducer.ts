import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ElementType } from "../../../constants/element";

export interface City {
  id: string;
  grid: number[][];
  position: [number, number, number];
  buildings: string[]; // IDs of buildings in this city
  type: string;
  info?: string;
}

interface CityPayload {
    id: string;
    data: Partial<City>;
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
      state.list.push({...action.payload, type: ElementType.City});
    },
    modifyCity: (state, action: PayloadAction<CityPayload>) => {
        state.list.map((city) =>
          city.id === action.payload.id
            ? { ...city, ...action.payload.data, type: ElementType.City }
            : city
        );
      },
      removeCity: (state, action: PayloadAction<String>) => {
        state.list.map((city) => city.id !== action.payload && city);
      },
    clearCities(state) {
        state.list = [];
    },
  },
});

export const { addCity, modifyCity, removeCity, clearCities } = citiesSlice.actions;
export default citiesSlice.reducer;