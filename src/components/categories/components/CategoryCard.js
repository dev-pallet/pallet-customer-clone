// react
import React from "react";
import { useNavigate } from "react-router";

// mui components
import { Box } from "@mui/material";

// custom components
import Text from "../../custom-components/Text";

// common function
import { truncateText } from "../../../constants/commonFunction";

// styles
import "./index.css";

export default function CategoryCard({
  categoryName,
  mainCategoryId,
  brandName,
  imgUrl,
  isBrand,
}) {
  const navigate = useNavigate();
  const imgShadow =
    "0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)";
  return (
    <Box
      sx={{
        display: brandName && "flex",
        justifyContent: brandName && "center",
      }}
    >
      {categoryName ? (
        <Box
          height={"130px"}
          onClick={() => {
            navigate(`/product-listing/category/${mainCategoryId}`);
          }}
        >
          <Box className="category-text-image-wrapper">
            <Box className="category-div">
              <img
                src={imgUrl}
                alt={categoryName}
                width="100%"
                height="100%"
                // style={{
                //   objectFit: "contain",
                //   borderRadius: "8px",
                // }}
              />
            </Box>
            <Text
              text={truncateText(categoryName, 32)}
              fontsize="10px"
              textAlign="center"
              marginTop=" 7px"
              // fontweight={600}
            />
          </Box>
        </Box>
      ) : (
        <Box
          onClick={() => {
            navigate(`/product-listing/brand/${brandName}`);
          }}
          className="brand-div"
        >
          <Box className="brand-div-image">
            <img
              src={imgUrl}
              alt={brandName}
              width="100%"
              height="100%"
              // style={{ objectFit: "contain" }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
