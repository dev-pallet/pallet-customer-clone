import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userPlan: "basic",
};

const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    setUserPlan: (state, action) => {
      if (["basic", "premium"].includes(action.payload)) {
        state.userPlan = action.payload;
      }
    },
  },
});

export const { setUserPlan } = planSlice.actions;
export const getUserPlan = (state) => state.plan.userPlan;
export default planSlice.reducer;
