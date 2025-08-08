// react
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

// mui components
import { Box } from "@mui/material";

// custom components
import ProductListing from "../../productListing";
import { useSnackbar } from "../../../../../custom hooks/SnackbarProvider";

// api
import { getFilterProducts } from "../../../../../config/services/catalogService";

// redux-reducer
import { getSelectedTagData } from "../../../../../redux/reducers/productReducer";
import { getNearByStore } from "../../../../../redux/reducers/locationReducer";
import { ScrollToTop } from "../../../../../constants/commonFunction";
import ViewCart from "../../viewCart";
import { getDeliverySubOrderType } from "../../../../../redux/reducers/cartReducer";

export default function TagItemsListing() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState(0);
  const [totalResults, setTotalResults] = useState(null);
  const [init, setInit] = useState(true);
  const showSnackbar = useSnackbar();

  const nearByStore = useSelector(getNearByStore);
  const selectedTagData = useSelector(getSelectedTagData);
  const getSubOrderType = useSelector(getDeliverySubOrderType);
  const params = useParams();

  //   get products data for selected tagName
  const getProductsData = async () => {
    const payload = {
      page: page,
      pageSize: 20,
      storeLocations: [String(nearByStore?.locId)],
      //storeLocationId: String(nearByStore?.locId?.toLowerCase()),
      barcode: selectedTagData?.gtins,
      salesChannels: [getSubOrderType],
    };

    try {
      const res = await getFilterProducts(payload);

      if (res?.data?.status !== "SUCCESS") return;
      // const temp = res?.data?.data?.data?.response;
      // setList([...list, ...temp?.filter((e) => e?.inventoryData)]);
      const variantData = res?.data?.data?.data?.data;
      setList((prevList) => [...prevList, ...variantData]);
      setTotalPage(res?.data?.data?.data?.totalPages);
      setTotalResults(res?.data?.data?.data?.totalRecords);
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
    if (init) {
      setInit(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom
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
    getProductsData();
  }, [page]);

  useEffect(() => {
    ScrollToTop();
  }, []);

  return (
    <Box>
      <ProductListing
        title={params?.tagName}
        itemsList={list}
        totalItems={totalResults}
        loading={loading}
        noData={noData}
        init={init}
      />
      <ViewCart adjustView={true} />
    </Box>
  );
}
