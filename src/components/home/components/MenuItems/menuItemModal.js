import React, { memo, useEffect, useState } from "react";
import { Box, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { useDispatch, useSelector } from "react-redux";
import { getCachedCategories } from "../../../../redux/reducers/categoryReducer";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";

import Text from "../../../custom-components/Text";
import "./menuList.css";
import AddIcon from "@mui/icons-material/Add";
import { Collapse } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import { setSelectedTagData } from "../../../../redux/reducers/productReducer";
import { store } from "../../../../redux/store";
import { useCategoryData } from "../../../../custom hooks/useCategoryData";
import { colorConstant } from "../../../../constants/colors";

const MenuList = ({ handleOpen, handleClose }) => {
  const [openedLevel2, setOpenedLevel2] = useState([]);
  const [selectedLevel1Id, setSelectedLevel1Id] = useState(null);

  const navigate = useNavigate();
  const {
    loading,
    list,
    level1Cat,
    level2Cat,
    error,
    refresh,
    loadingMenuList,
    menuList,
    menuListLevel1Cat,
    refreshList,
  } = useCategoryData({ fetchMenuData: true });

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     refreshList();
  //   }, 60 * 1000);

  //   return () => clearTimeout(timer);
  // }, [refreshList]);

  const handleToggle = (level1Id) => {
    if (selectedLevel1Id === level1Id) {
      setSelectedLevel1Id(null);
      setOpenedLevel2([]);
    } else {
      setSelectedLevel1Id(level1Id);
      // const subItems = level2Cat?.[level1Id] || [];
      // setOpenedLevel2(subItems);
    }
  };

  return (
    <Dialog
      open={handleOpen}
      onClose={handleClose}
      //   className="menulist-dialog-container"
      PaperProps={{
        sx: (theme) => ({
          position: "fixed",
          bottom: "5rem", 
          right: "0.25rem",
          width: "80%", 
          height: "50vh",
          maxWidth: "450px", 
          borderRadius: "8px",
          border: "1px solid red",
          backgroundColor: colorConstant?.showdowColor,
          color: colorConstant?.white,
          overflow: "hidden", 
          display: "flex",
          flexDirection: "column",
          margin: 0,
          zIndex: 1400,
          [theme.breakpoints.up("md")]: {
            width: "450px",
            right: "1rem"
          },
        }),
      }}
      hideBackdrop
    >
      <IconButton
        aria-label="close"
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: "white",
          zIndex: 1500,
          backgroundColor: "transparent",
          "& svg": {
            color: colorConstant?.white,
          },
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{
          pt: "10px",
          px: 2,
          mt: "40px",
          // maxHeight: "200px",
          flex: 1,
          backgroundColor: "#000",
          overflowY: "auto", // Move scroll here
          // "&::-webkit-scrollbar": {
          //   width: "6px",
          //   height: "6px"
          // },
          // "&::-webkit-scrollbar-track": {
          //   backgroundColor: "#000", // Black background
          // },
          // "&::-webkit-scrollbar-thumb": {
          //   // backgroundColor: "#ff0000",
          //   backgroundImage: "linear-gradient(to bottom, #ff0000, #000000)",
          //   borderRadius: "4px",
          // },
          // "&::-webkit-scrollbar-thumb:hover": {
          //   // backgroundColor: "#cc0000",
          //   backgroundImage: "linear-gradient(to bottom, #cc0000, #000000)",
          // },

          WebkitOverflowScrolling: "touch", // smoother on iOS
          // Standard webkit scrollbar styling (Safari/Chrome)
          "&::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          // Use a plain backgroundColor for thumb (avoid backgroundImage in Safari)
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#d32f2f", // fallback visible color
            borderRadius: "4px",
            border: "2px solid transparent",
            backgroundClip: "padding-box",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#b71c1c",
          },
          // Firefox fallback
          scrollbarWidth: "thin",
          scrollbarColor: "#d32f2f transparent",
        }}
      >
        {loading ? (
          <Text text={"Loading Menu..."} className="menulist-name-text" />
        ) : menuList?.length ? (
          menuList?.map((item, index) => {
            const isOpen = selectedLevel1Id === item?.mainCategoryId;
            const matchingLevel1Cats = item?.level1Entities?.filter(
              (level1) => level1?.mainCategoryId === item?.mainCategoryId
            );
            return (
              <Box key={index}>
                <Box className="check">
                  <Box className="common">
                    <Box
                      className="open-product-listing"
                      onClick={() => {
                        store.dispatch(setSelectedTagData(item?.[0]));

                        navigate(`/allMenu/${item?.categoryName}`, {
                          state: {
                            selectedCategory: item?.categoryName,
                            fullMenu: matchingLevel1Cats,
                          },
                        });
                      }}
                    >
                      <Text
                        text={item?.categoryName || "NA"}
                        className="menulist-name-text"
                      />
                    </Box>

                    <Box display="flex" alignItems="center" gap={1}>
                      {matchingLevel1Cats?.length > 0 &&
                        (selectedLevel1Id === item?.mainCategoryId ? (
                          <RemoveIcon
                            fontSize="small"
                            color="error"
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "9px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleToggle(item?.mainCategoryId)}
                          />
                        ) : (
                          <AddIcon
                            fontSize="small"
                            color="error"
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "9px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleToggle(item?.mainCategoryId)}
                          />
                        ))}
                    </Box>
                  </Box>
                  {matchingLevel1Cats?.length > 0 && (
                    <Text
                      text={matchingLevel1Cats?.length}
                      className="menulist-name-text"
                    />
                  )}
                </Box>
                {/* Sub-items with collapse */}
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <Box sx={{ pl: 2, pt: 1 }}>
                    {matchingLevel1Cats?.map((sub, i) => (
                      <Box
                        key={i}
                        className="open-product-listing"
                        onClick={() => {
                          store.dispatch(setSelectedTagData(sub));
                          navigate(
                            `/allMenu/${item?.categoryName}/${sub?.categoryName}`,
                            {
                              state: {
                                selectedCategory: sub?.categoryName,
                                fullMenu: matchingLevel1Cats,
                              },
                            }
                          );
                        }}
                      >
                        <Text
                          key={i}
                          className="menulist-name-text"
                          text={sub?.categoryName || ""}
                        />
                      </Box>
                    ))}
                  </Box>
                </Collapse>
              </Box>
            );
          })
        ) : (
          <p style={{ fontFamily: "sans-serif" }}>Loading Categories...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default memo(MenuList);
