// react
import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// mui components
import { Box } from "@mui/material";

// custom components
import CategoryCard from "../../../categories/components/CategoryCard";

// redux-reducer
import { getNearByStore } from "../../../../redux/reducers/locationReducer";

// images
import { no_image } from "../../../../constants/imageUrl";

// api
import { fetchBrands } from "../../../../config/services/catalogService";
import "./index.css";
import {
  getCachedBrands,
  setCachedBrands,
} from "../../../../redux/reducers/categoryReducer";
import Skeleton from "@mui/material/Skeleton";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";

function Brands() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const nearByStore = useSelector(getNearByStore);
  const dispatch = useDispatch();
  const cachedBrands = useSelector(getCachedBrands);
  const showSnackbar = useSnackbar();

  const getData = async () => {
    if (cachedBrands?.length) {
      // Use cached data
      setList(cachedBrands);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      if (nearByStore?.id) {
        await fetchBrands({
          page: 1,
          pageSize: 10,
          sourceId: [nearByStore?.id],
          sourceLocationId: [nearByStore?.locId],
          sort: {
            creationDateSortOption: "DEFAULT",
          },
        })
          .then((res) => {
            if (res?.data?.data?.es > 0) {
              showSnackbar(res?.data?.data?.message, "error");
              return;
            }
            if (res?.data?.status === "SUCCESS") {
              setList(res?.data?.data?.data?.data || []);
              dispatch(setCachedBrands(res?.data?.data?.data?.data));
            }
          })
          .catch((e) => {
            setList([]);
          });
      }
    } catch (e) {
      showSnackbar(e?.message || e?.response?.data?.message, "error");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [nearByStore]);

  return (
    <Box className="brands-card">
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          animation="wave"
          sx={{
            borderRadius: "8px",
            marginBottom: "10px",
            backgroundColor: "#eef4ee",
          }}
        />
      ) : (
        list?.length !== 0 &&
        list?.map((item, index) => (
          <Box key={index}>
            <CategoryCard
              brandName={item?.brandName}
              imgUrl={item?.image || no_image}
              isBrand={true}
            />
          </Box>
        ))
      )}
    </Box>
  );
}

export default memo(Brands);
