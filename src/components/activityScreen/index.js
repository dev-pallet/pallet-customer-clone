import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import moment from "moment";

//react-redux
import { useDispatch, useSelector } from "react-redux";

//reducers
import {
  getDeliveryAddress,
  getUserData,
  setDeliveryAddress,
} from "../../redux/reducers/userReducer";
import { getCoords, setCoords } from "../../redux/reducers/locationReducer";

import {
  setAppliedCoupon,
  setCartBill,
  setCartId,
  setCartProducts,
  setLoyalityPoints,
  setShippingAddress,
} from "../../redux/reducers/cartReducer";

// mui components
import { Box } from "@mui/material";

//assets
import mapPin from "../../assets/gif/mapPin.gif";

//services
import { getNearestServiceableStores } from "../../config/services/serviceabilityService";

import { createCart } from "../../config/services/cartService";

//custom-components
import Text from "../custom-components/Text";
import Heading from "../custom-components/Heading";

//constants
import { colorConstant } from "../../constants/colors";

//css
import "./index.css";

//custom-hook
import useCurrenLocation from "../../custom hooks/useCurrenLocation";
import { getAddressFromLatLong } from "../../constants/ConvertLatLongToAddress";
import { storeData, storePlainData } from "../../middlewares/localStorage";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { debounce } from "lodash";

const ActivityScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loc = useCurrenLocation();
  const showSnackbar = useSnackbar();
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const coords = useSelector(getCoords);
  const liveLoc = useSelector(getDeliveryAddress);
  const [address, setAddress] = useState(null);
  const storeDetails = JSON.parse(localStorage.getItem("storeDetails"));
  const debouncedGetNearestStores = useRef(
    debounce((lat, long) => {
      getNearestServiceableStores({ lat, long });
    }, 1000)
  ).current;
  useEffect(() => {
    if (loc) {
      getAddressFromLatLong(loc?.latitude, loc?.longitude).then((res) => {
        if (res) {
          dispatch(setDeliveryAddress({ ...res, ...loc }));
        }
      });
      debouncedGetNearestStores(loc?.latitude, loc?.longitude);
    }
  }, [loc]);

  const cartCreation = async (data) => {
    try {
      // const storeDetails = JSON.parse(localStorage.getItem("cartData"));
      const response = await createCart(data);
      const result = response?.data?.data;
      if (result?.es !== 0) {
        return;
      }

      dispatch(setCartId(result?.data?.cartId));
      dispatch(setCartProducts(result?.data?.cartProducts));
      // let storeDataLocalStorage = localStorage.getItem("storeDetails");
      // const storeDataDetails = storeDataLocalStorage
      //   ? JSON.parse(storeDataLocalStorage)
      //   : null;
      // await storeData("cartData", {
      //   cartProducts: result?.data?.cartProducts,
      //   storeDataDetails: storeDataDetails,
      // });
      await storePlainData("cartId", result?.cartId);
      dispatch(setCartBill(result?.data?.billing));
      dispatch(setShippingAddress(result?.data?.shippingAddress));
      dispatch(setAppliedCoupon(result?.data?.cartCoupon));
      dispatch(setLoyalityPoints(null));

      if (storeDetails !== null && storeDetails?.cartProducts?.length) {
        const payload = {
          lat: storeDetails?.storeDataDetails?.latitude,
          long: storeDetails?.storeDataDetails?.longitude,
        };

        await getNearestServiceableStores(payload);
        navigate("/home");
      }
    } catch (err) {
      showSnackbar(
        err?.message || err?.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const temp =
        user?.addresses && user?.addresses?.length > 0
          ? user?.addresses.find((e) => e?.defaultShipping) ||
            user?.addresses?.[0]
          : null;
      if (temp) {
        setAddress(temp);
        // dispatch(
        //   setCoords({
        //     latitude: parseFloat(temp?.latitude),
        //     longitude: parseFloat(temp?.longitude),
        //     latitudeDelta: 0.02,
        //   })
        // );

        // getNearestServiceableStores({
        //   lat: temp?.latitude,
        //   long: temp?.longitude,
        // });
        debouncedGetNearestStores(temp?.latitude, temp?.longitude);
        dispatch(setDeliveryAddress(temp));
      }
      return;
    } else {
      getNearestServiceableStores({
        lat: coords?.latitude,
        long: coords?.longitude,
      });
      setAddress(liveLoc);
    }
  }, [liveLoc]);

  useEffect(() => {
    if (address !== null) {
      const addressData = {
        userName: user?.name,
        userId: user?.id,
        mobileNo: user?.phoneNumber,
        enableWhatsapp: true,
        updatedBy: user?.uidx,
        locationId: user?.uidx,
        loggedInUser: user?.uidx,
        billingAddress: address?.id
          ? {
              ...address,
              addressId: address?.id,
              pinCode: address?.pincode,
              addressType:
                address?.addressType === "OTHER"
                  ? address?.otherName
                  : address?.addressType,
              updatedOn: moment(new Date()).toISOString(),
              updatedBy: user?.uidx,
            }
          : null,
        shippingAddress: address?.id
          ? {
              ...address,
              addressId: address?.id,
              pinCode: address?.pincode,
              addressType:
                address?.addressType === "OTHER"
                  ? address?.otherName
                  : address?.addressType,
              updatedOn: moment(new Date()).toISOString(),
              updatedBy: user?.uidx,
            }
          : null,
      };

      cartCreation(addressData);
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    }
  }, [address]);

  return (
    <Box className="activity-screen">
      <Box className="map-image">
        <img src={mapPin} className="map-gif" />
      </Box>
      {address && (
        <>
          <Text
            text={"Delivering To"}
            letterSpacing={1}
            tint
            fontweight={400}
          />
          <Heading
            text={
              address?.id
                ? address?.addressType === "OTHER"
                  ? address?.otherName
                  : address?.addressType
                : address?.city
            }
            color={colorConstant?.primaryColor}
            fontSize={16}
          />
          <Text
            textAlign="center"
            width="70%"
            text={address?.addressLine1 + " " + address?.addressLine2 + " "}
            noWrap
          />
          <Text
            textAlign="center"
            width="70%"
            text={address?.city + "," + address?.state + "," + address?.pincode}
            noWrap
          />
        </>
      )}
    </Box>
  );
};

export default ActivityScreen;
