import { useDispatch, useSelector } from "react-redux";
import { Box, Button, Checkbox, Divider, Typography } from "@mui/material";
import Heading from "../../../custom-components/Heading";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import {
  getAppliedCoupon,
  getBillingData,
  getDeliverySubOrderType,
  getDonationAmount,
  getLoyalityData,
  getTipAmount,
  getUserPreference,
  getWalletData,
  setCartBill,
  setDeliveryCharges,
  setDonationAmount,
  setSavePreference,
  setUserSelectedTip,
} from "../../../../redux/reducers/cartReducer";
import newspaper from "../../../../assets/images/newspaper.png";
import taxIcon from "../../../../assets/images/home.png";
import taxBreakdownIcon from "../../../../assets/images/Subtract.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import React, { useEffect, useState } from "react";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CelebrationIcon from "@mui/icons-material/Celebration";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeIcon from "@mui/icons-material/Home";
import { fetchDeliveryCharges } from "../../../../config/services/serviceabilityService";
import {
  getNearByStore,
  getUserSelectedLocation,
} from "../../../../redux/reducers/locationReducer";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import StoreIcon from "@mui/icons-material/Store";
import {
  getResturantCart,
  updateResturantCart,
} from "../../../../config/services/cartService";
import { getUserData } from "../../../../redux/reducers/userReducer";
import CloseIcon from "@mui/icons-material/Close";
import { fetchOrderDetailsById } from "../../../../config/services/orderService";

