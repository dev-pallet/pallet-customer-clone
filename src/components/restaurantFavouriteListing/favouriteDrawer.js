import React, { memo, useState } from "react";
import BottomDrawer from "../drawer";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { colorConstant } from "../../constants/colors";
import noImage from "../../assets/images/no-image-icon-6.png";
import {
  getCartId,
  getCartProducts,
  setCartProducts,
} from "../../redux/reducers/cartReducer";
import { useSelector, useDispatch } from "react-redux";

import vegLogo from "../../assets/images/veg.png";
import nonVegLogo from "../../assets/images/Union.png";
import {
  addQuantityInProduct,
  increaseProductToRestaurantCart,
} from "../../config/services/cartService";
import Text from "../custom-components/Text";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { getNearByStore } from "../../redux/reducers/locationReducer";
import { storePlainData } from "../../middlewares/localStorage";
const RestaurantFavouriteDrawer = ({
  openDetailDrawer,
  setOpenDetailDrawer,
  selectedProduct,
}) => {
  const [selectedSize, setSelectedSize] = useState({});
  const [expandAddInfo, setExpandAddInfo] = useState(false);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [showAllVegToppings, setShowAllVegToppings] = useState(false); // State for veg toppings visibility
  const [showAllNonVegToppings, setShowAllNonVegToppings] = useState(false);
  const [selectedVariantProduct, setSelectedVariantProduct] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const cartProducts = useSelector(getCartProducts);
  const [note, setNote] = useState("");
  const [foodProductQtyMap, setFoodProductQtyMap] = useState({});
  //   const [loader, setLoader] = useState();
  const dispatch = useDispatch();
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const showSnackbar = useSnackbar();
  const userString = localStorage.getItem("@user");
  const user = userString ? JSON.parse(userString) : null;
  const nearByStore = useSelector(getNearByStore);
  const [loader, setLoader] = useState(false);

  const handleExpandClick = (e) => {
    e.stopPropagation();
    setExpandAddInfo(!expandAddInfo);
  };
  const selectedVariantToppings = selectedSize?.addOn || [];
  // Separate veg and non-veg toppings
  const vegToppings = selectedVariantToppings?.filter(
    (item) => item?.foodType?.toUpperCase() === "VEG"
  );
  const nonVegToppings = selectedVariantToppings?.filter(
    (item) => item?.foodType?.toUpperCase() === "NON_VEG"
  );

  const vegToppingsToShow = showAllVegToppings
    ? vegToppings
    : vegToppings?.slice(0, 4);

  const nonVegToppingsToShow = showAllNonVegToppings
    ? nonVegToppings
    : nonVegToppings?.slice(0, 4);

  // composite key to get variantId if unique enough
  const getCompositeKey = (productId, variantId) => variantId;

  const handleCheckboxChange = (productId, variantId) => {
    const key = getCompositeKey(productId, variantId);
    setSelectedToppings((prev) => {
      return prev?.includes(key)
        ? prev?.filter((k) => k !== key)
        : [...prev, key];
    });
  };

  const handleClearAddOn = () => {
    setSelectedToppings([]);
  };

  // Clear handlers
  const handleClearVegToppings = () => {
    setSelectedToppings((prev) =>
      prev?.filter((item) => {
        const topping = selectedVariantToppings?.find(
          (t) => t?.variantId === item
        );
        return topping?.foodType?.toUpperCase() !== "VEG";
      })
    );
  };

  const handleAddProductResturant = (
    selectedVariantProduct,
    selectedToppings,
    quantity
  ) => {
    try {
      if (cartId !== null) {
        const addonProducts = selectedToppings?.map((item) => ({
          variantId: item?.variantId,
          itemName: item?.title,
          sellingPrice: item?.additionalPrice || 0,
          sellingUnit: item?.unitOfMeasure,
          specification: item?.specification,
          igst: item?.gst || 0,
          igstAmount: item?.igstAmount || 0,
        }));

        addProductInCart({
          variantId: selectedVariantProduct?.variantId,
          cartId: cartId,
          orgId: user?.organizationId,
          locationId: String(nearByStore?.locId),
          sellingPrice:
            selectedVariantProduct?.externalSalesChannels?.[0]?.salePrice || 0,
          qty: quantity,
          comments: note,
          addonProducts: addonProducts,
          quantityBySpecs: quantity,
        });

        setFoodProductQtyMap((prev) => ({
          ...prev,
          [selectedVariantProduct?.variantId]: quantity || 1,
        }));
      }
      // else {
      //   createRestroCart();
      // }
      setNote("");
    } catch (err) {
      showSnackbar(
        err?.message || err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const addProductInCart = async (data) => {
    try {
      setLoader(true);
      const res = await increaseProductToRestaurantCart(data);

      if (res?.data?.status === "ERROR") {
        showSnackbar(res?.data?.message, "error");
        return;
      }

      const result = res?.data?.data;

      if (result?.es !== 0) {
        // setHoldErrorMsg(res?.data?.data?.message);
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }

      const quantity = result?.data?.cartProducts?.find(
        (item) => item?.variantId === data?.variantId
      )?.quantity;

      if (res?.data?.status == "SUCCESS") {
        setFoodProductQtyMap((prev) => ({
          ...prev,
          [data?.variantId]: quantity || 1,
        }));
        dispatch(setCartProducts(result?.data?.cartProducts));
        await storePlainData("cartId", result?.data?.cartId);
        // dispatch(setCartBill(result?.data?.billing));
      }
    } catch (err) {
      setLoader(false);
      if (err?.status === 400) {
        showSnackbar(
          "Something went wrong. Please check your input and try again.",
          "error"
        );
        return;
      }
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    } finally {
      setLoader(false);
    }
  };

  const addIncreaseProduct = async (data, isModal) => {
    const variantId = isModal
      ? data?.variantId
      : data?.variants?.[0]?.variantId;

    if (!variantId) {
      showSnackbar("Variant ID is missing");
      return;
    }
    try {
      setLoader(true);
      const cartProduct = cartProducts?.find(
        (item) => item?.variantId === variantId
      );

      const payload = {
        cartId: cartId,
        cartProductId: cartProduct?.cartProductId, // will come from when add
        // quantityBySpecs: 1,
        qty: (foodProductQtyMap[variantId] || 0) + 1,
      };

      const res = await addQuantityInProduct(payload);

      // if response status is error
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

      const updatedCartProducts = result?.data?.cartProducts || [];
      const updatedCartProduct = updatedCartProducts?.find(
        (item) => item?.variantId === data?.variantId
      );
      const newQty = updatedCartProduct?.quantity || 1;

      if (
        res?.data?.status == "SUCCESS" &&
        res?.data?.data?.statusCode === 200
      ) {
        // Update UI state only on success
        // setFoodProductQtyMap((prev) => ({
        //   ...prev,
        //   [variantId]: newQty,
        // }));

        setFoodProductQtyMap((prev) => ({
          ...prev,
          [variantId]: (prev[variantId] || 1) + 1,
        }));

        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));

        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      }

      setLoader(false);
    } catch (err) {
      setLoader(false);
      if (err?.status === 400) {
        showSnackbar(
          "Something went wrong. Please check your input and try again.",
          "error"
        );
        return;
      }
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    } finally {
      setLoader(false);
    }
  };
  const formatString = (str) => {
    if (!str) return "";
    return str
      ?.split("_")
      ?.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      ?.join(" ");
  };
  return (
    <BottomDrawer
      drawerStateProp={openDetailDrawer}
      setDrawerStateProp={setOpenDetailDrawer}
      drawerHeight={expanded ? "80vh" : "90vh"}
      customCloseIcon={
        <CancelPresentationIcon
          sx={{ color: "black", backgroundColor: "white" }}
        />
      }
      drawerContentStyle={{ marginBottom: "50px" }}
      drawerContent={
        <>
          <Box>
            <Box
              sx={{
                height: "100%",
                transition: "height 0.3s ease-in-out",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                // overflowY: "auto",
                px: 2,
                // pt: 1,
                paddingBottom: 12,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle
            <Box
              onClick={toggleHeight}
              sx={{
                width: 40,
                height: 4,
                bgcolor: "#ccc",
                borderRadius: 2,
                mx: "auto",
                my: 1,
                cursor: "pointer",
              }}
            /> */}

              {selectedProduct && (
                <div className="product-detail-drawer">
                  <img
                    src={
                      selectedSize?.images?.front
                        ? selectedSize?.images?.front
                        : noImage
                    }
                    width="100%"
                    height="300px"
                    className="restro-product-image"
                  />

                  <Box className="restro-product-header">
                    <img
                      width={25}
                      height={25}
                      src={
                        selectedProduct?.attributes?.foodType?.toUpperCase() ===
                        "VEG"
                          ? vegLogo
                          : nonVegLogo
                      }
                    />
                    <p className="restro-product-name">
                      {selectedProduct?.name}
                    </p>
                  </Box>

                  <p className="restro-product-description">
                    {selectedProduct?.description}
                  </p>

                  <Box
                    mt={2}
                    display="flex"
                    alignItems="center"
                    onClick={handleExpandClick}
                    sx={{ cursor: "pointer" }}
                  >
                    <p className="restro-product-additional-info">
                      Additional info
                    </p>
                    <IconButton size="small">
                      {expandAddInfo ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>

                  <Collapse in={expandAddInfo}>
                    <Box className="restro-product-additional-info-box">
                      <p className="restro-product-description-info">
                        Allergen-
                        {selectedProduct?.allergenItems
                          ?.map((item) => item)
                          ?.join(", ")}
                      </p>

                      <p className="restro-product-description-info">
                        Spice Level:
                        {selectedProduct?.spiceLevels
                          ?.map((item) => formatString(item))
                          ?.join(", ")}
                      </p>

                      <p className="restro-product-description-info">
                        Calories-{selectedProduct?.calories}
                      </p>
                    </Box>
                  </Collapse>

                  <p className="customization-title">Customization</p>
                  <Box
                    // className="restro-product-customization-size"
                    sx={{
                      backgroundColor: " #f4f7fc",
                      padding: "10px",
                      borderRadius: "8px",
                    }}
                  >
                    <FormControl component="fieldset">
                      <FormLabel
                        component="legend"
                        mb={2}
                        sx={{ fontWeight: 700 }}
                      >
                        Choice of size
                        <br />
                        Required • Select any 1 Options
                      </FormLabel>
                      <RadioGroup
                        value={selectedSize?.variantId || ""}
                        name="controlled-radio-buttons-group"
                        onChange={(e) => {
                          e.stopPropagation();
                          const selected = selectedProduct?.variants?.find(
                            (size) => size?.variantId === e.target.value
                          );
                          setSelectedSize(selected);
                          setSelectedVariantProduct(selected);

                          // update persisted quantity and toppings for this variant
                          const cartItem = cartProducts?.find(
                            (item) => item?.variantId === selected?.variantId
                          );
                          // setPersitQty(cartItem?.quantity || 0);
                          setSelectedToppings(
                            cartItem?.addonProducts?.map(
                              (addon) => addon?.itemName
                            ) || []
                          );
                          setShowAllVegToppings(true);
                          setShowAllNonVegToppings(true);
                        }}
                      >
                        {selectedProduct?.variants?.map((size) => {
                          const deliveryChannel =
                            size?.externalSalesChannels?.find(
                              (channel) =>
                                channel?.salesChannelName === "DELIVERY"
                            );
                          return (
                            <FormControlLabel
                              key={size?.variantId}
                              value={size?.variantId}
                              control={
                                <Radio
                                  sx={{
                                    color: colorConstant?.sakuraRestroColor, // default color
                                    "&.Mui-checked": {
                                      color: colorConstant?.sakuraRestroColor, // checked color
                                    },
                                  }}
                                />
                              }
                              label={
                                <div className="details-radio-items">
                                  <p style={{ fontFamily: "sans-serif" }}>
                                    {size?.name}
                                  </p>
                                  <p
                                    style={{
                                      marginLeft: 8,
                                      fontFamily: "sans-serif",
                                    }}
                                  >
                                    ₹{deliveryChannel?.salePrice || 0}
                                  </p>
                                </div>
                              }
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {Boolean(vegToppings?.length) && (
                    <Box
                      className="restro-product-customization-size"
                      style={{
                        backgroundColor: " #f4f7fc",
                        padding: 5,
                        marginTop: "18px",
                        borderRadius: "8px",
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <FormLabel sx={{ fontWeight: 700 }}>
                          Veg Add ons
                        </FormLabel>
                        <FormLabel
                          p={2}
                          sx={{
                            color: colorConstant?.sakuraRestroColor,
                            fontSize: "13px",
                            fontWeight: "600",
                            marginRight: "48px !important",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearVegToppings();
                          }}
                        >
                          Clear
                        </FormLabel>
                      </Box>
                      {vegToppingsToShow?.map((addOn, groupIndex) => {
                        return (
                          <Box
                            key={addOn?.addOnId}
                            className="restro-product-customization-size-item"
                          >
                            <img
                              width={20}
                              height={20}
                              src={vegLogo}
                              alt={addOn?.title}
                            />
                            <Box
                              className="detail-page-tooping"
                              display="flex"
                              alignItems="center"
                              width="100%"
                            >
                              <label
                                className="restro-customize-font"
                                // htmlFor={`addOn-${key}`}
                              >
                                {addOn?.title}
                              </label>
                              <Box
                                display="flex"
                                alignItems="center"
                                marginLeft="auto"
                              >
                                <Typography sx={{ mr: 2 }}>
                                  ₹{addOn?.additionalPrice}
                                </Typography>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      sx={{
                                        color: colorConstant?.sakuraRestroColor, // default color
                                        "&.Mui-checked": {
                                          color:
                                            colorConstant?.sakuraRestroColor, // checked color
                                        },
                                      }}
                                      checked={selectedToppings?.includes(
                                        addOn?.variantId
                                      )}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleCheckboxChange(
                                          addOn?.productId,
                                          addOn?.variantId
                                        );
                                      }}
                                    />
                                  }
                                />
                              </Box>
                            </Box>
                          </Box>
                        );
                      })}
                      {vegToppings?.length > 4 && (
                        <p
                          style={{
                            cursor: "pointer",
                            color: colorConstant?.sakuraRestroColor,
                            fontSize: "13px",
                            marginTop: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontFamily: "sans-serif",
                          }}
                          onClick={() =>
                            setShowAllVegToppings(!showAllVegToppings)
                          }
                        >
                          {showAllVegToppings ? (
                            <>
                              Show less <KeyboardArrowUpIcon fontSize="small" />
                            </>
                          ) : (
                            <>
                              +{showAllVegToppings?.length - 3} more{" "}
                              <KeyboardArrowDownIcon fontSize="small" />
                            </>
                          )}
                        </p>
                      )}
                    </Box>
                  )}

                  {Boolean(nonVegToppings?.length) > 0 && (
                    <Box
                      className="restro-product-customization-size"
                      sx={{
                        backgroundColor: "#f4f7fc",
                        padding: "10px",
                        marginTop: "18px",
                        borderRadius: "8px",
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <FormLabel sx={{ fontWeight: 700 }}>
                          Non-Veg Add ons
                        </FormLabel>
                        <FormLabel
                          p={2}
                          sx={{
                            color: colorConstant?.sakuraRestroColor,
                            fontSize: "13px",
                            fontWeight: "600",
                            marginRight: "48px !important",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearNonVegToppings();
                          }}
                        >
                          Clear
                        </FormLabel>
                      </Box>
                      {nonVegToppingsToShow?.map((addOn, index) => (
                        <Box
                          key={addOn?.addOnId}
                          className="restro-product-customization-size-item"
                          display="flex"
                          alignItems="center"
                        >
                          <img
                            width={16}
                            height={16}
                            src={nonVegLogo}
                            alt={addOn?.title}
                          />
                          <Box
                            className="detail-page-tooping"
                            display="flex"
                            alignItems="center"
                            width="100%"
                          >
                            <label className="restro-customize-font">
                              {addOn?.title}
                            </label>
                            <Box
                              display="flex"
                              alignItems="center"
                              marginLeft="auto"
                            >
                              <Typography sx={{ mr: 2 }}>
                                ₹{addOn?.additionalPrice}
                              </Typography>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    sx={{
                                      color: colorConstant?.sakuraRestroColor,
                                      "&.Mui-checked": {
                                        color: colorConstant?.sakuraRestroColor,
                                      },
                                    }}
                                    checked={selectedToppings?.includes(
                                      addOn?.variantId
                                    )}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleCheckboxChange(
                                        addOn?.productId,
                                        addOn?.variantId
                                      );
                                    }}
                                  />
                                }
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                      {nonVegToppings?.length > 4 && (
                        <p
                          style={{
                            cursor: "pointer",
                            color: colorConstant?.sakuraRestroColor,
                            fontSize: "13px",
                            marginTop: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontFamily: "sans-serif",
                          }}
                          onClick={() =>
                            setShowAllNonVegToppings(!showAllNonVegToppings)
                          }
                        >
                          {showAllNonVegToppings ? (
                            <>
                              Show less <KeyboardArrowUpIcon fontSize="small" />
                            </>
                          ) : (
                            <>
                              +{nonVegToppings?.length - 4} more{" "}
                              <KeyboardArrowDownIcon fontSize="small" />
                            </>
                          )}
                        </p>
                      )}
                    </Box>
                  )}

                  {(vegToppings?.length > 0 || nonVegToppings?.length > 0) && (
                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <button
                        style={{
                          color: colorConstant?.sakuraRestroColor,
                          fontSize: "13px",
                          fontWeight: "600",
                          outline: "none",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClearAddOn();
                        }}
                      >
                        Clear All Toppings
                      </button>
                    </Box>
                  )}

                  <Box
                    mt={3}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    sx={{
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                  >
                    <p className="add-cooking-title">Add a cooking request</p>
                    <TextField
                      sx={{ backgroundColor: " #F5F5F5" }}
                      fullWidth
                      placeholder="e.g. don’t make it too spicy"
                      value={note}
                      onChange={(e) => {
                        e.stopPropagation();
                        setNote(e.target.value.slice(0, 100));
                      }}
                      multiline
                      inputProps={{ maxLength: 100 }}
                      rows={2}
                    />
                  </Box>
                </div>
              )}
            </Box>
          </Box>

          <Box
            className="addon-button-container drawer-page"
            sx={{ position: "fixed", bottom: 5, width: "96%" }}
          >
            <Box className="customize-product-qty-counter">
              <Box className="added-qty">
                <Box
                  // className="decrement-qty"
                  sx={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecrease();
                    // decreaseProduct(selectedSize, true);
                  }}
                  // disabled={loader || qty <= 0}
                  variant="text"
                >
                  <RemoveIcon />
                </Box>
                {/* {loader ? (
                  <CircularProgress
                    sx={{
                      color: colorConstant?.defaultButtonText,
                      width: "15px !important",
                      height: "15px !important",
                    }}
                  />
                ) : (
                )} */}
                <Text text={1} className="product-quantity" />
                <Box
                  sx={{ cursor: "pointer" }}
                  // className="increment-qty"
                  onClick={(e) => {
                    e.stopPropagation();
                    addIncreaseProduct();
                    // addIncreaseProduct(selectedSize, true);
                  }}
                  // disabled={loader}
                  variant="text"
                >
                  <AddIcon />
                </Box>
              </Box>
            </Box>
            <Button
              onClick={() => {
                // const selectedToppingData = selectedVariantToppings?.flatMap(
                //   (addOnGroup) =>
                //     addOnGroup?.addOn?.filter((topping) =>
                //       selectedToppings?.includes(
                //         getCompositeKey(topping?.productId, topping?.variantId)
                //       )
                //     ) || []
                // );
                if (!selectedSize) {
                  return;
                }
                const selectedToppingData =
                  selectedVariantToppings?.filter((topping) =>
                    selectedToppings?.includes(
                      getCompositeKey(topping?.productId, topping?.variantId)
                    )
                  ) || [];
                const quantity =
                  foodProductQtyMap[selectedSize?.variantId] || 1;
                handleAddProductResturant(
                  selectedSize,
                  selectedToppingData,
                  quantity
                );
                setSelectedVariantProduct(selectedSize);
                // disabled = { loader };
              }}
              className="button-add-on"
            >
              Add item
            </Button>
          </Box>
        </>
      }
      // PaperProps={{
      //   sx: { height: expanded ? "80vh" : "90vh", background: "transparent" },
      // }}
    />
  );
};

export default memo(RestaurantFavouriteDrawer);
