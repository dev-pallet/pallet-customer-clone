// react
import React from "react";

// mui components
import { Box } from "@mui/material";

// custom components
import Heading from "../../../custom-components/Heading";

// icons
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";

// styles
import "./index.css";

// constants
import { colorConstant } from "../../../../constants/colors";
import { useSelector } from "react-redux";
import { getStoreType } from "../../../../redux/reducers/miscReducer";

export default function HomeListingComponent({
  title,
  children,
  onClick,
  noData,
}) {
  const retailType = useSelector(getStoreType);
  return (
    <Box my={2}>
      <Box
        mx={"4px"}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        {title ? (
          <Box
            my="1"
            flex="1"
            alignItems="center"
            borderLeft="4px solid yellow"
          >
            <Heading text={title} paddingLeft="5px" />
          </Box>
        ) : null}

        {onClick ? (
          <Box mr="4px">
            <Box
              bg="#fff"
              // p="3px 4px 0px"
              boxShadow={2}
              // borderRadius="50%"
              onClick={onClick}
            >
              <ChevronRightOutlinedIcon
                style={{
                  color:
                    retailType === "RESTAURANT"
                      ? colorConstant?.sakuraRestroColor
                      : colorConstant?.primaryColor,
                  stroke: colorConstant?.primaryColor,
                  strokeWidth: 1,
                  fontSize: "1.2rem",
                }}
              />
            </Box>
          </Box>
        ) : null}
      </Box>
      <Box
        mx={1}
        sx={
          noData == true
            ? {
                display: "flex",
                justifyContent: "center",
              }
            : null
        }
      >
        {children}
      </Box>
    </Box>
  );
}
