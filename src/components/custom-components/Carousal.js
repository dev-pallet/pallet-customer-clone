// react
import React, { useEffect, useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";

// mui components
import { Box } from "@mui/material";

// styles
import "./carousal.css";
import useImageCompressor from "../../custom hooks/useManualCompressor";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import Skeleton from "@mui/material/Skeleton";

export default function Carousal({ data, ...props }) {
  const { compressImage } = useImageCompressor();
  const [compressedItems, setCompressedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const compressAllImages = async () => {
      setLoading(true);
      const compressed = await Promise.all(
        data?.map(async (banner) => {
          try {
            const compressedUrl = await compressImage(
              banner?.props?.src || banner?.props?.image
            );
            return (
              <img
                key={banner?.key}
                src={compressedUrl}
                style={{ width: "100%" }}
                className="home_banner_img"
                alt="Banner"
                onClick={banner?.props?.onClick}
              />
            );
          } catch (err) {
            showSnackbar(err?.message, "error");
            return banner;
          }
        })
      );
      setCompressedItems(compressed);
      setLoading(false);
    };

    if (data?.length) compressAllImages();
  }, [data, compressImage]);

  const dataLengthGreaterThanOne = data?.length > 1 ? true : false;

  return (
    <Box className="carousel-libr">
      {loading ? (
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
      ) : (
        <AliceCarousel
          autoPlay
          autoPlayInterval={3000}
          infinite={dataLengthGreaterThanOne}
          mouseTracking
          // items={data}
          items={compressedItems}
          keyboardNavigation
          responsive={true}
          disableDotsControls={!dataLengthGreaterThanOne}
        />
      )}
    </Box>
  );
}
