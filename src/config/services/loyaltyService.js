import axios from "axios";
import storageConstants from "../../constants/storageConstants";
import EnvConfig from "../EnvConfig";
import { store } from "../../redux/store";
import { API_CONSTANTS } from "../../constants/constants";
import STORE_DATA from "../../constants/storeData";
import constants from "../../constants/storageConstants";
import { getAsyncStorageData } from "../../middlewares/localStorage";

const envConfig = EnvConfig();

const API = axios.create({ baseURL: `${envConfig.baseConfigUrl}loyalty/` });

API.interceptors.request.use(async (req) => {
  const token = await JSON.parse(localStorage.getItem(constants.TOKEN));
  if (token) {
    req.headers.at = token;
  }
  return req;
});

export const getLoyalityPoints = (data) =>
  API.post(`api/loyaltyPoints/v3/details/redeemable`, data);

export const findLoyalityPointsForCustomer = (data) => {
  return API.post(`api/transactions/loyaltyPoints/v2/customer/details`, data);
};
