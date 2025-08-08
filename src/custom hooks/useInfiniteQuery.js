import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useSnackbar } from "./SnackbarProvider";
import { getNearByStore } from "../redux/reducers/locationReducer";
import { getFilterProducts } from "../config/services/catalogService";
import { useMemo } from "react";
import { getDeliverySubOrderType } from "../redux/reducers/cartReducer";

const PAGE_SIZE = 20;

//Using react query for better refetching and handling infinite scrolling case
//for product api resturant
export const useInfiniteProducts = ({
  categoryName,
  encodedCategory2,
  enabled = true,
  filtersState = {},
}) => {
  const showSnackbar = useSnackbar();
  const locationId = localStorage.getItem("locationId"); //if refresh then fetch location id from local
  const nearByStore = useSelector(getNearByStore);
  const locId = nearByStore?.locId ? nearByStore?.locId : locationId;
  const getSubOrderType = useSelector(getDeliverySubOrderType);

  const fetchProducts = async ({ pageParam = 1 }) => {
    const foodType = Object.entries(filtersState)
      ?.filter(([_, value]) => value) // only those marked as true
      ?.map(([key]) => key);
    const payload = {
      productStatus: [],
      query: "",
      barcode: [],
      brands: [],
      manufacturers: [],
      mergedProductShow: false,
      name: [],
      preferredVendors: [],
      page: pageParam,
      pageSize: PAGE_SIZE,
      storeLocations: [locId],
      salesChannels: [getSubOrderType],
      // storeLocationId: locId?.toLowerCase(),
      // appCategories: {
      //   categoryLevel1: categoryName ? [categoryName] : [],
      //   categoryLevel2: encodedCategory2 ? [encodedCategory2] : [],
      // },
      ...(foodType?.length > 0 && { foodType }),
    };
    if (categoryName || encodedCategory2) {
      payload.appCategories = {
        ...(categoryName && { categoryLevel1: [categoryName] }),
        ...(encodedCategory2 && { categoryLevel2: [encodedCategory2] }),
      };
    }

    const res = await getFilterProducts(payload);

    // If no products found and category was set, retry without category filter
    let products = res?.data?.data?.data?.data || [];
    if (products.length === 0 && (categoryName || encodedCategory2)) {
      // Remove appCategories and try again
      delete payload.appCategories;
      const res2 = await getFilterProducts(payload);
      products = res2?.data?.data?.data?.data || [];

      if (res2?.data?.data?.es !== 0) {
        const msg = res2?.data?.data?.message || "Something went wrong";
        showSnackbar(msg, "error");
      }
      if (res2?.data?.status !== "SUCCESS") {
        showSnackbar("Failed to fetch products", "error");
      }
      return {
        products,
        nextPage: pageParam + 1,
        total: res2?.data?.data?.data?.totalCount,
      };
    }
    if (res?.data?.data?.es !== 0) {
      const msg = res?.data?.data?.message || "Something went wrong";
      showSnackbar(msg, "error");
    }
    if (res?.data?.status !== "SUCCESS") {
      showSnackbar("Failed to fetch products", "error");
    }
    return {
      products: res?.data?.data?.data?.data || [],
      nextPage: pageParam + 1,
      total: res?.data?.data?.data?.totalRecords,
    };
  };

  const getNextPageParam = (lastPage, allPages) => {
    const loaded = allPages?.flatMap((p) => p?.products)?.length;
    return loaded < lastPage?.total ? lastPage?.nextPage : undefined;
  };

  const query = useInfiniteQuery({
    queryKey: ["products", locId, categoryName, encodedCategory2, filtersState],
    queryFn: fetchProducts,
    getNextPageParam,
    retry: 1,
    staleTime: 5 * 60 * 1000, // 1 min
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled,
  });

  //   Without useMemo,
  //  a new array is created on every render, causing any useEffect that depends on allProductsData to run every time.
  //   With useMemo,
  // the array only changes when the underlying data changes, preventing unnecessary effect runs and re-renders.

  // Memoize the flattened products array
  const allProductsData = useMemo(
    () => query?.data?.pages?.flatMap((page) => page?.products) || [],
    [query?.data]
  );

  return {
    ...query,
    allProductsData,
  };
};
