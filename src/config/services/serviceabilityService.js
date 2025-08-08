import axios from "axios";
import storageConstants from "../../constants/storageConstants";
import EnvConfig from "../EnvConfig";
import STORE_DATA from "../../constants/storeData";
import {
  setNearByStore,
  setStoresList,
  setSelectedLongLat,
  setUserSelectedLocation,
} from "../../redux/reducers/locationReducer";
import { store } from "../../redux/store";
import {
  getServiceabilityLocationId,
  setServiceabilityLocationId,
  setServiceable,
  setUserCurrentLocationServiceable,
} from "../../redux/reducers/miscReducer";

const envConfig = EnvConfig();

const API = axios.create({
  baseURL: `${envConfig.baseConfigUrl}serviceability/`,
});

API.interceptors.request.use(async (req) => {
  const token = await JSON.parse(localStorage.getItem(storageConstants.TOKEN));
  if (token) {
    req.headers.at = token;
  }
  return req;
});

export const getDeliverySlots = (id) => API.post(`slot/retrieve/${id}`);

export const getInstantSlots = (data) => {
  const nearByStore = store.getState()?.location?.nearByStore;
  const check = store.getState()?.location?.coords;

  const address =
    store.getState()?.cart?.shippingAddress ||
    store.getState()?.user?.deliveryAddress;

  const addressVal = store.getState()?.location;

  const storeLat = store.getState()?.misc?.longitudeFromRetailApi;
  const storeLong = store.getState()?.misc?.latitudeFromRetailApi;

  const userFetchedLocation = store.getState().location.userSelectedLocation;
  const userLat = userFetchedLocation?.latitude;
  const userLong = userFetchedLocation?.longitude;

  const addressFromInitialLatitude = address?.latitude
    ? address?.latitude
    : check.latitude;

  const addressFromInitialLongitutde = address?.longitude
    ? address?.longitude
    : check.longitude;

  return API.post(
    `locations/map/calculate/time/travel/${data?.id}?lat1=${storeLong}&lon1=${storeLat}&lat2=${userLat}&lon2=${userLong}`
  );
};

export const fetchDeliveryCharges = (data) =>
  API.post(`locations/delivery/charge/calculate`, data);

export const getExpectedDelivery = (data) =>
  API.get(`api/get-promise?SourceId=${data?.locId}&PinCode=${data?.id}`);

export const getNearestServiceableStores = async (data) => {
  const retailId = localStorage.getItem("retailId"); //org id, yeh bhejna ha
  let serviceable = false;
  let newObj = {};
  // Check if latitude and longitude are defined
  if (!data?.lat || !data?.long) {
    store.dispatch(setServiceable(false));
    return serviceable;
  }
  store.dispatch(
    setUserSelectedLocation({
      latitude: data?.lat,
      longitude: data?.long,
    })
  );

  //STORE_DATA?.id
  try {
    await API.get(
      `locations/user/fetch/stores?userLat=${data?.lat}&userLon=${data?.long}&orgId=${retailId}&limit=10`
    ).then((res) => {
      if (res?.data?.status === "SUCCESS") {
        if (res?.data?.data?.length > 0) {
          const temp = res?.data?.data?.[0];
          store.dispatch(
            setNearByStore({
              id: temp?.sourceId,
              locId: temp?.sourceLocationId,
              regionId: temp?.regionId,
              sourceLocationId: temp?.sourceLocationId,
            })
          );
          store.dispatch(
            setSelectedLongLat({
              latitude: temp?.latitude,
              longitude: temp?.longitude,
            })
          );
          newObj.serviceable = true;
          store.dispatch(setServiceable(true));
          newObj.response = temp;
        } else {
          newObj.serviceable = false;
          store.dispatch(setServiceable(false));
        }
      } else {
        newObj.serviceable = false;
        store.dispatch(setServiceable(false));
      }
    });
  } catch (e) {
    newObj.serviceable = false;
    store.dispatch(setServiceable(false));
  }

  return newObj;
};

export const getNearestServiceableStoresBasedOnUserLocaion = async (data) => {
  const retailId = localStorage.getItem("retailId");
  try {
    await API.get(
      `locations/user/fetch/stores?userLat=${data?.lat}&userLon=${data?.long}&orgId=${retailId}&limit=10`
    ).then((res) => {
      const locId = res?.data?.data?.[0]?.sourceLocationId;
      localStorage.setItem("locationId", locId);
      store.dispatch(setServiceabilityLocationId(locId));

      if (res?.data?.status === "SUCCESS") {
        if (res?.data?.data?.length > 0) {
          store.dispatch(getServiceabilityLocationId(locId));
          store.dispatch(setUserCurrentLocationServiceable(true));
        } else {
          store.dispatch(setUserCurrentLocationServiceable(false));
        }
      } else {
        store.dispatch(setUserCurrentLocationServiceable(false));
      }
    });
  } catch (e) {
    store.dispatch(setUserCurrentLocationServiceable(false));
  }
};

export const getRegionFilter = async (data) => {
  try {
    await API.post(`region/filter?page=1&pageSize=20`, data).then((res) => {
      if (res?.data?.status === "SUCCESS") {
        if (res?.data?.data?.results?.length > 0) {
          const storeList = res?.data?.data?.results;
          const uniqueData = storeList.filter(
            (obj, index, self) =>
              index ===
              self.findIndex((t) => t.sourceLocationId === obj.sourceLocationId)
          );
          store.dispatch(setStoresList(uniqueData));
        } else {
          store.dispatch(setServiceable(false));
        }
      } else {
        store.dispatch(setServiceable(false));
      }
    });
  } catch (e) {
    store.dispatch(setServiceable(false));
  }
};
