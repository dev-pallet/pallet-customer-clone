import axios from "axios";
import storageConstants from "../../constants/storageConstants";
import EnvConfig from "../EnvConfig";
import { store } from "../../redux/store";

const envConfig = EnvConfig();

const API = axios.create({ baseURL: `${envConfig.baseConfigUrl}catalog/` });

API.interceptors.request.use(async (req) => {
  const token = await JSON.parse(localStorage.getItem(storageConstants.TOKEN));
  if (token) {
    req.headers.at = token;
  }
  return req;
});

const storeDetails = JSON.parse(localStorage.getItem("storeDetails"));
// app/product/filter
export const getFilterProducts = (data) =>
  API.post("product/v2/filter/product", {
    // supportedStore: [
    //   storeDetails?.locId ||
    //     String(store.getState().location?.nearByStore?.locId),
    // ],
    // storeLocationId:
    //   storeDetails?.locId ||
    //   String(store.getState().location?.nearByStore?.locId?.toLowerCase()),
    storeLocations: [
      String(store.getState().location?.nearByStore?.locId) ||
        storeDetails?.locId,
    ],
    // productStatus: ["CREATED"],
    // displayApp: true,
    // inventoryCheck: true,
    // checkInventory: true,
    // displayWithoutInventoryProducts: true,
    ...data,
  });

export const getSearchProducts = (data) =>
  API.post(`suggest/filter/product`, {
    ...data,
    supportedStore: [String(store.getState().location?.nearByStore?.locId)],
    productStatuses: ["CREATED"],
  });
export const fetchCategories = async (data) =>
  await API.post("category/view/filter", data);

//for level1 category restaurant
export const fetchAllCategories = async (data) =>
  await API.post("category/main/filter", data);

//for menuList
export const fetchAllMenus = async (data) => {
  return await API.post("category/main/filterV2", data);
};

//for level2 category restaurant
export const fetchAllLevel1 = async (data) =>
  await API.post("category/level1/filterV2", data);

// export const getManufactureres=({data,params,...props})=>API.
export const fetchMainCat = (id) => API.post(`category/main/ids?ids=${id}`);

export const fetchCategoryLevel1Cat = (id) =>
  API.post(`category/level1/ids?ids=${id}`);
export const fetchLevel1Cat = (data) =>
  API.post(`category/level1/filter`, data);
export const fetchLevel2Cat = ({ id }) => API.get(`category/level2/${id}`);

export const fetchTags = (data) => API.post(`tag/filter`, data);
export const fetchBanners = (data) => API.post(`banner/filter`, data);
export const fetchBrands = (data) => API.post(`brand/store/filter`, data);

export const fetchContent = (data) => API.post(`content/filter`, data);
