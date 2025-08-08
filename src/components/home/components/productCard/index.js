// react
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// mui components
import { Box, Button, CircularProgress } from "@mui/material";

// styles
import "./index.css";

// icons
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

// custom components
import { no_image } from "../../../../constants/imageUrl";
import Text from "../../../custom-components/Text";
import Favourite from "../../../Favourites/Favourite";

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
} from "../../../../redux/reducers/cartReducer";

//services
import {
  createCart,
  decreaseProductFromCart,
  increaseProductToCart,
  removeAssets,
} from "../../../../config/services/cartService";

// constants
import { colorConstant } from "../../../../constants/colors";
import { API_CONSTANTS } from "../../../../constants/storageConstants";

// reducers
import {
  getStoreType,
  getUserCurrentLocationServiceable,
} from "../../../../redux/reducers/miscReducer";

// middlewares
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import {
  storeData,
  storePlainData,
} from "../../../../middlewares/localStorage";
import { getUserData } from "../../../../redux/reducers/userReducer";
import ProductModal from "./productModal";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";
import { getAddBtnStyle } from "../../../../constants/commonFunction";

function ProductCard({
  verticalListing,
  imageUrl,
  discountText,
  productName,
  productDescription,
  productQuantity,
  originalPrice,
  discountedPrice,
  uniqueKey,
  productData,
  productAvailablity,
}) {
  const { product, inventoryData, inventorySync, variants } = productData;

  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const [loader, setLoader] = useState(false);
  const [productQty, setProductQty] = useState(1);
  const [addProduct, setAddProduct] = useState(false);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const cartProducts = useSelector(getCartProducts);
  const [productModalPage, setProductModalPage] = useState(false);
  const [variantData, setVariantData] = useState([]);
  const showSnackbar = useSnackbar();
  const nearByStore = useSelector(getNearByStore);
  const [holdErrorMsg, setHoldErrorMsg] = useState(null);
  const retailType = useSelector(getStoreType);
  // const itemToAdd = cartProducts?.find((i) => {
  //   return i?.gtin === productData?.variants?.[0]?.barcodes;
  // });
  const walletData = useSelector(getWalletData);
  const loyalityData = useSelector(getLoyalityData);
  const couponApplied = useSelector(getAppliedCoupon);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isUserCurrentLocationServiceable = useSelector(
    getUserCurrentLocationServiceable
  );

  function filteredVariantsData() {
    const matchedVariant = productData?.variants?.filter((variant) => variant);
    setVariantData(matchedVariant || null);
  }

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
      sellingPrice: variants?.[0]?.inventorySync?.sellingPrice,
      gtin: variants?.[0]?.inventorySync?.gtin,
      mrp: variants?.[0]?.inventorySync?.mrp || inventorySync?.mrp,
      inventoryChecks: "NO",
      qty: productQty,
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
        // const storeDataDetails = localStorage.getItem("storeDetails");

        // await storeData("cartData", {
        //   cartProducts: result?.cartProducts,
        //   storeDataDetails: storeDataDetails
        //     ? JSON.parse(storeDataDetails)
        //     : null,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.billing));
      } else {
        showSnackbar(res?.data?.message || "something went wrong", "error");
      }
    } catch (err) {
      setLoader(false);
      showSnackbar(err?.message || err?.response?.data?.message, "error");
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

      const result = res?.data?.data;

      if (result?.es !== 0) {
        setHoldErrorMsg(res?.data?.data?.message);
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }

      if (res?.data?.status == "SUCCESS") {
        // Update UI state only on success
        setAddProduct(true);
        setProductQty((prev) => prev + 1);

        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));
        // const storeDataDetails = "";
        // JSON.parse(localStorage.getItem("storeDetails"));

        // await storeData("cartData", {
        //   cartProducts: result?.data?.cartProducts,
        //   storeDataDetails: storeDataDetails,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      } else {
        if (!productModalPage) {
          showSnackbar(res?.data?.message, "success");
        }
      }
    } catch (err) {
      setLoader(false);

      showSnackbar(err?.message, "error");
      // setProductQty(itemToAdd?.quantity);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const matchingProduct = cartProducts?.find(
      (item) => item?.gtin === productData?.variants?.[0]?.barcodes?.[0]
    );
    if (matchingProduct) {
      setProductQty(matchingProduct?.quantity);
      setAddProduct(true);
    } else {
      setProductQty(1);
      setAddProduct(false);
    }
  }, [cartProducts, productData]);

  const cartCreation = async () => {
    try {
      const res = await createCart({});
      const result = res?.data?.data;

      if (res?.data?.data?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      // setProductQty(1);
      dispatch(setCartId(result?.data?.cartId));
      addProductToCart({
        cartId: result?.data?.cartId,
        sellingPrice: inventorySync?.sellingPrice || productData?.sellingPrice,
        gtin:
          productData?.barcodes?.[0] ||
          productData?.variants?.[0]?.barcodes?.[0],
        qty: 1,
        mrp: inventorySync?.mrp || inventorySync?.mrp,
        inventoryChecks: true,
        locationId: String(nearByStore?.locId),
      });

      dispatch(setCartProducts(result?.data?.cartProducts));
      // const storeDataDetails = JSON.parse(localStorage.getItem("storeDetails"));

      // await storeData("cartData", {
      //   cartProducts: result?.barcodes,
      //   storeDataDetails: storeDataDetails,
      // });
      await storePlainData("cartId", result?.cartId);
      dispatch(setCartBill(result?.data?.billing));
      dispatch(setShippingAddress(result?.data?.shippingAddress));
      dispatch(setAppliedCoupon(res?.data?.cartCoupon));
      dispatch(
        setLoyalityPoints({
          loyaltyPoints: res?.data?.loyaltyPoints,
          loyaltyPointsValue: res?.data?.loyaltyPointsValue,
        })
      );
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const handleAddProduct = () => {
    // setAddProduct(true);

    if (cartId !== null) {
      setProductQty(1);

      //checking products having variants or not
      if (productData?.variants?.length > 1) {
        // if yes open modal and show all data, there in modal
        setProductModalPage(true);
        filteredVariantsData();
        return;
      }
      addProductToCart({
        cartId: cartId,
        sellingPrice: productData?.variants?.[0]?.inventorySync?.sellingPrice,
        gtin: productData?.variants?.[0]?.barcodes?.[0],
        qty: 1,
        mrp: productData?.variants?.[0]?.inventorySync?.mrp,
        inventoryChecks: true,
        locationId: String(nearByStore?.locId),
      });
    } else {
      cartCreation();
    }
  };

  const handleAddProductForModal = (variantData) => {
    // setAddProduct(true);
    if (cartId !== null) {
      setProductQty(1);
      addProductToCart({
        cartId: cartId,
        sellingPrice: variantData?.inventorySync?.sellingPrice,
        gtin: variantData?.barcodes?.[0],
        qty: 1,
        mrp: variantData?.inventorySync?.mrp,
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
      sellingPrice: variants?.[0]?.inventorySync?.sellingPrice,
      gtin: variants?.[0]?.inventorySync?.gtin,
      qty: productQty + 1,
      mrp: variants?.[0]?.inventorySync?.mrp,
      inventoryChecks: true,
      locationId: String(nearByStore?.locId),
    });
    setProductQty((prev) => prev + 1);
  };
  const handleIncrementVariant = (variantData, variantQty) => {
    addProductToCart({
      cartId: cartId,
      sellingPrice: variantData?.inventorySync?.sellingPrice,
      gtin: variantData?.barcodes?.[0],
      qty: variantQty,
      mrp: variantData?.inventorySync?.mrp,
      inventoryChecks: true,
      locationId: String(nearByStore?.locId),
    });
    setProductQty((prev) => prev + 1);
  };

  const handleDecrementProduct = () => {
    if (productQty > 1) {
      setProductQty((prev) => prev - 1);
      decrementProductFromCart();
    } else {
      decrementProductFromCart();
      setAddProduct(false);
      setProductQty(1);
    }
  };

  const handleDecrementVariant = (variantData, variantQty) => {
    if (variantQty >= 1) {
      setProductQty((prev) => prev - 1);
      decrementProductFromCart({
        cartId: cartId,
        gtin: variantData?.barcodes?.[0],
        qty: variantQty,
        inventoryChecks: "NO",
        sellingPrice: variantData?.inventorySync?.sellingPrice,
        mrp: variantData?.inventoryData?.mrp,
        locationId: String(nearByStore?.locId),
      });
    } else {
      decrementProductFromCart({
        cartId: cartId,
        gtin: variantData?.barcodes?.[0],
        qty: variantQty,
        inventoryChecks: "NO",
        sellingPrice: variantData?.inventorySync?.sellingPrice,
        mrp: variantData?.inventoryData?.mrp,
        locationId: String(nearByStore?.locId),
      });

      setProductQty(1);
    }
  };

  const handleProductCard = () => {
    const barcode =
      productData?.barcodes?.[0] || productData?.variants?.[0]?.barcodes?.[0];

    if (barcode) {
      navigate(`/product-details/${barcode}`);
    }
  };

  const handleOpenModal = () => {
    setProductModalPage(true);
  };
  const handleCloseModal = () => {
    setProductModalPage(false);
  };

  // const dynamicStyle = {
  //   backgroundColor: retailType === "RESTAURANT" ? "#AD1A19" : "#e7f3ec",
  //   color: retailType === "RESTAURANT" ? "#ffffff" : "#0f8241",
  //   border:
  //     retailType === "RESTAURANT"
  //       ? "1px solid #ffffff"
  //       : "1px solid rgb(49, 134, 22)",
  //   position: "relative",
  //   right: "0.1rem",
  //   top: "0.2rem",
  //   width: "6rem",
  //   borderRadius: "0.5rem",
  //   padding: "2.5px 8px",
  // };
  const dynamicStyle = getAddBtnStyle(retailType);

  return (
    <Box
      className="product-card"
      onClick={(e) => {
        e.stopPropagation();
        handleProductCard();
      }}
      sx={{ marginBottom: "10px" }}
      key={uniqueKey}
    >
      <Box>
        {verticalListing ? (
          <Box
            className="product-details"
            sx={{ flexDirection: "row", width: "auto", padding: "5px" }}
          >
            <Box
              className="product-image vertical-listing"
              width="30%"
              borderRadius="1rem"
              overflow="hidden"
            >
              <img
                src={imageUrl || no_image}
                className="prod-img"
                alt={productName}
                onError={(e) => (e.target.src = no_image)}
              />
            </Box>
            <Box flex={1}>
              <Box className="product-name" sx={{ paddingTop: 0 }}>
                <Text text={productName} className="product-name-text" />
              </Box>
              <Box className="product-description" sx={{ paddingTop: 0 }}>
                <Text text={productAvailablity} className="product-name-text" />
              </Box>
              <Box className="product-description">
                <Text
                  text={productDescription}
                  className="product-description-text"
                />
              </Box>
              <Box className="product-quantity">
                <Text
                  text={productQuantity}
                  className="product-quantity-text"
                />
              </Box>
              <Box className="product-price-details" pb="0.2rem">
                <Box className="price-description">
                  <Text
                    text={`₹ ${originalPrice?.toFixed(2)} `}
                    // text={
                    //   Number.isFinite(parsedOrginalPrice)
                    //     ? `${parsedOrginalPrice.toFixed(0)}% OFF`
                    //     : "No Discount"
                    // }
                    className="price-description-not-applicable"
                  />
                  <Text
                    text={discountedPrice || 0}
                    // text={
                    //   Number.isFinite(parseDiscountedPrice)
                    //     ? `${Number.isFinite(parseDiscountedPrice).toFixed(
                    //         0
                    //       )}% OFF`
                    //     : "No Discount"
                    // }
                    className="price-description-applicable"
                  />
                </Box>

                {!addProduct ? (
                  <Box className="product-add-btn">
                    <Button
                      // className="add-btn"
                      sx={dynamicStyle}
                      onClick={(event) => {
                        if (
                          variants?.[0]?.inventorySync?.availableQuantity !== 0
                        ) {
                          event.stopPropagation();
                          handleAddProduct();
                        } else {
                          return null;
                        }
                      }}
                      // sx={{ top: "-0.2rem" }}
                    >
                      {variants?.[0]?.inventorySync?.availableQuantity !== 0
                        ? "ADD"
                        : "Out of Stock"}
                    </Button>
                  </Box>
                ) : (
                  <Box className="product-qty-counter">
                    <Box
                      className="decrement-qty"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrementProduct();
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrementProduct();
                      }}
                      variant="text"
                    >
                      <AddIcon />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
            {/* discount tag and wishlist  */}
            <Box
              className="product-discount"
              sx={{
                backgroundColor:
                  retailType === "RESTAURANT" ? "rgb(173, 26, 25)" : "#0f8241",
              }}
              left={0}
              top={0}
            >
              <Box className="discount-details">
                <Text
                  text={
                    Number.isFinite(discountText) && discountText > 0
                      ? `${discountText?.toFixed(0)}% OFF`
                      : "No Discount"
                  }
                  className="discount-text"
                />
              </Box>
            </Box>

            <Box
              className="product-wishlist"
              sx={{ display: !user?.name && "none" }}
            >
              {user?.name || user?.uidx ? (
                <Favourite
                  key={productData?.barcodes?.[0]}
                  gtin={
                    productData?.barcodes?.[0] ||
                    productData?.variants?.[0]?.barcodes?.[0]
                  }
                />
              ) : null}
            </Box>
          </Box>
        ) : (
          <Box className="product-details">
            <Box className="product-image-box">
              <Box className="product-image">
                <img
                  src={imageUrl}
                  className="prod-img"
                  alt={productName}
                  onError={(e) => (e.target.src = no_image)}
                />
              </Box>
            </Box>
            <Box
              className="product-discount"
              sx={{
                backgroundColor:
                  retailType === "RESTAURANT" ? "rgb(173, 26, 25)" : "#0f8241",
              }}
            >
              <Box className="discount-details">
                <Text text={discountText} className="discount-text" />
              </Box>
            </Box>
            <Box
              className="product-wishlist"
              sx={{ display: !user?.name && "none" }}
            >
              {user?.name ? (
                <Favourite
                  gtin={
                    productData?.barcodes?.[0] ||
                    productData?.variants?.[0]?.barcodes?.[0]
                  }
                />
              ) : null}
            </Box>
            <Box className="horizontal-product-card-wrapper">
              <Box className="product-name">
                <Text text={productName} className="product-name-text" />
              </Box>

              <Box className="product-description">
                <Text
                  text={productDescription}
                  className="product-description-text"
                />
              </Box>
              <Box className="product-quantity">
                <Text
                  text={productQuantity}
                  className="product-quantity-text"
                />
              </Box>
              <Box className="product-price-details">
                <Box className="price-description">
                  <Text
                    text={`₹ ${originalPrice?.toFixed(2)} `}
                    className="price-description-not-applicable"
                  />
                  <Text
                    text={`₹ ${discountedPrice?.toFixed(2)}`}
                    className="price-description-applicable"
                  />
                </Box>

                {!addProduct ? (
                  <Box className="product-add-btn">
                    <Button
                      // className="add-btn"
                      sx={dynamicStyle}
                      onClick={(event) => {
                        if (
                          variants?.[0]?.inventorySync?.availableQuantity !== 0
                        ) {
                          event.stopPropagation();
                          handleAddProduct();
                        } else {
                          return null;
                        }
                      }}
                    >
                      {variants?.[0]?.inventorySync?.availableQuantity !== 0
                        ? "ADD"
                        : "Out of Stock"}
                    </Button>
                  </Box>
                ) : (
                  <Box className="product-qty-counter">
                    <Box
                      className="decrement-qty"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrementProduct();
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrementProduct();
                      }}
                      variant="text"
                    >
                      <AddIcon />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {productModalPage && (
        <ProductModal
          handleOpenModal={handleOpenModal}
          handleClose={handleCloseModal}
          productVariantsData={variantData}
          handleProductCard={handleProductCard}
          handleAddProductForModal={handleAddProductForModal}
          handleDecrementVariant={handleDecrementVariant}
          handleIncrementVariant={handleIncrementVariant}
        />
      )}
    </Box>
  );
}

export default ProductCard;
