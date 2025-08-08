import axios from "axios";
import EnvConfig from "../EnvConfig";
import storageConstants from "../../constants/storageConstants";

const envConfig = EnvConfig();

const API = axios.create({
  baseURL: `${envConfig.baseConfigUrl}retail-service/`,
});

API.interceptors.request.use(async (req) => {
  const token = await JSON.parse(localStorage.getItem(storageConstants.TOKEN));

  if (token) {
    req.headers.at = token;
  }
  return req;
});

export const getLocationByOrgId = (id) =>
  API.get(`branch/v1/get?retailId=${id}`);
