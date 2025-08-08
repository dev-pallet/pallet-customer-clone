import React, { memo, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Box, Avatar, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Text from "../../../custom-components/Text";
import { useSelector } from "react-redux";
import {
  getBillingData,
  getCartProducts,
} from "../../../../redux/reducers/cartReducer";
import {
  getServiceable,
  getStoreType,
} from "../../../../redux/reducers/miscReducer";
import { colorConstant } from "../../../../constants/colors";
import { motion } from "framer-motion";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import "../../index.css";

const ViewCart = ({ adjustView }) => {
  const billData = useSelector(getBillingData);
  const cartProducts = useSelector(getCartProducts);
  const isServiceable = useSelector(getServiceable);
  const navigate = useNavigate();
  const totalCartValue = billData?.totalCartValue ?? 0;

  const location = useLocation();

  const totalMrpValue = billData?.totalMrpValue ?? 0;
  const retailType = useSelector(getStoreType);
  const handleViewCart = () => {
    navigate("/cart");
  };
  const [translateY, setTranslateY] = useState(300);

  if (!cartProducts?.length || !isServiceable || totalCartValue <= 0) {
    return null;
  }

  // useEffect(() => {
  //   setTranslateY(-50);
  //   const timer = setTimeout(() => {
  //     setTranslateY(0);
  //   }, 300);
  //   return () => clearTimeout(timer);
  // }, [cartProducts?.length]);

  // const renderCircle = useCallback((item, i) => {
  //   return (
  //     <motion.div
  //       key={i}
  //       // initial={{ y: 80, x: -1 }}
  //       animate={{ y: 0, x: 12 }}
  //       transition={{ delay: 0.04 * i }}
  //       style={{
  //         width: 28,
  //         height: 28,
  //         borderRadius: "50%",
  //         backgroundColor: item?.color,
  //         marginLeft: "13px",
  //         zIndex: i,
  //         border: "1px solid white",
  //         position: "absolute",
  //         left: "12px",
  //         // transform: `translateX(10px)`,
  //       }}
  //     />
  //   );
  // }, []);

  // utils/screen.js
  const screen = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const iconSize = screen.width > 480 ? 20 * 1.4 : 22;
  return (
    <>
      {retailType !== "RESTAURANT" ? (
        <Box
          className="home-cart-view"
          sx={adjustView ? { height: "4.5rem" } : null}
        >
          <Box
            className="home-cart-details"
            sx={{
              backgroundColor:
                retailType === "RESTAURANT"
                  ? colorConstant?.sakuraRestroColor
                  : colorConstant?.twinleavesColorPallet,
              // width: retailType === "RESTAURANT" ? "100%" : "30%",
            }}
            onClick={handleViewCart}
          >
            <Box className="home-cart-amount-details">
              <Box className="home-cart-icon">
                <ShoppingCartIcon className="cart-icon" />
              </Box>
              <Box className="cart-line"></Box>
              <Box className="home-cart-amount">
                <Text
                  text={`₹${totalCartValue}`}
                  fontsize={17}
                  fontweight={600}
                  tint="white"
                />
              </Box>
              {totalMrpValue - totalCartValue > 0 && (
                <Box className="cart-total-amount-saved">
                  <Text
                    text={`\u20b9${parseInt(
                      totalMrpValue - totalCartValue
                    )} saved`}
                    fontsize={12}
                    fontweight={600}
                    tint="white"
                  />
                </Box>
              )}
              <Box className="home-total-cart-items">
                <Text
                  text={cartProducts?.length}
                  fontsize={12}
                  fontweight={600}
                  tint="white"
                />
              </Box>
            </Box>
            <Box className="home-cart-redirect">
              <Text
                text="View Cart"
                fontsize={17}
                fontweight={600}
                tint="white"
              />
              <Box>
                <ArrowForwardIosIcon sx={{ color: "white" }} />
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "fixed",
            bottom: location.pathname !== "/search" ? 
              "calc(75px + env(safe-area-inset-bottom))" : 
              "calc(85px + env(safe-area-inset-bottom))",
            left: "50%", // center from left
            transform: "translateX(-50%)", // pull it back to center
            backgroundColor: "#a91b1b",
            borderRadius: 50,
            padding: "4px 8px",
            gap: 1,
            zIndex: 999,
            cursor: "pointer",
          }}
          onClick={handleViewCart}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* {circles.map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: color,
                  marginLeft: index !== 0 ? -8 : 0,
                  border: "2px solid white",
                }}
              />
            ))} */}
            {/* {circles?.map(renderCircle)} */}
            <motion.div
              // initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                width: 36,
                height: 36,
                padding: 0,
                backgroundColor: colorConstant?.surfaceWhite,
                borderRadius: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                // transform: "translateX(10px)",
                zIndex: "9999",
              }}
              className="cart-btn-items-img"
            >
              {cartProducts?.length > 0 ? (
                <img
                  src={cartProducts[cartProducts?.length - 1]?.productImage}
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "100%",
                  }}
                />
              ) : (
                <ShoppingCartIcon size={12} color={colorConstant?.greenG0} />
              )}
            </motion.div>
          </div>
          {cartProducts?.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box>
                <Typography
                  fontWeight={500}
                  fontSize={14}
                  color={colorConstant?.surfaceWhite}
                >
                  View cart
                </Typography>
                <Typography
                  fontWeight={400}
                  fontSize={12}
                  color={colorConstant?.surfaceWhite}
                >
                  {cartProducts?.length}{" "}
                  {cartProducts?.length > 1 ? "items" : "item"}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: colorConstant?.defaultButtonText,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className="cart-btn-items-btn"
              >
                <ArrowRightAltIcon
                  sx={{ color: colorConstant?.sakuraRestroColor }}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
};

export default ViewCart;
