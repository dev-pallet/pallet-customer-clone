import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import Text from "../../../custom-components/Text";
import { no_image } from "../../../../constants/imageUrl";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Button, CircularProgress } from "@mui/material";
import { colorConstant } from "../../../../constants/colors";
import CloseIcon from "@mui/icons-material/Close";
import "./productModal.css";
import { getAddBtnStyle } from "../../../../constants/commonFunction";
import { useSelector } from "react-redux";
import { getStoreType } from "../../../../redux/reducers/miscReducer";

const ProductModal = ({
  handleOpenModal,
  handleClose,
  productVariantsData,
  handleProductCard,
  handleAddProductForModal,
  handleDecrementVariant,
  handleIncrementVariant,
  loader,
  productQty,
}) => {
  const [variantAddState, setVariantAddState] = useState({});
  const [variantQtyState, setVariantQtyState] = useState({});
  const [selectedCardId, setSelectedCardId] = useState(null);
  const retailType = useSelector(getStoreType);

  const handleAddClick = (variantId, variantData) => {
    handleAddProductForModal(variantData);
    setSelectedCardId(variantId); // Select card
    setVariantAddState((prev) => ({
      ...prev,
      [variantId]: true,
    }));
    setVariantQtyState((prev) => ({
      ...prev,
      [variantId]: 1,
    }));
  };

  // Called on increment
  const handleIncrementClick = (variantId, variantData) => {
    const updatedQty = (variantQtyState[variantId] || 0) + 1;
    handleIncrementVariant(variantData, updatedQty);
    setVariantQtyState((prev) => ({
      ...prev,
      [variantId]: updatedQty,
    }));
  };

  // Called on decrement
  const handleDecrementClick = (variantId, variantData) => {
    const currentQty = (variantQtyState[variantId] || 0) - 1;
    handleDecrementVariant(variantData, currentQty);
    setVariantQtyState((prev) => ({
      ...prev,
      [variantId]: currentQty,
    }));
  };

  const dynamicStyle = getAddBtnStyle(retailType);

  return (
    <Dialog open={handleOpenModal} onClose={handleClose} fullWidth>
      <IconButton
        aria-label="close"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme?.palette?.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        {productVariantsData?.map((item, index) => {
          const isDisabled =
            Object.keys(variantQtyState)?.length > 0 &&
            selectedCardId !== item?.barcodes?.[0];

          {
            /* const isAdded = variantAddState[item.barcodes?.[0]]; */
          }
          return (
            <Box
              // className="variant-product-card"
              className={`variant-product-card ${isDisabled ? "disabled" : ""}`}
              onClick={(event) => {
                if (isDisabled) return;
                event.stopPropagation();
                handleProductCard(item);
              }}
              // sx={{ marginBottom: "10px", cursor: "pointer" }}
              sx={{
                marginBottom: "10px",
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1, // visually show disabled
                pointerEvents: isDisabled ? "none" : "auto", // prevent any interaction if disabled
              }}
              key={index}
            >
              <Box className="variant-product-card-inner">
                <input
                  type="radio"
                  name="selectedCard"
                  disabled={
                    Object.keys(variantQtyState)?.length > 0 &&
                    selectedCardId !== item?.barcodes?.[0]
                  }
                  checked={selectedCardId === item?.barcodes?.[0]}
                  onChange={() => {
                    setSelectedCardId(item?.barcodes?.[0]);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />

                <Box
                  className="variant-product-details"
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    padding: "5px",
                  }}
                >
                  <Box
                    className="variant-product-image "
                    width="30%"
                    borderRadius="1rem"
                    overflow="hidden"
                  >
                    <img
                      src={item?.images?.front || no_image}
                      className="var-prod-img"
                      alt={item?.name}
                      onError={(e) => (e.target.src = no_image)}
                      style={{
                        width: "41%",
                        height: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Box flex={1} pl={2}>
                    <Box className="product-name" sx={{ paddingTop: 0 }}>
                      <Text
                        text={item?.name || "NA"}
                        className="product-name-text"
                      />
                    </Box>
                    <Box className="product-description" sx={{ paddingTop: 0 }}>
                      <Text
                        text={`Available: ${
                          item?.inventorySync?.availableQuantity ?? "NA"
                        }`}
                        className="product-name-text"
                      />
                    </Box>

                    <Box className="product-quantity">
                      <Text
                        text={
                          item?.weightsAndMeasures?.[0]
                            ? `${item?.weightsAndMeasures[0]?.netContent} ${item?.weightsAndMeasures[0]?.measurementUnit}`
                            : "NA"
                        }
                        className="product-quantity-text"
                      />
                    </Box>
                    <Box className="variant-product-price-details" pb="0.2rem">
                      <Box className="price-description">
                        <Text
                          text={`₹ ${
                            item?.inventorySync?.sellingPrice?.toFixed(2) ||
                            "0.00"
                          }`}
                          className="price-description-not-applicable"
                        />
                        <Text
                          text={`Cost: ₹ ${
                            item?.inventorySync?.purchasePrice || 0
                          }`}
                          className="price-description-applicable"
                        />
                      </Box>

                      {!variantAddState[item?.barcodes?.[0]] ? (
                        <Box className="product-add-btn">
                          <Button
                            // className="add-btn"
                            sx={dynamicStyle}
                            onClick={(event) => {
                              event.stopPropagation();
                              if (
                                item?.inventorySync?.availableQuantity !== 0
                              ) {
                                handleAddClick(item?.barcodes?.[0], item);
                              } else {
                                return null;
                              }
                            }}
                            // sx={{ top: "-0.2rem" }}
                          >
                            {item?.inventorySync?.availableQuantity !== 0
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
                              handleDecrementClick(
                                item?.inventorySync?.gtin,
                                item
                              );
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
                            <Text
                              text={variantQtyState?.[item?.barcodes?.[0]] || 1}
                              className="product-qty"
                            />
                          )}
                          <Box
                            className="increment-qty"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleIncrementClick(
                                item?.inventorySync?.gtin,
                                item
                              );
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
              </Box>
            </Box>
          );
        })}
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
