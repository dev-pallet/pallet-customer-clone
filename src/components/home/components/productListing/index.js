// react
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

// mui components
import { Box } from "@mui/material";

// custom components
import Text from "../../../custom-components/Text";
import Menuback from "../../../menuback";

// constants
import { colorConstant } from "../../../../constants/colors";
import ProductCard from "../productCard";

// styles
import "./index.css";

// loader
import { no_image } from "../../../../constants/imageUrl";
import { CircularLoader } from "../../../custom-components/CircularLoader";
import Loader from "../../../custom-components/Loader";
import NothingFound from "../../../custom-components/NothingFound";
import ProductsListingSkeleton from "../../../skeleton/productsListingSkeleton";
import ViewCart from "../viewCart";

export default function ProductListing({
  title,
  tags,
  totalItems,
  itemsList,
  loading,
  isSearch,
  isWishlist,
  searchItem,
  noData,
  init,
  adjustCartViewInWishlist,
  isWishlistPage,
}) {
  const allVariants = itemsList?.flatMap((item) =>
    item?.variants?.map((variant) => ({
      ...variant,
      productData: item,
    }))
  );

  return (
    <Box className="product-list-container">
      {isSearch || isWishlist ? null : (
        <Menuback
          head={true}
          search={true}
          text={title}
          bg={colorConstant?.baseBackground}
        />
      )}
      <Box
        marginTop={!isSearch && "3rem"}
        sx={
          adjustCartViewInWishlist
            ? {
                marginBottom: "3rem",
              }
            : null
        }
      >
        <Box px="10px" pb="10px">
          {isSearch && searchItem !== "" ? (
            <Text text={`Showing results for "${searchItem}"`} />
          ) : totalItems !== null && !isWishlist ? (
            `${totalItems} Products`
          ) : null}
          {init ? (
            <Loader />
          ) : (
            <Box
              mt="0.7rem"
              pb={5}
              sx={{
                display: "grid",
                gridTemplateColumns: isWishlistPage
                  ? "repeat(5, 1fr)"
                  : "repeat(5, 1fr)",
                gap: "1.4em",
                padding: "1em",
                alignItems: "center",
              }}
            >
              {noData ? (
                <NothingFound message={"nothing found"} width={"200px"} />
              ) : itemsList?.length ? (
                itemsList?.map((item) => {
                  return (
                    <ProductCard
                      key={item?.id}
                      imageUrl={item?.variants?.[0]?.images?.front || no_image}
                      discountText={
                        item?.variants?.[0]?.["inventorySync"]?.mrp &&
                        item?.variants?.[0]?.["inventorySync"]?.sellingPrice
                          ? `${Math.abs(
                              parseInt(
                                parseFloat(
                                  ((item?.variants?.[0]?.["inventorySync"]
                                    ?.mrp -
                                    item?.variants?.[0]?.["inventorySync"]
                                      ?.sellingPrice) /
                                    item?.variants?.[0]?.["inventorySync"]
                                      ?.mrp) *
                                    100
                                ).toFixed(2)
                              )
                            )}% OFF`
                          : "Best Price"
                      }
                      productName={
                        item?.["companyDetail"]?.brand || "Unknown Brand"
                      }
                      productDescription={item?.name || "No Description"}
                      productQuantity={`${
                        item?.variants?.[0]?.weightsAndMeasures?.[0]
                          ?.grossWeight || "NA"
                      } ${
                        item?.variants?.[0]?.weightsAndMeasures?.[0]
                          ?.measurementUnit || ""
                      }`}
                      originalPrice={
                        item?.variants?.[0]?.["inventorySync"]?.mrp || 0
                      }
                      discountedPrice={
                        item?.variants?.[0]?.["inventorySync"]?.sellingPrice ||
                        0
                      }
                      productAvailablity={`In Stock: ${
                        item?.variants?.[0]?.["inventorySync"]
                          ?.availableQuantity || 0
                      } Items`}
                      productData={item}
                    />
                  );
                })
              ) : (
                !noData && <ProductsListingSkeleton listingType="vertical" />
              )}
              {loading && <CircularLoader />}
            </Box>
          )}
        </Box>
      </Box>
      <ViewCart adjustView={true} />
    </Box>
  );
}
