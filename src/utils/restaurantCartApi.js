// utils/cartUtils.js

import { useSelector } from "react-redux";
import { createRestaurantCart } from "../config/services/cartService";
import { storeData, storePlainData } from "../middlewares/localStorage";
import { getDeliverySubOrderType } from "../redux/reducers/cartReducer";

export const restaurantCreateCartApi = async ({
  payload,
  onSuccess,
  onError,
  dispatchers = {},
}) => {
  const {
    setCartId,
    setCartProducts,
    setCartBill,
    setShippingAddress,
    setAppliedCoupon,
    setLoyalityPoints,
    setCartStatus,
    setDeliveryType,
  } = dispatchers;

  try {
    const res = await createRestaurantCart(payload);

    const result = res?.data?.data?.data;
    // if (res?.data?.data?.es !== 0) {
    //   onError?.(res?.data?.data?.message || "Unknown error");
    //   return;
    // }
    // Dispatch and persist cart data
    if (setCartId) setCartId(result?.cartId);
    if (setCartProducts) setCartProducts(result?.cartProducts);
    if (setCartStatus) setCartStatus(result?.cartStatus);
    if (setCartBill) setCartBill(result?.billing);
    if (setShippingAddress) setShippingAddress(result?.shippingAddress);
    if (setAppliedCoupon) setAppliedCoupon(result?.cartCoupon);
    if (setLoyalityPoints) setLoyalityPoints(result?.loyaltyPoints);

    // if (setDeliveryType) setDeliveryType(getDeliveryType);
    // it's setting by default from api // 1st time

    // const storeDataDetails = localStorage.getItem("storeDetails");
    // await storeData("cartData", {
    //   cartProducts: result?.cartProducts,
    //   storeDataDetails: storeDataDetails ? JSON.parse(storeDataDetails) : null,
    // });
    await storePlainData("cartId", result?.cartId);

    onSuccess?.(result);
  } catch (err) {
    onError?.(err?.message || err?.response?.data?.message || "API failed");
  }
};
