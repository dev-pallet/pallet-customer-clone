// react
import React, { memo, useEffect, useMemo, useRef, useState } from "react";

// mui components
import { Box, CircularProgress } from "@mui/material";

// custom components
import Footer from "../footer";
import CategoryCard from "./components/CategoryCard";
import Menuback from "../menuback";
import NotServiceable from "../notServiceable";

// constants
import { useSelector, useDispatch } from "react-redux";
import { colorConstant } from "../../constants/colors";

// images
import { no_image } from "../../constants/imageUrl";

// api
import {
  fetchCategories,
  fetchMainCat,
} from "../../config/services/catalogService";

// redux-reducer
import { getNearByStore } from "../../redux/reducers/locationReducer";
import { getServiceable, setStoreType } from "../../redux/reducers/miscReducer";
import Skeleton from "@mui/material/Skeleton";

// styles
import "./index.css";

// skeleton
import CategoryAndBrandListingSkeleton from "../skeleton/categoryAndBrandCardListingSkeleton";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import {
  getCachedCategories,
  setCachedCategories,
} from "../../redux/reducers/categoryReducer";

const Categories = ({ homePage = false, footer = true }) => {
  const isServiceable = useSelector(getServiceable);
  const [mainCategories, setMainCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const nearByStore = useSelector(getNearByStore);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const cachedCategories = useSelector(getCachedCategories);

  const payload = {
    sourceId: [nearByStore?.id],
    sourceLocationId: [nearByStore?.locId],
    sort: {
      creationDateSortOption: "DEFAULT",
      tagPriority: "DEFAULT",
    },
  };

  const getMainCategories = async () => {
    try {
      setLoading(true);

      if (cachedCategories?.length) {
        setMainCategory(cachedCategories);
        setLoading(false);
        return;
      }

      const res = await fetchCategories(payload);

      if (res?.data?.data?.es > 0) {
        showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      const allCategories = res?.data?.data?.data?.data[0]?.categoryData;

      const promises = allCategories?.map(async (item) => {
        const resp = await fetchMainCat(item?.categoryId);

        return resp?.data?.data?.[0];
      });

      const categoryList = await Promise.all(promises);
      setMainCategory(categoryList);

      // Cache the categories in Redux
      dispatch(setCachedCategories(categoryList));
    } catch (err) {
      showSnackbar(err?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
    getMainCategories();
  }, [nearByStore]);

  const storedRetailType = localStorage.getItem("retailType");
  useEffect(() => {
    if (storedRetailType) {
      dispatch(setStoreType(storedRetailType));
    }
  }, [storedRetailType]);

  return (
    <Box
      sx={{
        backgroundColor: colorConstant?.baseBackground,
        height: !homePage && "100vh",
        overflow: !homePage && "scroll",
      }}
      className="categories-root-div"
    >
      {/* <div>Categories</div> */}
      {!homePage && (
        <Menuback
          head={true}
          text="All Categories"
          bg={colorConstant?.baseBackground}
          wishlist={true}
        />
      )}

      {isServiceable ? (
        <Box
          className="categories-listing"
          sx={{
            paddingTop: footer === false ? "1rem" : "3.5rem",
            paddingBottom: !homePage ? "5rem" : "1rem",
          }}
        >
          {loading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              animation="wave"
              sx={{
                borderRadius: "8px",
                marginBottom: "10px",
                color: "#eef4ee",
              }}
            />
          ) : mainCategories?.length ? (
            mainCategories?.map((item, index) => (
              <CategoryCard
                key={index}
                categoryName={item?.categoryName}
                mainCategoryId={item?.mainCategoryId}
                imgUrl={item?.categoryImage || no_image}
              />
            ))
          ) : (
            <CategoryAndBrandListingSkeleton listingType={"category"} />
          )}
        </Box>
      ) : (
        <Box
          className="un-serviceable"
          sx={{
            marginTop: "7rem",
          }}
        >
          <NotServiceable />
        </Box>
      )}
      {footer && <Footer navigationVal={1} />}
    </Box>
  );
};

export default memo(Categories);
