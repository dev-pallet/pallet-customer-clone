// react
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

// material ui
import { Box } from "@mui/material";

// custom components
import Menuback from "../menuback";
import StyledButton from "../custom-components/Button";
import ProductListing from "../home/components/productListing";

// services
import { getCustomerfavList } from "../../config/services/customerService";
import { getFilterProducts } from "../../config/services/catalogService";

// images
import NothingFound from "../custom-components/NothingFound";
import WishlistImage from "../../assets/images/wishlist.png";

// reducer
import {
  getFavourites,
  getUserData,
  setFavourites,
} from "../../redux/reducers/userReducer";
import { getNearByStore } from "../../redux/reducers/locationReducer";

// common function / constants
import { ScrollToTop } from "../../constants/commonFunction";
import { colorConstant } from "../../constants/colors";
import ViewCart from "../home/components/viewCart";

import TwinLoader from "../../assets/gif/loading.gif";
import SakuraLoader from "../../assets/gif/sakuraLoader.gif";
import { getStoreType } from "../../redux/reducers/miscReducer";
import SearchResturantProducts from "../searchResturantProducts";
import ResturantFavouriteListing from "../restaurantFavouriteListing/restaurantFavListing";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { getDeliverySubOrderType } from "../../redux/reducers/cartReducer";

export default function FavouritesListing() {
  const navigate = useNavigate();
  const favsList = useSelector(getFavourites);
  const dispatch = useDispatch();
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState(0);
  const [totalResults, setTotalResults] = useState(null);
  const [init, setInit] = useState(true);
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const nearByStore = useSelector(getNearByStore);
  const showSnackbar = useSnackbar();
  const getSubOrderType = useSelector(getDeliverySubOrderType);
  const getProductsData = async () => {
    // const payload = {
    //   page: page,
    //   pageSize: 10,
    //   storeLocations: [nearByStore?.locId],
    //   barcode: favsList?.map((e) => e?.productId),
    // };
    // const resturantPayload = {
    //   page: page,
    //   pageSize: 50,
    //   storeLocationId: nearByStore?.locId?.toLowerCase(),
    //   barcode: favsList?.map((e) => e?.productId),
    // };
    const check = favsList?.filter((item) => item);
    const barcodeList = favsList?.filter((item) =>
      /^\d+$/.test(item?.productId)
    );

    const variantIdList = favsList?.filter(
      (item) => !/^\d+$/.test(item?.productId)
    );
    let payload = {};

    if (retailType === "RESTAURANT") {
      payload = {
        page: page,
        pageSize: 10,
        // storeLocationId: nearByStore.locId,
        productIds: variantIdList?.map((e) => e?.productId),
        salesChannels: [getSubOrderType],
      };
    } else {
      // Assuming GROCERY or other retail types
      payload = {
        page: page,
        pageSize: 20,
        storeLocations: [nearByStore?.locId],
        barcode: barcodeList?.map((e) => e?.productId),
      };
    }
    // const finalPayload =
    //   retailType === "RESTAURANT" ? resturantPayload : payload;

    setLoading(true);
    try {
      const res = await getFilterProducts(payload);
      setLoading(false);
      if (res?.data?.status !== "SUCCESS") return;
      const temp = res?.data?.data?.data?.data;
      // setList([...list, ...temp?.filter((e) => e?.inventoryData)]);
      // setList(...list, temp);
      setList((prev) => [...prev, ...temp]);
      setTotalPage(res?.data?.data?.data?.totalPages);
      setTotalResults(res?.data?.data?.data?.totalRecords);
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
      setLoading(false);
    }
    if (init) {
      setInit(false);
    }
    setLoading(false);
  };

  const getWishListData = async (showLoader) => {
    // setLoading(true);
    try {
      const userId = user?.id;
      await getCustomerfavList(userId).then((res) => {
        setLoading(false);
        if (res?.data?.es === 0) {
          dispatch(setFavourites(res?.data?.data));
        }
      });
    } catch (error) {
      showSnackbar(err?.message, "error");
      // setLoading(false);
    }
  };

  useEffect(() => {
    ScrollToTop();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        document.documentElement.scrollTop + window.innerHeight + 1 >=
        document.documentElement.scrollHeight
      ) {
        // Call function when reaching the bottom
        if (page < totalPages) {
          setLoading(true);
          setPage(page + 1);
        }
        if (page === totalPages) {
          setNoData(true);
        }
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (favsList?.length === 0) {
      getWishListData();
    }

    if (favsList?.length) {
      let filteredList = list?.filter((el) =>
        favsList?.find((e) => e?.productId === el?.inventoryData?.gtin)
      );
      setList(filteredList);
    }
  }, [favsList]);

  useEffect(() => {
    getProductsData();
  }, [page]);

  useEffect(() => {
    if (!init && favsList?.length) {
      getProductsData();
    }
  }, [favsList]);
  const dynamicStyle = {
    width: "45%",
    height: "45%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <Menuback
        head={true}
        text="Wishlist"
        search={true}
        bg={colorConstant?.baseBackground}
      />
      <Box mt={8}>
        {(favsList?.length === 0 && !loading) ||
        (list?.length === 0 && !loading) ? (
          <Box textAlign={"center"}>
            <NothingFound
              message={"Your wishlist is empty"}
              src={WishlistImage}
              width={"300px"}
            />
            <br />
            <StyledButton
              textTransform={"capitalize"}
              text={"Explore More"}
              fw={"bold"}
              width={"100px"}
              borderRadius={"1rem"}
              mg={"0"}
              onClick={() => navigate("/home")}
            />
          </Box>
        ) : (favsList?.length === 0 && loading) ||
          (list?.length === 0 && loading) ? (
          <Box
            className="wallet-root-loader"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              className="wallet-loader-box"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <img
                src={retailType === "RESTAURANT" ? SakuraLoader : TwinLoader}
                // className="wallet-loader"
                style={retailType === "RESTAURANT" ? dynamicStyle : {}}
                // style={retailType === "RESTAURANT" && dynamicStyle}
              />
            </Box>
          </Box>
        ) : (
          <>
            {retailType === "RESTAURANT" ? (
              <ResturantFavouriteListing
                restaurantFavList={list}
                loading={loading}
              />
            ) : (
              <ProductListing
                itemsList={list}
                loading={loading}
                noData={noData}
                init={init}
                isWishlist={true}
                adjustCartViewInWishlist={true}
                isWishlistPage={true}
              />
            )}
          </>
        )}
        <ViewCart adjustView={true} />
      </Box>
    </Box>
  );
}
