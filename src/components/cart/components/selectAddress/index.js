// react
import React, { useEffect } from "react";

// mui component
import { Box } from "@mui/material";

// custom component
import Heading from "../../../custom-components/Heading";
import Text from "../../../custom-components/Text";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

// redux-reducer
import { getDeliveryAddress } from "../../../../redux/reducers/userReducer";

// function
import { truncateText } from "../../../../constants/commonFunction";

// constants
import { colorConstant } from "../../../../constants/colors";
import { boxShadow } from "../../../../constants/cssStyles";

// styles
import "./index.css";
import { getBillingData } from "../../../../redux/reducers/cartReducer";
import { getStoreType } from "../../../../redux/reducers/miscReducer";

export default function SelectAddress() {
  const liveLoc = useSelector(getDeliveryAddress);
  const navigate = useNavigate();
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  const billData = useSelector(getBillingData);
  const totalSave =
    parseInt(billData?.totalMrpValue) - parseInt(billData?.totalCartValue);

  const handleChangeAddress = () => {
    localStorage.setItem("address_change_from_cart", true);
    navigate("/address-book");
  };

  useEffect(() => {
    // if address_change_from_cart present in localStorage, remove it
    let addressChangeFromCart = localStorage.getItem(
      "address_change_from_cart"
    );
    if (addressChangeFromCart) {
      localStorage.removeItem("address_change_from_cart");
    }
  }, []);

  return (
    <Box
      className={
        totalSave > 0 ? "select-address-div" : "select-address-div-alt"
      }
      // boxShadow={boxShadow}
      onClick={handleChangeAddress}
    >
      <Box className="cart-delivery-address-wrapper">
        <Box className="content-space-between">
          <Box className="content-left" alignItems="baseline" gap="5px">
            <Text
              text="Delivering To"
              fontsize="12px"
              fontweight={400}
              color="#333333"
            />

            <Heading
              text={`${
                liveLoc?.addressType === "OTHER"
                  ? liveLoc?.otherName
                  : liveLoc?.addressType || "WORK"
              }`}
              tint={
                retailType === "RESTAURANT"
                  ? colorConstant?.showdowColor
                  : colorConstant?.primaryColor
              }
            />
          </Box>
          <Box>
            <Text
              text="Change"
              tint={
                retailType === "RESTAURANT"
                  ? "#333333"
                  : colorConstant?.requiredColor
              }
            />
          </Box>
        </Box>
        <Text
          text={
            liveLoc !== null
              ? truncateText(
                  liveLoc?.street_address ||
                    liveLoc?.addressLine1 + liveLoc?.addressLine2,
                  50
                )
              : null
          }
          tint="333333"
          fontsize="10px"
          fontweight={400}
        />
      </Box>
    </Box>
  );
}
