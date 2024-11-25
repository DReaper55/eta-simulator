import { createSlice } from "@reduxjs/toolkit";

interface AnimationState {
  isPaused: Boolean;
}

const initialState: AnimationState = {
  isPaused: false,
};

const animationsSlice = createSlice({
  name: "animations",
  initialState,
  reducers: {
    toggleAnimation: (state) => {
      state.isPaused = !state.isPaused;
    }
  },
});

export const { toggleAnimation } = animationsSlice.actions;
export default animationsSlice.reducer;
