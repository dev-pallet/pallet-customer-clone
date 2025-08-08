import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme } from "@mui/material/styles";
import "./orderType.css";
import { restaurantCreateCartApi } from "../../../../utils/restaurantCartApi";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { useDispatch, useSelector } from "react-redux";
import {
  getBillingData,
  getDeliveryCharges,
  getDeliverySubOrderType,
  setAppliedCoupon,
  setCartBill,
  setCartId,
  setCartProducts,
  setCartStatus,
  setDeliveryType,
  setLoyalityPoints,
  setShippingAddress,
} from "../../../../redux/reducers/cartReducer";
import { getUserData } from "../../../../redux/reducers/userReducer";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";
import { increaseProductToRestaurantCart } from "../../../../config/services/cartService";
import { getFilterProducts } from "../../../../config/services/catalogService";

const OrderTypeSelector = ({
  cartProducts,
  // findDeliveryType,
  // setFindDeliveryType,
  getRestaurantCartData,
}) => {
  const subOrderType = useSelector(getDeliverySubOrderType);
  const deliveryValue = subOrderType;

  // useEffect(() => {
  //   getResturantCartData();
  // }, [deliveryValue]);

  const orderTypeOptions = [
    // { value: "DINE_IN", label: "Dine In" },
    { value: "TAKE_AWAY", label: "Take Away" },
    { value: "DELIVERY", label: "Delivery" },
  ];
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const cartId = localStorage.getItem("cartId");
  const [previousDeliveryType, setPreviousDeliveryType] =
    useState(deliveryValue);
  const userDataLocalStorage = localStorage.getItem("@user");
  const userData = userDataLocalStorage
    ? JSON.parse(userDataLocalStorage)
    : null;
  const user = useSelector(getUserData) || userData;
  const locationId = localStorage.getItem("locationId");
  const nearByStore = useSelector(getNearByStore);
  const bill = useSelector(getBillingData);
  const sourceId = localStorage.getItem("retailId");
  const deliveryCharges = useSelector(getDeliveryCharges);

  const getResturantCartData = async () => {
    const payload = {
      cartId: cartId,
      userName: user?.name,
      userId: user?.id,
      tableNumber: "1",
      mobileNo: user?.phoneNumber,
      enableWhatsapp: true,
      createdBy: user?.uidx,
      updatedBy: user?.uidx,
      locationId: locationId,
      sourceId: sourceId,

      // licenseId: "LIC000051",
      // terminalName: "TER-01",
      orderType: "RESTAURANT_ORDER",
      subOrderType: deliveryValue,
      sourceLocationId: locationId,
      sourceType: "RETAIL",
      channel: "B2C",
      loggedInUser: user?.uidx,
      sourceApp: "B2C",
      // destinationId: user?.organizationId,
      destinationId: sourceId,
      destinationLocationId: locationId,
      destinationType: "RETAIL",
      deliveryCharges:
        deliveryValue !== "TAKE_AWAY" ? parseInt(deliveryCharges) : 0,
      // sessionId: "RLC_8320250328103719",
    };
    await restaurantCreateCartApi({
      payload,
      onSuccess: (result) => {
        if (result?.data?.status === "SUCCESS") {
          showSnackbar(result?.data?.status, "success");
        }
      },
      onError: (msg) => {
        showSnackbar(msg, "error");
      },
      dispatchers: {
        setCartId: (id) => dispatch(setCartId(id)),
        setCartProducts: (products) => dispatch(setCartProducts(products)),
        setCartStatus: (products) => dispatch(setCartStatus(products)),
        setCartBill: (bill) => dispatch(setCartBill(bill)),
        setShippingAddress: (addr) => dispatch(setShippingAddress(addr)),
        setAppliedCoupon: (coupon) => dispatch(setAppliedCoupon(coupon)),
        // setDeliveryType: (deliveryType) =>
        //   dispatch(setDeliveryType(deliveryType)),
        setLoyalityPoints: (loyalty) => dispatch(setLoyalityPoints(loyalty)),
      },
    });
  };

  // Track only subOrderType change
  useEffect(() => {
    if (previousDeliveryType && previousDeliveryType !== deliveryValue) {
      // addProductsToCart();
      getResturantCartData();
      setPreviousDeliveryType(deliveryValue);
      // dispatch(setDeliveryType(deliveryValue));
      // setFindDeliveryType(deliveryValue);
    }
  }, [deliveryValue]);
  return (
    <Box className="parent-container-cart">
      <Box
        sx={{
          width: "60%",
          // mx: "auto",
          // p: 2,
          borderRadius: 2,
          bgcolor: "#FFFFFF",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          mb={2}
        >
          {orderTypeOptions?.map((type) => (
            <Button
              key={type?.value}
              //   variant={selectedType === type ? "contained" : "text"}
              //   onClick={() => {
              //     setSelectedType(type);
              //     setFindDeliveryType((prev) => ({
              //       ...prev,
              //       subOrderType: type,
              //     }));
              //   }}
              //  setFindDeliveryType((prev) => ({
              //   ...prev,
              //   subOrderType: type?.value,
              // }));
              variant={deliveryValue === type?.value ? "contained" : "text"}
              // onClick={() => {
              //   dispatch(
              //     setDeliveryType({
              //       subOrderType: type?.value,
              //     })
              //   );
              // }}
              // onClick={() => {
              //   dispatch(setDeliveryType(type?.value));
              // }}
              onClick={() => {
                dispatch(setDeliveryType(type?.value));
                setPreviousDeliveryType(deliveryValue); // Update previousDeliveryType to current value
              }}
              sx={{
                flexGrow: 1,
                minWidth: 0,
                fontSize: isMobile ? "0.75rem" : "0.9rem",
                bgcolor:
                  deliveryValue === type?.value
                    ? "rgb(173, 26, 25)"
                    : "#FFFFFF",
                color: deliveryValue === type?.value ? "white" : "#555",
                borderRadius: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor:
                    deliveryValue === type?.value
                      ? "rgb(173, 26, 25)"
                      : "#e0e0e0",
                },
              }}
            >
              {type?.label}
            </Button>
          ))}
        </Stack>

        {/* Option box below tabs */}
      </Box>
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: isMobile ? 1 : 1.5,
          borderRadius: 2,
          bgcolor: "#fff",
          boxShadow: "none",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AccessTimeIcon fontSize="small" />
          <Typography
            variant="body2"
            fontWeight={500}
            color={"#333333"}
            size={12}
          >
            {orderTypeOptions?.find((t) => t?.value === deliveryValue)?.label ||
              ""}{" "}
            now
          </Typography>
        </Stack>
        <IconButton size="small">
          <ChevronRightIcon sx={{ color: "rgb(173, 26, 25)" }} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default OrderTypeSelector;
