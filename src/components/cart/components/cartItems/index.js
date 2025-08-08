import React, { useState } from "react";

// mui components
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box } from "@mui/material";

//css
import Heading from "../../../custom-components/Heading";
import CartItemCard from "./cartItemCard";
import "./index.css";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getAppliedCoupon,
  getCartId,
  getCartProducts,
  getLoyalityData,
  getWalletData,
  setAppliedCoupon,
  setCartBill,
  setCartId,
  setCartProducts,
  setLoyalityPoints,
  setWalletData,
} from "../../../../redux/reducers/cartReducer";

//services
import {
  flushCart,
  flushCartRestaurant,
  removeAssets,
} from "../../../../config/services/cartService";
import { getStoreType, setSlot } from "../../../../redux/reducers/miscReducer";

//custom-components
import { CircularLoader } from "../../../custom-components/CircularLoader";

import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";

const CartItems = () => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const cartProducts = useSelector(getCartProducts);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const walletData = useSelector(getWalletData);
  const loyalityData = useSelector(getLoyalityData);
  const couponApplied = useSelector(getAppliedCoupon);
  const showSnackbar = useSnackbar();

  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  const handleAssets = async () => {
    if (!cartId) return;
    const payload = {
      cartId: cartId,
      removeCoupon: couponApplied ? true : false,
      removeWallet: walletData ? true : false,
      removeLoyalty: loyalityData ? true : false,
    };

    try {
      const res = await removeAssets(payload);
      const result = res?.data?.data;
      if (result?.es !== 0) return;
      dispatch(setCartBill(result?.data?.billing));
      dispatch(setAppliedCoupon(result?.data?.cartCoupon));
      dispatch(
        setLoyalityPoints(
          result?.data?.loyaltyPoints !== null ||
            result?.data?.loyaltyPoints !== ""
            ? {
                loyaltyPoints: result?.data?.loyaltyPoints,
                loyaltyPointsValue: result?.data?.loyaltyPointsValue,
              }
            : null
        )
      );
      dispatch(setWalletData(result?.data?.redeemAmount));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const handleClearCart = async () => {
    try {
      setLoader(true);
      if (retailType !== "RESTAURANT") {
        const res = await flushCart(cartId);
      } else {
        const res = await flushCartRestaurant({ cartId });
      }
      handleAssets();
      dispatch(setCartProducts([]));
      // await storeData("cartData", null);
      dispatch(setCartBill(null));
      // dispatch(setCartId(null));
      dispatch(setAppliedCoupon(null));
      dispatch(setLoyalityPoints(null));
      // dispatch(setSlot(null));
      setLoader(false);
    } catch (err) {
      setLoader(false);
      showSnackbar(err?.message || "Something went wrong", "error");
    }
  };

  return (
    <Box className="cart-items">
      <Box className="cart-items-header">
        <Box className="cart-delete-all-icon">
          {loader ? (
            <CircularLoader />
          ) : (
            <Box
              my="1"
              flex="1"
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              paddingRight="15px"
              gap="2px"
              // borderLeft="4px solid yellow"
            >
              <Heading
                text={"Clear Cart"}
                paddingLeft="5px"
                fontsize={10}
                fontweight={600}
                tint="#333333"
              />

              <DeleteForeverIcon
                className="cart-delete-icon"
                onClick={handleClearCart}
              />
            </Box>
          )}
        </Box>
      </Box>
      <Box className="cart-items-list">
        {[...cartProducts]
          ?.sort((a, b) => a?.cartProductId.localeCompare(b?.cartProductId))
          ?.map((item) => (
            <CartItemCard cartItem={item} key={uuidv4()} />
          ))}
      </Box>
    </Box>
  );
};

export default CartItems;
