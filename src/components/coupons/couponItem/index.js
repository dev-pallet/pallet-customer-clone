import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// mui components
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, CircularProgress, Drawer } from "@mui/material";

//css
import "./index.css";

//custom-component
import Text from "../../custom-components/Text";

//assets
import orderSuccessAnimation from "../../../assets/animation-json/order.json";

//libraries
import Lottie from "react-lottie";

//redux
import { useDispatch, useSelector } from "react-redux";
import { applyCoupon } from "../../../config/services/cartService";
import { colorConstant } from "../../../constants/colors";
import { useSnackbar } from "../../../custom hooks/SnackbarProvider";
import {
  getAppliedCoupon,
  getCartId,
  setAppliedCoupon,
  setCartBill,
} from "../../../redux/reducers/cartReducer";

const CouponItem = ({ couponData }) => {
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const couponApplied = useSelector(getAppliedCoupon);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [drawerState, setDrawerState] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: orderSuccessAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toggleDrawer = (val) => {
    setDrawerState(val);
  };

  const couponApply = async () => {
    const payload = {
      couponId: couponData?.couponId,
      cartId,
      couponCode: couponData?.couponCode,
    };
    try {
      setLoading(true);
      const res = await applyCoupon(payload);
      setLoading(false);
      if (res?.data?.status === "SUCCESS") {
        dispatch(setAppliedCoupon(res?.data?.data?.cartCoupon));
        dispatch(setCartBill(res?.data?.data?.billing));
        setDrawerState(true);
        setTimeout(() => {
          navigate("/cart");
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  return (
    <>
      <Box className="coupon-item">
        <Box className="coupon-item-top">
          <Box className="coupon-img-data">
            <img className="coupon-img" src={couponData?.image} />
          </Box>
          <Box className="coupon-item-details">
            <Text text={couponData?.offerName} fontSize={14} tint="black" />
            <Text text={couponData?.description} tint="slategrey" />
            <Box className="coupon-item-code">
              <Box className="coupon-code">
                <Text
                  text={couponData?.couponCode}
                  tint="0f8241"
                  fontSize={12}
                  textTransform="uppercase"
                  letterSpacing="0.2rem"
                />
              </Box>
              <Box
                className="coupon-code-details"
                onClick={() => setShow(!show)}
              >
                {!show ? (
                  <>
                    <Text text="View Details" tint="slategrey" />
                    <KeyboardArrowDownIcon
                      sx={{
                        fontSize: "0.6rem",
                        color: "slategrey",
                      }}
                    />
                  </>
                ) : (
                  <Box className="coupon-hide-details">
                    <Text text="Hide Details" tint="slategrey" />
                    <Box className="coupon-hide-details-icon">
                      <ExpandLessIcon
                        sx={{
                          fontSize: "0.6rem",
                          color: "slategrey",
                        }}
                      />
                      <ExpandMoreIcon
                        sx={{
                          fontSize: "0.6rem",
                          color: "slategrey",
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        {show && (
          <Box>
            <Box className="seperator"></Box>
            <Box className="coupon-terms-and-condition">
              <Text text={couponData?.termsAndConditions} tint="slategrey" />
            </Box>
          </Box>
        )}

        <Box
          className="coupon-item-bottom"
          sx={{
            backgroundColor:
              couponData?.couponCode === couponApplied?.couponCode
                ? "rgb(12, 121, 36)"
                : colorConstant?.secondaryColor,
          }}
          onClick={couponApply}
        >
          {loading ? (
            <CircularProgress
              sx={{
                width: "10px !important",
                height: "10px !important",
              }}
            />
          ) : (
            <Text
              text={
                couponData?.couponCode === couponApplied?.couponCode
                  ? "APPLIED"
                  : "TAP TO APPLY"
              }
              fontweight={"bold"}
              tint={
                couponData?.couponCode === couponApplied?.couponCode
                  ? "#fff"
                  : colorConstant?.iconColor
              }
            />
          )}
        </Box>
      </Box>
      <Drawer
        anchor={"bottom"}
        open={drawerState}
        onClose={() => toggleDrawer(false)}
      >
        <CloseSharpIcon
          className="drawer-cancel-button"
          onClick={() => toggleDrawer(false)}
        />
        <Box p={2} className="drawer-main-box">
          <Box className="drawer-coupon-applied">
            <Lottie options={animationOptions} height={70} width={70} />
            <Text
              fontWeight="bold"
              fontSize={22}
              textTransform="uppercase"
              text={couponApplied?.couponName}
            />
            <Text text={"Applied Successfully"} />
            <Text
              text={
                "you have got " + `\u20b9` + couponApplied?.couponValue + " off"
              }
              fontSize={12}
              tint={colorConstant?.primaryColor}
            />
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default CouponItem;
