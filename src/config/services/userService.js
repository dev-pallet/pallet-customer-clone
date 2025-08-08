import axios from "axios";
import EnvConfig from "../EnvConfig";
import storageConstants from "../../constants/storageConstants";

const envConfig = EnvConfig();

const API = axios.create({ baseURL: `${envConfig.baseConfigUrl}/` });

API.interceptors.request.use(async (req) => {
  const token = await JSON.parse(localStorage.getItem(storageConstants.TOKEN));
  if (token) {
    req.headers.at = token;
  }
  return req;
});

export const getOtp = (data) =>
  API.post("auth/user/login", data, {
    headers: {
      org_id: "PALLET",
    },
  });

export const verifyOtp = (data) =>
  API.post("auth/otp/app/verify", data, {
    headers: {
      platform: "B2C",
    },
  });

export const loginWithPin = (data) =>
  API.post(`auth/user/login/pin`, data, {
    headers: {
      platform: "B2C",
    },
  });

export const createBrowseOnlyToken = (data) =>
  API.post(`auth/user/browse/token`, data);

//retail type api
export const getRetailTypeApi = (locationId) => {
  return API.get(`retail-service/branch/v1/get/details?branchId=${locationId}`);
};

export const getDomainLocation = (domain) => {
  return API.get(
    `retail-service/branch/v2/retail-branch/get?domainName=${domain}`
  );
};
