//react
import React, { useEffect, useState } from "react";

// mui components
import { Box } from "@mui/material";

//custom components
import Footer from "../footer";
import Menuback from "../menuback";
import NotServiceable from "../notServiceable";

//css
import "./index.css";

//assets
import noCart from "../../assets/images/no-cart.png";

//cart-components
import CartAmountSaved from "./components/amountSaved";
import CartBillDetails from "./components/billDetails";
import CartCoupons from "./components/cartCoupons";
import CartItems from "./components/cartItems";
import CartLoyality from "./components/cartLoyality";
import DeliverySlots from "./components/deliverySlots";
import ReviewOrder from "./components/reviewOrder";
import SelectAddress from "./components/selectAddress";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getServiceable,
  getStoreType,
  setSlot,
} from "../../redux/reducers/miscReducer";

//services
import {
  getBillingData,
  getCartId,
  getCartProducts,
  getDeliveryCharges,
  getDeliverySubOrderType,
  getShippingAddress,
  setAppliedCoupon,
  setCartBill,
  setCartProducts,
  setDeliveryCharges,
  setDeliveryType,
  setLoyalityPoints,
  setShippingAddress,
  setWalletData,
} from "../../redux/reducers/cartReducer";
import { getNearByStore } from "../../redux/reducers/locationReducer";

import { useNavigate, useParams } from "react-router";

//custom-components
import StyledButton from "../custom-components/Button";
import Text from "../custom-components/Text";
import EndFooter from "../home/components/EndFooter";

//services
import {
  applyDeliveryCharges,
  getCartDetails,
  getResturantCart,
} from "../../config/services/cartService";
import { fetchDeliveryCharges } from "../../config/services/serviceabilityService";

