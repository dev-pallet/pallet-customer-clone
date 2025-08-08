const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  addressInfo: "",
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddressInfo: (state, action) => {
      state.addressInfo = action.payload;
    }
  },
});

export const {
  setAddressInfo,
} = addressSlice.actions;

export const getAddressInfo = (state) => state.address.addressInfo;

export default addressSlice.reducer;
