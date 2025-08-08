import React from "react";

// mui components
import { Box } from "@mui/material";

//css
import "./index.css";

//custom-components
import Text from "../../../custom-components/Text";
import { colorConstant } from "../../../../constants/colors";
import Heading from "../../../custom-components/Heading";
import { cartAmountSaved } from "../../../../constants/imageUrl";
import { getBillingData } from "../../../../redux/reducers/cartReducer";
import { useSelector } from "react-redux";
import { getStoreType } from "../../../../redux/reducers/miscReducer";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const CartAmountSaved = () => {
  const billData = useSelector(getBillingData);
  const totalSave =
    parseInt(billData?.totalMrpValue) - parseInt(billData?.totalCartValue);
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  return (
    parseInt(totalSave) > 0 && (
      <Box className="cart-amount-saved">
        <Box className="amount-saving">
          <Box className="cart-amount-saved-gif">
            <LocalOfferIcon />
            {/* <img src={cartAmountSaved} className="amount-saved-img" /> */}
          </Box>
          <Text
            text={"You saved"}
            letterSpacing={1}
            tint={"#0B0B0B"}
            fontsize={12}
            fontweight={700}
          />
          <Heading
            text={`₹${totalSave}`}
            color={
              retailType !== "RESTAURANT"
                ? colorConstant?.primaryColor
                : colorConstant?.sakuraRestroColor
            }
            fontSize={16}
            marginBottom={"0.3rem"}
          />
          <Text text={"on this order"} letterSpacing={1} tint />
        </Box>
      </Box>
    )
  );
};

export default CartAmountSaved;
