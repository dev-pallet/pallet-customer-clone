import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNearByStore } from "../redux/reducers/locationReducer";
import {
  getCachedCategories,
  setCachedCategories,
  setCachedMenuList,
  getCachedMenuList,
} from "../redux/reducers/categoryReducer";
import { useSnackbar } from "./SnackbarProvider";
import {
  fetchAllCategories,
  fetchAllMenus,
  fetchCategories,
  fetchCategoryLevel1Cat,
  fetchLevel1Cat,
  fetchMainCat,
} from "../config/services/catalogService";
import Cookies from "js-cookie";
//  making hook flexible for different pages that require different data fetching behavior.
export const useCategoryData = ({
  fetchMenuList = false,
  fetchMenuData = false,
} = {}) => {
  const [loading, setLoading] = useState(false);
  const [allCategoryDashboard, setAllCategoryDashboard] = useState([]);
  const [list, setList] = useState([]);
  const [level1Cat, setLevel1Cat] = useState([]);
  const [level2Cat, setLevel2Cat] = useState({});
  const [error, setError] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  //for menulisting modal
  const [loadingMenuList, setLoadingMenuList] = useState(false);
  const [menuList, setMenuList] = useState([]);
  const [menuListLevel1Cat, setMenuListLevel1Cat] = useState([]);

  const nearByStore = useSelector(getNearByStore);
  const cachedCategories = useSelector(getCachedCategories);
  const cachedMenuList = useSelector(getCachedMenuList);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    // if (fetchMenuList) getMenuList();
    if (
      fetchMenuList &&
      nearByStore?.id &&
      nearByStore?.locId &&
      categoryId !== null
    ) {
      getMenuList();
    }
    // if (fetchMenuData) getMenuData();
    if (fetchMenuData && nearByStore?.id && nearByStore?.locId) {
      getMenuData();
    }
  }, [
    fetchMenuList,
    fetchMenuData,
    nearByStore?.id,
    nearByStore?.locId,
    categoryId,
  ]);

  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

  // const getCache = (key) => {
  //   const cached = localStorage.getItem(key);

  //   if (!cached) return null;
  //   try {
  //     const { data, timestamp } = JSON.parse(cached);
  //     if (Date.now() - timestamp < CACHE_TTL) {
  //       return data;
  //     }

  //     localStorage.removeItem(key);
  //     return null;
  //   } catch {
  //     localStorage.removeItem(key);
  //     return null;
  //   }
  // };

  // const setCache = (key, data) => {
  //   localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  // };

  // function setCacheCategory(key, value) {
  //   Cookies.set(key, JSON.stringify(value), { path: "/" });
  // }

  // // Get cache from cookies
  // function getCacheCategory(key) {
  //   const value = Cookies.get(key);
  //   return value ? JSON.parse(value) : null;
  // }

  const getMenuList = async () => {
    if (!nearByStore?.id || !nearByStore?.locId || categoryId === null) return;
    try {
      setLoading(true);

      //catching categories from redux store
      if (cachedCategories?.length) {
        setAllCategoryDashboard(allCategories);
        setLevel1Cat(allLevel1);
        return;
      }

      const payload = {
        sourceId: [nearByStore?.id],
        sourceLocationId: [nearByStore?.locId],
        categoryViewId: categoryId,
        sort: {
          creationDateSortOption: "DEFAULT",
          tagPriority: "DEFAULT",
        },
      };

      const response = await fetchCategories(payload);

      if (response?.data?.data?.es > 0) {
        showSnackbar(response?.data?.data?.message, "error");
        return;
      }

      if (response?.data?.status !== "SUCCESS") {
        setLoading(false);
        return;
      }

      const allCategories =
        response?.data?.data?.data?.data?.[0]?.categoryData || [];
      //actual data from hyper local
      let allLevel1 = [];
      let level2Map = {};

      // const menuData = await Promise.all(
      //   allCategories.map(async (item) => {
      //     const res = await fetchMainCat(item?.categoryId);
      //     const level1Entities = res?.data?.data?.[0]?.level1Entities || [];
      //     allLevel1 = [...allLevel1, ...level1Entities];
      //     // const enrichedLevel1 = await Promise.all(
      //     //   level1Entities.map(async (lvl1) => {
      //     //     const lvl1Res = await fetchCategoryLevel1Cat(lvl1?.level1Id);
      //     //     const subcategories =
      //     //       lvl1Res?.data?.data?.[0]?.level2Entities || [];

      //     //     level2Map[lvl1?.level1Id] = subcategories;

      //     //     return {
      //     //       ...lvl1,
      //     //       level2Entities: subcategories,
      //     //     };
      //     //   })
      //     // );

      //     // return {
      //     //   ...item,
      //     //   level1Entities: enrichedLevel1,
      //     // };
      //   })
      // );
      setAllCategoryDashboard(allCategories);
      setLevel1Cat(allLevel1);
      // setLevel2Cat(level2Map);
      // setList(menuData);

      // setCacheCategory(cacheKey, { allCategories, allLevel1 });
      dispatch(setCachedCategories({ allCategories, allLevel1 }));
    } catch (err) {
      setError(err?.message);
      showSnackbar(err?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getMenuData = async () => {
    try {
      setLoadingMenuList(true);

      // const cacheKey = `menus_${nearByStore?.id}_${nearByStore?.locId}`;
      // const cachedData = getCache(cacheKey);

      //catching menulist from redux store
      if (cachedMenuList?.length) {
        setMenuList(allCategories);
        setLoadingMenuList(false);
        return;
      }
      const payload = {
        page: 1,
        pageSize: 50,
        sortByUpdatedDate: "DESCENDING",
        sourceId: [nearByStore?.id],
        sourceLocationId: [nearByStore?.locId],
        type: ["APP"],
      };

      // const response = await fetchAllCategories(payload);
      const response = await fetchAllMenus(payload);

      if (response?.data?.data?.es > 0) {
        showSnackbar(response?.data?.data?.message, "error");
        return;
      }

      const allCategories = response?.data?.data?.results || [];

      setMenuList(allCategories);

      // const results = await Promise.all(
      //   allCategories?.map(async (item) => {
      //     const res = await fetchLevel1Cat({
      //       mainCategoryId: [item?.mainCategoryId],
      //     });

      //     if (res?.data?.status === "SUCCESS") {
      //       return res?.data?.data?.results || [];
      //     } else {
      //       return [];
      //     }
      //   })
      // );
      // const allLevel1Cats = results?.flat();
      // setMenuListLevel1Cat(allLevel1Cats);
      // setCache(cacheKey, { menuList: allCategories });
      dispatch(setCachedMenuList({ allCategories }));
    } catch (err) {
      showSnackbar(err?.message, "error");
    } finally {
      setLoadingMenuList(false);
    }
  };

  return {
    loading,
    allCategoryDashboard,
    list,
    level1Cat,
    // level2Cat,
    error,
    setCategoryId,
    refresh: getMenuList, // calling refresh manually in components

    // expose menu modal-related states too
    loadingMenuList,
    menuList,
    menuListLevel1Cat,
    refreshList: getMenuData,
  };
};
