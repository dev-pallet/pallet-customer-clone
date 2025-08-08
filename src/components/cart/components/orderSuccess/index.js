import React, { useEffect } from "react";

// mui components
import { Box } from "@mui/material";

//css
import "./index.css";

//redux
import { useDispatch, useSelector } from "react-redux";
import { colorConstant } from "../../../../constants/colors";
import { getOrderId } from "../../../../redux/reducers/orderReducer";
import {
  getDeliveryAddress,
  getUserData,
} from "../../../../redux/reducers/userReducer";
import Heading from "../../../custom-components/Heading";

//library
import moment from "moment";
import { createCart } from "../../../../config/services/cartService";
import {
  storeData,
  storePlainData,
} from "../../../../middlewares/localStorage";
import {
  setAppliedCoupon,
  setCartBill,
  setCartId,
  setCartProducts,
  setLoyalityPoints,
  setShippingAddress,
} from "../../../../redux/reducers/cartReducer";
import { setPromise, setSlot } from "../../../../redux/reducers/miscReducer";
import Text from "../../../custom-components/Text";

import Lottie from "react-lottie";

//assets
import { useNavigate } from "react-router-dom";
import orderSuccessAnimation from "../../../../assets/animation-json/order.json";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";

const OrderSuccess = () => {
  const orderId = useSelector(getOrderId);
  const shippingAddress = useSelector(getDeliveryAddress);
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: orderSuccessAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const cartCreation = async (data) => {
    try {
      const res = await createCart(data);
      if (res?.data?.data?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      const result = res?.data?.data?.data;
      dispatch(setCartId(result?.cartId));
      dispatch(setCartProducts(result?.data?.cartProducts));
      // const storeDataDetails = localStorage.getItem("storeDetails");
      // await storeData("cartData", {
      //   cartProducts: result?.cartProducts,
      //   storeDataDetails: storeDataDetails
      //     ? JSON.parse(storeDataDetails)
      //     : null,
      // });

      // await storePlainData("cartId", result?.cartId);
      dispatch(setCartBill(result?.data?.billing));
      dispatch(setShippingAddress(result?.data?.shippingAddress));
      dispatch(setAppliedCoupon(null));
      dispatch(setLoyalityPoints(null));
      dispatch(setSlot(null));
      dispatch(setPromise(null));
      dispatch(setAppliedCoupon(null));
      setTimeout(() => {
        navigate(`/order-details/track/${orderId}`);
      }, 1000);
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    cartCreation({
      billingAddress: {
        ...shippingAddress,
        addressType:
          shippingAddress?.addressType === "OTHER"
            ? shippingAddress?.otherName
            : shippingAddress?.addressType,
        updatedOn: moment(new Date()).toISOString(),
        updatedBy: user?.uidx,
      },
      shippingAddress: {
        ...shippingAddress,
        addressType:
          shippingAddress?.addressType === "OTHER"
            ? shippingAddress?.otherName
            : shippingAddress?.addressType,
        updatedOn: moment(new Date()).toISOString(),
        updatedBy: user?.uidx,
      },
      cartProducts: [],
    });
  }, []);

  return (
    <Box className="order-success">
      {shippingAddress !== null ? (
        <>
          <Lottie options={animationOptions} height={150} width={150} />
          <Heading
            text={"Order Placed"}
            color={colorConstant?.primaryColor}
            fontSize={22}
          />
          <Text
            text={"Delivering To"}
            letterSpacing={1}
            tint
            fontweight={400}
          />
          <Text
            textAlign="center"
            width="70%"
            text={
              shippingAddress?.addressLine1 +
              "," +
              shippingAddress?.addressLine2 +
              shippingAddress?.city +
              "," +
              shippingAddress?.state +
              ","
            }
            noWrap
          />
        </>
      ) : null}
    </Box>
  );
};

export default OrderSuccess;
