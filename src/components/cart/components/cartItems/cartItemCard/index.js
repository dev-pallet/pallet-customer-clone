import React, { useEffect, useState } from "react";

// mui components
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, CircularProgress } from "@mui/material";

//css
import "./index.css";

//custom-components
import { truncateText } from "../../../../../constants/commonFunction";
import { no_image } from "../../../../../constants/imageUrl";
import Heading from "../../../../custom-components/Heading";
import Text from "../../../../custom-components/Text";

//services
import {
  addQuantityInProduct,
  decreaseProductFromCart,
  increaseProductToCart,
  increaseProductToRestaurantCart,
  removeAssets,
  removeProductFromCart,
  removeRestaurantProductFromCart,
} from "../../../../../config/services/cartService";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getAppliedCoupon,
  getBillingData,
  getCartId,
  getCartProducts,
  getDeliverySubOrderType,
  getLoyalityData,
  getWalletData,
  setAppliedCoupon,
  setCartBill,
  setCartProducts,
  setDeliveryType,
  setLoyalityPoints,
  setShippingAddress,
  setWalletData,
} from "../../../../../redux/reducers/cartReducer";

//constants
import { useNavigate } from "react-router-dom";
import { colorConstant } from "../../../../../constants/colors";
import { API_CONSTANTS } from "../../../../../constants/storageConstants";
import { useSnackbar } from "../../../../../custom hooks/SnackbarProvider";
import {
  storeData,
  storePlainData,
} from "../../../../../middlewares/localStorage";
import { getNearByStore } from "../../../../../redux/reducers/locationReducer";
import { getStoreType } from "../../../../../redux/reducers/miscReducer";
import { getFilterProducts } from "../../../../../config/services/catalogService";
import { CircularLoader } from "../../../../custom-components/CircularLoader";
import { restaurantCreateCartApi } from "../../../../../utils/restaurantCartApi";

