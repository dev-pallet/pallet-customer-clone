import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coords: null,
  pickedAddress: null,
  storeLocation: {
    latitude: 11.322799,
    longitude: 77.73605,
  },
  nearByStore: null,
  selectedLongLat: {
    latitude: null,
    longitude: null,
  },
  userSelectedLocation: {
    latitude: null,
    longitude: null,
  },
  storesList: [
    // {
    //   coords: {
    //     latitude: 13.067439,
    //     longitude: 80.237617,
    //   },
    //   radius: 10000,
    //   store: 'CHENNAI',
    // },
    // {
    //   coords: {
    //     latitude: 11.004556,
    //     longitude: 76.961632,
    //   },
    //   radius: 10000,
    //   store: 'COIMBATORE',
    // },
  ],
  userSelectedLocationTakeAway: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCoords: (state, action) => {
      state.coords = action.payload;
    },
    setPickedAddress: (state, action) => {
      state.pickedAddress = action.payload;
    },
    setStoreLocation: (state, action) => {
      state.storeLocation = action.payload;
    },
    setNearByStore: (state, action) => {
      state.nearByStore = action.payload;
    },
    setStoresList: (state, action) => {
      state.storesList = action.payload;
    },
    setSelectedLongLat: (state, action) => {
      state.selectedLongLat = action.payload;
    },
    setuserSelectedLocationTakeAway: (state, action) => {
      state.userSelectedLocationTakeAway = action.payload;
    },
    setUserSelectedLocation: (state, action) => {
      state.userSelectedLocation = action.payload;
    },
  },
});
export const {
  setCoords,
  setPickedAddress,
  setStoreLocation,
  setNearByStore,
  setStoresList,
  setSelectedLongLat,
  setuserSelectedLocationTakeAway,
  setUserSelectedLocation,
} = locationSlice.actions;
export const getCoords = (state) => state.location.coords;
export const getPickedAddress = (state) => state.location.pickedAddress;
export const getStoreLocation = (state) => state?.location?.storeLocation;
export const getNearByStore = (state) => {
  return state.location.nearByStore;
};
export const getStoresList = (state) => state.location.storesList;
export const getSelectedLongLat = (state) => state.location.selectedLongLat;
export const getUserSelectedLocationTakeAway = (state) =>
  state.location.userSelectedLocationTakeAway;
export const getUserSelectedLocation = (state) => {
  return state.location.userSelectedLocation;
};

export default locationSlice.reducer;
