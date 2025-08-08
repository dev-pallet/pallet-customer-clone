import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderDetails: null,
  orderId: null,
  previouslyOrdered: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderDetails: (state, action) => {
      state.orderDetails = action.payload;
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    setPreviouslyOrdered: (state, action) => {
      state.previouslyOrdered = action.payload;
    },
  },
});
export const { setOrderDetails, setOrderId, setPreviouslyOrdered } =
  orderSlice.actions;
export const getOrderId = (state) => state.order.orderId;
export const getOrderDetails = (state) => state.order.orderDetails;
export const getPreviouslyOrdered = (state) => state.order.previouslyOrdered;
export default orderSlice.reducer;
