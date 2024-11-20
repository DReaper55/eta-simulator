import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Road {
  id: string;
  startCity: string;
  endCity: string;
  start: [number, number, number];
  end: [number, number, number];
  width: number;
}

interface RoadPayload {
    id: string;
    data: Partial<Road>;
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
    modifyRoad: (state, action: PayloadAction<RoadPayload>) => {
        state.list.map((road) =>
          road.id === action.payload.id
            ? { ...road, ...action.payload.data }
            : road
        );
      },
      removeRoad: (state, action: PayloadAction<String>) => {
        state.list.map((road) => road.id !== action.payload && road);
      },
  },
});

export const { addRoad, modifyRoad, removeRoad } = roadsSlice.actions;
export default roadsSlice.reducer;