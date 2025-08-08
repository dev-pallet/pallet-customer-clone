// react
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// mui components
import { Box } from "@mui/material";

// custom components
import { useSnackbar } from "../../../../../custom hooks/SnackbarProvider";
// constants

// api
import { getFilterProducts } from "../../../../../config/services/catalogService";
import { ScrollToTop } from "../../../../../constants/commonFunction";
import ProductListing from "../../productListing";
import ViewCart from "../../viewCart";

export default function BrandItemsListing() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState(false);
  const [init, setInit] = useState(true);
  const showSnackbar = useSnackbar();

  const params = useParams();

  const fetchData = async () => {
    try {
      await getFilterProducts({
        page,
        pageSize: 20,
        brands: [params?.brandName],
        productStatus: [],
        preferredVendors: [],
        sortByPrice: "DEFAULT",
        names: [],
        query: "",
      }).then((res) => {
        if (res?.data?.status !== "SUCCESS") {
          return;
        }

        if (
          res?.data?.data?.data?.data?.length === 0 &&
          page < res?.data?.data?.data?.totalPages
        ) {
          setPage((prev) => prev + 1);
        }
        const temp = res?.data?.data?.data?.data;

        setTotalPages(res?.data?.data?.data?.totalPages);
        setTotalResults(res?.data?.data?.data?.totalRecords);
        if (res?.data?.data?.data?.totalRecords === 0) {
          setNoData(true);
        }
        // setData([...data, ...temp?.filter((e) => e?.inventoryData)]);
        setData([...temp]);
      });
    } catch (e) {
      showSnackbar(e?.message || e?.response?.data?.message, "error");
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
  }, [page, totalPages]);

  useEffect(() => {
    if (params?.brandName) {
      fetchData();
      setLoading(false);
    }
  }, [params?.brandName, page]);

  useEffect(() => {
    ScrollToTop();
  }, []);

  return (
    <Box>
      <ProductListing
        title={params?.brandName}
        itemsList={data}
        totalItems={totalResults}
        loading={loading}
        noData={noData}
        init={init}
      />
      <ViewCart adjustView={true} />
    </Box>
  );
}
