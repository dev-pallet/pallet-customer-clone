import { memo, useCallback, useRef, useState } from "react";
// mui components
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveIcon from "@mui/icons-material/Remove";
import ShareIcon from "@mui/icons-material/Share";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import nonVegLogo from "../../assets/images/Union.png";
import vegLogo from "../../assets/images/veg.png";
import {
  addQuantityInProduct,
  increaseProductToRestaurantCart,
  removeAssets,
} from "../../config/services/cartService";
import { colorConstant } from "../../constants/colors";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { useInfiniteProducts } from "../../custom hooks/useInfiniteQuery";
import { storePlainData } from "../../middlewares/localStorage";
import {
  getAppliedCoupon,
  getCartId,
  getCartProducts,
  getDeliverySubOrderType,
  getLoyalityData,
  getWalletData,
  setAppliedCoupon,
  setCartBill,
  setCartProducts,
  setLoyalityPoints,
  setWalletData,
} from "../../redux/reducers/cartReducer";
import { getNearByStore } from "../../redux/reducers/locationReducer";
import { CircularLoader } from "../custom-components/CircularLoader";
import Text from "../custom-components/Text";
import Favourite from "../Favourites/Favourite";
import Header from "../header";
import Menuback from "../menuback";
import AddMoreCustomization from "./addOn";
import CustomizeProduct from "./customizeAddOn";
import DetailDrawer from "./detailDrawer";
import EditCustomizeProduct from "./editCustomizeAddOn";
import FilterChips from "./filterChips";
import FiltersDrawer from "./filterDrawer";
import "./searchProduct.css";
import ShareProductPopUp from "./sharePopup";

