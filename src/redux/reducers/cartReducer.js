const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  billing: null,
  cartProducts: [],
  adjustItems: null,
  shippingAddress: null,
  cartId: null,
  appliedCoupon: null,
  loyalityData: null,
  redeemedData: null,
  minCartValue: "99",
  appliedWallet: null,
  walletData: null,
  cartStatus: null,
  deliveryType: "DELIVERY",
  deliveryCharges: null,
  userSelectedTip: null,
  donationAmount: null,
  saveUserPreference: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartBill: (state, action) => {
      state.billing = action.payload;
    },
    setCartId: (state, action) => {
      state.cartId = action.payload;
    },
    setCartProducts: (state, action) => {
      state.cartProducts = action.payload;
    },
    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
    },
    setAppliedCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    setLoyalityPoints: (state, action) => {
      state.loyalityData = action.payload;
    },
    setRedeemData: (state, action) => {
      state.redeemedData = action.payload;
    },
    setMinCartValue: (state, action) => {
      state.minCartValue = action.payload;
    },
    setWalletData: (state, action) => {
      state.walletData = action.payload;
    },
    setAdjustItems: (state, action) => {
      state.adjustItems = action.payload;
    },
    setCartStatus: (state, action) => {
      state.cartStatus = action.payload;
    },
    setDeliveryType: (state, action) => {
      state.deliveryType = action.payload;
    },
    setDeliveryCharges: (state, action) => {
      state.deliveryCharges = action.payload;
    },
    setUserSelectedTip: (state, action) => {
      state.userSelectedTip = action.payload;
    },
    setDonationAmount: (state, action) => {
      state.donationAmount = action.payload;
    },
    setSavePreference: (state, action) => {
      state.saveUserPreference = action.payload;
    },
  },
});

export const {
  setCartBill,
  setShippingAddress,
  setCartProducts,
  setCartId,
  setAppliedCoupon,
  setLoyalityPoints,
  setRedeemData,
  setMinCartValue,
  setWalletData,
  setAdjustItems,
  setCartStatus,
  setDeliveryType,
  setDeliveryCharges,
  setUserSelectedTip,
  setDonationAmount,
  setSavePreference,
} = cartSlice.actions;

export const getCartId = (state) => state.cart.cartId;
export const getShippingAddress = (state) => state.cart.shippingAddress;

export const getBillingData = (state) => state.cart.billing;
export const getCartProducts = (state) => state.cart.cartProducts;
export const getAppliedCoupon = (state) => state.cart.appliedCoupon;
export const getLoyalityData = (state) => state.cart.loyalityData;
export const getRedeemedData = (state) => state.cart.redeemedData;
export const getMinCartValue = (state) => state.cart.minCartValue;
export const getWalletData = (state) => state.cart.walletData;
export const getAdjustItems = (state) => state.cart.adjustItems;
export const getCartStatus = (state) => state.cart.cartStatus;
export const getDeliverySubOrderType = (state) => state.cart.deliveryType;
export const getDeliveryCharges = (state) => state.cart.deliveryCharges;
export const getTipAmount = (state) => state.cart.userSelectedTip;
export const getDonationAmount = (state) => state.cart.donationAmount;
export const getUserPreference = (state) => state.cart.saveUserPreference;
export default cartSlice.reducer;
