// react
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

// mui components
import { Avatar, Box, Modal } from "@mui/material";

// custom components
import Categories from "../categories";
import Footer from "../footer";
import Banner from "./components/Banner";
import EndFooter from "./components/EndFooter";
import HomeListingComponent from "./components/HomeListingComponent";
import Tags from "./components/Tags";
import MenuItems from "./components/MenuItems";

// icons
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import { FaLocationDot } from "react-icons/fa6";

//redux-reducer
import { useDispatch, useSelector } from "react-redux";
import {
  getCartId,
  setAppliedCoupon,
  setCartBill,
  setCartId,
  setCartProducts,
  setLoyalityPoints,
  setShippingAddress,
  setCartStatus,
  getCartStatus,
  setDeliveryType,
} from "../../redux/reducers/cartReducer";
import {
  getLatitudeFromRetailApi,
  getLongitutudeFromRetailAPi,
  getServiceabilityLocationId,
  getServiceable,
  getStoreType,
  getUserCurrentLocationServiceable,
} from "../../redux/reducers/miscReducer";
import {
  getDeliveryAddress,
  getUserData,
  setDeliveryAddress,
  setFavourites,
  setUserData,
} from "../../redux/reducers/userReducer";

//components
import NotServiceable from "../notServiceable";

//redux-reducer
import { getNearByStore } from "../../redux/reducers/locationReducer";

//services
import { fetchContent } from "../../config/services/catalogService";
import HeaderDropdown from "../custom-components/HeaderDropdown";
import Skeleton from "@mui/material/Skeleton";

// styles
import "react-alice-carousel/lib/alice-carousel.css";
import "./index.css";

// constants
import { useInView } from "react-intersection-observer";
import { colorConstant } from "../../constants/colors";
import {
  getCache,
  setCache,
  truncateText,
} from "../../constants/commonFunction";
import storageConstants from "../../constants/storageConstants";
import ExtractDataFromGzip from "../../middlewares/ExtractDataFromGzip";
import { storeData, storePlainData } from "../../middlewares/localStorage";
import Brands from "./components/Brands";

import { v4 as uuidv4 } from "uuid";
import ViewCart from "./components/viewCart";

//services
import { getCustomerfavList } from "../../config/services/customerService";
import {
  getNearestServiceableStoresBasedOnUserLocaion,
  getRegionFilter,
} from "../../config/services/serviceabilityService";
import {
  createBrowseOnlyToken,
  getRetailTypeApi,
} from "../../config/services/userService";
import { getAddressFromLatLong } from "../../constants/ConvertLatLongToAddress";
import STORE_DATA from "../../constants/storeData";
import useCurrenLocation from "../../custom hooks/useCurrenLocation";
import StoreList from "./components/storeList";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { CircularProgress } from "@mui/material";
import HorizontalCategories from "./components/HorizontalCategories";
import Header from "../header";
import { getUserPlan } from "../../redux/reducers/planReducer";
import HeaderEnd from "../header/headerEnd";
import { createCart } from "../../config/services/cartService";
import useBanners from "../../custom hooks/useBanners";
import useTagsList from "../../custom hooks/useTagList";
import { useCategoryData } from "../../custom hooks/useCategoryData";
import { useMediaQuery } from "@mui/material";
import { restaurantCreateCartApi } from "../../utils/restaurantCartApi";
import {
  getCachedContent,
  getCatchContentObject,
  setCatchContentObject,
  setCatchedContent,
} from "../../redux/reducers/categoryReducer";
import DeliveryChannel from "./components/selectDeliveryChannel/deliveryChannel";

