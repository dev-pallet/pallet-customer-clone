import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterPayload: null,
  selectedMainCat: null,
  selectedTagData: null
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setFilterPayload: (state, action) => {
      state.filterPayload = action.payload;
    },
    setSelectedMainCat: (state, action) => {
      state.selectedMainCat = action.payload;
    },
    setSelectedTagData: (state, action) =>{
      state.selectedTagData = action.payload
    }
  },
});

export const { setFilterPayload, setSelectedMainCat, setTagsList, setSelectedTagData } =
  productSlice.actions;

export const getMainCat = (state) => state.product.selectedMainCat;
export const getFilterPayload = (state) => state.product.filterPayload;
export const getSelectedTagData = (state) => state.product.selectedTagData;

export default productSlice.reducer;
