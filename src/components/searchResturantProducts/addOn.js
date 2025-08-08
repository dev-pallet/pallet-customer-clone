import React, { useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CancelPresentationIcon from "@mui/icons-material/CancelPresentation";
import BottomDrawer from "../drawer";
import vegLogo from "../../assets/images/veg.png";
import nonVegLogo from "../../assets/images/Union.png";
import noImage from "../../assets/images/no-image-icon-6.png";
import "./addOn.css";
import Text from "../custom-components/Text";
import { colorConstant } from "../../constants/colors";
import CustomizeProduct from "./customizeAddOn";
import EditCustomizeProduct from "./editCustomizeAddOn";
import { getCartProducts } from "../../redux/reducers/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const AddMoreCustomization = ({
  selectedVariantProduct,
  addTitle,
  openHavingQuantityModal,
  setHavingQuantityModal,
  handleAddNewCustomization,
  decreaseProduct,
  addIncreaseProduct,
  setIsEdit,
  isEdit,
  handleEditCustomization,
  foodProductQtyMap,
  setFoodProductQtyMap,
}) => {
  const [variantLoaders, setVariantLoaders] = useState({});
  const selectedVariantIds = Array.isArray(selectedVariantProduct)
    ? selectedVariantProduct?.map((v) => v?.variantId)
    : [selectedVariantProduct?.variantId];
  const [editableVariant, setEditableVariant] = useState(null);
  const cartProducts = useSelector(getCartProducts);
  const filteredVariantsInCart = cartProducts;

  const handleAdd = async (item) => {
    setVariantLoaders((prev) => ({ ...prev, [item?.variantId]: true }));
    await addIncreaseProduct(item, true);
    setVariantLoaders((prev) => ({ ...prev, [item?.variantId]: false }));
  };

  const handleRemove = async (item) => {
    setVariantLoaders((prev) => ({ ...prev, [item?.variantId]: true }));
    await decreaseProduct(item, true);
    setVariantLoaders((prev) => ({ ...prev, [item?.variantId]: false }));
  };
  return (
    <BottomDrawer
      drawerStateProp={openHavingQuantityModal}
      setDrawerStateProp={setHavingQuantityModal}
      // drawerHeight={expanded ? "30vh" : "40vh"}
      customCloseIcon={
        <CancelPresentationIcon
          sx={{ color: "black", backgroundColor: "white" }}
        />
      }
      drawerContentStyle={{ marginBottom: "50px" }}
      drawerContent={
        <Box
          sx={{
            height: "100%",
            transition: "height 0.3s ease-in-out",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            px: 2,
            pt: 1,
            paddingBottom: 12,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {filteredVariantsInCart?.length && (
            <p className="addon-title" style={{ color: "red" }}>
              Repeat last used customization?
            </p>
          )}
          <Box>
            {filteredVariantsInCart?.length > 0 &&
              filteredVariantsInCart?.map((item) => {
                const matchingCartProduct = cartProducts?.find(
                  (p) => p?.variantId === item?.variantId
                );
                {
                  /* const isEditing = editModeMap[item?.variantId]; */
                }

                return (
                  <Box sx={{ position: "relative" }} key={item?.variantId}>
                    <Box
                      key={item?.variantId}
                      className="repeat-order-drawer"
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <img
                        width={20}
                        height={20}
                        src={
                          addTitle?.attributes?.foodType?.toUpperCase() ===
                          "VEG"
                            ? vegLogo
                            : nonVegLogo
                        }
                        alt="Food Type"
                      />

                      <Box className="box-container" sx={{ flex: 1 }}>
                        <img
                          src={
                            addTitle?.variants?.[0]?.images?.front || noImage
                          }
                          className="restro-product-image-addon"
                          alt="Product"
                        />

                        <p className="addon-title">
                          {/* {addTitle?.title} - {item?.name} */}
                          {matchingCartProduct?.variantName}
                        </p>

                        <p className="restro-product-name">
                          ₹
                          {item?.externalSalesChannels?.[2]?.salePrice ||
                            item?.sellingPrice ||
                            ""}
                        </p>
                      </Box>

                      <Box className="box-container-quantity">
                        <Box
                          className="decrement-qty"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item);
                          }}
                        >
                          <RemoveIcon />
                        </Box>
                        {variantLoaders[item?.variantId] ? (
                          <CircularProgress
                            sx={{
                              color: colorConstant?.sakuraRestroColor,
                              width: "15px !important",
                              height: "15px !important",
                            }}
                          />
                        ) : (
                          <Text
                            text={item?.quantity}
                            className="product-quantity"
                          />
                        )}
                        <Box
                          className="increment-qty"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdd(item);
                          }}
                        >
                          <AddIcon />
                        </Box>
                      </Box>
                    </Box>

                    <p
                      className="addon-title"
                      style={{
                        color: colorConstant?.sakuraRestroColor,
                        position: "absolute",
                        left: "119px",
                        bottom: 0,
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                      onClick={() => {
                        isEdit;
                        handleEditCustomization(
                          matchingCartProduct?.variantId,
                          {
                            selectedVariantProduct: {
                              variantId: matchingCartProduct?.variantId,
                              variantName: matchingCartProduct?.variantName,
                            },

                            selectedToppings:
                              matchingCartProduct?.addonProduct?.map(
                                (addon) => addon?.itemName
                              ) || [],
                            note: matchingCartProduct?.comments || "",
                            qty: matchingCartProduct?.quantity,
                            addTitle: {
                              name: matchingCartProduct?.productName,
                              variants: [
                                {
                                  variantId: matchingCartProduct?.variantId,
                                  images: {
                                    front: matchingCartProduct?.productImage,
                                  },
                                },
                              ],
                            },
                          }
                        );
                      }}
                    >
                      Edit
                      <ArrowRightIcon
                        sx={{
                          fontSize: "16px",
                          verticalAlign: "middle",
                          marginLeft: "1px",
                        }}
                      />
                    </p>
                  </Box>
                );
              })}

            <Box
              sx={{
                boxShadow: "0 2px 6px rgb(187 178 157 / 40%)",
                borderRadius: "4px",
              }}
            >
              {filteredVariantsInCart?.length === 0 && (
                <Text
                  text="Please use Add+ button to make new order"
                  sx={{
                    textAlign: "center",
                    mt: 2,
                    color: "#rgb(173, 26, 25)",
                    fontSize: "12px",
                  }}
                />
              )}
            </Box>
          </Box>

          <Button
            onClick={handleAddNewCustomization}
            sx={{
              mt: 3,
              mx: "auto",
              display: "block",
              backgroundColor: "#f0f0f0",
              color: "red",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
              width: {
                xs: "90%",
                sm: "70%",
                md: "50%",
              },
              textAlign: "center",
            }}
          >
            + Add new customization
          </Button>

          {/* Conditionally render CustomizeProduct if needed */}
          {open && <CustomizeProduct />}
          {/* {isEditing && <EditCustomizeProduct />} */}
        </Box>
      }
    />
  );
};

export default AddMoreCustomization;
