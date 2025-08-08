import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// mui components
import { Box } from "@mui/material";

//assets
import TwinLoader from "../../../../assets/gif/loading.gif";
import SakuraLoader from "../../../../assets/gif/sakuraLoader.gif";

//css
import "./index.css";

//custom-components
import Text from "../../../custom-components/Text";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  createCart,
  removeWallet,
} from "../../../../config/services/cartService";
import { fetchOrderDetailsById } from "../../../../config/services/orderService";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import {
  getCartId,
  setAppliedCoupon,
  setCartBill,
  setCartId,
  setCartProducts,
  setLoyalityPoints,
  setShippingAddress,
  setWalletData,
} from "../../../../redux/reducers/cartReducer";
import { setOrderId } from "../../../../redux/reducers/orderReducer";
import { getStoreType } from "../../../../redux/reducers/miscReducer";

const OrderProcessing = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const showSnackbar = useSnackbar();
  const [hits, setHits] = useState(0);

  const handleRemoveWallet = () => {
    try {
      removeWallet(cartId).then((res) => {
        if (res?.data?.status === "SUCCESS" && res?.data?.data?.es === 0) {
          dispatch(setCartBill(res?.data?.data?.data?.billing));
          dispatch(setWalletData(res?.data.data?.data?.redeemAmount));
        }
      });
    } catch (e) {
      showSnackbar(e?.message || e?.response?.data?.message, "error");
    }
  };

  const refreshCart = async () => {
    try {
      const res = await createCart({});
      if (res?.data?.data?.es !== 0) {
        return;
      }
      const result = res?.data?.data?.data;

      dispatch(setCartId(result?.cartId));
      dispatch(setCartProducts(result?.cartProducts));
      dispatch(setCartBill(result?.billing));
      dispatch(setShippingAddress(result?.shippingAddress));
      dispatch(setAppliedCoupon(result?.cartCoupon));
      dispatch(setLoyalityPoints(null));
      dispatch(setOrderId(null));
      navigate("/cart");
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const checkPaymentStatus = async () => {
    try {
      const res = await fetchOrderDetailsById({ id: orderId });

      if (res?.data) {
        if (res?.data?.data?.orderBillingDetails?.paymentMethod == "COD") {
          dispatch(setOrderId(orderId));
          navigate("/order-success");
        } else if (
          res?.data?.data?.baseOrderResponse?.paymentStatus ===
            "PAYMENT_COMPLETED" ||
          res?.data?.data?.baseOrderResponse?.paymentStatus ===
            "PAYMENT_PENDING"
        ) {
          dispatch(setOrderId(orderId));
          navigate("/order-success");
        } else if (
          res?.data?.data?.baseOrderResponse?.paymentStatus ===
          "PAYMENT_CANCELLED"
        ) {
          refreshCart();
        }
      }
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    if (orderId !== null) {
      checkPaymentStatus();
    } else {
      refreshCart();
    }
  }, [orderId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHits((prev) => prev + 1);
    }, 3000);

    const timeOut = setTimeout((err) => {
      showSnackbar(err?.message, "error");
      navigate(-1);
    }, 10000);
    return () => {
      clearTimeout(timeOut);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (hits > 0 && orderId !== null) {
      checkPaymentStatus();
    }
    return () => {
      setHits(0);
    };
  }, [hits, orderId]);

  //get retailype
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  const dynamicStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  };
  // const groceryStyle = {
  //   width: "100%",
  //   height: "100%",
  //   objectFit: "contain",
  // };
  return (
    <Box className="order-processing">
      <Box className="order-processing-loader">
        <img
          src={retailType === "RESTAURANT" ? SakuraLoader : TwinLoader}
          className="processing-loader"
          // style={retailType === "RESTAURANT" && dynamicStyle}
          style={retailType === "RESTAURANT" ? dynamicStyle : undefined}
        />
      </Box>
      <Text
        text={"Processing Your Order"}
        fontSize={18}
        fontWeight={700}
        tint="grey"
      />
    </Box>
  );
};

export default OrderProcessing;
