// react
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// mui components
import { Box, Button, CircularProgress } from "@mui/material";
//mui-icons
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// custom components
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import Loader from "../custom-components/Loader";
import Text from "../custom-components/Text";
import Banner from "../home/components/Banner";
import Menuback from "../menuback";

// constants
import { colorConstant } from "../../constants/colors";
import { boxShadow } from "../../constants/cssStyles";
import { no_image } from "../../constants/imageUrl";
import constants, { API_CONSTANTS } from "../../constants/storageConstants";

//services
import {
  createCart,
  decreaseProductFromCart,
  increaseProductToCart,
  removeAssets,
} from "../../config/services/cartService";
import { getFilterProducts } from "../../config/services/catalogService";

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
  setShippingAddress,
  setWalletData,
} from "../../redux/reducers/cartReducer";
import { getStoreType, setAlertMsg } from "../../redux/reducers/miscReducer";
import Favourite from "../Favourites/Favourite";

// middlewares
import { storeData, storePlainData } from "../../middlewares/localStorage";
import DeliveryTat from "./DeliveryTat";

// css
import ViewCart from "../home/components/viewCart";
import "./index.css";
import { getNearByStore } from "../../redux/reducers/locationReducer";
import { getAddBtnStyle } from "../../constants/commonFunction";

