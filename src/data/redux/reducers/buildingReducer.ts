import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ElementType } from "../../../constants/element";

export interface Building {
  id: string;
  grid: number[][];
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  info?: string;
  type: string;
}

interface BuildingPayload {
  id: string;
  data: Partial<Building>;
}

interface BuildingState {
  list: Building[];
}

const initialState: BuildingState = {
  list: [],
};

const buildingSlice = createSlice({
  name: "buildings",
  initialState,
  reducers: {
    addBuilding: (state, action: PayloadAction<Building>) => {
      state.list.push({...action.payload, type: ElementType.Building});
    },
    modifyBuilding: (state, action: PayloadAction<BuildingPayload>) => {
      state.list.map((building) =>
        building.id === action.payload.id
          ? { ...building, ...action.payload.data, type: ElementType.Building }
          : building
      );
    },
    removeBuilding: (state, action: PayloadAction<String>) => {
      state.list.map((building) => building.id !== action.payload && building);
    },
    clearBuildings(state) {
        state.list = [];
    },
  },
});

export const { addBuilding, modifyBuilding, removeBuilding, clearBuildings } = buildingSlice.actions;
export default buildingSlice.reducer;