import React, { useState } from "react";

// mui components
import { Box, CircularProgress } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import RedeemIcon from "@mui/icons-material/Redeem";
import CancelIcon from "@mui/icons-material/Cancel";

//css
import "./index.css";
import Heading from "../../../custom-components/Heading";
import Text from "../../../custom-components/Text";
import { useNavigate } from "react-router-dom";

//redux
import {
  getCartId,
  getLoyalityData,
  setCartBill,
  setLoyalityPoints,
} from "../../../../redux/reducers/cartReducer";
import { colorConstant } from "../../../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { removeLoyality } from "../../../../config/services/cartService";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const CartLoyality = () => {
  const dispatch = useDispatch();
  const loyaltyData = useSelector(getLoyalityData);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const navigate = useNavigate();
  const [loyaltyLoader, setLoyaltyLoader] = useState(false);

  const handleCartLoyality = () => {
    navigate("/loyalty-points");
  };

  const removeRedeem = async (event) => {
    event.stopPropagation();
    try {
      setLoyaltyLoader(true);
      const res = await removeLoyality(cartId);
      setLoyaltyLoader(false);
      if (!res?.data?.data) {
        return;
      }
      dispatch(setLoyalityPoints(null));
      dispatch(setCartBill(res?.data?.data?.billing));
    } catch (err) {
      setLoyaltyLoader(false);
    }
  };

  return (
    <Box className="cart-loyalty" onClick={handleCartLoyality}>
      <Box className="cart-loyalty-details">
        <Box className="cart-loyalty-left">
          <Box className="cart-loyalty-icon">
            {/* <RedeemIcon className="redeem-icon" /> */}
            <CurrencyRupeeIcon
              style={{
                backgroundColor: "rgb(173, 26, 25)",
                borderRadius: "15px",
                padding: "2px",
                color: "white",
                fontSize: "15px",
              }}
            />
          </Box>
          {loyaltyData?.loyaltyPointsValue ? (
            <Box className="loyalty-applied">
              <Heading
                text={"Redeemed Value:"}
                fontSize={14}
                fontWeight={300}
              />
              <Heading
                text={`\u20b9${loyaltyData?.loyaltyPointsValue}`}
                fontSize={14}
                fontWeight={300}
                tint={colorConstant?.primaryColor}
              />
            </Box>
          ) : (
            <Box className="cart-loyalty-description">
              <Heading
                text={"Add Loyalty Points"}
                fontSize={12}
                fontWeight={700}
                // tint={"rgb(173, 26, 25) !important"}
              />
              <Text
                text={"View all loyalty"}
                sx={{
                  color: "rgb(173, 26, 25)",
                  fontSize: "10px",
                  fontWeight: "700",
                }}
              />
            </Box>
          )}
        </Box>
        {loyaltyData?.loyaltyPointsValue ? (
          <Box className="loyalty-applied-remove-icon" onClick={removeRedeem}>
            {loyaltyLoader ? (
              <CircularProgress
                sx={{
                  color: colorConstant?.primaryColor,
                  width: "10px !important",
                  height: "10px !important",
                }}
              />
            ) : (
              <CancelIcon
                style={{
                  width: "auto",
                  height: "16px",
                  color: "red",
                }}
              />
            )}
          </Box>
        ) : (
          <Box className="cart-loyalty-navigation-icon">
            <button
              onClick={handleCartLoyality}
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
              {" "}
              Apply
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CartLoyality;
