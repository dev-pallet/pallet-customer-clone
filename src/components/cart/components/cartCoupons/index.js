import React, { useState } from "react";

// mui components
import { Box, CircularProgress } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

//css
import "./index.css";
import Heading from "../../../custom-components/Heading";
import Text from "../../../custom-components/Text";

//assets
import discountCoupon from "../../../../assets/images/discount.png";
import { useNavigate } from "react-router-dom";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getAppliedCoupon,
  getCartId,
  setAppliedCoupon,
  setCartBill,
} from "../../../../redux/reducers/cartReducer";
import { colorConstant } from "../../../../constants/colors";
import { removeCoupon } from "../../../../config/services/cartService";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { getStoreType } from "../../../../redux/reducers/miscReducer";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
const CartCoupons = () => {
  const navigate = useNavigate();
  const couponApplied = useSelector(getAppliedCoupon);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const [loading, setLoading] = useState(false);
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const handleCoupons = (event) => {
    event.stopPropagation();
    navigate("/coupons");
  };

  const handleRemoveCoupon = async (event) => {
    event.stopPropagation();
    try {
      setLoading(true);
      const res = await removeCoupon(cartId);
      setLoading(false);
      if (res?.data?.status === "SUCCESS") {
        dispatch(setCartBill(res?.data?.data?.billing));
        dispatch(setAppliedCoupon(null));
      }
    } catch (err) {
      setLoading(false);
      showSnackbar(
        err?.message || "An error occured while removing coupon",
        "error"
      );
    }
  };

  return (
    <Box className="cart-coupons">
      <Box className="cart-coupons-details">
        <Box className="cart-coupons-left">
          <Box className="cart-coupons-icon">
            {couponApplied !== null ? (
              <CheckCircleIcon
                style={{
                  color: "rgb(12, 121, 36)",
                }}
              />
            ) : (
              <ConfirmationNumberIcon
                style={{
                  color: "rgb(173, 26, 25)",
                }}
              />
            )}
          </Box>
          <Box className="cart-coupon-description" onClick={handleCoupons}>
            {couponApplied !== null ? (
              <Heading
                text={couponApplied?.couponName}
                fontSize={14}
                fontWeight={500}
              />
            ) : (
              <Heading
                text={"Add Coupon"}
                fontSize={12}
                fontWeight={700}
                // tint={"rgb(173, 26, 25) !important"}
              />
            )}
            {couponApplied !== null ? (
              <Text
                text={`You got discount of \u20b9${couponApplied?.couponValue}`}
                tint={
                  retailType !== "RESTAURANT"
                    ? colorConstant?.primaryColor
                    : colorConstant?.sakuraRestroColor
                }
              />
            ) : (
              <Text
                text={"View all coupons"}
                sx={{
                  color: "rgb(173, 26, 25)",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              />
            )}
          </Box>
        </Box>

        <Box className="cart-coupon-navigation-icon">
          {couponApplied == null && loading ? (
            <>
              <CircularProgress
                sx={{
                  width: "10px !important",
                  height: "10px !important",
                }}
              />
            </>
          ) : couponApplied !== null && !loading ? (
            <HighlightOffIcon
              style={{
                color: "indianred",
              }}
              onClick={handleRemoveCoupon}
            />
          ) : (
            <button
              onClick={handleCoupons}
              style={{
                border: "1.5px solid rgb(173, 26, 25)",
                borderRadius: "2px",
                padding: "8px",
                width: "100%",
                color: "rgb(173, 26, 25)",
                fontWeight: "600",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Apply
            </button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CartCoupons;
