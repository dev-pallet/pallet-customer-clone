import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useSnackbar } from "./SnackbarProvider";
import { useDebounceValue } from "usehooks-ts";
import { getDeliverySubOrderType } from "../redux/reducers/cartReducer";
import { getServiceable } from "../redux/reducers/miscReducer";
import { getNearByStore } from "../redux/reducers/locationReducer";
import { getFilterProducts } from "../config/services/catalogService";

const PAGE_SIZE = 20;

export const useProductData = () => {
  const showSnackbar = useSnackbar();

  // Use fallback values if selectors are undefined
  const getDeliveryType = useSelector(
    typeof getDeliverySubOrderType === "function"
      ? getDeliverySubOrderType
      : (state) => state.cart?.deliverySubOrderType || "DELIVERY"
  );
  const isServiceable = useSelector(
    typeof getServiceable === "function"
      ? getServiceable
      : (state) => state.misc?.isServiceable || false
  );
  const nearByStore = useSelector(
    typeof getNearByStore === "function"
      ? getNearByStore
      : (state) => state.location?.nearByStore || {}
  );
  const locId = nearByStore?.locId;

  const [querySearch, setQuerySearch] = useDebounceValue("", 2000);

  const fetchProducts = async ({ pageParam = 1 }) => {
    if (!isServiceable || !locId) {
      return { products: [], variantData: [], nextPage: undefined, total: 0 };
    }

    const payload = {
      page: pageParam,
      pageSize: PAGE_SIZE,
      query: querySearch || "",
      barcode: [],
      brands: [],
      manufacturers: [],
      mergedProductShow: false,
      name: [],
      preferredVendors: [],
      productStatus: [],
      productTypes: ["MENU"],
      salesChannels: [getDeliveryType || "DELIVERY"],
      storeLocations: [locId],
    };

    const res = await getFilterProducts(payload);
    if (!res?.data) {
      showSnackbar("No data received from server", "error");
      return { products: [], variantData: [], nextPage: undefined, total: 0 };
    }

    if (res?.data?.data?.es !== 0) {
      showSnackbar(res?.data?.data?.message || "Something went wrong", "error");
      return { products: [], variantData: [], nextPage: undefined, total: 0 };
    }

    if (res?.data?.status !== "SUCCESS") {
      showSnackbar("Failed to fetch products", "error");
      return { products: [], variantData: [], nextPage: undefined, total: 0 };
    }

    const filteredProducts =
      res?.data?.data?.data?.data?.filter((p) =>
        p?.productTypes?.some((type) => ["MENU"].includes(type))
      ) || [];

    const variantData =
      filteredProducts?.flatMap((item) =>
        item?.variants?.map((variant) => ({
          ...variant,
          appCategories: item?.appCategories,
          productId: item?.productId,
          description: item?.description,
          allergenItems: item?.allergenItems,
          spiceLevels: item?.spiceLevels,
          attributes: item?.attributes,
        }))
      ) || [];

    return {
      products: filteredProducts,
      variantData,
      nextPage: filteredProducts?.length > 0 ? pageParam + 1 : undefined,
      total: res?.data?.data?.data?.totalRecords || 0,
    };
  };

  const getNextPageParam = (lastPage) => {
    return lastPage?.products?.length > 0 &&
      lastPage?.products?.length < lastPage?.total
      ? lastPage?.nextPage
      : undefined;
  };

  const query = useInfiniteQuery({
    queryKey: ["searchProducts", querySearch, locId, getDeliveryType],
    queryFn: fetchProducts,
    getNextPageParam,
    enabled: isServiceable, // Allow fetching even with empty querySearch
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const allProductsData =
    query?.data?.pages?.flatMap((page) => page?.products) || [];
  const allVariantData =
    query?.data?.pages?.flatMap((page) => page?.variantData) || [];

  return {
    loading: query?.isLoading,
    restaurantData: {
      filteredProducts: allProductsData,
      variantData: allVariantData,
    },

    error: query?.isError,
    errorMessage: query?.error?.message,
    totalResults: query?.data?.pages?.[0]?.total || 0,
    setQuerySearch,
    querySearch,
    fetchNextPage: query?.fetchNextPage,
    hasNextPage: query?.hasNextPage,
    isFetchingNextPage: query?.isFetchingNextPage,
  };
};
