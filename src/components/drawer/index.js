// react
import React, { useEffect, useState } from "react";
// mui components
import { Box, Drawer } from "@mui/material";
// icons
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

export default function BottomDrawer({
  drawerStateProp,
  setDrawerStateProp,
  drawerContent,
  drawerHeight = "50%",
  customCloseIcon,
  drawerContentStyle = {},
}) {
  const [drawerState, setDrawerState] = useState(false);

  const toggleDrawer = (val) => {
    // Ignore undefined or invalid values
    if (typeof val !== "boolean") return;
    setDrawerState(val);
    setDrawerStateProp(val);
  };

  useEffect(() => {
    toggleDrawer(drawerStateProp);
  }, [drawerStateProp]);

  return (
    <Drawer
      anchor={"bottom"}
      open={drawerState}
      onClose={() => toggleDrawer(false)}
      PaperProps={{
        sx: { 
          height: drawerHeight, 
          boxShadow: "none", 
          borderTopLeftRadius: "1.5rem",
          borderTopRightRadius: "1.5rem",
        },
      }}
      hideBackdrop={false}
      sx={{
        "& MuiBackdrop-root-MuiModal-backdrop": {
          // backgroundColor: "#5753530f",
          backgroundColor: "#2c2b2b7a",
        },
      }}
    >
      {/* {customCloseIcon ? (
        React.cloneElement(customCloseIcon, {
          onClick: () => toggleDrawer(false),
          className: "drawer-cancel-button",
        })
      ) : ( */}
      <Box display="flex" justifyContent="center" alignItems="center" py={1}>
        <CloseSharpIcon
          className="drawer-cancel-button"
          onClick={() => toggleDrawer(false)}
          sx={{ cursor: "pointer" }}
        />
      </Box>
      {/* )} */}
      <Box
        p={2}
        className="drawer-main-box"
        height="auto"
        sx={{ overflowY: "scroll", ...drawerContentStyle }}
      >
        {drawerContent}
      </Box>
    </Drawer>
  );
}
