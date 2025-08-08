import axios from "axios";
import storageConstants from "../../constants/storageConstants";
import EnvConfig from "../EnvConfig";

const envConfig = EnvConfig();

const API = axios.create({ baseURL: `${envConfig.baseConfigUrl}b2c/` });

API.interceptors.request.use(async (req) => {
  const token = await JSON.parse(localStorage.getItem(storageConstants.TOKEN));
  if (token) {
    req.headers.at = token;
  }
  return req;
});

export const createCustomer = (data) => API.post(`customer/v1/create`, data);
export const updateCustomer = (data) => API.post(`customer/v1/update`, data);
export const deleteCustomer = (data) => API.post(`customer/v1/delete`, data);

export const checkCustomer = (data) =>
  API.get(
    `customer/v2/get/phone?phoneNumber=${data?.mobile}&organizationId=${data?.orgId}`
  );

export const getCustomerDetails = (id) =>
  API.get(`customer/v1/get?customerId=${id}`);

export const getAllAddress = (id) =>
  API.get(`address/v1/customer?customerId=${id}`);

export const addAddress = (data) => API.post(`address/v1/create`, data);

export const updateAddress = (data) => API.post(`address/v1/update`, data);

export const deleteAddress = (data) => API.post(`address/v1/delete`, data);

// Wallet Serivce
export const fetchWallet = async (id) =>
  await API.get(`wallet/v1/customer/${id}`);

export const fetchWalletDataAndTransaction = (id) =>
  API.get(`wallet/v1/customer/details/${id}`);

export const getRedeemableWalletAmount = (data) =>
  API.post(`wallet/transaction/v1/amount`, data);

//Favourited
export const getCustomerfavList = (id) =>
  API.get(`wishlist/v1/customer?customerId=${id}`);
export const addToFav = (data) => API.post(`wishlist/v1/create`, data);
export const removeFav = (data) => API.post(`wishlist/v1/delete`, data);
