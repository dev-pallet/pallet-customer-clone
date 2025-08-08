import { Box } from "@mui/material";
import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBanners } from "../../../../config/services/catalogService";
import { no_image } from "../../../../constants/imageUrl";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";
import Carousal from "../../../custom-components/Carousal";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { message } from "../../../../constants/statisData";
import {
  getCachedBanner,
  setCachedBanner,
} from "../../../../redux/reducers/categoryReducer";
import Skeleton from "@mui/material/Skeleton";
import handleBannerNavigation from "../../../linkingUrl/deepLinking";
import { useNavigate } from "react-router-dom";
import { setStoreType } from "../../../../redux/reducers/miscReducer";

function Banner({
  bannersData,
  isDetailsPage = false,
  bannerDataValue,
  loadingVal,
}) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const nearByStore = useSelector(getNearByStore);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const cachedBanners = useSelector(getCachedBanner);
  const navigate = useNavigate();

  useEffect(() => {
    if (bannerDataValue) {
      setLoading(false);
    }
  }, [bannerDataValue]);

  const defaultImage = [
    <div
      style={{
        width: "100%",
        height: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        src={no_image}
        style={{
          width: "100%",
          height: "100%",
        }}
        role="presentation"
      />
    </div>,
  ];

  // const getBanners = () => {
  //   setLoading(true);

  //   if (!nearByStore?.id || !nearByStore?.locId) {
  //     return;
  //   }
  //   // Check if cached data exists

  //   if (cachedBanners?.[bannersData]?.length) {
  //     setBanners(cachedBanners?.[bannersData]);
  //     setLoading(false);
  //     return;
  //   }

  //   fetchBanners({
  //     page: 1,
  //     pageSize: 10,
  //     bannerId: [bannersData],
  //     sourceId: [String(nearByStore?.id)],
  //     sourceLocationId: [String(nearByStore?.locId)],
  //     sort: {
  //       creationDateSortOption: "DEFAULT",
  //       tagPriority: "DEFAULT",
  //     },
  //   })
  //     .then((res) => {
  //       if (res?.data?.status === "SUCCESS") {
  //         const temp = res?.data?.data?.data?.data || [];

  //         const bannerImgList =
  //           temp?.[0]?.bannerImage?.map((item) => ({
  //             id: item?.id,
  //             image: item?.image,
  //             clickableUrl: item?.clickableUrl,
  //           })) || [];

  //         const addBanners = {};
  //         addBanners[bannersData] = bannerImgList || [];
  //         setBanners(bannerImgList || []);
  //         // Cache the banners in Redux
  //         dispatch(setCachedBanner({ ...cachedBanners, ...addBanners }));
  //       } else {
  //         showSnackbar("Unable to fetch Banner", "error");
  //       }
  //       setLoading(false);
  //     })
  //     .catch((e) => {
  //       showSnackbar(e?.message || e?.response?.data?.message, "error");
  //       setLoading(false);
  //     });
  // };

  // useEffect(() => {
  //   if (!isDetailsPage) {
  //     getBanners();
  //   }
  // }, [isDetailsPage]);

  const storedRetailType = localStorage.getItem("retailType");
  useEffect(() => {
    if (storedRetailType) {
      dispatch(setStoreType(storedRetailType));
    }
  }, [storedRetailType]);

  return (
    <Box
      className="banner-carousel"
      sx={{
        minHeight: loading ? "200px" : "auto",
      }}
    >
      {loading ? (
        <div>
          <Skeleton
            variant="rectangular"
            width="100vw"
            height="30vh"
            top="50%"
            animation="wave"
            sx={{
              borderRadius: "8px",
              marginBottom: "10px",
              background: "lightgrey !important",
            }}
          />
        </div>
      ) : isDetailsPage ? (
        bannerDataValue?.length ? (
          <Carousal data={bannerDataValue || []} />
        ) : (
          <>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{
                borderRadius: "8px",
                backgroundColor: "lightgrey !important",
                marginBottom: "10px",
              }}
            />
          </>
        )
      ) : bannerDataValue?.length ? (
        <Carousal
          data={bannerDataValue?.map((banner) => (
            <img
              key={banner?.id}
              src={banner?.image}
              style={{ width: "100%" }}
              className="home_banner_img"
              alt="Banner"
              onClick={() =>
                handleBannerNavigation(banner?.clickableUrl, navigate)
              }
            />
          ))}
        />
      ) : (
        <Skeleton
          variant="rectangular"
          width="95vw"
          height="30vh"
          animation="wave"
          sx={{
            borderRadius: "8px",
            backgroundColor: "#a7a7b575",
            margin: "12px",
          }}
        />
      )}
    </Box>
  );
}

export default memo(Banner);
