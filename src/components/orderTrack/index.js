// react
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// material ui
import { Box, Step, StepLabel, Stepper } from "@mui/material";

// custom-components
import Text from "../custom-components/Text";
import Menuback from "../menuback";

// components
import OrderDetails from "../orderDetails";

// modal
import PopupScreen from "../modal";

// services
import { cancelOrder, fetchTimeLine } from "../../config/services/orderService";

// constants
import { colorConstant } from "../../constants/colors";

// redux
import { useSelector } from "react-redux";
import { getUserData } from "../../redux/reducers/userReducer";

// styles
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import "./index.css";

const steps = ["Ordered", "Packaged", "In Transit", "Delivered"];
export default function OrderTrack() {
  const params = useParams();
  const orderId = params?.orderId;
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const navigate = useNavigate();

  const [status, setStatus] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();

  // <-- modal fn
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleYesAction = () => {
    handleCancelOrder();
    setOpenModal(false);
  };
  const handleNoAction = () => {
    //close the modal
    setOpenModal(false);
  };
  // modal code -->

  const statusMap = {
    CREATED: 0,
    PACKAGED: 1,
    IN_TRANSIT: 2,
    DELIVERED: 3,
  };

  const getStepFromTimeline = (timeline) => {
    // Reverse to prioritize latest known status
    const reversed = [...timeline].reverse();

    for (const entry of reversed) {
      const step = statusMap[entry?.fulfilmentStatus];
      if (step !== undefined) return step;
    }

    return 0; // fallback
  };

  const checkStatus = async () => {
    try {
      const res = await fetchTimeLine({ id: orderId });

      if (res?.status !== 200) {
        showSnackbar(res?.data?.status, "error");
        return;
      }
      setLoading(false);
      const timeline = res?.data?.data?.timeLine || [];
      const step = getStepFromTimeline(timeline);
      setStatus(step);

      const latestFulfillment =
        timeline[timeline?.length - 1]?.fulfilmentStatus;
      if (latestFulfillment === "DELIVERED") {
        showSnackbar("Order Delivered", "success");
      }
    } catch (e) {
      showSnackbar(e?.message || e?.data?.data?.status, "error");
      setLoading(false);
    }
  };
  const handleCancelOrder = async () => {
    const payload = {
      orderId: orderId,
      userId: user?.uidx,
    };
    try {
      await cancelOrder({ data: payload }).then((res) => {
        navigate("/home");
        showSnackbar(res?.data?.message || "Order Cancelled", "success");
      });
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    if (orderId) {
      setTimeout(() => {
        checkStatus();
      }, 1200);
    }
  }, [orderId]);

  return (
    <>
      <Menuback
        bg={colorConstant?.baseBackground}
        head={true}
        text="Order Status"
        redirect="/home"
        wishlist={true}
      />
      <Box marginTop="3rem" bgcolor={colorConstant?.baseBackground} pt={1}>
        <Box p={1}>
          <Stepper activeStep={status} alternativeLabel>
            {steps?.map((label, index) => {
              return (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
        <OrderDetails page={"orderTrack"} />

        {/* cancel order  */}
        <Box p={1} mt={2} pb={2} textAlign={"center"}>
          <Text
            text={"Cancel Order"}
            sx={{
              textDecoration: "underline !important",
              textUnderLineOffset: "2px !important",
            }}
            fontweight={"bold"}
            onClick={handleOpenModal}
            tint={colorConstant?.lightgraytext}
          />
        </Box>

        <PopupScreen
          open={openModal}
          handleClose={handleCloseModal}
          modalTitle={"Cancel Order"}
          modalContent="Are you sure you want to cancel the order?"
          handleYes={handleYesAction}
          handleNo={handleNoAction}
        />
      </Box>
    </>
  );
}
