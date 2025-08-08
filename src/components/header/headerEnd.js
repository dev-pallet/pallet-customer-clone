import React, { memo, useEffect, useState } from "react";
import "./header.css";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { getStoreType } from "../../redux/reducers/miscReducer";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import WalletIcon from "@mui/icons-material/Wallet";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/material";
import { getCustomerfavList } from "../../config/services/customerService";
import { getUserData, setFavourites } from "../../redux/reducers/userReducer";
import { CircularLoader } from "../custom-components/CircularLoader";

const HeaderEnd = ({ navigationVal }) => {
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const [value, setValue] = useState(navigationVal || 0);
  const [favPageLoader, setFavPageLoader] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userDataLocalStorage = localStorage.getItem("@user");
  const userData = userDataLocalStorage
    ? JSON.parse(userDataLocalStorage)
    : null;
  const user = useSelector(getUserData) || userData;

  const fetchFavouritesProductData = async () => {
    const userId = user?.id;

    if (!userId) return;
    try {
      setFavPageLoader(true);
      const res = await getCustomerfavList(userId);
      if (res?.data?.es === 0) {
        dispatch(setFavourites(res?.data?.data));
      } else {
        dispatch(setFavourites([]));
      }
    } catch (err) {
      dispatch(setFavourites([]));
    } finally {
      setFavPageLoader(false);
    }
  };
  // Fetch favorites when navigating to the favorites page
  useEffect(() => {
    if (value === 1 && user?.name) {
      fetchFavouritesProductData();
    }
  }, [value, user]);

  const getIconColor = (isActive) => {
    if (!isActive) return "grey";
    return retailType === "RESTAURANT" ? "white" : "rgb(12, 121, 36)";
  };
  return (
    <Box className="heading-right">
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        sx={{
          backgroundColor: "transparent !important",
        }}
      >
        <BottomNavigationAction
          component={Link}
          to="/wallet"
          // label="Wallet"
          icon={<WalletIcon />}
          style={{
            color:
              value === 0
                ? retailType === "RESTAURANT"
                  ? "white"
                  : "rgb(12, 121, 36)"
                : "grey",
          }}
          className="header-navbar-nav-icon"
        />
        <BottomNavigationAction
          component={Link}
          to="/favourites"
          sx={{ color: getIconColor(value === 1) }}
          icon={favPageLoader ? <CircularLoader /> : <FavoriteIcon />}
          className="header-navbar-nav-icon"

          // icon={
          //   <FavoriteIcon
          //     onClick={async () => {
          //       if (userData?.name) {
          //         await fetchFavouritesProductData();
          //       } // call before navigating
          //       {
          //         favPageLoader ? <CircularLoader /> : navigate("/favourites");
          //       }
          //     }}
          //   />
          // }
        />
        <BottomNavigationAction
          component={Link}
          to="/customer-profile"
          // label="profile"
          icon={
            <AccountCircleIcon
            // onClick={() => handleNavigate("/customer-profile")}
            />
          }
          style={{
            color:
              value === 2
                ? retailType === "RESTAURANT"
                  ? "white"
                  : "rgb(12, 121, 36)"
                : "grey",
          }}
          className="header-navbar-nav-icon"
        />
      </BottomNavigation>
    </Box>
  );
};

export default memo(HeaderEnd);
