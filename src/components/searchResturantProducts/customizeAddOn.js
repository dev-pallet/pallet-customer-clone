import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { memo, useMemo, useState } from "react";
import vegLogo from "../../assets/images/veg.png";
import nonVegLogo from "../../assets/images/Union.png";
import { CircularProgress } from "@mui/material";
import { colorConstant } from "../../constants/colors";
import Text from "../custom-components/Text";
import "./customize.css";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCartProducts } from "../../redux/reducers/cartReducer";
import { useParams } from "react-router-dom";
import AddMoreCustomization from "./addOn";
import BottomDrawer from "../drawer";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { debounce } from "lodash";
const CustomizeProduct = ({
  openAddOnModal,
  setOpenAddOnModal,
  handleClose,
  handleAddProductResturant,
  product = [],
  decreaseProduct,
  addIncreaseProduct,
  qty,
  foodProductQtyMap,
  setFoodProductQtyMap,
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
}) => {
  const cartProducts = useSelector(getCartProducts);

  const [selectedSize, setSelectedSize] = useState({});
  // const [selectedCrusts, setSelectedCrusts] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [persistQty, setPersitQty] = useState(1);
  const [showAllToppings, setShowAllToppings] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [showAllVegToppings, setShowAllVegToppings] = useState(false); // State for veg toppings visibility
  const [showAllNonVegToppings, setShowAllNonVegToppings] = useState(false); // State for non-veg toppings visibility

  const debouncedSetNote = debounce((variantId, value) => {
    setNote((prev) => ({
      ...prev,
      [variantId]: value?.slice(0, 100),
    }));
  }, 30);

  const toggleHeight = (e) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };
  // composite key to get variantId if unique enough
  const getCompositeKey = (productId, variantId) => variantId;

  //this function used for checkbox, the same add on may present in various products so checked the selected variants add on
  const handleCheckboxChange = (productId, variantId) => {
    const key = getCompositeKey(productId, variantId);

    setSelectedToppings((prev) =>
      prev?.includes(key) ? prev?.filter((k) => k !== key) : [...prev, key]
    );
  };
  useEffect(() => {
    if (product?.varaints?.length > 0) {
      const firstVariants = product?.varaints?.[0];
      setSelectedSize(firstVariants);
      setSelectedVariantProduct(firstVariants);
    }
  }, [selectedVariantProduct, setSelectedVariantProduct]);

  // const initializeFresh = () => {
  //   const defaultVariant = product?.[0];
  //   setSelectedSize(defaultVariant);
  //   setSelectedVariantProduct(defaultVariant);
  //   // Only clear toppings if not editing
  //   if (!isEdit) {
  //     setSelectedToppings([]);
  //   }
  // };

  // useEffect(() => {
  //   initializeFresh();
  // }, [cartProducts, sizeOptions]);
  useEffect(() => {
    // On first load or when product changes, set first variant and clear toppings
    if (product?.length > 0) {
      const firstVariant = product[0];
      setSelectedSize(firstVariant);
      setSelectedVariantProduct(firstVariant);
      // Only clear toppings if not editing
      if (!isEdit) {
        setSelectedToppings([]);
      }
    }
    // eslint-disable-next-line
  }, [product, isEdit]);

  // For edit mode, set toppings from cart
  useEffect(() => {
    if (isEdit && cartProducts?.length > 0) {
      const addonProductsVal =
        cartProducts?.flatMap((item) =>
          item?.addonProduct?.map((addonWrapper) => {
            return addonWrapper?.variantId;
          })
        ) || [];
      setSelectedToppings(addonProductsVal);
    }
  }, [cartProducts, isEdit]);

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

  // Separate veg and non-veg toppings
  const vegToppings = useMemo(() =>
    selectedVariantToppings?.filter(
      (item) => item?.foodType?.toUpperCase() === "VEG"
    )
  );

  const nonVegToppings = useMemo(() =>
    selectedVariantToppings?.filter(
      (item) => item?.foodType?.toUpperCase() === "NON_VEG"
    )
  );

  // Limit to 4 items initially for each category
  const vegToppingsToShow = showAllVegToppings
    ? vegToppings
    : vegToppings?.slice(0, 4);

  const nonVegToppingsToShow = showAllNonVegToppings
    ? nonVegToppings
    : nonVegToppings?.slice(0, 4);

  // Clear all veg toppings, if needed to delete individual toppings
  // const handleClearVegToppings = () => {
  //   setSelectedToppings((prev) =>
  //     prev.filter((item) => item?.foodType?.toUpperCase() !== "VEG")
  //   );
  // };

  // Clear all non-veg toppings
  // const handleClearNonVegToppings = () => {
  //   setSelectedToppings((prev) =>
  //     prev.filter((item) => item?.foodType?.toUpperCase() !== "NON_VEG")
  //   );
  // };

  //clear all toppings
  const handleClearAddOn = () => {
    setSelectedToppings([]);
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
      drawerStateProp={openAddOnModal ? openAddOnModal : isEdit}
      setDrawerStateProp={setOpenAddOnModal ? setOpenAddOnModal : setIsEdit}
      drawerHeight={expanded ? "80vh" : "70vh"}
      customCloseIcon={
        <CancelPresentationIcon
          sx={{ color: "black", backgroundColor: "white" }}
        />
      }
      drawerContentStyle={{ marginBottom: "50px" }}
      drawerContent={
        // <Dialog
        //   open={openAddOnModal}
        //   onClose={handleClose}
        //   hideBackdrop
        //   maxWidth="lg"
        // >
        //   <IconButton
        //     aria-label="close"
        //     onClick={(e) => {
        //       e.stopPropagation();
        //       handleClose();
        //     }}
        //     sx={{ position: "absolute", right: 8, top: 8 }}
        //   >
        //     <CloseIcon color="black" />
        //   </IconButton>
        //   <DialogContent>

        <>
          <Box sx={{ paddingBottom: "calc(24px + env(safe-area-inset-bottom))"}}>
            <Box className="customize-heading">
              <Box className="customize-title-image-wrapper">
                <img
                  width={40}
                  height={40}
                  style={{ borderRadius: "12px" }}
                  src={
                    productImage
                    // addTitle?.attributes?.foodType?.toUpperCase() === "VEG"
                    //   ? vegLogo
                    //   : nonVegLogo
                  }
                  alt={addTitle?.title}
                />
                <p className="customize-heading-title">{addTitle?.name}</p>
              </Box>
            </Box>
            {/* );
        })} */}

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
                    const selected = sizeOptions?.find(
                      (s) => s?.variantId === e.target.value
                    );
                    setSelectedSize(selected);
                    setSelectedVariantProduct(selected);

                    // update persisted quantity and toppings for this variant
                    const cartItem = cartProducts?.find(
                      (item) => item?.variantId === selected?.variantId
                    );
                    setPersitQty(cartItem?.quantity || persistQty);
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
                              {/* {option?.externalSalesChannels?.[1]?.salePrice || 0} */}
                            </span>
                          </>
                        }
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Crust */}
            {/* <Box mt={2}>
          <FormLabel sx={{ color: "blue" }}>Change crust</FormLabel>
          {crustOptions?.map((option) => (
            <FormControlLabel
              key={option?.label}
              control={
                <Checkbox
                  checked={selectedCrusts?.includes(option?.label)}
                  onChange={() => handleCheckboxChange(option, "crust")}
                />
              }
              label={`${option?.label} ₹${option?.price}`}
            />
          ))}
        </Box> */}

            {/* Toppings */}
            {/* Veg Toppings Box */}
            {Boolean(vegToppings?.length) && (
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
                    Veg Add Ons
                  </FormLabel>

                  <FormLabel
                    p={2}
                    sx={{
                      color: colorConstant?.sakuraRestroColor,
                      fontSize: "13px",
                      fontWeight: "600",
                      marginRight: "48px !important",
                    }}
                    onClick={handleClearAddOn}
                  >
                    Clear
                  </FormLabel>
                </Box>
                {vegToppingsToShow?.map((item, index) => {
                  return (
                    <>
                      <Box
                        key={`${item?.title}-${index}`}
                        display="flex"
                        alignItems="center"
                        gap="10px"
                      >
                        <img
                          // src={
                          //   item?.foodType?.toUpperCase() === "VEG"
                          //     ? vegLogo
                          //     : nonVegLogo
                          // }
                          src={vegLogo}
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
                                    color: colorConstant?.sakuraRestroColor, // default color
                                    "&.Mui-checked": {
                                      color: colorConstant?.sakuraRestroColor, // checked color
                                    },
                                  }}
                                  checked={selectedToppings?.includes(
                                    item?.variantId
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(
                                      item?.productId,
                                      item?.variantId
                                    )
                                  }
                                />
                              }
                              // label={`₹${item?.additionalPrice}`}
                            />
                          </Box>
                          {/* Quantity and Button */}

                          {/* <Box className="customize-product-qty-counter">
                      <Box className="added-qty">
                        <Box
                          className="decrement-qty"
                          onClick={(e) => {
                            e.stopPropagation();
                            decreaseProduct(selectedSize);
                          }}
                          // disabled={loader || qty <= 0}
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
                          <Text
                            text={qty || persistQty}
                            className="product-qty"
                          />
                        )}
                        <Box
                          className="increment-qty"
                          onClick={(e) => {
                            e.stopPropagation();
                            // handleIncrementProduct(product);
                            addIncreaseProduct(selectedSize, true);
                          }}
                          // disabled={loader}
                          variant="text"
                        >
                          <AddIcon />
                        </Box>
                      </Box>
                    </Box> */}
                        </Box>
                      </Box>
                    </>
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
                    onClick={() => setShowAllVegToppings(!showAllVegToppings)}
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
            {/* Non-Veg Toppings Box */}

            {Boolean(nonVegToppings?.length) && (
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
                    Non-Veg Add Ons
                  </FormLabel>
                </Box>
                {nonVegToppingsToShow?.map((item, index) => (
                  <Box
                    key={`${item?.title}-${index}`}
                    display="flex"
                    alignItems="center"
                    gap="10px"
                  >
                    <img
                      src={nonVegLogo}
                      alt={item?.title}
                      width={16}
                      height={16}
                    />
                    <Box className="checkbox-wrapper">
                      <label className="addon-title-data">{`${item?.title} ${item?.specification}`}</label>
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
                              onChange={() =>
                                handleCheckboxChange(
                                  item?.productId,
                                  item?.variantId
                                )
                              }
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
                inputProps={{
                  maxLength: 100,
                  paddingTop: "20px",
                  backgroundColor: " #F5F5F5",
                  margonTop: "12px",
                }}
                rows={2}
                label="Additional note"
                fullWidth
                // size="medium"
                // variant="outlined"
                // margin="normal"
                // value={note}

                value={
                  selectedVariantProduct?.variantId
                    ? note[selectedVariantProduct?.variantId] || ""
                    : ""
                }
                onChange={(e) => {
                  if (selectedVariantProduct?.variantId) {
                    debouncedSetNote(
                      selectedVariantProduct?.variantId,
                      e.target.value
                    );
                  }
                }}
                placeholder="e.g. Make it extra spicy"
                sx={{
                  "& .MuiInputBase-root": {
                    backgroundColor: "#F5F5F5",
                    paddingTop: "20px",
                  },
                  "& .MuiFormLabel-root.Mui-focused": {
                    color: "black",
                    border: "black", // Change to your desired color
                  },
                }}
                mt={1}
              />
            </Box>
            {/* )} */}
          </Box>
          <Box
            className="addon-button-container drawer-btn-wrapper-par"
            sx={{ position: "fixed", bottom: 0, width: "96%" }}
          >
            <Box className="customize-product-qty-counter drawer-qty-btn-par">
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
                    color={colorConstant?.sakuraRestroColor}
                    sx={{
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
            <Button
              onClick={() => {
                //selectedVariantToppings
                const selectedToppingData = selectedVariantToppings?.filter(
                  (topping) =>
                    selectedToppings?.includes(
                      getCompositeKey(topping?.productId, topping?.variantId)
                    )
                );
                const quantity =
                  foodProductQtyMap[selectedSize?.variantId] || 1;
                handleAddProductResturant(
                  selectedSize,
                  selectedToppingData,
                  quantity
                );
                setSelectedVariantProduct(selectedSize);
                setOpenAddOnModal(false);
                // disabled = { loader };
              }}
              className="button-add-on drawer-add-btn-1"
            >
              Add item
            </Button>
          </Box>
        </>
        //   </DialogContent>
        // </Dialog>
      }
    />
  );
};

export default memo(CustomizeProduct);
