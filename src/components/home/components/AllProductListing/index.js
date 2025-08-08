import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Box, Typography } from "@mui/material";

const AllProductListing = () => {
  const { categoryName } = useParams();

  const location = useLocation();
  const fullMenu = location.state?.fullMenu || [];

  // Scroll to the category on mount
  useEffect(() => {
    if (categoryName) {
      const targetId = categoryName?.replace(/\s+/g, "-").toLowerCase();
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [categoryName]);

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "black",
        color: "white",
      }}
    >
      {fullMenu?.length === 0 ? (
        <Typography>No menu data available.</Typography>
      ) : (
        fullMenu?.map((category, index) => (
          <Box
            key={index}
            id={category?.categoryName.replace(/\s+/g, "-").toLowerCase()}
            sx={{ mb: 4, backgroundColor: "white", borderRadius: "9px" }}
          >
            <Typography
              variant="h5"
              sx={{
                position: "sticky",
                top: 0,
                padding: "5px",
                zIndex: 10,
                color: "black",
                fontWeight: "500",
              }}
            >
              {category?.categoryName}
            </Typography>

            {/* Example rendering for level2Entities (nested products) */}
            {category?.level2Entities?.length > 0 ? (
              category?.level2Entities?.map((item, i) => (
                <Typography
                  variant="h6"
                  key={i}
                  sx={{ pl: 2, pt: 1, color: "white" }}
                >
                  {item?.categoryName}
                </Typography>
              ))
            ) : (
              <Typography sx={{ pl: 2, pt: 1, color: "black" }}>
                No products
              </Typography>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default AllProductListing;
