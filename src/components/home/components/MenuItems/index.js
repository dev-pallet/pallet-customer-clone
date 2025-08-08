import React, { useState } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { useSelector } from "react-redux";
import { getStoreType } from "../../../../redux/reducers/miscReducer";
import MenuList from "./menuItemModal";
import CloseIcon from "@mui/icons-material/Close";

const MenuItems = ({ navigationVal }) => {
  const [value, setValue] = useState(navigationVal || 0);
  const [openMenuList, setOpenMenuList] = useState(false);
  const retailType = useSelector(getStoreType);

  const handleOpen = () => {
    setOpenMenuList(true);
  };

  const handleClose = () => {
    setOpenMenuList(false);
  };

  return (
    <Box>
      <Paper sx={{ position: "fixed", bottom: 50, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          className="bottom-navigation"
        >
          {retailType === "RESTAURANT" &&
            (openMenuList ? (
              <BottomNavigationAction
                label="Close"
                icon={<CloseIcon />}
                onClick={handleClose}
                style={{
                  color: value === 0 ? "black" : "grey",
                  backgroundColor: value === 0 ? "red" : "black",
                }}
              />
            ) : (
              <BottomNavigationAction
                label="Menu"
                icon={<RestaurantIcon />}
                onClick={handleOpen}
                style={{
                  color: value === 0 ? "white" : "grey",
                  backgroundColor: value === 0 ? "#E48413" : "black",
                }}
              />
            ))}
        </BottomNavigation>
      </Paper>

      {openMenuList && (
        <MenuList handleOpen={handleOpen} handleClose={handleClose} />
      )}
    </Box>
  );
};

export default MenuItems;
