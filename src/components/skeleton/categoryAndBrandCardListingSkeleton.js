// react 
import React from "react";
// mui 
import { Box, Skeleton } from "@mui/material";

export default function CategoryAndBrandListingSkeleton({ listingType }) {
  const renderCategoryCardListing = () => {
    const components = [];
    for (let i = 0; i < 9; i++) {
      components.push(<CategoryCardListing key={i} />);
    }
    return components;
  };

  const renderBrandCardListing = () => {
    const components = [];
    for (let i = 0; i < 6; i++) {
      components.push(<BrandCardListing key={i} />);
    }
    return components;
  };

  return listingType === "category"
    ? renderCategoryCardListing()
    : listingType === "brand"
    ? renderBrandCardListing()
    : null;
}

export const CategoryCardListing = () => {
  return (
    <Box>
      <Box width={"100px"} height={"130px"}>
        <Box className="category-div">
          <Skeleton
            variant="rectangular"
            sx={{
              height: "100%",
              width: "100%",
            }}
          />
        </Box>
        <Skeleton variant="text" width={"100%"} height="20px" />
      </Box>
    </Box>
  );
};

export const BrandCardListing = () => {
  return (
    <Box className="brand-div">
      <Box className="brand-div-image">
        <Skeleton
          variant="rectangular"
          sx={{
            height: "100%",
            width: "100%",
          }}
        />
      </Box>
    </Box>
  );
};
