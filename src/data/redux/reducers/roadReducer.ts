import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ElementType } from "../../../constants/element";

export interface Road {
  id: string;
  startCity: string;
  endCity: string;
  start: [number, number, number];
  end: [number, number, number];
  width: number;
  type: string;
  info?: string;
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
      state.list.push({...action.payload, type: ElementType.Road});
    },
    modifyRoad: (state, action: PayloadAction<RoadPayload>) => {
      state.list = state.list.map((road) =>
          road.id === action.payload.id
            ? { ...road, ...action.payload.data, type: ElementType.Road }
            : road
        );
      },
      removeRoad: (state, action: PayloadAction<String>) => {
        state.list = state.list.filter((road) => road.id !== action.payload);
      },
  },
});

export const { addRoad, modifyRoad, removeRoad } = roadsSlice.actions;
export default roadsSlice.reducer;