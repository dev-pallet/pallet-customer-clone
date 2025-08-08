import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// mui components
import { Box } from "@mui/material";

//custom-components
import { colorConstant } from "../../../../constants/colors";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import Text from "../../../custom-components/Text";

//services
import { createCart } from "../../../../config/services/cartService";
import { getNearestServiceableStores } from "../../../../config/services/serviceabilityService";

//redux
import {
  getAsyncStorageData,
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
import { getStoresList } from "../../../../redux/reducers/locationReducer";

const StoreList = ({ handleCloseStoreModal }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const storesList = useSelector(getStoresList);
  const activeStoreStyle = (item) =>
    selectedLocation !== null && selectedLocation?.regionId === item?.regionId
      ? "store-active"
      : null;
  const activeStoreTextColor = (item) =>
    selectedLocation !== null && selectedLocation?.regionId === item?.regionId
      ? colorConstant?.white
      : colorConstant?.primaryColor;

  const getSelectedStoreDetails = async () => {
    let selectedLoc = await getAsyncStorageData("storeDetails");
    setSelectedLocation(selectedLoc);
  };

  const getCartData = async () => {
    try {
      const res = await createCart({
        cartProducts: [],
      });

      const result = res?.data?.data?.data;
      if (res?.data?.data?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      dispatch(setCartId(res?.data?.data?.data?.cartId));
      dispatch(setCartProducts(result?.cartProducts));
      // const storeDataDetails = JSON.parse(localStorage.getItem("storeDetails"));
      // await storeData("cartData", {
      //   cartProducts: result?.cartProducts,
      //   storeDataDetails: storeDataDetails,
      // });
      await storePlainData("cartId", result?.cartId);
      dispatch(setCartBill(result?.billing));
      dispatch(setShippingAddress(result?.shippingAddress));
      dispatch(setAppliedCoupon(result?.cartCoupon));
      dispatch(setLoyalityPoints(null));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const handleStoreListItem = async (store) => {
    await storeData("storeDetails", {
      id: store?.sourceId,
      locId: store?.sourceLocationId,
      regionId: store?.regionId,
      latitude: store?.latitude,
      longitude: store?.longitude,
    });
    const payload = {
      lat: store?.latitude,
      long: store?.longitude,
    };
    await getNearestServiceableStores(payload);
    getCartData();
    handleCloseStoreModal();
  };

  useEffect(() => {
    getSelectedStoreDetails();
  }, []);

  return (
    <Box className="store-modal">
      {storesList?.map((item) => (
        <Box
          className={`store-list-item ${activeStoreStyle(item)}`}
          onClick={() => handleStoreListItem(item)}
          key={item?.regionId}
        >
          <Text
            text={item?.areaName}
            fontsize={12}
            fontweight={500}
            tint={activeStoreTextColor(item)}
            textTransform={"capitalize"}
          />
        </Box>
      ))}
    </Box>
  );
};

export default StoreList;