const SearchResturantProduct = ({
  isSearch,
  searchItem,
  itemsList,
  isRestroProductPage,
  loadSearchPage,
  loading,
  lastElementRef,
}) => {
  const nearByStore = useSelector(getNearByStore);
  const { categoryName } = useParams();
  const location = useLocation();
  const subCategory = location.pathname.split("/")[3];

  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const walletData = useSelector(getWalletData);
  const loyalityData = useSelector(getLoyalityData);
  const couponApplied = useSelector(getAppliedCoupon);
  const cartProducts = useSelector(getCartProducts);
  const [addedProducts, setAddedProducts] = useState({});
  const [foodProductQtyMap, setFoodProductQtyMap] = useState({});
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const [categoryWiseData, setCategoryWiseData] = useState({});
  //bottom drawer
  const [openDetailDrawer, setOpenDetailDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const [openAddOnModal, setOpenAddOnModal] = useState(false);
  const [productData, setProductData] = useState(null);
  const [addTitle, setAddTitle] = useState(null);

  //sending this to customize add on when product selected it will reflect
  const [selectedVariantProduct, setSelectedVariantProduct] = useState(null);
  const [note, setNote] = useState({});
  const [openHavingQuantityModal, setHavingQuantityModal] = useState(false);

  // const [isEdit, setIsEdit] = useState(false);
  // const [editCustomizationData, setEditCustomizationData] = useState(null);
  const [editStates, setEditStates] = useState({});
  const [editVariantId, setEditVariantId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // states for managing share products
  const [openShareDrawer, setOpenShareDrawer] = useState(false);
  const [selectedShareProduct, setSelectedShareProduct] = useState(null);
  const [selectedShareProdDetails, setSelectedShareProdDetails] = useState({
    title: "",
    shareUrl: ""
  });

  //adding code for share
  const domain = "stage-restaurant.palletnow.co";
  const getSubOrderType = useSelector(getDeliverySubOrderType);

  const handleShareClick = (event, product, title, shareUrl) => {
    event.stopPropagation();
    setOpenShareDrawer(true);
    setSelectedShareProduct(product);
    setSelectedShareProdDetails({
      title: title,
      shareUrl: shareUrl
    });
  };

  const userString = localStorage.getItem("@user");
  const user = userString ? JSON.parse(userString) : null;

  const isSearchPage = location.pathname === "/search";
  const encodedCategory2 = encodeURIComponent(subCategory ? subCategory : []); //using for encoding subcategory name
  //filters
  const [filtersState, setFiltersState] = useState({
    // priceLowHigh: false,
    // priceHighLow: false,
    NON_VEG: false,
    VEG: false,
    // highlyReordered: false,
    // spicy: true,
    // nonSpicy: true,
    VEGAN: false,
  });

  const filterLabels = {
    // priceLowHigh: "Price - low to high",
    // priceHighLow: "Price - high to low",
    NON_VEG: "Non Veg",
    VEG: "Veg",
    // highlyReordered: "Highly reordered",
    // spicy: "Spicy",
    // nonSpicy: "Non Spicy",
    VEGAN: "Vegan",
  };

  const selectedChips = Object.entries(filtersState)
    ?.filter(([_, value]) => value)
    ?.map(([key]) => ({ key, label: filterLabels[key] }));

  const {
    allProductsData, //Flattened array of all pages of products returned in hook.
    fetchNextPage, //Used to load the next page of data.
    hasNextPage, //Boolean — true if there's another page to fetch
    isFetchingNextPage, //true while next page is loading.
    isLoading, //true on first load
    isError, //true if query failed.
    error, //Error object returned from failed query.
  } = useInfiniteProducts({
    categoryName,
    encodedCategory2,
    enabled: isRestroProductPage,
    filtersState,
  });

  useEffect(() => {
    const categoryData = processCategoryWiseData(
      allProductsData,
      itemsList,
      categoryName,
      subCategory,
      isRestroProductPage
    );

    setCategoryWiseData(categoryData);
  }, [
    allProductsData,
    itemsList,
    categoryName,
    subCategory,
    isRestroProductPage,
  ]);

  //populate foodProductQtyMap from cartProducts when the component loads
  useEffect(() => {
    if (cartProducts?.length) {
      const initialQtyMap = {};
      cartProducts.forEach((product) => {
        if (product?.variantId) {
          initialQtyMap[product?.variantId] = product?.quantity || 0;
        }
      });
      setFoodProductQtyMap(initialQtyMap || 1);
      const variantList = cartProducts?.reduce((acc, item) => {
        if (item?.variantId) acc[item?.variantId] = true;
        return acc;
      }, {});

      setAddedProducts(variantList);
      // setSelectedVariantProduct(variantList);
    }
  }, [cartProducts]);

  //this function is for showing product on the basis of category name and sub category, initially it will show all products
  const processCategoryWiseData = (
    allProductsData,
    itemsList,
    categoryName,
    subCategory,
    isRestroProductPage
  ) => {
    let allProducts = [];
    if (isRestroProductPage) {
      const ids = new Set();
      const fetchedData = allProductsData || [];

      const itemData =
        // itemsList?.variantData;
        itemsList?.filteredProducts?.filter((item) => {
          if (ids.has(item?.variants?.[0]?.variantId)) return false;
          ids.add(item?.variants?.[0]?.variantId);
          return true;
        }) || [];
      allProducts = [...fetchedData, ...itemData];
    } else {
      allProducts = itemsList?.filteredProducts || [];
    }

    // --- FILTER PRODUCTS BASED ON FILTERS ---
    // Access filtersState from the component scope
    let filteredProducts = allProducts;
    if (filtersState?.VEG || filtersState?.NON_VEG || filtersState?.VEGAN) {
      filteredProducts = allProducts?.filter((item) => {
        const foodType = item?.attributes?.foodType?.toUpperCase();
        if (filtersState?.VEG && foodType === "VEG") return true;
        if (filtersState?.NON_VEG && foodType === "NON_VEG") return true;
        if (filtersState?.VEGAN && foodType === "VEGAN") return true;
        // If no filter matches, exclude
        return false;
      });
    }
    let prioritizedProducts = filteredProducts;

    if (categoryName || subCategory) {
      const matchesCategory = (item) =>
        (categoryName &&
          item?.appCategories?.categoryLevel1?.[0] === categoryName) ||
        (subCategory &&
          item?.appCategories?.categoryLevel2?.[0] === subCategory);

      prioritizedProducts = [
        ...filteredProducts?.filter(matchesCategory),
        ...filteredProducts?.filter((item) => !matchesCategory(item)),
      ];
    }

    const grouped = prioritizedProducts?.length
      ? Object.groupBy(
          prioritizedProducts,
          (item) => item?.appCategories?.categoryLevel1?.[0] || "Others"
        )
      : {};

    return grouped;
  };

  const handleAssets = async () => {
    if (!cartId) return;
    const payload = {
      cartId: cartId,
      removeCoupon: couponApplied ? true : false,
      removeWallet: walletData ? true : false,
      removeLoyalty: loyalityData ? true : false,
    };

    try {
      const res = await removeAssets(payload);
      const result = res?.data?.data;

      if (result?.es !== 0) return;
      dispatch(setCartBill(result?.data?.billing));
      dispatch(setAppliedCoupon(result?.data?.cartCoupon));
      dispatch(
        setLoyalityPoints(
          result?.data?.loyaltyPoints !== null ||
            result?.data?.loyaltyPoints !== ""
            ? {
                loyaltyPoints: result?.data?.loyaltyPoints,
                loyaltyPointsValue: result?.data?.loyaltyPointsValue,
              }
            : null
        )
      );
      dispatch(setWalletData(result?.data?.redeemAmount));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  // const createRestroCart = async (product) => {
  //   try {
  //     const response = await createRestaurantCart({});
  //     const result = response?.data?.data;

  //     if (response?.data?.data?.es !== 0) {
  //       showSnackbar(response?.data?.data?.message, "error");
  //       return;
  //     }
  //     dispatch(setCartId(result?.data?.cartId));
  //     addProductInCart({
  //       cartId: result?.data?.cartId,
  //       sellingPrice: product?.externalSalesChannels?.[0]?.salePrice || 0,
  //       variantId: product?.variantId,
  //       qty: 1,
  //       orgId: user?.organizationId,
  //       locationId: String(nearByStore?.locId),
  //     });

  //     dispatch(setCartProducts(result?.data?.cartProducts));
  //     // const storeDataDetails = localStorage.getItem("storeDetails");

  //     // await storeData("cartData", {
  //     //   cartProducts: result?.variantId,
  //     //   storeDataDetails: storeDataDetails
  //     //     ? JSON.parse(storeDataDetails)
  //     //     : null,
  //     // });
  //     await storePlainData("cartId", result?.cartId);
  //     dispatch(setCartBill(result?.data?.billing));
  //     dispatch(setShippingAddress(result?.data?.shippingAddress));
  //     dispatch(setAppliedCoupon(response?.data?.cartCoupon));
  //     dispatch(
  //       setLoyalityPoints({
  //         loyaltyPoints: response?.data?.loyaltyPoints,
  //         loyaltyPointsValue: response?.data?.loyaltyPointsValue,
  //       })
  //     );
  //   } catch (err) {
  //     showSnackbar(err?.message || err?.response?.data?.message, "error");
  //   }
  // };

  const handleAddProductResturant = (
    selectedVariantProduct,
    selectedToppings,
    quantity
  ) => {
    try {
      if (cartId !== null) {
        const addonProducts = selectedToppings?.map((item) => ({
          variantId: item?.variantId,
          itemName: item?.title,
          sellingPrice: item?.additionalPrice || 0,
          sellingUnit: item?.unitOfMeasure,
          specification: item?.specification,
          igst: item?.gst || 0,
          igstAmount: item?.igstAmount || 0,
        }));

        addProductInCart({
          variantId: selectedVariantProduct?.variantId,
          cartId: cartId,
          orgId: user?.organizationId,
          locationId: String(nearByStore?.locId),
          sellingPrice:
            selectedVariantProduct?.externalSalesChannels?.[0]?.salePrice || 0,
          qty: quantity,
          comments: note,
          addonProducts: addonProducts,
          quantityBySpecs: quantity,
        });

        setFoodProductQtyMap((prev) => ({
          ...prev,
          [selectedVariantProduct?.variantId]: quantity || 1,
        }));
      }
      // else {
      //   createRestroCart();
      // }

      // Clear the note for this product after adding to cart
      setNote((prev) => ({
        ...prev,
        [selectedVariantProduct?.variantId]: "",
      }));
    } catch (err) {
      showSnackbar(
        err?.message || err?.response?.data?.message || "Something went wrong"
      );
    }
  };

  const addProductInCart = async (data) => {
    try {
      setLoader(true);
      const res = await increaseProductToRestaurantCart(data);

      if (res?.data?.status === "ERROR") {
        showSnackbar(res?.data?.message, "error");
        return;
      }

      const result = res?.data?.data;

      if (result?.es !== 0) {
        // setHoldErrorMsg(res?.data?.data?.message);
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }

      const quantity = result?.data?.cartProducts?.find(
        (item) => item?.variantId === data?.variantId
      )?.quantity;

      if (res?.data?.status == "SUCCESS") {
        // Update UI state only on success
        // setAddRestroProduct(true);
        // setAddedProducts((prev) => new Set(prev).add(product?.barcodes?.[0]));
        setAddedProducts((prev) => ({
          ...prev,
          [data?.variantId]: true,
        }));
        setFoodProductQtyMap((prev) => ({
          ...prev,
          [data?.variantId]: quantity || 1,
        }));

        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));

        // const storeDataDetails = "";
        // localStorage.getItem("storeDetails");
        // await storeData("cartData", {
        //   cartProducts: result?.data?.cartProducts,
        //   storeDataDetails: storeDataDetails
        //     ? JSON.parse(storeDataDetails)
        //     : null,
        // });

        await storePlainData("cartId", result?.data?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      }
    } catch (err) {
      setLoader(false);
      if (err?.status === 400) {
        showSnackbar(
          "Something went wrong. Please check your input and try again.",
          "error"
        );
        return;
      }
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    } finally {
      setLoader(false);
    }
  };

  const addIncreaseProduct = async (data, isModal) => {
    // const variantId = selectedVariantProduct?.length
    //   ? selectedVariantProduct?.variantId
    //   : data?.variants?.[0]?.variantId;

    const variantId = isModal
      ? data?.variantId
      : data?.variants?.[0]?.variantId;

    if (!variantId) {
      showSnackbar("Variant ID is missing");
      return;
    }
    try {
      setLoader(true);
      const cartProduct = cartProducts?.find(
        (item) => item?.variantId === variantId
      );

      const payload = {
        cartId: cartId,
        cartProductId: cartProduct?.cartProductId, // will come from when add
        // quantityBySpecs: 1,
        qty: (foodProductQtyMap[variantId] || 0) + 1,
      };

      const res = await addQuantityInProduct(payload);

      // if response status is error
      if (res?.data?.status === "ERROR") {
        showSnackbar(res?.data?.message, "error");
        return;
      }
      const result = res?.data?.data;

      //handle es error or socket hang up error
      if (result?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }

      const updatedCartProducts = result?.data?.cartProducts || [];
      const updatedCartProduct = updatedCartProducts?.find(
        (item) => item?.variantId === data?.variantId
      );
      const newQty = updatedCartProduct?.quantity || 1;

      if (
        res?.data?.status == "SUCCESS" &&
        res?.data?.data?.statusCode === 200
      ) {
        // Update UI state only on success
        // setFoodProductQtyMap((prev) => ({
        //   ...prev,
        //   [variantId]: newQty,
        // }));

        setFoodProductQtyMap((prev) => ({
          ...prev,
          [variantId]: (prev[variantId] || 1) + 1,
        }));

        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));

        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      }

      setLoader(false);
    } catch (err) {
      setLoader(false);
      if (err?.status === 400) {
        showSnackbar(
          "Something went wrong. Please check your input and try again.",
          "error"
        );
        return;
      }
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    } finally {
      setLoader(false);
    }
  };

  const decreaseProduct = async (data, isModal) => {
    // const variantId = selectedVariantProduct?.length
    //   ? selectedVariantProduct?.variantId
    //   : data?.variants?.[0]?.variantId;

    const variantId = isModal
      ? data?.variantId
      : data?.variants?.[0]?.variantId;
    if (!variantId) {
      showSnackbar("Variant ID is missing");
      return;
    }
    try {
      setLoader(true);
      const cartProduct = cartProducts?.find(
        (item) => item?.variantId === variantId
      );

      const payload = {
        cartId: cartId,
        cartProductId: cartProduct?.cartProductId,
        qty: (foodProductQtyMap[variantId] || 1) - 1,
      };
      const res = await addQuantityInProduct(payload);

      if (res?.data?.status === "ERROR") {
        showSnackbar(res?.data?.message, "error");
        return;
      }
      const result = res?.data?.data;
      if (result?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      const updatedCartProducts = result?.data?.cartProducts || [];
      const updatedCartProduct = updatedCartProducts?.find(
        (item) => item?.variantId === data?.variantId
      );
      const newQty = updatedCartProduct?.quantity;

      if (
        res?.data?.status == "SUCCESS" &&
        res?.data?.data?.statusCode === 200
      ) {
        // Update UI state only on success

        setFoodProductQtyMap((prev) => ({
          ...prev,
          [variantId]: newQty,
        }));
        handleAssets();
        dispatch(setCartProducts(result?.data?.cartProducts));
        // const storeDataDetails = "";
        // localStorage.getItem("storeDetails");
        // await storeData("cartData", {
        //   cartProducts: result?.data?.cartProducts,
        //   storeDataDetails: storeDataDetails
        //     ? JSON.parse(storeDataDetails)
        //     : null,
        // });
        await storePlainData("cartId", result?.cartId);
        dispatch(setCartBill(result?.data?.billing));
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      if (err?.status === 400) {
        showSnackbar(
          "Something went wrong. Please check your input and try again.",
          "error"
        );
        return;
      }
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  //for opening product details
  const handleOpenProductDetails = (productId, product) => {
    //when the drawer open this function will call
    handleProduct(productId, product);
    setOpenDetailDrawer(!openDetailDrawer);
  };

  //passing particular product id and that particular product data
  const handleProduct = (productId, product) => {
    setSelectedProduct(product);
  };

  const handleAddOnModal = () => {
    setOpenAddOnModal(true);
  };

  const handleClose = () => {
    setOpenAddOnModal(false);
  };

  // customizable button functionality
  //logic:
  // 1. if qty ==0 || qty >= 1 then it will be active
  // 2. handling two modals: if already qty is present and more than 1 variants it will open
  // 3. if nothing is selected, then customizeAddon modal will open
  const handleCustomizableClick = (e, product) => {
    e.stopPropagation();
    const productQty = cartProducts?.find(
      (item) => item?.productId === product?.productId
    )?.quantity;

    setProductData(product?.variants);
    setAddTitle(product);
    setSelectedVariantProduct(product?.variants);
    if (productQty >= 1) {
      setOpenAddOnModal(false);
      setHavingQuantityModal(true);
    } else {
      setHavingQuantityModal(false);
      setOpenAddOnModal(true);
    }
  };

  //This function help in handling customizaAddOn modal from addon page, parent is handling state for consistency
  const handleAddNewCustomization = () => {
    setOpenAddOnModal(true);
    setHavingQuantityModal(false);
  };
  const hasData = Object.entries(categoryWiseData)?.length > 0;

  // const handleEditCustomization = (customizationData) => {
  //   if (typeof isEdit !== "boolean") return;
  //   setEditCustomizationData(customizationData);
  //   setIsEdit(true);
  //   setOpenAddOnModal(false);
  // };
  const handleEditCustomization = useCallback(
    (productVariantId, customizationData) => {
      setEditStates((prev) => ({
        ...prev,
        [productVariantId]: {
          isEdit: true,
          editCustomizationData: customizationData,
        },
      }));
      setEditVariantId(productVariantId);
      setOpenAddOnModal(false);
    },
    []
  );
  const editState = editStates[editVariantId] || {};

  //filter functionality
  const handleChipClick = (key) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleRemoveFilter = (key) => {
    setFiltersState((prev) => ({
      ...prev,
      [key]: false,
    }));
  };
  return (
    <>
      {!isSearchPage && (
        <Box
          className="header-top"
          sx={{
            background:
              "linear-gradient(rgb(0, 0, 0) 5%, rgba(217, 217, 217, 1) 146%)",
            padding: 0,
            marginBottom: 0,
          }}
        >
          <Header />
        </Box>
      )}
      <div>
        <Menuback
          head={true}
          text="All Products"
          headingClassName="custom-heading-position"
        />

        {/* filter component */}
        <FilterChips
          filters={selectedChips}
          onRemove={handleRemoveFilter}
          onFilterClick={() => setDrawerOpen(true)}
          onChipClick={handleChipClick}
          filtersState={filtersState}
        />

        <FiltersDrawer
          open={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          filtersState={filtersState}
          setFiltersState={setFiltersState}
        />
        {/* if component is loaded then the accordion loader will run  */}
        <div style={{margin: "0 0.5rem"}}>
        {!loading && loadSearchPage ? (
          <CircularLoader
            sx={{
              color: colorConstant?.sakuraRestroColor,
              width: "10px !important",
              height: "10px !important",
            }}
          />
        ) : (
          <>
            {isLoading && (
              <CircularLoader
                sx={{
                  color: colorConstant?.sakuraRestroColor,
                  width: "10px !important",
                  height: "10px !important",
                }}
              />
            )}

            {hasData ? (
              Object.entries(categoryWiseData)?.map(([category, products]) => {
                return (
                  <Accordion key={category} defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {category}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* <div style={{ height: "40vh" }}> */}
                      {products?.map((product, idx) => {
                        const hasImage =
                          !!product?.variants?.[0]?.images?.front;

                        const filteredData = cartProducts?.find((item) => {
                          if (item?.productId === product?.productId) {
                            return item;
                          }
                        });

                        const qty = filteredData?.quantity || 0;
                        const variantId = selectedVariantProduct?.variantId;
                        /* const qty = foodProductQtyMap[variantId] || 0; */

                        //share url
                        const shareUrl = `${domain}/product-details/${product?.productId}`;
                        const title = `Check out this awesome dish ${product?.name}!`;

                        const salesChannels =
                          product?.variants?.[0]?.externalSalesChannels || [];

                        const matchedChannel = salesChannels?.find(
                          (channel) =>
                            channel?.salesChannelName === getSubOrderType
                        );

                        const salePrice = matchedChannel?.salePrice;
                        return (
                          <>
                            <Box
                              key={product?.variants?.[0]?.variantId}
                              ref={
                                idx === products.length - 1
                                  ? lastElementRef
                                  : null
                              }
                              display="flex"
                              justifyContent="space-between"
                              pb={2}
                              borderBottom="1px solid #eee"
                            >
                              {/* Left Content */}
                              <Box
                                flex="1"
                                pr={2}
                                sx={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenProductDetails(
                                    product?.productId,
                                    // product?.barcodes?.[0],
                                    product
                                  );

                                  // navigate(
                                  //   `/product-details/${product?.barcodes?.[0]}`
                                  // );
                                }}
                              >
                                {/* Veg/Non-veg icon + Name */}
                                <Box display="flex" alignItems="center" gap={1}>
                                  <img
                                    src={
                                      product?.attributes?.foodType?.toUpperCase() ===
                                      "VEG"
                                        ? vegLogo
                                        : nonVegLogo
                                    }
                                    alt="veg/non-veg"
                                    width={16}
                                    height={16}
                                  />

                                  {/* {openDetailDrawer && (
                                    <DetailDrawer
                                      openDetailDrawer={openDetailDrawer}
                                      setOpenDetailDrawer={setOpenDetailDrawer}
                                      selectedProduct={selectedProduct}
                                      handleAddProductResturant={
                                        handleAddProductResturant
                                      }
                                      decreaseProduct={decreaseProduct}
                                      addIncreaseProduct={addIncreaseProduct}
                                      setNote={setNote}
                                      note={note}
                                      setSelectedVariantProduct={
                                        setSelectedVariantProduct
                                      }
                                      loader={loader}
                                      qty={
                                        foodProductQtyMap[
                                          selectedVariantProduct?.variantId || 1
                                        ]
                                      }
                                      foodProductQtyMap={foodProductQtyMap}
                                      setFoodProductQtyMap={
                                        setFoodProductQtyMap
                                      }
                                    />
                                  )} */}
                                  <Typography fontWeight="bold" variant="body1">
                                    {product?.name}
                                  </Typography>
                                </Box>

                                {/* Price */}
                                <Typography variant="body2" mt={0.5}>
                                  {salePrice && <>₹{salePrice}</>}
                                  {/* product?.inventorySync?.mrp ? (
                        <>
                          <span style={{ color: "gray" }}>
                            ₹{product?.inventorySync?.mrp}
                          </span>{" "}
                          <span style={{ color: "green", fontWeight: 500 }}>
                            Get it for ₹{product?.externalSalesChannels?.[0]?.salePrice}
                          </span>
                        </>
                      ) : (
                       
                      )} */}
                                </Typography>

                                {/* Description */}
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  mt={0.5}
                                >
                                  {product?.description?.slice(0, 60)}...{" "}
                                  {/* need to add functionality for read more */}
                                  <span style={{ color: "gray" }}>
                                    read more
                                  </span>
                                </Typography>

                                {/* Icons */}
                                <Box mt={1} display="flex" gap={1}>
                                  <IconButton size="small">
                                    <Favourite
                                      gtin={product?.productId}
                                      fontSize="small"
                                    />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      handleShareClick(e, product, title, shareUrl);
                                    }}
                                  >
                                    <ShareIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                              {/*Add Button */}
                              <Box
                                position="relative"
                                width="90px"
                                minHeight="90px"
                              >
                                {/* !addedProducts[product?.variants?.[0]?.variantId] || */}
                                {qty <= 0 ? (
                                  //adding data if no image is available
                                  hasImage ? (
                                    <>
                                      <CardMedia
                                        component="img"
                                        height="90"
                                        image={
                                          product?.variants?.[0]?.images?.front
                                        }
                                        alt={product?.name}
                                        sx={{
                                          borderRadius: 1,
                                          width: 90,
                                          objectFit: "cover",
                                        }}
                                      />
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={(e) => {
                                          // if (
                                          //   product?.inventorySync?.availableQuantity !== 0
                                          // ) {
                                          e.stopPropagation();
                                          const variants =
                                            product?.variants || [];
                                          if (
                                            variants?.length === 1 &&
                                            (!variants[0]?.addOn ||
                                              variants[0]?.addOn?.length === 0)
                                          ) {
                                            handleAddProductResturant(
                                              variants[0],
                                              [],
                                              1
                                            );
                                          } else {
                                            // Open modal for customization
                                            handleAddOnModal();
                                            setProductData(variants);
                                            setAddTitle(product);
                                          }
                                        }}
                                        sx={{
                                          position: "absolute",
                                          bottom: -12,
                                          left: "50%",
                                          transform: "translateX(-50%)",
                                          borderRadius: 3,
                                          fontSize: "0.7rem",
                                          padding: "2px 12px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {/* {product?.inventorySync?.availableQuantity !== 0
                              ? "ADD"
                              : "Out of Stock"} */}
                                        ADD
                                      </Button>
                                      {Boolean(
                                        product?.variants?.[0]?.addOn?.length
                                      ) > 0 && (
                                        <p
                                          className="custom-title"
                                          onClick={(e) =>
                                            handleCustomizableClick(e, product)
                                          }
                                        >
                                          Customizable
                                        </p>
                                      )}
                                    </>
                                  ) : (
                                    <Box
                                      display="flex"
                                      justifyContent="center"
                                      alignItems="center"
                                      height="100%"
                                      flexDirection="column"
                                    >
                                      <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={(e) => {
                                          // if (
                                          //   product?.inventorySync?.availableQuantity !== 0
                                          // ) {
                                          e.stopPropagation();
                                          const variants =
                                            product?.variants || [];
                                          if (
                                            variants?.length === 1 &&
                                            (!variants[0]?.addOn ||
                                              variants[0]?.addOn?.length === 0)
                                          ) {
                                            handleAddProductResturant(
                                              variants[0],
                                              [],
                                              1
                                            );
                                          } else {
                                            // Open modal for customization
                                            handleAddOnModal();
                                            setProductData(variants);
                                            setAddTitle(product);
                                          }
                                        }}
                                        sx={{
                                          borderRadius: 3,
                                          fontSize: "0.7rem",
                                          padding: "2px 12px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {/* {product?.inventorySync?.availableQuantity !== 0
                              ? "ADD"
                              : "Out of Stock"} */}
                                        ADD
                                      </Button>
                                      {Boolean(
                                        product?.variants?.[0]?.addOn?.length
                                      ) > 0 && (
                                        <p
                                          className="custom-title"
                                          onClick={(e) =>
                                            handleCustomizableClick(e, product)
                                          }
                                        >
                                          Customizable
                                        </p>
                                      )}
                                    </Box>
                                  )
                                ) : (
                                  <Box>
                                    {hasImage ? (
                                      <>
                                        <CardMedia
                                          component="img"
                                          height="90"
                                          image={
                                            product?.variants?.[0]?.images
                                              ?.front
                                          }
                                          alt={product?.name}
                                          sx={{
                                            borderRadius: 1,
                                            width: 90,
                                            objectFit: "cover",
                                          }}
                                        />
                                      </>
                                    ) : null}
                                    {Boolean(
                                      product?.variants?.[0]?.addOn?.length
                                    ) && (
                                      <p
                                        className="custom-title"
                                        onClick={(e) =>
                                          handleCustomizableClick(e, product)
                                        }
                                      >
                                        Customizable
                                      </p>
                                    )}

                                    <Box className="product-qty-counter">
                                      <Box
                                        className="decrement-qty"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (product?.variants?.length) {
                                            setHavingQuantityModal(true);
                                            setOpenAddOnModal(false);
                                          } else {
                                            decreaseProduct(product);
                                          }
                                        }}
                                        variant="text"
                                      >
                                        <RemoveIcon />
                                      </Box>
                                      {loader[
                                        product?.variant?.[0]?.variantId
                                      ] ? (
                                        <CircularProgress
                                          sx={{
                                            color:
                                              colorConstant?.defaultButtonText,
                                            width: "15px !important",
                                            height: "15px !important",
                                          }}
                                        />
                                      ) : (
                                        <Text
                                          text={qty}
                                          className="product-qty"
                                        />
                                      )}
                                      <Box
                                        className="increment-qty"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // handleIncrementProduct(product);
                                          if (cartProducts?.length) {
                                            setHavingQuantityModal(true);
                                            setOpenAddOnModal(false);
                                          } else {
                                            addIncreaseProduct(product);
                                          }
                                        }}
                                        variant="text"
                                      >
                                        <AddIcon />
                                      </Box>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                            {editStates[editVariantId]?.isEdit && (
                              <EditCustomizeProduct
                                handleAddProductResturant={
                                  handleAddProductResturant
                                }
                                product={productData}
                                decreaseProduct={decreaseProduct}
                                addIncreaseProduct={addIncreaseProduct}
                                qty={
                                  foodProductQtyMap[
                                    selectedVariantProduct?.variantId
                                  ] || 0
                                }
                                foodProductQtyMap={foodProductQtyMap}
                                setFoodProductQtyMap={setFoodProductQtyMap}
                                loader={loader}
                                //for additional info
                                setNote={setNote}
                                note={note}
                                //for handling variants products value
                                setSelectedVariantProduct={
                                  setSelectedVariantProduct
                                }
                                selectedVariantProduct={selectedVariantProduct}
                                addTitle={addTitle}
                                isEdit={editStates[editVariantId]?.isEdit}
                                // setIsEdit={setIsEdit}
                                // setIsEdit={!editState?.isEdit}
                                setIsEdit={(isEdit) =>
                                  setEditStates((prev) => ({
                                    ...prev,
                                    [editVariantId]: {
                                      ...prev[editVariantId],
                                      isEdit,
                                    },
                                  }))
                                }
                                editCustomizationData={
                                  editState?.editCustomizationData
                                }
                                setEditCustomizationData={(data) =>
                                  setEditStates((prev) => ({
                                    ...prev,
                                    [variantId]: {
                                      ...prev[variantId],
                                      editCustomizationData: data,
                                    },
                                  }))
                                }
                              />
                            )}

                            {/* {openShareDrawer ? (
                              <ShareProductPopUp
                                openShareDrawer={openShareDrawer}
                                setOpenShareDrawer={setOpenShareDrawer}
                                shareUrl={shareUrl}
                                title={title}
                                selectedShareProduct={selectedShareProduct}
                              />
                            ) : null} */}
                          </>
                        );
                      })}
                      {/* </div> */}
                      {isFetchingNextPage && (
                        <Box display="flex" justifyContent="center" my={2}>
                          <CircularProgress />
                        </Box>
                      )}

                      {openHavingQuantityModal ? (
                        <AddMoreCustomization
                          setHavingQuantityModal={setHavingQuantityModal}
                          selectedVariantProduct={selectedVariantProduct}
                          addTitle={addTitle}
                          openHavingQuantityModal={openHavingQuantityModal}
                          qty={
                            foodProductQtyMap[
                              selectedVariantProduct?.variantId
                            ] || 0
                          }
                          foodProductQtyMap={foodProductQtyMap}
                          setFoodProductQtyMap={setFoodProductQtyMap}
                          loader={loader}
                          handleAddProductResturant={handleAddProductResturant}
                          product={productData}
                          decreaseProduct={decreaseProduct}
                          addIncreaseProduct={addIncreaseProduct}
                          setSelectedVariantProduct={setSelectedVariantProduct}
                          handleAddNewCustomization={handleAddNewCustomization}
                          setIsEdit={(isEdit) =>
                            setEditStates((prev) => ({
                              ...prev,
                              [editVariantId]: {
                                ...prev[editVariantId],
                                isEdit,
                              },
                            }))
                          }
                          isEdit={editStates[editVariantId]?.isEdit || false}
                          handleEditCustomization={handleEditCustomization}
                        />
                      ) : null}

                      {openAddOnModal ? (
                        <CustomizeProduct
                          openAddOnModal={openAddOnModal}
                          setOpenAddOnModal={setOpenAddOnModal}
                          handleClose={handleClose}
                          handleAddProductResturant={handleAddProductResturant}
                          product={productData}
                          decreaseProduct={decreaseProduct}
                          addIncreaseProduct={addIncreaseProduct}
                          qty={
                            foodProductQtyMap[
                              selectedVariantProduct?.variantId
                            ] || 1
                          }
                          foodProductQtyMap={foodProductQtyMap}
                          setFoodProductQtyMap={setFoodProductQtyMap}
                          loader={loader}
                          //for additional info
                          setNote={setNote}
                          note={note}
                          //for handling variants products value
                          setSelectedVariantProduct={setSelectedVariantProduct}
                          selectedVariantProduct={selectedVariantProduct}
                          addTitle={addTitle}
                        />
                      ) : null}
                    </AccordionDetails>
                  </Accordion>
                );
              })
            ) : (
              <>
                {!isLoading && (
                  <div className="menulist-no-product">
                    <p style={{ fontFamily: "sans-serif" }}>{searchItem}</p>
                    <p style={{ fontFamily: "sans-serif" }}>
                      {`No results for ${searchItem} in Delivery. Please try something else.`}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* for drawer of product details */}
            {hasData && (
              <DetailDrawer
                openDetailDrawer={openDetailDrawer}
                setOpenDetailDrawer={setOpenDetailDrawer}
                selectedProduct={selectedProduct}
                handleAddProductResturant={
                  handleAddProductResturant
                }
                decreaseProduct={decreaseProduct}
                addIncreaseProduct={addIncreaseProduct}
                setNote={setNote}
                note={note}
                setSelectedVariantProduct={
                  setSelectedVariantProduct
                }
                loader={loader}
                qty={
                  foodProductQtyMap[
                    selectedVariantProduct?.variantId || 1
                  ]
                }
                foodProductQtyMap={foodProductQtyMap}
                setFoodProductQtyMap={
                  setFoodProductQtyMap
                }
              />
            )}

            {/* for share drawer */}
            {hasData && (
              <ShareProductPopUp
                openShareDrawer={openShareDrawer}
                setOpenShareDrawer={setOpenShareDrawer}
                shareUrl={selectedShareProdDetails?.shareUrl}
                title={selectedShareProdDetails?.title}
                selectedShareProduct={selectedShareProduct}
              />
            )}

            {isFetchingNextPage && <div>Loading more...</div>}
            {!hasNextPage && <div>No more products</div>}
          </>
        )}
        </div>
      </div>
      {/* <button onClick={() => pageSize(pageNumber + 1)}>Show More</button> */}
    </>
  );
};

export default memo(SearchResturantProduct);
