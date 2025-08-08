// react
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// material ui
import { Box, CircularProgress } from "@mui/material";

// reducers
import {
  getFavourites,
  getUserData,
  setFavourites,
} from "../../redux/reducers/userReducer";

// icons
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

// services
import { addToFav, removeFav } from "../../config/services/customerService";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { colorConstant } from "../../constants/colors";

import { getStoreType } from "../../redux/reducers/miscReducer";
import { CollectionsBookmarkOutlined } from "@mui/icons-material";

export default function Favourite({ gtin }) {
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const favList = useSelector(getFavourites);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  const [favLoading, setFavLoading] = useState(false);
  const [fav, setFav] = useState(false);
  const [productWishlistDetail, setProductWishlistDetail] = useState([]);

  const handleWishlist = async (e) => {
    e.stopPropagation();

    if (fav) {
      removeFromFavourites();
    } else {
      addToFavourites();
    }
  };

  const addToFavourites = async () => {
    if (favLoading) return;
    try {
      const payload = {
        productId: gtin,
        notes: "",
        customerId: user?.id,
        createdBy: user?.uidx,
      };
      setFavLoading(true);

      const res = await addToFav(payload);
      if (res?.data?.es === 0) {
        setFavLoading(false);
        dispatch(setFavourites([...favList, res?.data?.data]));
        showSnackbar(res?.data?.message || "Added to wishlist", "success");
      } else setFav((prev) => !prev);

      if (res?.data?.es === 1) {
        setFavLoading(false);
        showSnackbar(res?.data?.message);
      }
    } catch (err) {
      setFavLoading(false);
      setFav((prev) => !prev);
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const removeFromFavourites = async () => {
    if (favLoading) return;
    try {
      const payload = {
        wishlistId: productWishlistDetail?.[0]?.wishlistId,

        updatedBy: user?.uidx,
      };

      setFavLoading(true);
      const res = await removeFav(payload);

      if (res?.data?.es === 0) {
        setFavLoading(false);
        dispatch(
          setFavourites(
            favList?.filter(
              (e) => e?.wishlistId !== res?.data?.data?.wishlistId
            )
          )
        );
        showSnackbar(res?.data?.message || "Removed from wishlist", "success");
      } else {
        setFav((prev) => !prev);
      }
    } catch (err) {
      setFavLoading(false);
      setFav((prev) => !prev);
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    } finally {
      setFavLoading(false);
    }
  };
  useEffect(() => {
    const wishlistDetails = favList?.filter((el) => {
      return el?.productId === gtin;
    });
    setFav(wishlistDetails?.length);
    setProductWishlistDetail(wishlistDetails);
  }, [gtin, favList]);
  const dynamicStyle = {
    color:
      retailType === "RESTAURANT"
        ? "#fe0000"
        : colorConstant?.twinleavesColorPallet,
  };

  return (
    <Box
      className="whishlist-details"
      onClick={(e) => {
        handleWishlist(e);
      }}
    >
      {favLoading ? (
        <CircularProgress
          sx={{
            color: colorConstant?.primaryColor,
            width: "10px !important",
            height: "10px !important",
          }}
        />
      ) : !fav && !favLoading ? (
        <FavoriteBorderIcon className="wishlist-icon" style={dynamicStyle} />
      ) : fav && !favLoading ? (
        <FavoriteIcon className="wishlist-icon-added" style={dynamicStyle} />
      ) : null}
    </Box>
  );
}
