import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "./SnackbarProvider";
import {
  getCachedBanner,
  setCachedBanner,
} from "../redux/reducers/categoryReducer";
import { fetchBanners } from "../config/services/catalogService";
import { getNearByStore } from "../redux/reducers/locationReducer";
import moment from "moment";
import Cookies from "js-cookie";

const useBanners = () => {
  const [loading, setLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [bannerId, setBannerId] = useState(null);
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const nearByStore = useSelector(getNearByStore);
  const cachedBanners = useSelector(getCachedBanner);

  const CACHE_TTL = 1 * 60 * 1000; // 30 minutes in milliseconds

  //LocalStorage based cache functions
  // const getCache = (key) => {
  //   const cached = localStorage.getItem(key);

  //   if (!cached) return null;
  //   try {
  //     const { data, timestamp } = JSON.parse(cached);
  //     // if (Date.now() - timestamp < CACHE_TTL) {
  //     //   return data;
  //     // }

  //     const now = moment();
  //     const cacheTime = moment(timestamp);

  //     if (now.diff(cacheTime, "minutes") < 1) {
  //       return data;
  //     }
  //     localStorage.removeItem(key);
  //     return null;
  //   } catch {
  //     localStorage.removeItem(key);
  //     return null;
  //   }
  // };

  //set catch data
  // const setCache = (key, data) => {
  //   localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  // };

  useEffect(() => {
    if (bannerId?.length) {
      getBanners();
    }
  }, [bannerId]);

  const getBanners = async () => {
    if (!nearByStore?.id || !nearByStore?.locId) {
      setLoading(false);
      return;
    }

    const bannerKey = bannerId?.sort().join(",");
    if (cachedBanners?.[bannerKey]?.length) {
      setBanners(cachedBanners?.[bannerKey]);
      setLoading(false);
      return;
    }

    // if (cachedBanners) {
    //   setBanners(cachedBanners);
    //   setLoading(true);
    //   return;
    // }
    try {
      const res = await fetchBanners({
        page: 1,
        pageSize: 10,
        bannerId: bannerId,
        sourceId: [String(nearByStore?.id)],
        sourceLocationId: [String(nearByStore?.locId)],
        sort: {
          creationDateSortOption: "DEFAULT",
          tagPriority: "DEFAULT",
        },
      });
      if (res?.data?.status === "SUCCESS") {
        const temp = res?.data?.data?.data?.data || [];
        const data = temp?.map(
          (item) =>
            item?.bannerImage?.map((image) => ({
              id: image?.id,
              image: image?.image,
              clickableUrl: image?.clickableUrl,
              bannerId: item?.bannerId,
            })) || []
        );
        setBanners(data);
        dispatch(setCachedBanner({ [bannerKey]: data }));
      } else {
        showSnackbar("Unable to fetch Banner", "error");
      }
    } catch (e) {
      showSnackbar(e?.message || e?.response?.data?.message, "error");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { banners, loading, setBannerId };
};

export default useBanners;