// constants
import { colorConstant } from "../../constants/colors";
import { ScrollToTop } from "../../constants/commonFunction";
import { storeData, storePlainData } from "../../middlewares/localStorage";
import CartWallet from "./components/cartWallet";
import Checkout from "./components/checkout";
import NonLoggedIn from "./components/nonLoggedIn";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import OrderTypeSelector from "./components/orderTypeSelector.js";
import { CircularLoader } from "../custom-components/CircularLoader.js";
import { getDeliveryAddress } from "../../redux/reducers/userReducer.js";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Cart = () => {
  const isServiceable = useSelector(getServiceable);
  const showSnackbar = useSnackbar();
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const dispatch = useDispatch();
  const cartProducts = useSelector(getCartProducts);
  const shippingAddress = useSelector(getShippingAddress);
  const billData = useSelector(getBillingData);
  const navigate = useNavigate();
  const nearByStore = useSelector(getNearByStore);
  const userData = JSON.parse(localStorage.getItem("@user"));
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const [findDeliveryType, setFindDeliveryType] = useState({});
  const [loader, setLoader] = useState(false);
  const subOrderType = useSelector(getDeliverySubOrderType);
  const liveLoc = useSelector(getDeliveryAddress);
  const deliveryCharges = useSelector(getDeliveryCharges);

  //address is an array
  const findAddress = userData?.addresses?.filter(
    (selectedAddress) =>
      selectedAddress?.otherName === liveLoc?.otherName ||
      selectedAddress?.pincode === liveLoc?.pincode ||
      selectedAddress?.addressLine1 === liveLoc?.addressLine1
  );
  const addressForDeliverylatitude = findAddress?.[0]?.latitude;
  const addressForDeliverylongitude = findAddress?.[0]?.longitude;

  const getCartData = async () => {
    if (!cartId) return;
    try {
      const res = await getCartDetails(cartId);

      if (res?.data?.status !== "SUCCESS") {
        return;
      }
      // setFindDeliveryType(res?.data?.data);
      dispatch(setCartProducts(res?.data?.data?.cartProducts));
      const storeDataDetails = localStorage.getItem("storeDetails");
      // await storeData("cartData", {
      //   cartProducts: res?.data?.data?.cartProducts,
      //   storeDataDetails: storeDataDetails
      //     ? JSON.parse(storeDataDetails)
      //     : null,
      // });
      // await storePlainData("cartId", res?.data?.cartId);

      dispatch(setCartBill(res?.data?.data?.billing));
      dispatch(setShippingAddress(res?.data?.data?.shippingAddress));
      dispatch(setAppliedCoupon(res?.data?.data?.cartCoupon));
      if (
        res?.data?.data?.loyaltyPoints &&
        res?.data?.data?.loyaltyPoints !== ""
      ) {
        dispatch(
          setLoyalityPoints({
            loyaltyPoints: res?.data?.data?.loyaltyPoints,
            loyaltyPointsValue: res?.data?.data?.loyaltyPointsValue,
          })
        );
      }
      dispatch(setWalletData(res?.data?.data?.redeemAmount));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const getRestaurantCartData = async () => {
    if (!cartId) return;

    try {
      setLoader(true);
      const res = await getResturantCart(cartId);
      if (res?.data?.status !== "SUCCESS") {
        return;
      }
      const result = res?.data?.data;
      // setFindDeliveryType(result?.data?.subOrderType);
      // dispatch(setDeliveryType(result?.data?.subOrderType));
      dispatch(setCartProducts(result?.data?.cartProducts));
      dispatch(setCartBill(result?.data?.billing));
      dispatch(setShippingAddress(result?.data?.shippingAddress));
      dispatch(setAppliedCoupon(result?.data?.cartCoupon));
      // dispatch(setDeliveryType(result?.data?.subOrderType));
      if (
        res?.data?.data?.loyaltyPoints &&
        res?.data?.data?.loyaltyPoints !== ""
      ) {
        dispatch(
          setLoyalityPoints({
            loyaltyPoints: res?.data?.data?.loyaltyPoints,
            loyaltyPointsValue: res?.data?.data?.loyaltyPointsValue,
          })
        );
      }
      dispatch(setWalletData(res?.data?.data?.redeemAmount));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    if (retailType !== "RESTAURANT") {
      getCartData();
    } else {
      getRestaurantCartData();
    }
  }, [cartId]);

  const handleEmptyCartBtn = () => {
    navigate("/home");
  };

  const handleDelivery = async (data) => {
    try {
      const res = await applyDeliveryCharges(data);
      dispatch(setCartBill(res?.data?.data?.billing));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };
  useEffect(() => {
    if (!shippingAddress || !nearByStore) return;
    if (
      shippingAddress !== null &&
      shippingAddress?.latitude &&
      cartProducts?.length > 0
    ) {
      fetchDeliveryCharges({
        userLat: shippingAddress?.latitude || addressForDeliverylatitude,
        userLon: shippingAddress?.longitude || addressForDeliverylongitude,
        regionId: nearByStore?.regionId,
        cartValue: parseFloat(
          Number(billData?.subtotal) + Number(billData?.tax)
        )?.toFixed(2),
        // cartValue: billData?.totalCartValue,
      }).then((res) => {
        if (res?.data?.status === "SUCCESS") {
          const payload = {
            cartId,
            inventoryCheck: "YES",
            value: res?.data?.data?.data?.rate,
            // cartProducts?.length === 0
            //   ? 0
            //   : res?.data?.data?.statusCode === 2002 ||
            //     res?.data?.data?.statusCode === 2004
            //   ? 0
            //   : res?.data?.data?.data,
            freeDelivery:
              cartProducts?.length === 0
                ? false
                : res?.data?.data?.statusCode === 2002 ||
                  res?.data?.data?.statusCode === 2004
                ? true
                : false,
          };

          handleDelivery(payload);
        }
      });
    }
  }, [billData?.totalValue]);

  useEffect(() => {
    ScrollToTop();
  }, []);

  useEffect(() => {
    if (!cartProducts?.length) {
      dispatch(setSlot(null));
    }
  }, [cartProducts]);

  return (
    <>
      <Menuback
        head={true}
        text={
          <>
            Review Cart <ShoppingCartIcon color="white" />
          </>
        }
        bg={colorConstant?.baseBackground}
        redirect={"/"}
        wishlist={true}
        color={colorConstant?.white}
      />
      {isServiceable && cartProducts?.length ? (
        <>
          <Box
            className={
              !userData?.hasOwnProperty("active") ? "cart-nonLoggedIn" : "cart"
            }
          >
            <CartAmountSaved />
            <SelectAddress />
            {/* //this component is taken time to load cause it will chnage status according to delivery status,added loader */}
            {loader ? (
              <CircularLoader />
            ) : (
              <OrderTypeSelector
                cartProducts={cartProducts}
                // findDeliveryType={findDeliveryType}
                // setFindDeliveryType={setFindDeliveryType}
                getRestaurantCartData={getRestaurantCartData}
              />
            )}
            <Box
              sx={{
                backgroundColor: "#F5F5F5",
                marginTop: "14px",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <DeliverySlots />
              <CartItems />
            </Box>
            <CartCoupons />
            <CartLoyality />
            <CartWallet />
            <CartBillDetails />
            <ReviewOrder />
            {/* <Box className="end-footer-cart"> */}
            {/* <PaymentMethod /> */}
            {/* <EndFooter /> */}
            {/* </Box> */}
            {!userData?.hasOwnProperty("active") ? <NonLoggedIn /> : null}
            {userData?.hasOwnProperty("active") ? <Checkout /> : null}
          </Box>
        </>
      ) : isServiceable && !cartProducts?.length ? (
        <Box className="empty-cart">
          <Box className="empty-cart-img">
            <img src={noCart} className="cart-img" />
          </Box>
          <Box className="empyt-cart-description">
            <Text
              text={"Your cart is getting lonely"}
              fontSize={14}
              fontWeight={700}
            />
          </Box>
          <Box className="empty-cat-btn">
            <StyledButton
              variant="contained"
              text="Continue Shopping"
              borderRadius="2rem"
              onClick={handleEmptyCartBtn}
              textTransform="capitalize"
            />
          </Box>
        </Box>
      ) : (
        <Box
          className="un-serviceable"
          sx={{
            marginTop: "7rem",
          }}
        >
          <NotServiceable />
        </Box>
      )}
      {/* <Footer navigationVal={3} /> */}
    </>
  );
};

export default Cart;
