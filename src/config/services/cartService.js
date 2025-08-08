import axios from "axios";
import storageConstants from "../../constants/storageConstants";
import EnvConfig from "../EnvConfig";
import { store } from "../../redux/store";
import { API_CONSTANTS } from "../../constants/constants";
import STORE_DATA from "../../constants/storeData";
import constants from "../../constants/storageConstants";
import { getAsyncStorageData } from "../../middlewares/localStorage";
import { getNearByStore } from "../../redux/reducers/locationReducer";
import { useSelector } from "react-redux";

const envConfig = EnvConfig();
const HOST = envConfig.baseConfigUrl;
const API = axios.create({ baseURL: `${envConfig.baseConfigUrl}cart/` });

API.interceptors.request.use(async (req) => {
  const token = await JSON.parse(localStorage.getItem(constants.TOKEN));
  if (token) {
    req.headers.at = token;
  }
  return req;
});

export const createCart = async (data) => {
  const user = store.getState().user?.userData;
  const nearByStore = store.getState().location?.nearByStore;
  const shippingAddress = store.getState()?.cart?.shippingAddress;
  const sourceLocationId = nearByStore?.regionId || user?.id;
  // If sourceLocationId is not present, skip the API call
  if (!sourceLocationId) {
    return;
  }
  return await API.post(`v2/b2c/create/cart`, {
    userName: user?.name,
    userId: user?.id,
    mobileNo: user?.phoneNumber,
    updatedBy: user?.uidx,
    enableWhatsapp: true,
    locationId: user?.uidx,
    sourceId: user?.id,
    loggedInUser: user?.uidx,
    comments: "string",
    sourceType: API_CONSTANTS.sourceType,
    sourceApp: API_CONSTANTS.sourceApp,
    sourceLocationId, // Use the derived sourceLocationId
    destinationId: nearByStore?.id || STORE_DATA.id,
    destinationLocationId: nearByStore?.locId || STORE_DATA.locId,
    destinationType: "RETAIL",
    orderType: API_CONSTANTS.orderType,
    billingAddress: data?.billingAddress
      ? data?.billingAddress
      : shippingAddress || null,
    shippingAddress: data?.shippingAddress
      ? data?.shippingAddress
      : shippingAddress || null,
    cartProducts:
      store.getState()?.cart?.cartProducts?.length > 0
        ? store.getState()?.cart?.cartProducts
        : [],
    subOrderType: "DELIVERY",
    ...data,
  });
};

export const flushCart = (id) => API.post(`product/flush/${id}`);
export const flushCartRestaurant = (data) =>
  API.post(`v1/restaurant/cart/product/remove/all`, data);

export const getCartDetails = (id) =>
  API.get(`get/${id}?inventoryCheck=${API_CONSTANTS.inventoryCheck}`);
export const updateCart = (data, id) =>
  API.patch(`update/${id || data?.id}`, data);

export const increaseProductToCart = (data) =>
  API.post(`v2/b2c/add/product/quantity`, data);

export const decreaseProductFromCart = (data) =>
  API.post(`v2/b2c/decrease`, data);

export const removeProductFromCart = (data) => API.post(`v2/b2c/remove`, data);
// API.post(`product/remove/${data?.cartId}/${data?.gtin}`);
export const removeRestaurantProductFromCart = (data) =>
  API.post(`v1/restaurant/cart/product/remove`, data);

export const renewCart = (data) =>
  API.post(
    `adjust/${data?.cartId}?order-id=${data?.orderId}&inventoryCheck=${API_CONSTANTS.inventoryCheck}`
  );

export const createOrder = async (data) => {
  const token = await getAsyncStorageData(storageConstants.TOKEN);
  return axios.post(`${HOST}cart/v2/b2c/create/order`, data, {
    headers: { at: token },
  });
};

export const applyCoupon = (data) =>
  API.post(`coupon/apply?inventoryCheck=${API_CONSTANTS.inventoryCheck}`, data);

export const removeCoupon = async (id) =>
  await API.post(
    `coupon/remove/${id}?inventoryCheck=${API_CONSTANTS.inventoryCheck}`
  );

export const applyLoyality = (id, data) =>
  API.post(
    `loyalty/redeem/${id}?inventoryCheck=${API_CONSTANTS.inventoryCheck}`,
    data
  );
export const removeAssets = (data) => API.post(`v2/b2c/remove/asset`, data);
export const removeLoyality = async (id) =>
  await API.post(
    `loyalty/remove/${id}?inventoryCheck=${API_CONSTANTS.inventoryCheck}`
  );

export const applyWallet = async (data) => {
  const token = await getAsyncStorageData(constants.TOKEN);
  return axios.post(`${HOST}cart/v3/apply/wallet/balance`, data, {
    headers: { at: token },
  });
};

export const removeWallet = async (id) => {
  const token = await getAsyncStorageData(constants.TOKEN);
  return await axios.post(
    `${HOST}cart/v3/remove/wallet/balance/${id}`,
    {},
    {
      headers: { at: token },
    }
  );
};
export const applyDeliveryCharges = (data) =>
  API.post(`v2/b2c/apply/delivery/charges`, data);

// for Restaurant Create Cart Api
export const createRestaurantCart = (payload) => {
  return API.post(`/v1/restaurant/cart/create`, payload);
};

export const increaseProductToRestaurantCart = (data) =>
  API.post(`v1/restaurant/cart/add/product`, data);

export const addQuantityInProduct = (data) =>
  API.post(`v1/restaurant/cart/add/product/qty`, data);

export const getResturantCart = (cartId) => {
  return API.get(`v1/restaurant/cart/get/${cartId}`);
};

export const updateResturantCart = (payload) => {
  return API.patch(`/v1/restaurant/cart/update`, payload);
};