const Home = () => {
  const isSmallScreen = useMediaQuery(
    "(min-width:390px) and (max-width:844px)"
  );
  const loc = useCurrenLocation();
  const isServiceable = useSelector(getServiceable);
  const nearByStore = useSelector(getNearByStore);
  const liveLoc = useSelector(getDeliveryAddress);
  const userPlan = useSelector(getUserPlan);
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const [apiResponseContentData, setApiResponseContentData] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isServiceableLoader, setIsServiceableLoader] = useState(true);
  const [page, setPage] = useState(0);
  const [isCarouselInView, setIsCarouselInView] = useState(true);
  const locationId = localStorage.getItem("locationId");

  const carouselRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsCarouselInView(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Adjust as needed
      }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  const isUserCurrentLocationServiceable = useSelector(
    getUserCurrentLocationServiceable
  );

  const [openStoreModal, setOpenStoreModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const retailType = useSelector(getStoreType);
  const userDataLocalStorage = localStorage.getItem("@user");
  const userData = userDataLocalStorage
    ? JSON.parse(userDataLocalStorage)
    : null;
  //hooks
  const { banners, loading: loader, setBannerId } = useBanners();
  const { tagsList, setTagId } = useTagsList();
  const {
    allCategoryDashboard,
    list,
    level1Cat,
    level2Cat,
    setCategoryId,
    refresh,
  } = useCategoryData({ fetchMenuList: true });

  const catchContentObject = useSelector(getCatchContentObject);
  const cartStatus = useSelector(getCartStatus);
  const fetchLatitudeFromRetailApi = useSelector(getLatitudeFromRetailApi);
  const fetchLongtitudeFromRetailApi = useSelector(getLongitutudeFromRetailAPi);
  useEffect(() => {
    if (localStorage.getItem("currentLocation")) {
      localStorage.removeItem("currentLocation");
    }
    if (localStorage.getItem("persist:root")) {
      localStorage.removeItem("persist:root");
    }

    if (
      userData === null ||
      userData === undefined ||
      !userData.hasOwnProperty("active")
    ) {
      handleGuestLogin();
    } else {
      getRegionData();
    }

    // fetch favourites products data
    // if (userData?.name) {
    //   fetchFavouritesProductData();
    // }
  }, []);

  useEffect(() => {
    // Only run if all data is loaded
    if (
      !apiResponseContentData?.length ||
      !banners?.length ||
      !tagsList?.length ||
      !allCategoryDashboard?.length
    ) {
      return;
    }
    //catching content api data
    const cacheKey = `content_data_${nearByStore?.id}_${nearByStore?.locId}`;

    const flattenedBanners = banners?.flat?.() || [];

    // Map through contentData and enrich BANNER type with banner info
    const enrichedContent = apiResponseContentData?.map((item) => {
      if (item?.type === "BANNER") {
        // Find matching banners
        const matchingBanners = flattenedBanners?.filter(
          (banner) => banner?.bannerId === item?.idOfData
        );
        return {
          ...item,
          banners: matchingBanners,
          loader: loader,
        };
      }

      if (item?.type === "TAGS") {
        //Find matching tags
        const matchingTags = tagsList?.filter(
          (tag) => tag?.tagIds === item?.idOfData
        );

        return {
          ...item,
          tagsVal: matchingTags,
        };
      }

      if (item?.type === "CATEGORY") {
        //Find matching categories
        // const matchingCategories = list?.filter(
        //   (cat) => cat?.idOfData
        // );
        return {
          ...item,
          categoryVal: allCategoryDashboard,
        };
      }
      return item;
    });

    // Sort by priority
    const sortedContent = [...enrichedContent].sort(
      (a, b) => a?.priority - b?.priority
    );

    setContentData(sortedContent);
    setLoading(false);

    if (sortedContent?.length) {
      dispatch(
        setCatchContentObject({
          contentData: sortedContent,
        })
      );
      //setCache(cacheKey, sortedContent);
    }
    // setContentData()
  }, [
    banners,
    tagsList,
    allCategoryDashboard,
    apiResponseContentData,
    loader,
    nearByStore?.id,
    nearByStore?.locId,
  ]);

  const getRegionData = async () => {
    const retailId = localStorage.getItem("retailId");
    //String(STORE_DATA?.id)]
    const payload = {
      sourceId: [String(retailId)],
    };
    try {
      await getRegionFilter(payload);
    } catch (err) {
      showSnackbar(err?.message || "Something went wrong", "error");
    }
  };

  const handleGuestLogin = async () => {
    const payload = {
      deviceId: uuidv4(),
    };
    try {
      const response = await createBrowseOnlyToken(payload);
      const accessToken = response?.data?.data?.at;
      storeData(storageConstants.TOKEN, accessToken);
      const extractPayload = await ExtractDataFromGzip(accessToken);
      const extractPayloadParsed = JSON.parse(extractPayload);
      dispatch(
        setUserData({
          uidx: extractPayloadParsed?.deviceId,
          nonLoggedIn: extractPayloadParsed?.nonLoggedIn,
        })
      );

      await storeData(storageConstants.STORAGE_KEY_USER_DATA, {
        uidx: extractPayloadParsed?.deviceId,
        nonLoggedIn: extractPayloadParsed?.nonLoggedIn,
      });

      getRegionData();
    } catch (err) {}
  };

  useEffect(() => {
    if (!!liveLoc) return;

    if (
      userData === null ||
      userData === undefined ||
      !userData.hasOwnProperty("active")
    ) {
      if (loc !== null) {
        const lat =
          fetchLatitudeFromRetailApi != null
            ? fetchLatitudeFromRetailApi
            : loc?.latitude;
        const long =
          fetchLongtitudeFromRetailApi != null
            ? fetchLongtitudeFromRetailApi
            : loc?.longitude;
        if (lat != null && long != null) {
          getAddressFromLatLong(lat, long).then((res) => {
            if (res) {
              dispatch(setDeliveryAddress({ ...res, ...loc }));
            }
          });
          getNearestServiceableStoresBasedOnUserLocaion({
            lat: lat,
            long: long,
          });
        }
        // getRetailTypeApi(locationId);
      }
    }
  }, [loc, fetchLatitudeFromRetailApi, fetchLongtitudeFromRetailApi]);

  // fetch favourites products data

  const fetchFavouritesProductData = async () => {
    try {
      const userId = user?.id;
      const res = await getCustomerfavList(userId);
      if (res?.data?.es === 0) {
        dispatch(setFavourites(res?.data?.data));
      } else {
        dispatch(setFavourites([]));
      }
    } catch (err) {
      dispatch(setFavourites([]));
    }
  };

  useEffect(() => {
    if (
      nearByStore ||
      (fetchLatitudeFromRetailApi !== null &&
        fetchLongtitudeFromRetailApi !== null)
    ) {
      setLoading(true);
      getContentData(1);

      //handling both grocery and restaurant cart
      if (retailType === "RESTAURANT") {
        //getResturantCartData will only call when cartStatus is CREATED
        if (cartStatus !== "CREATED") {
          getResturantCartData();
        }
      } else {
        getCartData();
      }
    }
  }, [nearByStore, fetchLatitudeFromRetailApi, fetchLongtitudeFromRetailApi]);
  const getContentData = async () => {
    if (!nearByStore?.id) {
      // setLoading(false);
      return;
    }
    //check if catch data is present not allow api to call again
    // if (cachedData) {
    //   setContentData(cachedData);
    //   setApiResponseContentData([]);
    //   setLoading(false);
    //   return;
    // }

    if (catchContentObject?.contentData?.length) {
      setContentData(catchContentObject?.contentData);
      setApiResponseContentData([]);
      setLoading(false);
      return;
    }
    const payload = {
      // page: 1,
      // pageSize: 10,
      contentSourceId: [String(nearByStore?.id)],
      contentSourceLocationId: [String(nearByStore?.locId)],
      // contentSourceId: ["RET_82"],
      // contentSourceLocationId: ["RLC_83"],
      contentPage: ["HOME"],
      contentType: ["B2C"],
    };
    try {
      const res = await fetchContent(payload);
      const response = res?.data?.data?.data?.data;
      const groupHomepageData = response?.[0]?.contentData
        ? Object.groupBy(response?.[0]?.contentData, (item) => item?.type)
        : [];
      await handleDashboardContent(groupHomepageData);
      // setContentData(response?.[0]?.contentData || []);
      setApiResponseContentData(response?.[0]?.contentData || []);
      setPage(parseInt(response?.currentPage));
      setTotalPage(parseInt(response?.totalPages));
      // setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDashboardContent = (groupHomepageData) => {
    //for banner
    const bannerContent = groupHomepageData?.BANNER;
    if (bannerContent) {
      const bannerData = bannerContent?.map((item) => item?.idOfData);
      setBannerId(bannerData);
    }

    //for tag
    const tagContent = groupHomepageData?.TAGS;
    if (tagContent) {
      const tagData = tagContent?.map((item) => item?.idOfData);
      setTagId(tagData);
    }

    //for category
    const categoryContent = groupHomepageData?.CATEGORY;
    if (categoryContent) {
      const categoryData = categoryContent?.map((item) => item?.idOfData);
      setCategoryId(categoryData);
    }
  };

  const handleCloseStoreModal = () => {
    setOpenStoreModal(false);
  };

  // to detect when the carousal is in viewport or not
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const componentRenderers = useMemo(() => {
    return {
      BANNER: (item, index, ref) => (
        <div
          key={index}
          style={{
            marginTop: index === 0 && item?.type !== "BANNER" ? "140px" : "0px",
          }}
          ref={index === 0 ? ref : null}
          className="carousel-banner"
        >
          <Banner bannerDataValue={item?.banners} />
        </div>
      ),

      CATEGORY: (item, index) => {
        // const commonStyle = {
        //   marginTop:
        //     isSmallScreen && index === 0 && item?.type !== "BANNER"
        //       ? "32px"
        //       : index === 0 && item?.type !== "BANNER"
        //       ? "140px"
        //       : "0px",
        // };
        const commonStyle = {
          marginTop: index === 0 && item?.type !== "BANNER" ? "140px" : "30px",
          marginBottom:
            index === 0 && item?.type !== "BANNER" ? "10px" : "10px",
        };

        //&& userPlan === "premium"
        if (retailType === "RESTAURANT") {
          return (
            <div key={index} style={commonStyle}>
              <HorizontalCategories
                categoryVal={item?.categoryVal}
                homePage={true}
              />
            </div>
          );
        } else {
          return (
            <div key={index} style={commonStyle}>
              <HomeListingComponent
                title="Shop By Category"
                onClick={() => navigate("/categories")}
              >
                <Categories homePage={true} footer={false} />
              </HomeListingComponent>
            </div>
          );
        }
      },

      BRANDS: (item, index) => (
        <div
          key={index}
          style={{
            marginTop: index === 0 && item?.type !== "BANNER" ? "140px" : "0px",
          }}
        >
          <HomeListingComponent title="Shop By Brands">
            <Brands bannerId={item?.idOfData} />
          </HomeListingComponent>
        </div>
      ),

      TAGS: (item, index) => (
        <div
          key={index}
          style={{
            marginTop: index === 0 && item?.type !== "BANNER" ? "140px" : "0px",
          }}
        >
          <Tags tagDataValue={item?.tagsVal} />
        </div>
      ),
    };
  }, [nearByStore, navigate]);

  const renderContent = useCallback(
    (item, index) => {
      const renderFn = componentRenderers[item?.type];
      if (renderFn) {
        return renderFn(item, index, ref);
      }
      return null;
    },
    [componentRenderers]
  );
  const user = useSelector(getUserData) || userData;
  const getCartData = async () => {
    try {
      const payload = {
        userId: user?.id,
        locationId: user?.uidx,
        loggedInUser: user?.uidx,
        sourceId: user?.id,
        // sourceLocationId: user?.organizationId,
        sourceLocationId: nearByStore?.locId,
        destinationLocationId: nearByStore?.locId,
        orderType: "B2C_ORDER",
      };
      const res = await createCart(payload);

      const result = res?.data?.data?.data;
      if (res?.data?.data?.es !== 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }

      dispatch(setCartId(result?.cartId));
      dispatch(setCartProducts(result?.cartProducts));
      dispatch(setCartStatus(result?.cartStatus));
      // const storeDataDetails = localStorage.getItem("storeDetails");
      // await storeData("cartData", {
      //   cartProducts: result?.cartProducts,
      //   storeDataDetails: storeDataDetails
      //     ? JSON.parse(storeDataDetails)
      //     : null,
      // });

      await storePlainData("cartId", result?.cartId);
      dispatch(setCartBill(result?.billing));
      dispatch(setShippingAddress(result?.shippingAddress));
      dispatch(setAppliedCoupon(result?.cartCoupon));
      dispatch(setLoyalityPoints(null));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };
  const sourceId = localStorage.getItem("retailId");
  const getResturantCartData = async () => {
    const payload = {
      cartId: cartId,
      userName: user?.name,
      userId: user?.id,
      tableNumber: "1",
      mobileNo: user?.phoneNumber,
      enableWhatsapp: true,
      createdBy: user?.uidx,
      updatedBy: user?.uidx,
      locationId: locationId,
      // sourceId: user?.organizationId,
      sourceId: sourceId,
      // licenseId: "LIC000051",
      // terminalName: "TER-01",
      orderType: "RESTAURANT_ORDER",
      subOrderType: "DELIVERY",
      sourceLocationId: locationId,
      sourceType: "RETAIL",
      channel: "B2C",
      loggedInUser: user?.uidx,
      sourceApp: "B2C",
      // destinationId: user?.organizationId,
      destinationId: sourceId,
      destinationLocationId: locationId,
      destinationType: "RETAIL",
      // sessionId: "RLC_8320250328103719",
    };

    await restaurantCreateCartApi({
      payload,
      onSuccess: (result) => {
        if (result?.data?.status === "SUCCESS") {
          showSnackbar(result?.data?.status, "success");
        }
      },
      onError: (msg) => {
        showSnackbar(msg, "error");
      },
      dispatchers: {
        setCartId: (id) => dispatch(setCartId(id)),
        setCartProducts: (products) => dispatch(setCartProducts(products)),
        setCartStatus: (products) => dispatch(setCartStatus(products)),
        setCartBill: (bill) => dispatch(setCartBill(bill)),
        setShippingAddress: (addr) => dispatch(setShippingAddress(addr)),
        setAppliedCoupon: (coupon) => dispatch(setAppliedCoupon(coupon)),
        setLoyalityPoints: (loyalty) => dispatch(setLoyalityPoints(loyalty)),
        // setDeliveryType: (deliveryType) =>
        //   dispatch(setDeliveryType(deliveryType)),
      },
    });
  };
  const dynamicColor = {
    background: retailType === "RESTAURANT" ? "black" : "#eef4ee",
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: dynamicColor?.background,
        width: "100vw",
        // marginLeft: "6px",
      }}
    >
      {/* <Backdrop
        open={loading}
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
      >
        <CircularProgress color="inherit" />
      </Backdrop> */}
      <Box className="home">
        {retailType === "RESTAURANT" && (
          <Box
            className="header-top"
            sx={{
              padding: 0,
              marginBottom: 0,
            }}
          >
            <Header />

            {/* <Box
             
              className="header-top-left"
            >
              <FaLocationDot
                style={{
                  // width: "35px",
                  height: "35px",
                }}
                color={
                  retailType === "RESTAURANT"
                    ? colorConstant?.sakuraRestroColor
                    : colorConstant?.primaryColor
                }
              />

              <HeaderDropdown
                text1={liveLoc == null ? "Select Address" : liveLoc?.city}
                text2={
                  liveLoc !== null
                    ? truncateText(
                        liveLoc?.street_address ||
                          liveLoc?.addressLine1 + liveLoc?.addressLine2,
                        50
                      )
                    : null
                }
              />
            </Box> */}

            <HeaderEnd navigationVal={0} />
          </Box>
        )}

        {/* {retailType !== "RESTAURANT" && ( */}
        <Box className="home-header">
          <Box
            className="header-top-grocery"
            sx={{ backgroundColor: "#e0e1e8" }}
          >
            <Box sx={{ display: "flex" }}>
              <FaLocationDot
                style={{
                  width: "35px",
                  height: "35px",
                }}
                color={
                  retailType === "RESTAURANT"
                    ? colorConstant?.sakuraRestroColor
                    : colorConstant?.primaryColor
                }
              />

              <HeaderDropdown
                text1={liveLoc == null ? "Select Address" : liveLoc?.city}
                text2={
                  liveLoc !== null
                    ? truncateText(
                        liveLoc?.street_address ||
                          liveLoc?.addressLine1 + liveLoc?.addressLine2,
                        50
                      )
                    : null
                }
              />
            </Box>
            {retailType !== "RESTAURANT" && (
              <Box className="header-top-right">
                <Avatar
                  src="/broken-image.jpg"
                  onClick={() => navigate("/customer-profile")}
                />
              </Box>
            )}
          </Box>
        </Box>
        <DeliveryChannel />
        {/* )} */}
        {retailType !== "RESTAURANT" && (
          <Box
            className="home-search"

            // sx={{ backgroundColor: !inView && colorConstant?.baseBackground }}
          >
            <Box
              className="wrapper-input-box"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <SearchIcon className="search-icon" />
              <input
                tabIndex={-1}
                id="search-input"
                className="search-input"
                placeholder="Search over 20,000+ products here"
                onClick={() => navigate("/search")}
                style={{ flex: 1, marginRight: "8px" }}
              />
              <FavoriteIcon
                // onClick={() => navigate("/favourites")}
                onClick={async () => {
                  if (userData?.name) {
                    await fetchFavouritesProductData();
                  } // call before navigating
                  navigate("/favourites");
                }}
                style={{ cursor: "pointer", marginLeft: "8px" }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {!isServiceableLoader ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "40vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : isServiceable ? (
        <Box
          // className="home-content"
          sx={dynamicColor}
        >
          <Box className="carousel" ref={ref}></Box>

          {loading ? (
            <Skeleton
              variant="rectangular"
              width={isSmallScreen ? "95vw" : "95vw"}
              height={isSmallScreen ? 500 : 600}
              sx={{
                borderRadius: 2,
                backgroundColor: "#a7a7b575",
                margin: "10px",
              }}
              animation="wave"
            />
          ) : (
            <>
              ){contentData?.map((item, index) => renderContent(item, index))}
            </>
          )}
        </Box>
      ) : (
        <Box className="un-serviceable">
          <NotServiceable />
        </Box>
      )}

      {/* end footer  */}
      <Box className="end-footer">
        <EndFooter />
      </Box>
      <Footer navigationVal={0} />
      <ViewCart />
      <Modal
        open={openStoreModal}
        onClose={handleCloseStoreModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StoreList handleCloseStoreModal={handleCloseStoreModal} />
      </Modal>
      {/* <MenuItems navigationVal={0} /> */}
    </Box>
  );
};

export default memo(Home, (prev, next) => prev?.index === next?.index);
