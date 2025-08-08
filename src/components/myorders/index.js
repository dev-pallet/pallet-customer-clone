//react
import { useEffect, useState } from "react";

//mui components
import { Box } from "@mui/material";

//custom components
import Loader from "../custom-components/Loader";
import Menuback from "../menuback";

//styles
import "./index.css";

//icons

//api
import { fetchOrdersList } from "../../config/services/orderService";

//ui components
import OrderCard from "./components/orderCard";

// constants
import { colorConstant } from "../../constants/colors";

// redux
import { useSelector } from "react-redux";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { getNearByStore } from "../../redux/reducers/locationReducer";
import { getUserData } from "../../redux/reducers/userReducer";
import { CircularLoader } from "../custom-components/CircularLoader";
import { message } from "../../constants/statisData";

const MyOrders = () => {
  const nearByStore = useSelector(getNearByStore);
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const showSnackbar = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [initState, setInitState] = useState({
    data: [],
    loading: false,
    page: 0,
    pageSize: 20,
    totalResults: 0,
  });
  const [fetchingMore, setFetchingMore] = useState(false);

  useEffect(() => {
    getOrderList();
  }, []);
  const getOrderList = async (page, scrolling) => {
    if (fetchingMore) return;
    setFetchingMore(true);
    setInitState((prevState) => ({ ...prevState, loading: true }));

    try {
      const payload = {
        page: scrolling ? page : initState?.page,
        pageSize: initState?.pageSize,
        loggedInUserId: user?.uidx,
        orderType: "B2C_ORDER",
        orgId: nearByStore?.id,
      };

      const res = await fetchOrdersList({ payload });

      if (res?.data?.status === "ERROR") {
        showSnackbar(res?.data?.message, "error");
        return;
      }

      if (res?.data?.data?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      const response = res?.data?.data?.orderResponseList;
      setInitState((prevState) => ({
        ...prevState,
        loading: false,
        data: scrolling ? [...prevState.data, ...response] : response,
        totalResults: res?.data?.data?.totalResults,
      }));
    } catch (e) {
      setInitState((prevState) => ({ ...prevState, loading: false }));
      showSnackbar(e?.message || e?.response?.data?.message, "error");
    } finally {
      setFetchingMore(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.documentElement.scrollTop + window.innerHeight + 1 >=
          document.documentElement.scrollHeight &&
        !fetchingMore
      ) {
        if (initState?.data?.length < initState?.totalResults) {
          setLoading(true);
          getOrderList(initState?.page + 1, true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [initState?.page, initState?.totalResults, fetchingMore]);
  return (
    <Box
      sx={{
        backgroundColor: colorConstant?.baseBackground,
        height: initState?.data?.length <= 3 && "100vh",
      }}
    >
      <Menuback
        head={true}
        text="My Orders"
        bg={colorConstant?.baseBackground}
        wishlist={user?.name && true}
      />
      <Box p={1} mt={6}>
        {initState?.loading && <Loader />}
        {/* </Box> */}
        {/* {initState?.data?.map((order, i) => ( */}
        <OrderCard
          data={initState?.data}
          // key={order?.baseOrderResponse?.orderId}
        />
        {/* ))} */}
        {loading && <CircularLoader />}
      </Box>
    </Box>
  );
};

export default MyOrders;
