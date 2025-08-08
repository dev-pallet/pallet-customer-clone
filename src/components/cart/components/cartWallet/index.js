import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// mui components
import { Box, CircularProgress } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

//css
import "./index.css";

//custom-components
import Heading from "../../../custom-components/Heading";

//redux
import { getUserData } from "../../../../redux/reducers/userReducer";

//services
import {
  applyWallet,
  removeWallet,
} from "../../../../config/services/cartService";
import {
  fetchWallet,
  getRedeemableWalletAmount,
} from "../../../../config/services/customerService";
import { colorConstant } from "../../../../constants/colors";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import {
  getBillingData,
  getCartId,
  getMinCartValue,
  getWalletData,
  setCartBill,
  setWalletData,
} from "../../../../redux/reducers/cartReducer";
import Text from "../../../custom-components/Text";
import { message } from "../../../../constants/statisData";

const CartWallet = () => {
  const dispatch = useDispatch();
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const walletData = useSelector(getWalletData);
  const billData = useSelector(getBillingData);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const minCartValue = useSelector(getMinCartValue);
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState([]);
  const showSnackbar = useSnackbar();

  const fetchWalletAmount = async () => {
    try {
      const res = await fetchWallet(user?.id);
      if (res?.data?.es === 0) {
        setWallets(res?.data?.wallets);
      }
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const totalAmount = (() => {
    if (wallets && wallets.length > 0) {
      return wallets.reduce((prev, next) => prev + next?.amount, 0);
    }
    return 0;
  })();

  useEffect(() => {
    if (user?.id) {
      fetchWalletAmount();
    }
  }, [user?.id]);

  const checkRedeemValue = async (value) => {
    dispatch(setWalletData(null));
    setLoading(true);
    try {
      await getRedeemableWalletAmount({
        customerId: user?.id,
        totalAmount: value || billData?.totalCartValue,
      }).then((res) => {
        if (res?.data?.es === 0) {
          if (res?.data?.totalAmount === 0) {
            setLoading(false);
            showSnackbar(
              res?.data?.message ||
                `Order Value should be above \u20b9${
                  minCartValue - billData?.subtotal
                }`,
              "info"
            );
            if (walletData) {
              handleRemoveWallet({ reapply: false });
              return;
            }
          }

          const payload = {
            redeemAmount: res?.data?.redeemAmount,
            redeemableWalletBalance: parseFloat(res?.data?.totalAmount).toFixed(
              2
            ),
          };

          applyWallet({
            cartId,
            ...payload,
          })
            .then((res) => {
              setLoading(false);
              if (
                res?.data?.status === "SUCCESS" &&
                res?.data?.data?.es === 0
              ) {
                dispatch(setCartBill(res?.data?.data?.data?.billing || null));
                dispatch(setWalletData(res?.data.data?.data?.redeemAmount));
              } else {
                showSnackbar(
                  res?.data?.data?.message || "Insufficient amount",
                  "error"
                );
              }
            })
            .catch((e) => {
              showSnackbar(e?.message || e?.response?.data?.message, "error");
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
    } catch (e) {
      setLoading(false);
    }
  };

  const handleRemoveWallet = ({ reapply }) => {
    setLoading(true);
    try {
      removeWallet(cartId).then((res) => {
        setLoading(false);
        if (res?.data?.status === "SUCCESS" && res?.data?.data?.es === 0) {
          dispatch(setCartBill(res?.data?.data?.data?.billing || null));
          dispatch(setWalletData(res?.data.data?.data?.redeemAmount));
          if (reapply) {
            checkRedeemValue(res?.data?.data?.data?.billing?.totalCartValue);
          }
        } else {
          showSnackbar(
            res?.data?.data?.message || "In sufficient amount",
            "error"
          );
        }
      });
    } catch (e) {
      setLoading(false);
    }
  };

  const handleWalletCheckbox = (event) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      checkRedeemValue(billData?.totalCartValue);
    } else {
      handleRemoveWallet({ reapply: false });
    }
  };

  return (
    parseInt(totalAmount) > 0 && (
      <Box
        className={
          walletData && walletData?.length > 0
            ? "cart-wallet-checked"
            : "cart-wallet"
        }
      >
        <Box
          className={
            walletData && walletData?.length > 0
              ? "cart-wallet-checked-details"
              : "cart-wallet-details"
          }
        >
          <Box
            className={
              loading ? "cart-wallet-left-loading" : "cart-wallet-left"
            }
          >
            {loading ? (
              <CircularProgress
                sx={{
                  color: colorConstant.primaryColor,
                  width: "10px !important",
                  height: "10px !important",
                }}
              />
            ) : (
              <Checkbox
                color="success"
                checked={walletData && walletData?.length > 0 ? true : false}
                onChange={handleWalletCheckbox}
                sx={{
                  color: "green !important",
                }}
              />
            )}
            <Heading
              text={
                walletData && walletData?.length > 0
                  ? `Wallet Applied`
                  : `Use Wallet Balance`
              }
              fontSize={14}
              fontWeight={800}
            />
          </Box>
          <Box className="cart-wallet-balance">
            {walletData && walletData?.length > 0 ? null : (
              <Text
                text={`\u20b9${parseFloat(totalAmount).toFixed(2)}`}
                fontWeight={800}
                fontsize={13}
                tint={colorConstant.primaryColor}
              />
            )}
          </Box>
          {/* <WalletBreakUp /> */}
          {walletData && walletData?.length > 0 && (
            <>
              <Box className="cart-wallet-breakup">
                <Box className="wallet-amount-applicable">
                  <Text
                    text={`Applicable Amount :`}
                    sx={{ marginLeft: "2.5rem" }}
                  />
                  <Text
                    fontWeight={900}
                    tint={colorConstant?.primaryColor}
                    text={`- \u20b9${parseFloat(
                      walletData?.reduce((prev, next) => prev + next?.amount, 0)
                    ).toFixed(2)}`}
                  />
                </Box>
                <Box className="wallet-amount-remaining">
                  <Text
                    text={`Remaining Amount :`}
                    sx={{ marginLeft: "2.5rem" }}
                  />
                  <Text
                    fontWeight={900}
                    text={`\u20b9${parseFloat(
                      walletData?.reduce(
                        (prev, next) => prev + next?.remainingAmount,
                        0
                      )
                    ).toFixed(2)}`}
                  />
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    )
  );
};

export default CartWallet;