const CartItemCard = ({ cartItem }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [productQty, setProductQty] = useState(cartItem?.quantity);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const walletData = useSelector(getWalletData);
  const loyalityData = useSelector(getLoyalityData);
  const couponApplied = useSelector(getAppliedCoupon);
  const showSnackbar = useSnackbar();
  const nearByStore = useSelector(getNearByStore);
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const userString = localStorage.getItem("@user");
  const user = userString ? JSON.parse(userString) : null;
  const cartProducts = useSelector(getCartProducts);
  // const [channelPrice, setChannelPrice] = useState(cartItem?.sellingPrice);
  const deliveryType = useSelector(getDeliverySubOrderType);
  const [priceChangingLoader, setPriceChangingLoader] = useState(false);
  const billingData = useSelector(getBillingData);

  const sourceId = localStorage.getItem("retailId");

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

  const decrementProductFromCart = async () => {
    if (!cartId) return;

    const payload = {
      cartId: cartId,
      sellingPrice: cartItem?.sellingPrice,
      gtin: cartItem?.gtin,
      mrp: cartItem?.mrp,
      qty: productQty,
      inventoryChecks: "NO",
      locationId: String(nearByStore?.locId),
      // inventoryChecks: API_CONSTANTS.inventoryCheck,
    };

    try {
      setLoader(true);
      const res = await decreaseProductFromCart(payload);
      setLoader(false);
      const result = res?.data?.data;
      if (res?.data?.status == "SUCCESS") {
        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));
        // const storeDataDetails = localStorage.getItem("storeDetails");
        // await storeData("cartData", {
        //   cartProducts: result?.cartProducts,
        //   storeDataDetails: storeDataDetails
        //     ? JSON.parse(storeDataDetails)
        //     : null,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      } else {
        showSnackbar(res?.data?.message, "error");
      }
    } catch (err) {
      setLoader(false);
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  //added function for restaurant decrement of product
  const decrementRestroProductFromCart = async (data) => {
    if (!cartId) return;

    const variantId = data?.variantId;
    const cartProduct = cartProducts?.find(
      (item) => item?.variantId === variantId
    );

    const restroPayload = {
      cartId: cartId,
      cartProductId: cartProduct?.cartProductId,
      qty: (productQty || 1) - 1,
    };
    try {
      setLoader(true);
      const res = await addQuantityInProduct(restroPayload);

      if (res?.data?.status === "ERROR") {
        showSnackbar(res?.data?.message, "error");
        return;
      }

      const result = res?.data?.data;

      //handle es error or socket hang up error
      if (result?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      if (res?.data?.status == "SUCCESS") {
        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));
        // const storeDataDetails = localStorage.getItem("storeDetails");
        // await storeData("cartData", {
        //   cartProducts: result?.data?.cartProducts,
        //   storeDataDetails: storeDataDetails
        //     ? JSON.parse(storeDataDetails)
        //     : null,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      } else {
        showSnackbar(res?.data?.message, "error");
      }
    } catch (err) {
      showSnackbar();
    }
  };

  //added function for restaurant increment of product
  const incrementRestroProductFromCart = async (data) => {
    if (!cartId) return;

    const variantId = data?.variantId;
    const cartProduct = cartProducts?.find(
      (item) => item?.variantId === variantId
    );

    const restroPayload = {
      cartId: cartId,
      cartProductId: cartProduct?.cartProductId,
      qty: (productQty || 1) + 1,
    };
    try {
      setLoader(true);
      const res = await addQuantityInProduct(restroPayload);

      if (res?.data?.status === "ERROR") {
        showSnackbar(res?.data?.message, "error");
        return;
      }

      const result = res?.data?.data;
      //handle es error or socket hang up error
      if (result?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }

      if (res?.data?.status == "SUCCESS") {
        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));
        // const storeDataDetails = localStorage.getItem("storeDetails");
        // await storeData("cartData", {
        //   cartProducts: result?.data?.cartProducts,
        //   storeDataDetails: storeDataDetails
        //     ? JSON.parse(storeDataDetails)
        //     : null,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      } else {
        showSnackbar(res?.data?.message, "error");
      }
    } catch (err) {
      showSnackbar(err?.message, "error");
    }
  };

  const addProductToCart = async (data) => {
    try {
      setLoader(true);
      const res = await increaseProductToCart(data);

      if (res?.data?.data?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      setLoader(false);
      const result = res?.data?.data;

      if (res?.data?.status == "SUCCESS") {
        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));
        // const storeDataDetails = localStorage.getItem("storeDetails");

        // await storeData("cartData", {
        //   cartProducts: result?.data?.cartProducts,
        //   storeDataDetails: storeDataDetails
        //     ? JSON.parse(storeDataDetails)
        //     : null,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      } else {
        showSnackbar(res?.data?.message, "error");
      }
    } catch (err) {
      setLoader(false);
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    } finally {
      setLoader(false);
    }
  };

  const handleIncrementProduct = () => {
    addProductToCart({
      cartId: cartId,
      sellingPrice: cartItem?.sellingPrice,
      qty: productQty + 1,

      // inventoryChecks: API_CONSTANTS.inventoryCheck,
      inventoryChecks: true,
      locationId: String(nearByStore?.locId),

      ...(retailType !== "RESTAURANT"
        ? { gtin: cartItem?.gtin, mrp: cartItem?.mrp }
        : { variantId: cartItem?.variantId, orgId: user?.organizationId }),
    });
    setProductQty((prev) => prev + 1);
  };

  const handleDecremnetProduct = () => {
    if (productQty > 1) {
      setProductQty((prev) => prev - 1);
      decrementProductFromCart();
    } else {
      decrementProductFromCart();
      setProductQty(1);
    }
  };

  const deletCartProduct = async () => {
    if (!cartId) return;
    const payload = {
      cartId,
      sellingPrice: cartItem?.sellingPrice,
      mrp: cartItem?.mrp,
      gtin: cartItem?.gtin,
      inventoryChecks: API_CONSTANTS?.inventoryCheck,
    };
    const restroPayload = {
      cartId,
      cartProductId: cartItem?.cartProductId,
      comments: cartItem?.comments,
    };

    try {
      const res =
        retailType !== "RESTAURANT"
          ? await removeProductFromCart(payload)
          : await removeRestaurantProductFromCart(restroPayload);
      const result = res?.data?.data;

      if (res?.data?.status == "SUCCESS") {
        handleAssets();
        const dispatchVal =
          retailType !== "RESTAURANT"
            ? result?.cartProducts
            : result?.data?.cartProducts;
        dispatch(setCartProducts(dispatchVal));
        // const storeDataDetails = localStorage.getItem("storeDetails");

        // await storeData("cartData", {
        //   cartProducts: result?.cartProducts,
        //   storeDataDetails: storeDataDetails
        //     ? JSON.parse(storeDataDetails)
        //     : null,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));

        showSnackbar(res?.data?.message || "Item Deleted", "success");
        return;
      }
      showSnackbar(res?.data?.message || "An error occured", "error");
    } catch (err) {
      showSnackbar(
        err?.message ||
          err?.response?.data?.message ||
          "Something went wrong in removing product ",
        "error"
      );
    }
  };

  return (
    <Box className="cart-item-card">
      <Box className="cart-item-image">
        <img
          src={cartItem?.productImage || no_image}
          className="cart-img"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product-details/${cartItem?.gtin}`);
          }}
        />
      </Box>
      <Box className="cart-item-details">
        <Heading
          text={truncateText(cartItem?.variantName, 30)}
          fontSize={12}
          fontWeight={600}
          tint="#333333"
        />
        <Box
        // sx={{
        //   display: "flex",
        //   justifyContent: "flex-start",
        //   alignItems: "flex-start",
        // }}
        >
          {cartItem?.addonProduct?.map((item) => (
            <>
              <Text
                text={`${truncateText(item?.itemName, 30)}`}
                fontSize={10}
                fontWeight={500}
                tint="#333333"

                // sx={{
                //   display: "flex",
                //   justifyContent: "flex-start",
                //   alignItems: "flex-start",
                // }}
              />
            </>
          ))}
        </Box>
        <Text text={"1 piece"} tint={"#333333"} fontWeight="500" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          {cartItem?.mrp > cartItem?.sellingPrice && (
            <Text
              text={`₹${cartItem?.mrp}`}
              fontWeight={500}
              tint={"black"}
              fontSize={13}
              style={{ textDecoration: "line-through", marginRight: 8 }}
            />
          )}

          {/* {priceChangingLoader ? (
            <CircularLoader />
          ) : ( */}
          <Text
            text={`₹${cartItem?.sellingPrice}`}
            fontWeight={500}
            tint={"black"}
            fontSize={13}
          />
          {/* )} */}
        </Box>
      </Box>
      <Box className="remove-product">
        <DeleteOutlineIcon
          onClick={deletCartProduct}
          sx={{
            fontSize: "1rem",
            color: "rgb(173, 26, 25)",
          }}
        />
      </Box>
      <Box className="cart-item-qty-counter">
        <Box className="product-qty-counter">
          <Box
            className="decrement-qty"
            onClick={() => {
              retailType === "RESTAURANT"
                ? decrementRestroProductFromCart(cartItem)
                : handleDecremnetProduct();
            }}
            variant="text"
          >
            <RemoveIcon />
          </Box>
          {loader ? (
            <CircularProgress
              sx={{
                color: colorConstant?.primaryColor,
                width: "10px !important",
                height: "10px !important",
              }}
            />
          ) : (
            <Text text={productQty} className="product-qty" />
          )}
          <Box
            className="increment-qty"
            onClick={() => {
              retailType === "RESTAURANT"
                ? incrementRestroProductFromCart(cartItem)
                : handleIncrementProduct();
            }}
            variant="text"
          >
            <AddIcon />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartItemCard;
