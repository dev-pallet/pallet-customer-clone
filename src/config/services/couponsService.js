import axios from "axios";
import storageConstants from "../../constants/storageConstants";
import EnvConfig from "../EnvConfig";
import { store } from "../../redux/store";

const envConfig = EnvConfig();

const API = axios.create({ baseURL: `${envConfig.baseConfigUrl}coupon/` });

API.interceptors.request.use(async (req) => {
    const token = await JSON.parse(localStorage.getItem(storageConstants.TOKEN));
    if (token) {
      req.headers.at = token;
    }
    return req;
  });
  

export const getCoupons = (data) =>
  API.post(`api/v1/display/coupon?pageNo=1&limit=10`, data);