const CartBillDetails = ({ page, orderBillingDetails }) => {
  const showSnackbar = useSnackbar();
  const billData = useSelector(getBillingData);
  const loyaltyData = useSelector(getLoyalityData);
  const walletData = useSelector(getWalletData);
  const couponApplied = useSelector(getAppliedCoupon);
  const [openTaxesArrow, setOpenTaxesArrow] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const nearByStore = useSelector(getNearByStore);
  const userOnLocation = useSelector(getUserSelectedLocation);
  const userValue = localStorage.getItem("@user");
  const parsedUserValue = userValue ? JSON.parse(userValue) : null;
  const user = useSelector(getUserData) || parsedUserValue;
  const dispatch = useDispatch();
  const cartId = localStorage.getItem("cartId");
  const tipAmount = useSelector(getTipAmount);
  const donationAmount = useSelector(getDonationAmount);
  const savePreference = useSelector(getUserPreference);
  const fetchDeliveryType = useSelector(getDeliverySubOrderType);

  const totalAmt = walletData
    ? walletData?.reduce((prev, next) => prev + next?.amount, 0)
    : 0;

  const toggleTaxes = () => setOpenTaxesArrow(!openTaxesArrow);

  const ValueRow = ({
    label,
    value,
    tint = "#000",
    icon,
    labelColor = "#333333",
    bold = false,
  }) => {
    const renderIcon = () => {
      if (typeof icon === "string") {
        return (
          <img
            src={icon}
            alt=""
            style={{ width: 18, height: 18, objectFit: "contain" }}
          />
        );
      }
      return React.cloneElement(icon, {
        sx: { fontSize: 18, color: tint, ...icon?.props?.sx },
      });
    };

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {icon && <Box sx={{ mr: 1 }}>{renderIcon()}</Box>}
          <Typography variant="body2" color={labelColor}>
            {label}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "#333333",
            fontWeight: bold ? "bold" : "normal",
          }}
        >
          {value}
        </Typography>
      </Box>
    );
  };

  const getDeliveryCharges = async () => {
    let itemVal = orderBillingDetails?.subTotal ?? billData?.subtotal;
    const payload = {
      userLat: parseInt(userOnLocation?.latitude),
      userLon: parseInt(userOnLocation?.longitude),
      regionId: nearByStore?.regionId,
      cartValue: parseInt(itemVal),
    };
    try {
      const response = await fetchDeliveryCharges(payload);
      if (response?.data?.data?.es !== 0) {
        showSnackbar(response?.data?.data?.message, "error");
        return;
      }
      const data = response?.data?.data?.data;
      setDeliveryCharge(data?.rate);
      dispatch(setDeliveryCharges(data?.rate));
    } catch (err) {
      showSnackbar(err?.message);
    }
  };

  useEffect(() => {
    getDeliveryCharges();
  }, [
    userOnLocation?.latitude,
    userOnLocation?.longitude,
    orderBillingDetails?.subTotal,
    billData?.subtotal,
    nearByStore?.regionId,
  ]);

  const handleDonation = () => {
    const newAmount = donationAmount === null ? 4 : null;
    dispatch(setDonationAmount(newAmount));
  };

  //calling cart update api
  const updateCartBillComponent = async () => {
    const updatePayload = {
      cartId: cartId,
      userId: user?.uidx,
      tip: tipAmount || 0,
      donation: donationAmount || 0,
      updatedBy: user?.uidx,
      updatedOn: new Date().toISOString(),
    };
    try {
      const res = await updateResturantCart(updatePayload);
      if (res?.data?.status === "SUCCESS") {
        const updatedBilling = res?.data?.data?.data?.billing;
        if (updatedBilling) {
          // Update Redux state with backend billing data
          dispatch(
            setCartBill({
              cartBillingId: updatedBilling?.cartBillingId,
              totalCartValue: parseFloat(updatedBilling?.totalCartValue),
              discount: parseFloat(updatedBilling?.discount),
              subtotal: parseFloat(updatedBilling?.subtotal),
              deliveryCharges: parseFloat(updatedBilling?.deliveryCharges),
              packingCharges: parseFloat(updatedBilling?.packingCharges),
              freeDelivery: updatedBilling?.freeDelivery,
              serviceCharges: parseFloat(updatedBilling?.serviceCharges),
              tip: parseFloat(updatedBilling?.tip),
              otherCharges: parseFloat(updatedBilling?.otherCharges),
              donation: parseFloat(updatedBilling?.donation),
              appliedCoupon: parseFloat(updatedBilling?.appliedCoupon),
              appliedOffer: parseFloat(updatedBilling?.appliedOffer),
              quantity: parseInt(updatedBilling?.quantity),
              totalMrpValue: parseFloat(updatedBilling?.totalMrpValue),
              totalValue: parseFloat(updatedBilling?.totalValue),
              totalDiscountValue: parseFloat(
                updatedBilling?.totalDiscountValue
              ),
              igst: parseFloat(updatedBilling?.igst),
              cgst: parseFloat(updatedBilling?.cgst),
              sgst: parseFloat(updatedBilling?.sgst),
              totalCessAmount: parseFloat(updatedBilling?.totalCessAmount),
              tax: parseFloat(updatedBilling?.tax),
              comments: updatedBilling?.comments,
            })
          );
        }
      } else {
        showSnackbar(res?.data?.message, "error");
      }
    } catch (err) {
      showSnackbar(err?.message || "Failed to update cart", "error");
    }
  };
  useEffect(() => {
    let timeout;
    if (tipAmount !== null || donationAmount !== null) {
      updateCartBillComponent();
      // getResturantCart(cartId);
    }
  }, [tipAmount, donationAmount]);

  return (
    <Box
      sx={{
        marginTop: "12px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
      p={2}
    >
      <Heading text="Billing Summary" fontSize={16} fontWeight={700} mb={2} />
      <Box sx={{ backgroundColor: "#ffffff", borderRadius: "8px" }} p={2}>
        <ValueRow
          label="Item total"
          value={`₹${orderBillingDetails?.subTotal ?? billData?.subtotal}`}
          icon={<DescriptionIcon sx={{ fontSize: 20 }} />}
        />
        <Divider sx={{ borderBottom: "1px dashed #BDBDBD", my: 1 }} />
        <Box onClick={toggleTaxes} sx={{ cursor: "pointer" }}>
          <ValueRow
            label="GST & Other Charges"
            value={
              openTaxesArrow ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )
            }
            icon={<HomeIcon sx={{ fontSize: 20 }} />}
          />
        </Box>
        {openTaxesArrow && (
          <Box pl={2} pb={1}>
            <ValueRow
              label="CGST"
              value={`₹${orderBillingDetails?.igst || billData?.igst || 0}`}
              icon={<DescriptionIcon sx={{ fontSize: 16 }} />}
            />
            <ValueRow
              label="SGST"
              value={`₹${orderBillingDetails?.igst || billData?.igst || 0}`}
              icon={<DescriptionIcon sx={{ fontSize: 16 }} />}
            />
            {fetchDeliveryType !== "TAKE_AWAY" && (
              <>
                <ValueRow
                  label="Delivery Charges"
                  value={`₹${deliveryCharge || 0}`}
                  icon={<DeliveryDiningIcon sx={{ fontSize: 20 }} />}
                />
              </>
            )}
            <ValueRow
              label="Packaging Charges"
              value={`₹${orderBillingDetails?.packingCharges || 0}`}
              icon={<LocalMallIcon sx={{ fontSize: 20 }} />}
            />
            <ValueRow
              label="Other Charges"
              value={`₹${orderBillingDetails?.otherCharges || 0}`}
              icon={<StoreIcon sx={{ fontSize: 20 }} />}
            />
            {walletData && walletData?.length > 0 && (
              <ValueRow
                label="Wallet"
                value={`-₹${parseFloat(totalAmt).toFixed(2)}`}
                tint="rgb(173, 26, 25)"
              />
            )}
            {couponApplied && (
              <ValueRow
                label="Coupon Applied"
                value={`-₹${
                  couponApplied?.couponValue ||
                  couponApplied?.appliedCoupon ||
                  0
                }`}
                tint="rgb(173, 26, 25)"
                icon={
                  <CelebrationIcon
                    sx={{ color: "rgb(173, 26, 25)", fontSize: 20 }}
                  />
                }
              />
            )}
            {loyaltyData?.loyaltyPointsValue && (
              <ValueRow
                label="Redeemed Value"
                value={`-₹${loyaltyData?.loyaltyPointsValue}`}
                tint="rgb(173, 26, 25)"
              />
            )}
          </Box>
        )}
        <Divider sx={{ borderBottom: "1px dashed #BDBDBD", my: 1 }} />
        <ValueRow
          label="Estimated Total"
          labelColor="#0B0B0B"
          value={`₹${
            orderBillingDetails?.grandTotal || billData?.totalCartValue
          }`}
          bold
          tint="#0B0B0B"
        />
      </Box>

      {/* Gratitude Corner */}
      <Box mt={3}>
        <Heading
          text="Gratitude Corner"
          fontSize={14}
          fontWeight={700}
          mb={1}
        />
        <Box
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            padding: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="subtitle2"
            fontWeight={600}
            mb={0.5}
            fontSize={"13px"}
          >
            Tip your delivery partner
          </Typography>
          <Typography variant="body2" color="rgb(173, 26, 25)" mb={2}>
            Your kindness means a lot! 100% of your tip will go directly to them
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              fontFamily: "sans-serif",
              fontSize: "11px",
              fontWeight: "600",
            }}
          >
            {[20, 30, 50]?.map((amount) => (
              <Box
                key={amount}
                sx={{
                  border: "1px solid #E0E0E0",
                  borderRadius: "8px",
                  px: 2,
                  py: 1,
                  cursor: "pointer",

                  backgroundColor:
                    tipAmount === amount ? "rgb(173, 26, 25)" : "#FAFAFA",
                  color: tipAmount === amount ? "#FFFFFF" : "#000000",
                  "&:hover": {
                    backgroundColor:
                      tipAmount === amount ? "rgb(173, 26, 25)" : "#E0E0E0",
                  },
                  textAlign: "center",
                }}
                onClick={() =>
                  dispatch(
                    tipAmount === amount
                      ? setUserSelectedTip(null)
                      : setUserSelectedTip(amount)
                  )
                }
              >
                ₹{amount}
              </Box>
            ))}
            <Box
              sx={{
                border: "1px solid #E0E0E0",
                borderRadius: "8px",
                px: 2,
                py: 1,
                cursor: "pointer",
                backgroundColor: "#FAFAFA",
                textAlign: "center",
                "&:hover": { backgroundColor: "#E0E0E0" },
              }}
            >
              Other
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 1,
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, gap: 1 }}>
              <Checkbox
                checked={savePreference ?? false} // Default to false if undefined
                onChange={(e) => dispatch(setSavePreference(e.target.checked))}
                color="primary"
              />
              <Typography variant="body2">
                Save my preference for next order
              </Typography>
            </Box>
            {tipAmount !== null && (
              <Button
                variant="outlined"
                color="error"
                onClick={() => dispatch(setUserSelectedTip(null))}
                endIcon={<CloseIcon fontSize="small" />}
                sx={{ ml: 1, minWidth: "auto", padding: "1px 4px" }}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>

        {/* Donate to Feeding India */}
        <Box
          sx={{
            backgroundColor: "#FFF4F2",
            borderRadius: "8px",
            padding: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Let’s serve a brighter future
            </Typography>
            <Typography
              variant="body2"
              color="rgb(173, 26, 25)"
              fontSize={"13px"}
            >
              Through nutritious meals, you can empower young minds for
              greatness
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Typography fontWeight={600} mr={1}>
              ₹4
            </Typography>
            <Box>
              {donationAmount === null ? (
                <Box
                  sx={{
                    backgroundColor: "rgb(173, 26, 25)",
                    color: "white",
                    px: 2,
                    py: 0.5,
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "11px",
                    fontFamily: "sans-serif",
                  }}
                  onClick={handleDonation}
                >
                  ADD
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => dispatch(setDonationAmount(null))}
                  endIcon={<CloseIcon fontSize="small" />}
                  sx={{ ml: 1, minWidth: "auto", padding: "1px 4px" }}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartBillDetails;
