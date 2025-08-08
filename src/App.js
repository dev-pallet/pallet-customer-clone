import axios from "axios";
import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
// custom components
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import storageConstants from "../src/constants/storageConstants";
import PaymentMethods from "./Payment/PaymentMethods/PaymentMethods";
import { paymentRoutesConstant } from "./Payment/RouteConstants";
import AddCardForm from "./Payment/component/Card/AddCardForm";
import NetBankingList from "./Payment/component/Netbanking/NetBankingList";
import AddUpi from "./Payment/component/UPI/AddUpi";
import FavouritesListing from "./components/Favourites";
import AboutUs from "./components/aboutus";
import ActivityScreen from "./components/activityScreen";
import AddressBook from "./components/addressbook";
import AddAddress from "./components/addressbook/components/AddAddress";
import MapView from "./components/addressbook/components/mapview";
import Cart from "./components/cart";
import OrderProcessing from "./components/cart/components/orderProcessing";
import OrderSuccess from "./components/cart/components/orderSuccess";
import Categories from "./components/categories";
import CategoryItemsListing from "./components/categories/components/CategoryItemsListing";
import Coupons from "./components/coupons";
import CustomerProfile from "./components/customerPrfile";
import EditProfile from "./components/editprofile";
import FAQ from "./components/faq's";
import Home from "./components/home";
import AllProductListing from "./components/home/components/AllProductListing";
import BrandItemsList from "./components/home/components/Brands/components/BrandItemsListing";
import TagItemsListing from "./components/home/components/Tags/components/TagItemsListing";
import LoginPage from "./components/login";
import LoyaltyPoints from "./components/loyaltypoints";
import MyOrders from "./components/myorders";
import Notifications from "./components/notifications";
import OrderDetails from "./components/orderDetails";
import OrderTrack from "./components/orderTrack";
import OtpPage from "./components/otp";
import PrivacyPolicy from "./components/privacypolicy";
import ProductDetails from "./components/productDetails";
import RegisterPage from "./components/register";
import Search from "./components/search";
import SearchResturantProducts from "./components/searchResturantProducts";
import Settings from "./components/settings/index";
import Support from "./components/support";
import TermsOfUse from "./components/termsofuse";
import EnvConfig from "./config/EnvConfig";
import {
  createBrowseOnlyToken,
  getDomainLocation,
  getRetailTypeApi,
} from "./config/services/userService";
import { useSnackbar } from "./custom hooks/SnackbarProvider";
import ExtractDataFromGzip from "./middlewares/ExtractDataFromGzip";
import { storeData } from "./middlewares/localStorage";
import {
  setLatitudeFromRetailApi,
  setLongitudeFromRetailApi,
  setStoreType,
} from "./redux/reducers/miscReducer";
import {
  getOrganisationId,
  setOrgId,
  setUserData,
  setLocationId,
} from "./redux/reducers/userReducer";
import { setNearByStore } from "./redux/reducers/locationReducer";
import { getNearestServiceableStores } from "./config/services/serviceabilityService";
import LocationList from "./components/home/components/selectDeliveryChannel/locationList";
// Custom ProtectedRoute Component
const ProtectedRoute = ({ element }) => {
  const isTokenExist = JSON.parse(localStorage.getItem(storageConstants.TOKEN));
  return isTokenExist ? element : <Navigate to="/login" />;
};

const WalletPage = lazy(() => import("./components/wallet-menu"));
// const CustomerProfile = lazy(() => import("./components/customerPrfile"));

