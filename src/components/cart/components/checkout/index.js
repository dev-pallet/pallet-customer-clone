import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// mui components
import { Box, CircularProgress } from "@mui/material";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getDeliveryAddress,
  getUserData,
} from "../../../../redux/reducers/userReducer";

//css
import "./index.css";

//custom-components
import StyledButton from "../../../custom-components/Button";

//redux
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { paymentRoutesConstant } from "../../../../Payment/RouteConstants";
import {
  getBillingData,
  getCartId,
  getShippingAddress,
} from "../../../../redux/reducers/cartReducer";
import {
  getDeliveryPromise,
  getSelectedSlot,
  getServiceable,
  getStoreType,
} from "../../../../redux/reducers/miscReducer";
import Text from "../../../custom-components/Text";
import { colorConstant } from "../../../../constants/colors";
import SelectAddress from "../selectAddress";

const Checkout = () => {
  const navigate = useNavigate();
  const isServiceable = useSelector(getServiceable);
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const address = useSelector(getShippingAddress);
  const deliveryAddress = useSelector(getDeliveryAddress);
  const billData = useSelector(getBillingData);
  const selectedSlot = useSelector(getSelectedSlot);
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const [drawerState, setDrawerState] = useState(false);
  const [payBy, setPayBy] = useState("COD");
  const [checked, setChecked] = useState({
    COD: true,
    ONLINE: false,
  });
  const [loading, setLoading] = useState(false);

  const toggleDrawer = (val) => {
    setDrawerState(val);
  };

  const handleAddAddress = () => {
    navigate("/address-book");
  };

  const handleCheckboxChange = (event) => {
    const { name, checked: isChecked } = event.target;
    if (isChecked && name === "COD") {
      setChecked({ COD: true, ONLINE: false });
    } else if (isChecked && name === "ONLINE") {
      setChecked({ COD: false, ONLINE: true });
    }
    setPayBy(name);
    toggleDrawer(false);
  };

  const handlePlaceOrder = async () => {
    navigate(paymentRoutesConstant.DEFAULT);
  };

  return (
    <>
      {(address !== null && isServiceable == true && user?.addresses?.length) ||
      (deliveryAddress !== null &&
        isServiceable == true &&
        user?.addresses?.length) ? (
        <Box className="cart-checkout-order">
          <Box
            className="cart-place-order"
            sx={{
              opacity: selectedSlot !== null ? 1 : 0.5,
              backgroundColor:
                retailType === "RESTAURANT"
                  ? colorConstant?.sakuraRestroColor
                  : colorConstant?.twinleavesColorPallet,
            }}
            onClick={selectedSlot !== null ? handlePlaceOrder : null}
          >
            {loading ? (
              <CircularProgress
                sx={{
                  color: "white",
                  width: "10px !important",
                  height: "10px !important",
                }}
              />
            ) : (
              <>
                <Text
                  text={"Proceed to Pay"}
                  fontsize={14}
                  fontweight={500}
                  // tint="white"
                  color="white !important"
                  sx={{
                    marginLeft: "0.4rem",
                  }}
                />
                <Box className="checkout-cart-line"></Box>
                <Text
                  text={`₹${billData?.totalCartValue}`}
                  fontsize={14}
                  fontweight={500}
                  tint="white"
                />
              </>
            )}
          </Box>
        </Box>
      ) : (
        <Box className="cart-no-delivery-address">
          <StyledButton
            variant="contained"
            text="Choose Delivery Address"
            borderRadius="2rem"
            onClick={handleAddAddress}
            textTransform="capitalize"
            width="96%"
            height="2.5rem"
          />
        </Box>
      )}
    </>
  );
};

export default Checkout;
