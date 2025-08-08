// react
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom/dist";

// mui compnents
import { Box, Divider } from "@mui/material";
// icons
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

// images

// constants
import { colorConstant } from "../../constants/colors";
import { boxShadow } from "../../constants/cssStyles";

// custom components
import StyledButton from "../custom-components/Button";
import Heading from "../custom-components/Heading";
import Text from "../custom-components/Text";
import Footer from "../footer";
import HomeListingComponent from "../home/components/HomeListingComponent";
import Menuback from "../menuback";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";

// styles
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import TwinLoader from "../../assets/gif/loading.gif";
import SakuraLoader from "../../assets/gif/sakuraLoader.gif";
import { fetchWalletDataAndTransaction } from "../../config/services/customerService";
import { ScrollToTop } from "../../constants/commonFunction";
import { getUserData } from "../../redux/reducers/userReducer";
import NothingFound from "../custom-components/NothingFound";
import GuestLogin from "../guestAuth/guestLogin";
import TransactionCard from "./components/TransactionCard";
import WalletInfoCard from "./components/walletInfoCard";
import "./index.css";
import { getStoreType } from "../../redux/reducers/miscReducer";

const WalletMenu = () => {
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const handleStartShopping = () => {
    navigate("/home");
  };
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  useEffect(() => {
    ScrollToTop();
  }, []);

  const fetchWalletDetails = async () => {
    try {
      setLoading(true);
      try {
        await fetchWalletDataAndTransaction(user?.id).then((res) => {
          setLoading(false);

          if (res?.data?.es === 0) {
            setData(res?.data?.wallets);
            setTransactions(res?.data?.transactions);
          } else {
            setData(null);
          }
        });
      } catch (e) {
        setLoading(false);
      }
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, []);
  const dynamicStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <>
      {loading ? (
        <Box className="wallet-root-loader">
          <Box className="wallet-loader-box">
            <img
              src={retailType === "RESTAURANT" ? SakuraLoader : TwinLoader}
              className="wallet-loader"
              style={retailType === "RESTAURANT" ? dynamicStyle : undefined}
              // style={retailType === "RESTAURANT" && dynamicStyle}
            />
          </Box>
        </Box>
      ) : (
        <Box
          className="wallet-root-div"
          sx={{
            backgroundColor:
              retailType === "RESTAURANT"
                ? colorConstant?.showdowColor
                : colorConstant?.defaultButtonText,
          }}
        >
          <Box
            sx={{
              backgroundColor:
                retailType === "RESTAURANT"
                  ? colorConstant?.sakuraRestroColor
                  : colorConstant?.primaryColor,
            }}
            className="wallet-header"
          >
            <Menuback
              color={
                retailType === "RESTAURANT"
                  ? colorConstant?.showdowColor
                  : colorConstant?.white
              }
            />
            <Heading
              text="My Wallet"
              tint={
                retailType === "RESTAURANT"
                  ? colorConstant?.showdowColor
                  : colorConstant?.white
              }
              paddingLeft="25px"
              paddingBottom="5px"
              fontsize="25px"
            />
            <Box sx={{ height: "100%" }}>
              <CurrencyRupeeIcon
                sx={{ width: "100%", height: "100%", opacity: 0.3 }}
              />
            </Box>
          </Box>

          {/* content  */}
          {user?.nonLoggedIn ? (
            <GuestLogin text={"Login/Create Account to access your wallet."} />
          ) : (
            <Box className="wallet-content">
              <Box className="wallet-balance-div" sx={{ boxShadow: boxShadow }}>
                {/* wallet balance */}
                <Box className="content-space-between">
                  <Heading
                    text="Wallet Money"
                    tint={
                      retailType === "RESTAURANT"
                        ? colorConstant?.showdowColor
                        : colorConstant?.primaryColor
                    }
                    fontSize="14px"
                    fontweight="bold"
                  />
                  <Heading
                    color={
                      retailType === "RESTAURANT"
                        ? colorConstant?.showdowColor
                        : colorConstant?.primaryColor
                    }
                    text={
                      data !== null
                        ? `\u20b9` +
                          parseFloat(
                            Object?.values(data)?.map((item) =>
                              item?.reduce((prev, nxt) => prev + nxt?.amount, 0)
                            )
                          ).toFixed(2)
                        : 0
                    }
                    fontSize="14px"
                    fontweight="bold"
                  />
                </Box>
                <Box sx={{ margin: "5px 0px" }}>
                  <Divider />
                </Box>
                {/* gift card  */}
                {data &&
                  Object.entries(data)
                    ?.sort(([key], [nkey]) => {
                      if (key < nkey) {
                        return -1;
                      }
                      if (key > nkey) {
                        return 1;
                      }
                      return 0;
                    })
                    ?.map(([key, value], i) => {
                      return <WalletInfoCard item={[key, value]} key={i} />;
                    })}
              </Box>

              {/* terms & conditions  */}
              <Box sx={{ padding: "10px" }}>
                <Text text="Terms and Conditions:" fontweight="bold" />
                <Text
                  className="terms-and-conditions"
                  text="*The credited wallet money is valid for 6 months from the date of issuance."
                />
                <Text
                  className="terms-and-conditions"
                  text="**Maximum 10% of the wallet money can be used per purchase."
                />
                <Text
                  className="terms-and-conditions"
                  text="This offer cannot be combined with other offers or discounts. The wallet money can only be used for purchases made within the app."
                />
                <br />
                <Box className="content-center">
                  <StyledButton
                    variant="contained"
                    text="Start Shopping"
                    textTransform="capitalize"
                    width="50%"
                    fw="bold"
                    borderRadius="2rem"
                    onClick={handleStartShopping}
                  />
                </Box>
              </Box>

              {/* recent transaction  */}
              <HomeListingComponent title={"Recent Transactions"}>
                {transactions?.length ? (
                  transactions?.map((transactionData) => (
                    <TransactionCard item={transactionData} key={uuidv4()} />
                  ))
                ) : (
                  <NothingFound
                    message={"No transactions yet"}
                    width={"200px"}
                  />
                )}
              </HomeListingComponent>
            </Box>
          )}
        </Box>
      )}
      <Footer navigationVal={2} />
    </>
  );
};

export default WalletMenu;