export default function ProductDetails() {
  const params = useParams();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [productData, setProductData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [images, setImages] = useState([]);
  const [productQty, setProductQty] = useState(1);
  const [addProduct, setAddProduct] = useState(false);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const cartProducts = useSelector(getCartProducts);
  const nearByStore = useSelector(getNearByStore);
  const walletData = useSelector(getWalletData);
  const loyalityData = useSelector(getLoyalityData);
  const couponApplied = useSelector(getAppliedCoupon);
  const showSnackbar = useSnackbar();
  const retailType = useSelector(getStoreType);

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
  const page = "product-details";

  useEffect(() => {
    (() => {
      const temp = [];
      productData?.images &&
        Object?.values(productData?.images)?.map((item) => {
          if (item !== "" && item !== null && item !== undefined) {
            temp?.push(
              <div className="img_container">
                <img
                  src={item}
                  style={{
                    width: "100%",
                  }}
                  role="presentation"
                />
              </div>
            );
          }
        });
      if (temp?.length === 0) {
        temp?.push(
          <div className="img_container">
            <img
              src={no_image}
              style={{
                width: "100%",
              }}
              role="presentation"
            />
          </div>
        );
      }
      setImages(temp);
    })();
  }, [productData]);

  const discount = parseInt(
    (
      ((inventoryData?.mrp - inventoryData?.sellingPrice) /
        inventoryData?.mrp) *
      100
    ).toFixed(2)
  );

  const getProductDetails = async () => {
    const payload = {
      barcode: [String(params?.gtin)],
    };

    try {
      const response = await getFilterProducts(payload);

      if (response?.data?.data?.es == 0) {
        // const product = response?.data?.data?.data?.response?.[0]?.product;
        const product = response?.data?.data?.data?.data?.[0]?.variants?.[0];
        // const inventory =
        //   response?.data?.data?.data?.response?.[0]?.inventoryData;
        const inventory =
          response?.data?.data?.data?.data?.[0]?.variants?.[0]?.inventorySync;

        setProductData(product);
        setInventoryData(inventory);
      } else {
        return;
      }
    } catch (err) {
      showSnackbar(
        err?.message ||
          err?.response?.data?.message ||
          "SOmething went wrong while fetching product",
        "error"
      );
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  const decrementProductFromCart = async () => {
    if (!cartId) return;
    const payload = {
      cartId: cartId,
      sellingPrice: inventoryData?.sellingPrice,
      // gtin: productData?.gtin,
      qty: productQty,
      gtin: inventoryData?.gtin,
      mrp: inventoryData?.mrp || productData?.mrp?.mrp,
      inventoryChecks: "NO",
      locationId: String(nearByStore?.locId),
    };
    try {
      setLoader(true);
      const res = await decreaseProductFromCart(payload);
      setLoader(false);
      const result = res?.data?.data;
      if (res?.data?.status == "SUCCESS") {
        handleAssets();
        dispatch(setCartProducts(result?.cartProducts));
        // const storeDataDetails = JSON.parse(
        //   localStorage.getItem("storeDetails")
        // );
        // await storeData("cartData", {
        //   cartProducts: result?.cartProducts,
        //   storeDataDetails: storeDataDetails,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.billing));
        return;
      } else {
        showSnackbar(res?.message, "error");
      }
      dispatch(setAlertMsg({ status: "error", message: res?.message }));
    } catch (err) {
      setLoader(false);
      dispatch(setAlertMsg({ status: "error", message: "Unable to delete" }));
      // setProductQty(itemToAdd?.quantity);
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
      if (res?.data?.status === "ERROR") {
        showSnackbar(res?.data?.message, "error");
        return;
      }
      setLoader(false);
      const result = res?.data?.data;

      if (result?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }

      if (res?.data?.status == "SUCCESS") {
        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));
        // const storeDataDetails = JSON.parse(
        //   localStorage.getItem("storeDetails")
        // );
        // await storeData("cartData", {
        //   cartProducts: result?.data?.cartProducts,
        //   storeDataDetails: storeDataDetails,
        // });
        await storePlainData("cartId", res?.data?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      } else {
        showSnackbar(res?.message, "error");
      }
    } catch (err) {
      setLoader(false);
      dispatch(setAlertMsg({ status: "error", message: "Unable to add" }));
      // setProductQty(itemToAdd?.quantity);
    }
  };

  const cartCreation = async () => {
    try {
      const res = await createCart({});
      const result = res?.data?.data?.data;
      if (res?.data?.data?.es !== 0) {
        return;
      }
      setProductQty(1);
      dispatch(setCartId(res?.data?.data?.data?.cartId));
      addProductToCart({
        cartId: res?.data?.data?.data?.cartId,
        sellingPrice: inventoryData?.sellingPrice,
        // gtin: productData?.gtin,
        gtin: inventoryData?.gtin,
        qty: 1,
        mrp: inventoryData?.mrp || productData?.mrp?.mrp,
        inventoryChecks: true,
        locationId: String(nearByStore?.locId),
      });
      dispatch(setCartProducts(result?.data?.data?.cartProducts));
      // const storeDataDetails = JSON.parse(localStorage.getItem("storeDetails"));
      // await storeData("cartData", {
      //   cartProducts: result?.barcodes,
      //   storeDataDetails: storeDataDetails,
      // });
      await storePlainData("cartId", result?.cartId);
      dispatch(setCartBill(result?.data?.data?.billing));
      dispatch(setShippingAddress(result?.data?.data?.shippingAddress));
      dispatch(setAppliedCoupon(result?.data?.data?.cartCoupon));
      dispatch(setLoyalityPoints(null));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const handleAddProduct = () => {
    setAddProduct(true);
    if (cartId !== null) {
      setProductQty(1);
      addProductToCart({
        cartId: cartId,
        sellingPrice: inventoryData?.sellingPrice,
        // gtin: productData?.gtin,
        gtin: inventoryData?.gtin,
        qty: 1,
        mrp: inventoryData?.mrp || productData?.mrp?.mrp,
        inventoryChecks: true,
        locationId: String(nearByStore?.locId),
      });
    } else {
      cartCreation();
    }
  };

  const handleIncrementProduct = () => {
    addProductToCart({
      cartId: cartId,
      sellingPrice: inventoryData?.sellingPrice,
      // gtin: productData?.gtin,
      gtin: inventoryData?.gtin,
      qty: productQty + 1,
      mrp: inventoryData?.mrp || productData?.mrp?.mrp,
      inventoryChecks: true,
      locationId: String(nearByStore?.locId),
    });
    setProductQty((prev) => prev + 1);
    handleAssets();
  };

  const handleDecremnetProduct = () => {
    if (productQty > 1) {
      setProductQty((prev) => prev - 1);
      decrementProductFromCart();
    } else {
      decrementProductFromCart();
      setAddProduct(false);
      setProductQty(1);
    }
  };
  const parsedDiscount = Number(discount);

  useEffect(() => {
    const matchingProduct = cartProducts?.find((item) => {
      return item?.gtin === productData?.barcodes?.[0];
    });
    if (matchingProduct) {
      setProductQty(matchingProduct?.quantity);
      setAddProduct(true);
    } else {
      setProductQty(1);
      setAddProduct(false);
    }
  }, [cartProducts, productData]);

  const dynamicStyle = getAddBtnStyle(retailType);

  return (
    <Box bgcolor={colorConstant?.baseBackground}>
      <Menuback
        head={true}
        search={true}
        bg={colorConstant?.baseBackground}
        text={productData?.name}
      />
      {!productData ? (
        <Loader />
      ) : (
        <Box px="10px">
          <Box
            className={page === "product-details" && "carousel"}
            marginTop="3rem"
            padding="0px 0px 40px"
            backgroundColor={colorConstant?.white}
            borderRadius="1rem"
            boxShadow={boxShadow}
          >
            <Banner bannersData={images} isDetailsPage={true} />
          </Box>

          {productData !== null ? (
            <DeliveryTat locId={productData?.productSource?.sourceId} />
          ) : null}
          <Box>
            {/* product title and price  */}
            <Box
              mt={6}
              mb={2}
              px="10px"
              pt="10px"
              pb="20px"
              borderRadius="1rem"
              bgcolor={colorConstant?.white}
              boxShadow={boxShadow}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Text text={productData?.brand} tint="rgb(134,140,150)" />
                <Favourite
                  gtin={
                    inventoryData?.["gtin"] ||
                    productData?.barcodes?.[0] ||
                    productData?.variants?.[0]?.["inventorySync"]?.["gtin"]
                  }
                />
              </Box>
              <Text text={productData?.name} />
              <br />
              <Text
                text={
                  `${
                    productData?.weight ||
                    productData?.weights_and_measures?.net_content ||
                    "NA"
                  }` +
                  " " +
                  `${
                    constants.UNIT_TYPES[productData?.weightUnit] ||
                    productData?.weights_and_measures?.measurement_unit ||
                    "NA"
                  }`
                }
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Text
                    // text={`₹ ${inventoryData?.mrp?.toFixed(2)}`}
                    text={
                      typeof inventoryData?.mrp === "number"
                        ? `₹ ${inventoryData?.mrp?.toFixed(2)}`
                        : "NA"
                    }
                    display="inline"
                    tint="rgb(134,140,150)"
                    sx={{ textDecoration: "line-through" }}
                    wishList={true}
                  />
                  <Text
                    // text={`₹ ${inventoryData?.sellingPrice?.toFixed(2)}`}
                    text={
                      typeof inventoryData?.sellingPrice === "number"
                        ? `₹ ${inventoryData?.sellingPrice?.toFixed(2)}`
                        : "NA"
                    }
                    fontweight="bold"
                    display="inline"
                    marginLeft="5px"
                    fontsize="14px"
                  />
                  <Text
                    // text={
                    //   typeof discount === "number"
                    //     ? `${discount}% OFF`
                    //     : "No Discount"
                    // }
                    text={
                      Number.isFinite(parsedDiscount) && parsedDiscount > 0
                        ? `${parsedDiscount?.toFixed(0)}% OFF`
                        : "No Discount"
                    }
                    tint={colorConstant?.primaryColor}
                    fontweight="bold"
                    display="inline"
                    marginLeft="10px"
                    padding="2px 5px"
                    backgroundColor={colorConstant?.tintColor}
                  />
                </Box>

                {!addProduct ? (
                  <Box className="product-add-btn">
                    <Button
                      // className="add-btn"
                      sx={dynamicStyle}
                      // sx={{ marginTop: "-10px" }}
                      onClick={
                        inventoryData?.availableUnits !== 0
                          ? handleAddProduct
                          : null
                      }
                    >
                      {inventoryData?.availableUnits !== 0
                        ? "ADD"
                        : "Out of Stock"}
                    </Button>
                  </Box>
                ) : (
                  <Box className="product-qty-counter">
                    <Box
                      className="decrement-qty"
                      onClick={handleDecremnetProduct}
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
                      onClick={handleIncrementProduct}
                      variant="text"
                    >
                      <AddIcon />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
            {/* product description  */}
            <Box
              mb={10}
              px="10px"
              py="10px"
              borderRadius="1rem"
              bgcolor={colorConstant?.white}
              boxShadow={boxShadow}
            >
              <Text text="Description" fontweight="bold" />
              <Text text={productData?.description} tint="rgb(134,140,150)" />
            </Box>
          </Box>
        </Box>
      )}

      <ViewCart adjustView={true} />
    </Box>
  );
}
