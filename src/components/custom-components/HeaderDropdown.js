// react
import React, { useState } from "react";

// mui components
import { Box, Drawer, FormControl, FormLabel } from "@mui/material";
import { makeStyles } from "@mui/styles";

// custom components
import Heading from "./Heading";
import Text from "./Text";

// icons
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { IoIosArrowDown } from "react-icons/io";

// constants
import { useNavigate } from "react-router";
import { colorConstant } from "../../constants/colors";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";

const useStyles = makeStyles({
  drawer: {
    "& .MuiDrawer-paper": {
      height: "50%", // Adjust the height as needed
    },
  },
});

export default function HeaderDropdown({
  text1,
  text2,
  isHome = true,
  mainCategories,
}) {
  const [drawerState, setDrawerState] = useState(false);
  const navigate = useNavigate();
  const toggleDrawer = (val) => {
    setDrawerState(val);
  };
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  const classes = useStyles();

  return (
    <Box ml="10px">
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "5px",
          cursor: "pointer",
        }}
        onClick={() => {
          if (isHome === false) {
            toggleDrawer(true);
          }
          if (isHome === true) {
            navigate("/address-book");
          }
        }}
      >
        <Heading
          text={text1 ? text1 : null}
          fontsize="14px"
          fontweight={600}
          color={retailType === "RESTAURANT" ? "black" : "#000000"}
        />
        <IoIosArrowDown
          // "rgb(134,140,150)"
          // !isHome && retailType === "RESTAURANT"
          //   ? colorConstant?.sakuraRestroColor
          //   : colorConstant?.primaryColor
          color={"#000 !important"}
          sx={{ cursor: "pointer" }}
        />
      </Box>
      {text2 ? (
        <Text
          text={text2}
          tint={
            retailType === "RESTAURANT"
              ? "black"
              : !isHome && "rgb(134,140,150)"
          }
          // tint={!isHome && "rgb(134,140,150)"}
        />
      ) : null}

      {/* drawer  */}
      {isHome === false && (
        <Drawer
          anchor={"bottom"}
          open={drawerState}
          onClose={() => toggleDrawer(false)}
          PaperProps={{ sx: { height: "50%", background: "transparent" } }}
        >
          <CloseSharpIcon
            className="drawer-cancel-button"
            onClick={() => toggleDrawer(false)}
            sx={{
              position: "fixed",
              left: "50%",
              bottom: "50%",
            }}
          />
          <Box
            p={2}
            className="drawer-main-box"
            // sx={{ overflowY: "scroll" }}
          >
            <FormControl>
              <FormLabel>
                {mainCategories?.map((item, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      navigate(`/product-listing/category/${item?.categoryId}`);
                      toggleDrawer(false);
                    }}
                  >
                    <Text
                      text={item?.categoryName}
                      className="language-font-style"
                      mb="10px"
                    />
                  </Box>
                ))}
              </FormLabel>
            </FormControl>
          </Box>
        </Drawer>
      )}
    </Box>
  );
}
