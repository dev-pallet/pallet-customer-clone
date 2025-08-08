import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import CategoryIcon from "@mui/icons-material/Category";
import WalletIcon from "@mui/icons-material/Wallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";
import { colorConstant } from "../../constants/colors";
import MenuList from "../home/components/MenuItems/menuItemModal";
import Search from "../search";
import { AnimatePresence, motion } from "framer-motion";

const suggestions = [
  { id: 1, name: "Pizza" },
  { id: 2, name: "Burger" },
  { id: 3, name: "Pasta" },
  { id: 4, name: "Wings" },
  { id: 5, name: "Cold Coffee" },
];
const Footer = ({ navigationVal }) => {
  const [value, setValue] = useState(navigationVal || 0);
  const [index, setIndex] = useState(0);
  const [openMenuList, setOpenMenuList] = useState(false);
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpenMenuList(true);
  };

  const handleClose = () => {
    setOpenMenuList(false);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % suggestions?.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {retailType !== "RESTAURANT" ? (
        <Box className="footer">
          <Paper
            sx={{
              position: "fixed",
              bottom: 0,
              left: 3,
              right: 0,
              width: "99%",
              backgroundColor:
                retailType === "RESTAURANT" ? "rgb(173, 26, 25)" : "#fff",
            }}
            elevation={3}
          >
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              className="bottom-navigation"
              sx={{
                backgroundColor:
                  retailType === "RESTAURANT"
                    ? colorConstant?.defaultButtonText
                    : "#fff",
              }}
            >
              <BottomNavigationAction
                component={Link}
                to="/home"
                label="Home"
                icon={<HomeIcon />}
                style={{
                  color:
                    value === 0
                      ? retailType === "RESTAURANT"
                        ? "black"
                        : "rgb(12, 121, 36)"
                      : "grey",
                }}
              />
              {retailType !== "RESTAURANT" && (
                <BottomNavigationAction
                  component={Link}
                  to="/categories"
                  label="Categories"
                  icon={<CategoryIcon />}
                  style={{
                    color:
                      value === 1
                        ? retailType === "RESTAURANT"
                          ? "black"
                          : "rgb(12, 121, 36)"
                        : "grey",
                  }}
                />
              )}

              <BottomNavigationAction
                component={Link}
                to="/wallet"
                label="Wallet"
                icon={<WalletIcon />}
                style={{
                  color:
                    value === 2
                      ? retailType === "RESTAURANT"
                        ? "black"
                        : "rgb(12, 121, 36)"
                      : "grey",
                }}
              />
              <BottomNavigationAction
                component={Link}
                to="/cart"
                label="Cart"
                icon={<ShoppingCartIcon />}
                style={{
                  color:
                    value === 3
                      ? retailType === "RESTAURANT"
                        ? "black"
                        : "rgb(12, 121, 36)"
                      : "grey",
                }}
              />
            </BottomNavigation>
          </Paper>
        </Box>
      ) : (
        <Box
          className="footer"
          sx={{
            display: "flex",
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1300,
            width: "auto",
            paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          }}
        >
          <Paper
            sx={{
              // bottom: 0,
              // left: 0,
              // right: 0,
              backgroundColor: "#fff",
              width: "90%",
            }}
            elevation={3}
          >
            <Box
              className="wrapper-input-box"
              sx={{
                display: "flex",
                alignItems: "center",
                width: "99%",
                height: "77% ",
              }}
            >
              <SearchIcon className="search-icon" />
              <AnimatePresence mode="wait">
                <motion.input
                  key={suggestions[index].id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  placeholder={`Search "${suggestions[index]?.name}"`}
                  style={{
                    width: "100%",
                    padding: 5,
                    fontSize: 13,
                    border: "none",
                  }}
                  readOnly
                  onClick={() => navigate("/search")}
                />
              </AnimatePresence>
              {/* <input
                tabIndex={-1}
                id="search-input"
                className="search-input"
                placeholder={`Search "${suggestions[index]}"`}
                onClick={() => navigate("/search")}
                // style={{ flex: 1, marginRight: "8px" }}
              /> */}
              {/* <FavoriteIcon
                onClick={() => navigate("/favourites")}
                style={{ cursor: "pointer", marginLeft: "8px" }}
              /> */}
            </Box>
          </Paper>
          <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            sx={{
              backgroundColor:
                retailType === "RESTAURANT"
                  ? colorConstant?.defaultButtonText
                  : "#fff",
              flex: 1,
              borderRadius: "35px",
            }}
          >
            {retailType === "RESTAURANT" && (
              <BottomNavigationAction
                label="Menu"
                icon={<RestaurantIcon />}
                onClick={handleOpen}
                style={{
                  color: value === 0 ? "white" : "grey",
                  backgroundColor: value === 0 ? "#2f2f37" : "black",
                }}
              />
            )}
          </BottomNavigation>
          {openMenuList && (
            <MenuList handleOpen={handleOpen} handleClose={handleClose} />
          )}
        </Box>
      )}

      {/* ) : (
        <Box className="footer">
          <Paper
            sx={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor:
                retailType === "RESTAURANT" ? "rgb(173, 26, 25)" : "#fff",
            }}
            elevation={3}
          >
           

            <Search />
          </Paper>
        </Box>
      )} */}
    </>
  );
};

export default Footer;
