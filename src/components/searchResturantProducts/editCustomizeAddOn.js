import {
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { memo, useRef, useState } from "react";
import vegLogo from "../../assets/images/veg.png";
import nonVegLogo from "../../assets/images/Union.png";
import { CircularProgress } from "@mui/material";
import { colorConstant } from "../../constants/colors";
import Text from "../custom-components/Text";
import "./customize.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartId,
  getCartProducts,
  setCartBill,
  setCartProducts,
} from "../../redux/reducers/cartReducer";
import { useParams } from "react-router-dom";
import AddMoreCustomization from "./addOn";
import BottomDrawer from "../drawer";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  addQuantityInProduct,
  removeRestaurantProductFromCart,
} from "../../config/services/cartService";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { storeData, storePlainData } from "../../middlewares/localStorage";
const EditCustomizeProduct = ({
  handleAddProductResturant,
  product = [],
  decreaseProduct,
  addIncreaseProduct,
  qty,
  loader,
  note,
  setNote,
  setSelectedVariantProduct,
  selectedVariantProduct,
  addTitle,
  isEdit,
  setIsEdit,
  editCustomizationData,
  setEditCustomizationData,
  foodProductQtyMap,
  setFoodProductQtyMap,
}) => {
  const cartProducts = useSelector(getCartProducts);

  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState({});
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const showSnackbar = useSnackbar();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [persistQty, setPersitQty] = useState(0);
  const [showAllToppings, setShowAllToppings] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [originalVariantId, setOriginalVariantId] = useState(null);

  // composite key to get variantId if unique enough
  const getCompositeKey = (productId, variantId) => variantId;

  //this function used for checkbox, the same add on may present in various products so checked the selected variants add on
  const handleCheckboxChange = (productId, variantId) => {
    const key = getCompositeKey(productId, variantId);
    setSelectedToppings((prev) =>
      prev?.includes(key) ? prev?.filter((k) => k !== key) : [...prev, key]
    );
  };

  const initializeFromEditData = () => {
    if (!editCustomizationData) return;
    const selected = sizeOptions?.find(
      (s) =>
        s.variantId === editCustomizationData?.selectedVariantProduct?.variantId
    );
    setSelectedSize(selected);
    setSelectedVariantProduct(selected);
    setPersitQty(editCustomizationData?.qty || 0);
    setSelectedToppings(editCustomizationData?.selectedToppings || []);
    setNote((prev) => ({
      ...prev,
      [editCustomizationData?.selectedVariantProduct?.variantId]:
        editCustomizationData?.note || "",
    }));
    // setNote(editCustomizationData?.note || "");
  };

  useEffect(() => {
    if (editCustomizationData) {
      initializeFromEditData();
    }
  }, [editCustomizationData, product]);

  // for persisting checkboxes data
  useEffect(() => {
    const addonProductsVal =
      cartProducts?.flatMap((item) =>
        item?.addonProduct?.map((addonWrapper) => {
          return addonWrapper?.variantId;
        })
      ) || [];
    setSelectedToppings(addonProductsVal);
  }, [cartProducts]);

  const sizeOptions = product;
  const toppingOptions = product?.map((p) => p?.addOn || []);
  const selectedVariantToppings = selectedVariantProduct?.addOn || [];
  const productImage = addTitle?.variants?.[0]?.images?.front;

  //add on data
  //show initially only 4 item
  const toppingsToShow = showAllToppings
    ? selectedVariantToppings
    : selectedVariantToppings?.slice(0, 4);

  //clear all toppings
  const handleClearAddOn = () => {
    setSelectedToppings([]);
  };

  //in edit need to call few api's
  //1. if user selected variant is not changing only add on and qty is changing then updateCart api
  //2. if user is changing variants then need to call: delete api, add product api in update button
  const findselectedVariantcartProductId = () => {
    const matchingProduct = cartProducts?.find(
      (product) => product?.variantId === selectedVariantProduct?.variantId
    );
    return matchingProduct ? matchingProduct?.cartProductId : null;
  };
  // const cartProductId = findselectedVariantcartProductId();

  useEffect(() => {
    if (isEdit && selectedVariantProduct?.variantId && !originalVariantId) {
      setOriginalVariantId(selectedVariantProduct?.variantId);
    }
  }, [isEdit, selectedVariantProduct?.variantId]);

  const deleteCartProduct = async (cartProductId) => {
    if (!cartProductId) {
      showSnackbar("No matching product found in cart", "error");
      return;
    }
    try {
      const restroPayload = {
        cartId,
        cartProductId: cartProductId,
        // comments: matchingProduct?.comments,
      };
      const res = await removeRestaurantProductFromCart(restroPayload);

      if (res?.data?.data?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }

      const result = res?.data?.data;
      if (res?.data?.status == "SUCCESS") {
        const dispatchVal = result?.data?.cartProducts;

        dispatch(setCartProducts(dispatchVal));
        // storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
        showSnackbar(res?.data?.message || "Item Deleted", "success");
        return;
      }
    } catch (error) {
      showSnackbar(
        error?.message ||
          error?.response?.data?.message ||
          "Something went wrong",
        "error"
      );
    }
  };

  const handleUpdateItem = async () => {
    const quantity = foodProductQtyMap[selectedVariantProduct?.variantId] || 1;
    const selectedToppingData = selectedVariantToppings?.filter((topping) =>
      selectedToppings?.includes(
        getCompositeKey(topping?.productId, topping?.variantId)
      )
    );
    // const quantity = foodProductQtyMap[selectedSize?.variantId] || 1;

    if (originalVariantId !== selectedVariantProduct?.variantId) {
      // 1. Delete old variant from cart
      await deleteCartProduct(originalVariantId); // implement this API call
      // 2. Add new variant to cart
      handleAddProductResturant(
        /* get variant object for selectedVariantId */
        selectedSize,
        selectedToppingData,
        quantity
      );
    } else {
      // Only add-ons or quantity changed
      // addIncreaseProduct(
      //   {
      //     variantId: selectedVariantProduct?.variantId,
      //     cartId,
      //     qty: quantity,
      //     addonProducts: selectedToppingData,

      //   },
      //   true
      // );
      addIncreaseProduct(selectedSize, true);
    }
  };

  const handleIncrease = () => {
    setFoodProductQtyMap((prev) => ({
      ...prev,
      [selectedVariantProduct?.variantId]:
        (prev[selectedVariantProduct?.variantId] || 1) + 1,
    }));
  };
  const handleDecrease = () => {
    setFoodProductQtyMap((prev) => ({
      ...prev,
      [selectedVariantProduct?.variantId]: Math.max(
        1,
        (prev[selectedVariantProduct?.variantId] || 1) - 1
      ),
    }));
  };

  return (
    <BottomDrawer
      drawerStateProp={isEdit}
      setDrawerStateProp={setIsEdit}
      drawerHeight={expanded ? "80vh" : "70vh"}
      customCloseIcon={
        <CancelPresentationIcon
          sx={{ color: "black", backgroundColor: "white" }}
        />
      }
      drawerContentStyle={{ marginBottom: "50px" }}
      drawerContent={
        <>
          <Box>
            <Box className="customize-heading">
              <Box className="customize-title-image-wrapper">
                <img
                  width={40}
                  height={40}
                  style={{ borderRadius: "12px" }}
                  src={productImage}
                  alt={addTitle?.title}
                />
                <p className="customize-heading-title">
                  {addTitle?.name || editCustomizationData?.addTitle?.name}
                </p>
              </Box>
            </Box>

            {/* // Size selection */}
            <Box
              mt={2}
              sx={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                borderRadius: "12px",
              }}
            >
              <FormControl
                component="fieldset"
                sx={{ padding: "12px", paddingTop: "12px" }}
              >
                <FormLabel
                  component="legend"
                  p={2}
                  sx={{
                    color: "black",
                    fontSize: "13px",
                    fontWeight: "600",
                    paddingTop: "10px",
                  }}
                >
                  Choice of size
                  <br />
                  Required • Select any 1 Options
                </FormLabel>
                <RadioGroup
                  value={selectedSize?.variantId || ""}
                  name="controlled-radio-buttons-group"
                  // onChange={(e) => {
                  //   setSelectedSize(
                  //     sizeOptions?.find((s) => s?.name === e.target.value)
                  //   );
                  // }}
                  onChange={(e) => {
                    e.stopPropagation();
                    const selected = sizeOptions?.find(
                      (s) => s?.variantId === e.target.value
                    );
                    setSelectedSize(selected);
                    setSelectedVariantProduct(selected);

                    // update persisted quantity and toppings for this variant
                    const cartItem = cartProducts?.find(
                      (item) => item?.variantId === selected?.variantId
                    );
                    setPersitQty(cartItem?.quantity || 0);
                    setSelectedToppings(
                      cartItem?.addonProducts?.map(
                        (addon) => addon?.itemName
                      ) || []
                    );
                  }}
                >
                  {sizeOptions?.map((option, idx) => {
                    const deliveryChannel = option?.externalSalesChannels?.find(
                      (channel) => channel?.salesChannelName === "DELIVERY"
                    );

                    return (
                      <FormControlLabel
                        key={option?.variantId}
                        value={option?.variantId}
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
                          <>
                            <span>{option?.name}</span>
                            <span style={{ marginLeft: 8 }}>
                              ₹{deliveryChannel?.salePrice}
                            </span>
                          </>
                        }
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Toppings */}
            <Box
              mt={2}
              mb={1}
              sx={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                borderRadius: "12px",
              }}
              p={3}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormLabel
                  p={2}
                  sx={{
                    color: "black",
                    fontSize: "13px",
                    fontWeight: "600",
                  }}
                >
                  Add Ons
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
                    handleClearAddOn();
                  }}
                >
                  Clear
                </FormLabel>
              </Box>
              {toppingsToShow?.map((item, index) => {
                return (
                  <>
                    <Box
                      key={`${item?.title}-${index}`}
                      display="flex"
                      alignItems="center"
                      gap="10px"
                    >
                      <img
                        src={
                          item?.foodType?.toUpperCase() === "VEG"
                            ? vegLogo
                            : nonVegLogo
                        }
                        alt={item?.title}
                        width={16}
                        height={16}
                      />

                      <Box className="checkbox-wrapper">
                        <label className="addon-title-data">{`${item?.title}  ${item?.specification}`}</label>
                        <Box className="checkbox-inner-data">
                          <label className="addon-title-data">{`₹${item?.additionalPrice}`}</label>
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
                                  item?.variantId
                                )}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleCheckboxChange(
                                    item?.productId,
                                    item?.variantId
                                  );
                                }}
                              />
                            }
                          />
                        </Box>
                      </Box>
                    </Box>
                  </>
                );
              })}

              {selectedVariantToppings?.length > 4 && (
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAllToppings(!showAllToppings);
                  }}
                >
                  {showAllToppings ? (
                    <>
                      Show less <KeyboardArrowUpIcon fontSize="small" />
                    </>
                  ) : (
                    <>
                      +{selectedVariantToppings?.length - 3} more{" "}
                      <KeyboardArrowDownIcon fontSize="small" />
                    </>
                  )}
                </p>
              )}
            </Box>

            {/* Note */}
            <Box
              sx={{
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
                borderRadius: "12px",
                padding: "12px",
              }}
            >
              <label className="additional-note-title">
                Add a cooking request
              </label>
              <TextField
                label="Additional note"
                fullWidth
                size="medium"
                variant="outlined"
                margin="normal"
                // value={note}
                value={note[selectedVariantProduct?.variantId] || ""}
                onChange={(e) =>
                  setNote((prev) => ({
                    ...prev,
                    [selectedVariantProduct?.variantId]: e.target.value.slice(
                      0,
                      100
                    ),
                  }))
                }
                // onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Make it extra spicy"
                sx={{ padding: "10px" }}
              />
            </Box>
            {/* )} */}
          </Box>
          <Box
            className="addon-button-container"
            sx={{ position: "fixed", bottom: 0, width: "96%" }}
          >
            <Box className="customize-product-qty-counter">
              <Box className="added-qty">
                <Box
                  // className="decrement-qty"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDecrease();
                    // decreaseProduct(selectedSize, true);
                  }}
                  variant="text"
                >
                  <RemoveIcon />
                </Box>
                {loader ? (
                  <CircularProgress
                    sx={{
                      color: colorConstant?.showdowColor,
                      width: "15px !important",
                      height: "15px !important",
                    }}
                  />
                ) : (
                  <Text
                    text={qty || editCustomizationData?.qty}
                    className="product-quantity"
                  />
                )}
                <Box
                  // className="increment-qty"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleIncrease();
                    // addIncreaseProduct(selectedSize, true);
                  }}
                  variant="text"
                >
                  <AddIcon />
                </Box>
              </Box>
            </Box>
            <Button onClick={handleUpdateItem} className="button-add-on">
              Update item
            </Button>
          </Box>
        </>
        //   </DialogContent>
        // </Dialog>
      }
    />
  );
};

export default memo(EditCustomizeProduct);
