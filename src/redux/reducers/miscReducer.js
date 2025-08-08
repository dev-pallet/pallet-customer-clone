import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alertMsg: null,
  refresh: false,
  serviceable: true,
  showTranslateModal: false,
  slot: null,
  promise: null,
  offer: null,
  scrollEvent: null,
  expired: false,
  userCurrentLocationServiceable: false,
  tokenRefresh: null,
  selectedLocationId: null,
  storeType: null,
  longitudeFromRetailApi: null,
  latitudeFromRetailApi: null,
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setAlertMsg: (state, action) => {
      state.alertMsg = action.payload;
    },
    setRefreshState: (state, action) => {
      state.refresh = action.payload;
    },
    setServiceable: (state, action) => {
      state.serviceable = action.payload;
    },
    setUserCurrentLocationServiceable: (state, action) => {
      state.userCurrentLocationServiceable = action.payload;
    },
    setShowTranslateModal: (state) => {
      state.showTranslateModal = !state.showTranslateModal;
    },
    setSlot: (state, action) => {
      state.slot = action.payload;
    },
    setPromise: (state, action) => {
      state.promise = action.payload;
    },
    setOffer: (state, action) => {
      state.offer = action.payload;
    },
    setScrollEvent: (state, action) => {
      state.scrollEvent = action.payload;
    },
    setSessionExpired: (state, action) => {
      state.expired = action.payload;
    },
    setTokenRefresh: (state, action) => {
      state.tokenRefresh = action.payload;
    },
    setServiceabilityLocationId: (state, action) => {
      state.selectedLocationId = action.payload;
    },
    setStoreType: (state, action) => {
      state.storeType = action.payload;
    },
    setLatitudeFromRetailApi: (state, action) => {
      state.latitudeFromRetailApi = action.payload;
    },
    setLongitudeFromRetailApi: (state, action) => {
      state.longitudeFromRetailApi = action.payload;
    },
  },
});

export const {
  setAlertMsg,
  setRefreshState,
  setServiceable,
  setUserCurrentLocationServiceable,
  setShowTranslateModal,
  setSlot,
  setPromise,
  setOffer,
  setScrollEvent,
  setSessionExpired,
  setTokenRefresh,
  setServiceabilityLocationId,
  setStoreType,
  setLatitudeFromRetailApi,
  setLongitudeFromRetailApi,
} = miscSlice.actions;

export const getAlertMsg = (state) => state.misc.alertMsg;
export const getRefreshState = (state) => state.misc.refresh;
export const getServiceable = (state) => state.misc.serviceable;
export const getUserCurrentLocationServiceable = (state) =>
  state.misc.userCurrentLocationServiceable;
export const getTranslateModal = (state) => state.misc.showTranslateModal;
export const getSelectedSlot = (state) => state.misc.slot;
export const getDeliveryPromise = (state) => state.misc.promise;
export const getOffer = (state) => state.misc.offer;
export const getScrollEvent = (state) => state.misc.scrollEvent;
export const getSessionExpired = (state) => state.misc.expired;
export const getTokenRefresh = (state) => state.misc.tokenRefresh;
export const getServiceabilityLocationId = (state) =>
  state.misc.selectedLocationId;
export const getStoreType = (state) => state.misc.storeType;
export const getLatitudeFromRetailApi = (state) =>
  state.misc.latitudeFromRetailApi;
export const getLongitutudeFromRetailAPi = (state) =>
  state.misc.longitudeFromRetailApi;
export default miscSlice.reducer;
