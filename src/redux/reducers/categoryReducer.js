import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cachedCategories: [],
  cachedTags: {},
  cachedBanner: {},
  cachedBrands: [],
  catchContentObject: [],
  cachedMenuList: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCachedCategories: (state, action) => {
      state.cachedCategories = action.payload; // Update the cached categories
    },
    setCachedTags: (state, action) => {
      state.cachedTags = { ...state.cachedTags, ...action.payload }; // Merge new data with existing data
    },
    setCachedBanner: (state, action) => {
      state.cachedBanner = { ...state.cachedBanner, ...action.payload }; // Merge new data with existing data
    },
    setCachedBrands: (state, action) => {
      state.cachedBrands = action.payload; // Update the cached brands
    },
    setCatchContentObject: (state, action) => {
      state.catchContentObject = action.payload; // Update the cached content object
    },
    setCachedMenuList: (state, action) => {
      state.cachedMenuList = action.payload;
    },
  },
});

export const getCachedCategories = (state) => state.category.cachedCategories;
export const getCachedTags = (state) => state.category.cachedTags;
export const getCachedBanner = (state) => state.category.cachedBanner;
export const getCachedBrands = (state) => state.category.cachedBrands;
export const getCachedMenuList = (state) => state.category.cachedMenuList;

export const getCatchContentObject = (state) =>
  state.category.catchContentObject;

export const {
  setCachedCategories,
  setCachedTags,
  setCachedBanner,
  setCachedBrands,
  setCachedMenuList,
  setCatchContentObject,
} = categorySlice.actions; // Export action
export default categorySlice.reducer;
