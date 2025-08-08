import { createSlice } from "@reduxjs/toolkit";
import { storeData } from "../../middlewares/localStorage";

const initialState = {
  userData: null,
  deliveryAddress: null,
  fcmToken: null,
  favourites: [],
  locationName: null,
  organisationId: null,
  locationId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      storeData("@user", action.payload);
    },
    setDeliveryAddress: (state, action) => {
      state.deliveryAddress = action.payload;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setFavourites: (state, action) => {
      state.favourites = action.payload;
    },
    setLocationName: (state, action) => {
      state.locationName = action.payload;
    },
    setOrgId: (state, action) => {
      state.organisationId = action.payload;
    },
    setLocationId: (state, action) => {
      state.locationId = action.payload;
    },
  },
});

export const {
  setUserData,
  setDeliveryAddress,
  setFcmToken,
  setFavourites,
  setOrgId,
  setLocationId,
} = userSlice.actions;

export const getUserData = (state) => state.user.userData;
export const getDeliveryAddress = (state) => state.user.deliveryAddress;
export const getFcmToken = (state) => state.user.fcmToken;
export const getFavourites = (state) => state.user?.favourites;
export const getOrganisationId = (state) => state.user?.organisationId;
export const getLocationId = (state) => state.user?.locationId;
export default userSlice.reducer;
