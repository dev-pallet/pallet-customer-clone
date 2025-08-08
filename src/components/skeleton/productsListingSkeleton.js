// react
import React from "react";
// mui
import { Box, Skeleton } from "@mui/material";
import "./skeleton.css";

const addBtnStyle = {
  position: "relative !important",
  right: "0.5rem !important",
  top: " 0.2rem !important",
  width: "6rem",
  borderRadius: "1rem !important",
  padding: "2px 8px !important",
};

export default function ProductsListingSkeleton({ listingType }) {
  const renderVerticalListing = () => {
    const components = [];
    for (let i = 0; i < 10; i++) {
      components.push(<VerticalCategoryCard key={i} />);
    }
    return components;
  };

  const renderHorizontalListing = () => {
    const components = [];
    for (let i = 0; i < 3; i++) {
      components.push(<HorizontalCategoryCard key={i} />);
    }
    return components;
  };

  return listingType === "vertical"
    ? renderVerticalListing()
    : listingType === "horizontal"
    ? renderHorizontalListing()
    : null;
}

export const VerticalCategoryCard = () => {
  return (
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
        <Skeleton
          variant="rectangular"
          sx={{ height: "100%", borderRadius: "0", marginTop: 0 }}
          className="prod-img"
        />
      </Box>
      <Box flex={1}>
        <Box className="product-name" sx={{ paddingTop: 0 }}>
          <Skeleton
            variant="text"
            width={"100%"}
            height="20px"
            className="product-name-text"
          />
        </Box>
        <Box className="product-description">
          <Skeleton
            variant="text"
            width={"100%"}
            height="20px"
            className="product-description-text"
          />
        </Box>
        <Box
          className="product-quantity"
          sx={{ padding: "0.3rem 0.6rem 0 0.6rem" }}
        >
          <Skeleton
            variant="text"
            width={"100%"}
            height="20px"
            className="product-quantity-text"
          />
        </Box>
        <Box className="product-price-details" pb="0.2rem">
          <Box className="price-description">
            <Skeleton
              variant="text"
              width={"100px"}
              height="20px"
              className="price-description-not-applicable"
            />

            <Skeleton
              variant="text"
              width={"100px"}
              height="20px"
              className="price-description-applicable"
            />
          </Box>

          {/* add to cart  */}
          <Box className="product-add-btn">
            <Skeleton
              variant="rectangular"
              sx={({ top: "-0.2rem" }, addBtnStyle)}
              width={"100%"}
              height="20px"
            />
          </Box>
        </Box>
      </Box>

      {/* discount tag and wishlist  */}
      <Box className="product-discount" left={0} top={0}>
        <Box className="discount-details">
          <Skeleton
            variant="text"
            width={"100%"}
            height="20px"
            className="discount-text"
          />
        </Box>
      </Box>
      <Box className="product-wishlist">
        <Box className="whishlist-details">
          <Skeleton
            variant="circular"
            height="20px"
            className="wishlist-icon"
          />
        </Box>
      </Box>
    </Box>
  );
};

export const HorizontalCategoryCard = () => {
  return (
    <Box className="product-details" sx={{ position: "relative" }}>
      <Box className="product-image-box">
        <Box className="product-image">
          <Skeleton
            variant="rectangular"
            sx={{
              height: "8rem",
              width: "90%",
              marginTop: "25px",
              borderRadius: "0",
            }}
            className="prod-img"
          />
        </Box>
      </Box>
      <Box className="product-discount" sx={{ backgroundColor: "inherit" }}>
        <Box className="discount-details">
          <Skeleton
            variant="text"
            width={"100%"}
            height="20px"
            className="discount-text"
          />
        </Box>
      </Box>
      <Box className="product-wishlist">
        <Box className="whishlist-details">
          <Skeleton
            variant="circular"
            width={"100%"}
            height="20px"
            className="wishlist-icon"
          />
        </Box>
      </Box>
      <Box className="horizontal-product-card-wrapper">
        <Box className="product-name">
          <Skeleton
            variant="text"
            width={"100%"}
            height="20px"
            className="product-name-text"
          />
        </Box>
        <Box className="product-description">
          <Skeleton
            variant="text"
            width={"100%"}
            height="20px"
            className="product-description-text"
          />
        </Box>
        <Box
          className="product-quantity"
          sx={{ padding: "0.3rem 0.6rem 0 0.6rem" }}
        >
          <Skeleton
            variant="text"
            width={"100%"}
            height="20px"
            className="product-quantity-text"
          />
        </Box>
        <Box className="product-price-details">
          <Box className="price-description">
            <Skeleton
              variant="text"
              width={"60px"}
              height="20px"
              className="price-description-not-applicable"
            />

            <Skeleton
              variant="text"
              width={"60px"}
              height="20px"
              className="price-description-applicable"
            />
          </Box>

          {/* add product  */}
          <Box className="product-add-btn">
            <Skeleton
              variant="rectangular"
              sx={
                (addBtnStyle,
                {
                  top: "-0.2rem",
                  width: "4rem",
                  marginRight: "0.5rem",
                  borderRadius: "1rem",
                })
              }
              height="20px"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
