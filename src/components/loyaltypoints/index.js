//react
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//mui components
import { Box, Card, CircularProgress } from "@mui/material";

//custom components
import Heading from "../custom-components/Heading";
import Text from "../custom-components/Text";
import Menuback from "../menuback";

//styles
import "./index.css";

//images
import img from "../../assets/images/loyalty.png";

//icons
import StyledButton from "../custom-components/Button";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  getAppliedCoupon,
  getBillingData,
  getCartId,
  getLoyalityData,
  setCartBill,
  setLoyalityPoints,
} from "../../redux/reducers/cartReducer";
import { getNearByStore } from "../../redux/reducers/locationReducer";
import { getUserData } from "../../redux/reducers/userReducer";

//services
import {
  applyLoyality,
  removeLoyality,
} from "../../config/services/cartService";
import {
  findLoyalityPointsForCustomer,
  getLoyalityPoints,
} from "../../config/services/loyaltyService";
import { colorConstant } from "../../constants/colors";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import GuestLogin from "../guestAuth/guestLogin";
import { getStoreType } from "../../redux/reducers/miscReducer";

const LoyaltyPoints = () => {
  const billData = useSelector(getBillingData);
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const nearByStore = useSelector(getNearByStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const couponState = useSelector(getAppliedCoupon);
  const appliedLoyality = useSelector(getLoyalityData);
  const showSnackbar = useSnackbar();
  const [loyalityData, setLoyalityData] = useState(null);
  const [loader, setLoader] = useState(false);
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  const fetchLoyaltyPoints = async () => {
    const payload = {
      sourceOrgId: nearByStore?.id,
      cartValue: billData?.totalCartValue || 0,
      customerType: "END_CUSTOMER",
      customerId: user?.id || user?.uidx,
      couponApplied: couponState ? true : false,
    };
    setLoader(true);
    try {
      const res = await getLoyalityPoints(payload);
      setLoader(false);
      setLoyalityData(res?.data?.data?.data);
    } catch (err) {
      setLoader(false);
      showSnackbar(err?.response?.data?.message, "error");
    }
  };

  const fetchUserLoyaltyPoints = async () => {
    const payload = {
      customerType: "END_CUSTOMER",
      customerId: user?.uidx,
      sourceOrgId: nearByStore?.id,
      platformSupportType: "B2C",
    };
    try {
      setLoader(true);
      const res = await findLoyalityPointsForCustomer(payload);
      setLoader(false);
      setLoyalityData(res?.data?.data?.data);
    } catch (err) {
      setLoader(false);
      showSnackbar(err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    if (retailType === "RESTAURANT") {
      fetchUserLoyaltyPoints();
    } else {
      fetchLoyaltyPoints();
    }
  }, [couponState, billData]);

  const applyRedeem = async () => {
    const payload = {
      currencyCode: loyalityData?.currencyCode,
      redeemablePoint: loyalityData?.redeemablePoint,
      redeemablePointValue: loyalityData?.redeemablePointValue,
      totalAvailablePoint: loyalityData?.totalAvailablePoint,
      availablePointValue: loyalityData?.availablePointValue,
    };

    try {
      const res = await applyLoyality(cartId, payload);
      if (res?.data?.status !== "SUCCESS") {
        return;
      }
      const result = res?.data?.data;
      dispatch(setCartBill(result?.billing));
      dispatch(
        setLoyalityPoints({
          loyaltyPoints: result?.loyaltyPoints,
          loyaltyPointsValue: result?.loyaltyPointsValue,
        })
      );
      showSnackbar(res?.data?.message || "Loyality Points Applied!", "success");
      navigate("/cart");
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const removeRedeem = async () => {
    try {
      const res = await removeLoyality(cartId);
      if (!res?.data?.data) {
        return;
      }
      dispatch(setLoyalityPoints(null));
      dispatch(setCartBill(res?.data?.data?.billing));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const loyatltyArray = [
    {
      text: "Redeemable Points",
      value:
        loyalityData?.redeemablePoint !== null
          ? loyalityData?.redeemablePoint
          : "0",
    },
    {
      text: "Redeemable Value",
      value:
        loyalityData?.redeemablePointValue !== null
          ? loyalityData?.redeemablePointValue
          : "0",
    },
  ];
  return (
    <Box>
      <Box className="loyalty-icon-menu">
        <Menuback
          head={true}
          text="Redeem Points"
          bg={colorConstant?.baseBackground}
          wishlist={user?.name && true}
        />
      </Box>
      {user?.nonLoggedIn ? (
        <GuestLogin text={"Login/Create account to get loyalty points."} />
      ) : (
        <>
          <Box mt={5}>
            <Box className="loyalty-img-box">
              <img className="loyalty-bg-image" src={img} alt="error" />
            </Box>
            <Box className="loyalty-balance-box">
              <Heading text={"BALANCE : "} fontsize={18} fontweight={600} />
              {loader ? (
                <CircularProgress
                  sx={{
                    color: colorConstant?.primaryColor,
                    width: "10px !important",
                    height: "10px !important",
                  }}
                />
              ) : (
                <Heading
                  text={
                    `${loyalityData?.currencyCode === "INR" ? `\u20b9` : ""}` +
                    (loyalityData?.availablePointValue || 0)
                  }
                  fontsize={18}
                  fontweight={600}
                  tint="rgb(12, 121, 36)"
                />
              )}
            </Box>
            <Card className="loyalty-main-card">
              <Box className="loyalty-total-points">
                <Text
                  text={"Total Points Available:"}
                  tint="rgb(12, 121, 36)"
                  fontsize={16}
                  fontweight={600}
                />
                {loader ? (
                  <CircularProgress
                    sx={{
                      color: colorConstant?.primaryColor,
                      width: "10px !important",
                      height: "10px !important",
                    }}
                  />
                ) : (
                  <Text
                    text={loyalityData?.totalAvailablePoint || 0}
                    tint="rgb(12, 121, 36)"
                    fontsize={16}
                    fontweight={600}
                  />
                )}
              </Box>
              <hr style={{ opacity: 0.3 }} />
              {loyatltyArray?.map((e, i) => (
                <Box key={i} className="loyalty-card-content">
                  <Text text={e.text} />
                  {loader ? (
                    <CircularProgress
                      sx={{
                        color: colorConstant?.primaryColor,
                        width: "10px !important",
                        height: "10px !important",
                      }}
                    />
                  ) : (
                    <Text
                      text={
                        e.text === "Redeemable Value"
                          ? `₹
                    ${e.value || 0}`
                          : e.value
                      }
                    />
                  )}
                </Box>
              ))}
            </Card>
          </Box>
          <Box className="loyalty-cart-insufficient-value">
            {loader ? (
              <Box className="loader-loyalty-redeemable-reason">
                <CircularProgress
                  sx={{
                    color: colorConstant?.primaryColor,
                    width: "10px !important",
                    height: "10px !important",
                  }}
                />
              </Box>
            ) : (
              <Text
                text={loyalityData?.notRedeemableReason}
                tint={
                  loyalityData?.redeemable ? "rgb(12, 121, 36)" : "orangered"
                }
                fontsize={13}
                fontweight={600}
                sx={{
                  padding: "1rem",
                }}
              />
            )}
          </Box>
          <Box className="loyalty-redeem-btn">
            {appliedLoyality?.loyaltyPointsValue ? (
              <StyledButton
                variant="contained"
                text="Remove"
                textTransform="capitalize"
                width="90%"
                fw="bold"
                borderRadius="2rem"
                height="3rem"
                bg="red"
                onClick={removeRedeem}
              />
            ) : (
              <StyledButton
                disabled={!loyalityData?.redeemable}
                variant="contained"
                text="Redeem"
                textTransform="capitalize"
                width="90%"
                fw="bold"
                borderRadius="2rem"
                height="3rem"
                onClick={applyRedeem}
                bg="rgb(12, 121, 36)"
              />
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default LoyaltyPoints;
