import React, { useState } from "react";
import { loadScript } from "./razorpayInit";
import {
  getDeliveryPromise,
  getSelectedSlot,
} from "../../redux/reducers/miscReducer";
import { useSelector } from "react-redux";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { getCartId } from "../../redux/reducers/cartReducer";
import { createOrder } from "../../config/services/cartService";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../redux/reducers/userReducer";

const useRazropayConfig = () => {
  const slot = useSelector(getSelectedSlot);
  const promise = useSelector(getDeliveryPromise);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [paymentLoader, setPaymentLoader] = useState(false);
  const sourceId = localStorage.getItem("retailId");
  const locationId = localStorage.getItem("locationId");

  const razporPayCheckout = async (payData, gateWayId, amount, orderId) => {
    await loadScript();
    const razorpay = new window.Razorpay({
      key: process.env.RAZORPAY_KEY,
    });

    let payload = {};

    // Handle different payment methods
    if (payData?.method === "card") {
      const cardNameInput = document.querySelector("#cardName");
      const cardNumberInput = document.querySelector("#cardNumber");
      payload = {
        amount: Math.round(amount * 100),
        currency: "INR",
        email: user?.emailId,
        contact: user?.phoneNumber,
        order_id: gateWayId,
        method: "card",
        "card[name]": payData?.["card[name]"] || cardNameInput?.value,
        "card[number]": payData?.["card[number]"] || cardNumberInput?.value,
        "card[expiry_month]": payData?.["card[expiry_month]"],
        "card[expiry_year]": payData?.["card[expiry_year]"],
        "card[cvv]": payData?.["card[cvv]"],
      };
    } else if (payData?.method === "netbanking") {
      const bankInput = document.querySelector("#bank");
      payload = {
        amount: Math.round(amount * 100),
        currency: "INR",
        email: user?.emailId,
        contact: user?.phoneNumber,
        order_id: gateWayId,
        method: "netbanking",
        bank: payData?.bank || bankInput?.value,
      };
    } else if (payData?.method === "upi") {
      const vpaInput = document.querySelector("#vpa");
      payload = {
        amount: Math.round(amount * 100),
        currency: "INR",
        email: user?.emailId,
        contact: user?.phoneNumber,
        order_id: gateWayId,
        method: "upi",
        vpa: payData?.vpa || vpaInput?.value,
      };
    }

    // Trigger Razorpay payment
    razorpay.createPayment(payload);

    // Payment success handler
    razorpay.on("payment.success", function (resp) {
      showSnackbar("Payment Successful", "success");
      navigate(`/cart/order-processing/${orderId}`);
    });

    // Payment error handler
    razorpay.on("payment.error", function (resp) {
      showSnackbar(resp.error.description, "error");
    });
  };

  const placeOrder = async (paymentData) => {
    const payload = {
      sessionId: "no",
      licenseId: "no",
      machineCode: "no",
      cartId,
      paymentMode: paymentData?.method === "cod" ? "COD" : "ONLINE",
      paymentMethod:
        paymentData?.method === "cod"
          ? "COD"
          : paymentData?.method === "netbanking"
          ? "NET_BANKING"
          : paymentData?.method === "card"
          ? "CARD"
          : "UPI",
      inventoryCheck: "NO",
      tender: "0",
      balance: "0",
      whatsapp: true,
      slotId: slot?.slotId,
      cutoffId: slot?.cutoffId,
      startTime: slot?.startTime,
      endTime: slot?.endTime,
      expectedHours: promise?.expectedHours || 24,
      orderWithinMinutes: promise?.orderWithInMinutes || 24 * 60,
      SourceId: sourceId,
      destinationId: locationId,
    };

    try {
      const res = await createOrder(payload);
      if (res.data?.data?.es === 0) {
        const result = res?.data?.data?.orderResponseModel;
        const orderId = result?.orderId;

        if (result?.gateWayOrderId) {
          const gateWayId = result?.gateWayOrderId;
          const amount = parseFloat(result?.amountToBePaid);
          if (paymentData?.method !== "cod") {
            // Only load Razorpay script and start checkout for non-COD payments
            setPaymentLoader(true);
            razporPayCheckout(paymentData, gateWayId, amount, orderId);
          } else {
            // For COD, navigate to success page directly
            navigate(`/cart/order-processing/${orderId}`);
          }
        } else {
          navigate(`/cart/order-processing/${orderId}`);
        }
      } else {
        showSnackbar(
          "We are unable to process your order. Please try again!",
          "error"
        );
        setPaymentLoader(false);
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message, "error");
      setPaymentLoader(false);
    }
  };

  const capturePayment = async (paymentData) => {
    if (paymentData.method === "cod") {
      // Directly place order for COD without Razorpay
      placeOrder(paymentData);
    } else {
      // For other payment methods, handle Razorpay checkout
      setPaymentLoader(true);
      placeOrder(paymentData);
    }
  };

  const verifyVPA = async (vpa) => {
    await loadScript();
    const key = process.env.RAZORPAY_KEY;

    if (!key) return;
    const razorpay = new window.Razorpay({
      key,
    });
    return razorpay.verifyVpa(vpa);
  };

  return {
    capturePayment,
    verifyVPA,
    paymentLoader,
  };
};

export default useRazropayConfig;