export default function App() {
  const envConfig = EnvConfig();
  const showSnackbar = useSnackbar();
  const API = axios.create({ baseURL: `${envConfig.baseConfigUrl}/` });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isTokenExist = JSON.parse(localStorage.getItem(storageConstants.TOKEN));
  const [branchInfo, setBranchInfo] = useState(null);
  const organisationId = useSelector(getOrganisationId);
  const [retailTypeFromApi, setRetailTypeFromApi] = useState("");
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
      navigate("/home");
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };
  const handleDomainLocationApi = async () => {
    const domain = "stage-restaurant.palletnow.co";
    // const domain = "stage-grocery.palletnow.co";
    // const domain = window.location.hostname;
    console.log({ domain });

    const response = await getDomainLocation(domain);
    if (response?.data?.es > 0) {
      showSnackbar(response?.data?.message, "error");
    }
    const result = await response?.data;
    if (result?.statusCode === 200 && result?.data) {
      setBranchInfo(result?.data);
      localStorage.setItem("retailId", result?.data?.retailId);
      dispatch(setOrgId(result?.data?.retailId));
      dispatch(setLocationId(result?.data?.branchId));
    }
    return result?.data?.branchId;
  };

  const fetchRetailType = async (branchId) => {
    // if (!branchId) {
    //   showSnackbar(
    //     "branchId is null or undefined, skipping getRetailTypeApi",
    //     "error"
    //   );
    //   return;
    // }
    const retailRes = await getRetailTypeApi(branchId);
    const branchVal = await retailRes?.data?.branch?.branchType;
    const branchType = branchVal;

    //fetch store lat and long --> for instant api
    const address = await retailRes?.data?.branch?.addresses?.[0];
    const latitude = address?.latitude;
    const longitude = address?.longitude;

    const locationVal = await retailRes?.data?.branch?.branchId;
    const locId = locationVal;

    localStorage.setItem("retailType", branchType);
    localStorage.setItem("locationId", locId);

    dispatch(setStoreType(branchType));
    dispatch(setLatitudeFromRetailApi(latitude));
    dispatch(setLongitudeFromRetailApi(longitude));

    // const addressList = await retailRes?.data?.branch?.addresses;
    // const firstAddressWithCoordinates = addressList?.find(
    //   (item) => item?.latitude != null && item?.longitude != null
    // );

    // if (firstAddressWithCoordinates !== null) {
    //   const latitude = firstAddressWithCoordinates.latitude;
    //   const longitude = firstAddressWithCoordinates.longitude;

    //   await getNearestServiceableStores({
    //     lat: latitude,
    //     long: longitude,
    //   });

    //   dispatch(setLatitudeFromRetailApi(latitude));
    //   dispatch(setLongitudeFromRetailApi(longitude));
    // }
  };

  useEffect(() => {
    const token = localStorage.getItem(storageConstants?.TOKEN);
    const user = localStorage.getItem(storageConstants?.STORAGE_KEY_USER_DATA);

    if (!token || !user) {
      // No user session -> perform guest login
      handleGuestLogin()
        .then(() => handleDomainLocationApi())
        .then((branchId) => fetchRetailType(branchId))
        .catch((err) => {
          showSnackbar(err?.message || "An error occurred", "error");
        });
    } else {
      // User is already logged in -> skip guest login
      handleDomainLocationApi()
        .then((branchId) => fetchRetailType(branchId))
        .catch((err) => {
          showSnackbar(err?.message || "An error occurred", "error");
        });
    }
  }, []);

  useEffect(() => {
    if (retailTypeFromApi) {
      fetchRetailType();
    }
  }, [retailTypeFromApi]);

  useEffect(() => {
    if (!isTokenExist) {
      navigate("/login");
    }
    if (localStorage.getItem("persist:root")) {
      localStorage.removeItem("persist:root");
    }
  }, [isTokenExist]);

  return (
    <>
      <Routes>
        {/* Routes for non-authenticated users */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp/:mobile" element={<OtpPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes for authenticated users */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="*" element={<ProtectedRoute element={<Home />} />} />
        <Route
          path="/activity-screen"
          element={<ProtectedRoute element={<ActivityScreen />} />}
        />
        <Route
          path="/categories"
          element={<ProtectedRoute element={<Categories />} />}
        />
        <Route
          path="/wallet"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <ProtectedRoute element={<WalletPage />} />
            </Suspense>
          }
          // element={<ProtectedRoute element={<WalletMenu />}
        />
        <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        <Route
          path="/cart/order-processing/:orderId"
          element={<ProtectedRoute element={<OrderProcessing />} />}
        />
        <Route
          path="/order-success"
          element={<ProtectedRoute element={<OrderSuccess />} />}
        />
        <Route
          path="/customer-profile"
          element={<ProtectedRoute element={<CustomerProfile />} />}
        />
        <Route
          path="/myorders"
          element={<ProtectedRoute element={<MyOrders />} />}
        />
        <Route
          path="/order-details/:orderId"
          element={<ProtectedRoute element={<OrderDetails />} />}
        />
        <Route
          path="/order-details/track/:orderId"
          element={<ProtectedRoute element={<OrderTrack />} />}
        />
        <Route
          path="/settings"
          element={<ProtectedRoute element={<Settings />} />}
        />
        <Route
          path="/settings/notifications"
          element={<ProtectedRoute element={<Notifications />} />}
        />
        <Route
          path="/settings/edit-profile"
          element={<ProtectedRoute element={<EditProfile />} />}
        />
        <Route
          path="/aboutus"
          element={<ProtectedRoute element={<AboutUs />} />}
        />
        <Route
          path="/aboutus/privacypolicy"
          element={<ProtectedRoute element={<PrivacyPolicy />} />}
        />
        <Route
          path="/aboutus/termsofuse"
          element={<ProtectedRoute element={<TermsOfUse />} />}
        />
        <Route path="/faq" element={<ProtectedRoute element={<FAQ />} />} />
        <Route
          path="/mapview"
          element={<ProtectedRoute element={<MapView />} />}
        />
        <Route
          path="/loyalty-points"
          element={<ProtectedRoute element={<LoyaltyPoints />} />}
        />
        <Route
          path="/coupons"
          element={<ProtectedRoute element={<Coupons />} />}
        />
        <Route
          path="/support"
          element={<ProtectedRoute element={<Support />} />}
        />
        <Route
          path="/address-book"
          element={<ProtectedRoute element={<AddressBook />} />}
        />
        <Route
          path="/address-book/add-or-edit"
          element={<ProtectedRoute element={<AddAddress />} />}
        />
        <Route
          path="/location-list"
          element={<ProtectedRoute element={<LocationList />} />}
        />
        <Route
          path="/product-details/:gtin"
          element={<ProtectedRoute element={<ProductDetails />} />}
        />
        <Route
          path="/product-listing/tags/:tagName"
          element={<ProtectedRoute element={<TagItemsListing />} />}
        />
        <Route
          path="/product-listing/brand/:brandName"
          element={<ProtectedRoute element={<BrandItemsList />} />}
        />
        <Route
          path="/product-listing/category/:mainCategoryId"
          element={<ProtectedRoute element={<CategoryItemsListing />} />}
        />
        <Route
          path="/search"
          element={<ProtectedRoute element={<Search />} />}
        />
        <Route
          path="/favourites"
          element={<ProtectedRoute element={<FavouritesListing />} />}
        />
        <Route
          path="/allProducts/:categoryName"
          element={<ProtectedRoute element={<AllProductListing />} />}
        />
        <Route
          path="/allMenu/:categoryName/*"
          element={
            <ProtectedRoute
              element={<SearchResturantProducts isRestroProductPage={true} />}
            />
          }
        />
        {/* Payment Routes*/}
        <Route
          path={paymentRoutesConstant.DEFAULT}
          element={<ProtectedRoute element={<PaymentMethods />} />}
        />
        <Route
          path={paymentRoutesConstant.ADD_CARD}
          element={<ProtectedRoute element={<AddCardForm />} />}
        />
        <Route
          path={paymentRoutesConstant.NETBANKING}
          element={<ProtectedRoute element={<NetBankingList />} />}
        />
        <Route
          path={paymentRoutesConstant.ADD_UPI}
          element={<ProtectedRoute element={<AddUpi />} />}
        />
      </Routes>
    </>
  );
}
