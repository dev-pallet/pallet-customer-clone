//react
import React, { Fragment, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//mui components
import {
  Avatar,
  Box,
  Card,
  Drawer,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";

// components
import GuestLogin from "../guestAuth/guestLogin";

//custom components
import Heading from "../custom-components/Heading";
import Text from "../custom-components/Text";
import Menuback from "../menuback";

//styles
import "./index.css";

//icons
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { HiMiniWallet } from "react-icons/hi2";
import { LuMessagesSquare } from "react-icons/lu";
import { MdRedeem } from "react-icons/md";

// redux
import { getUserData } from "../../redux/reducers/userReducer";

// constants
import { colorConstant } from "../../constants/colors";
import PopupScreen from "../modal";


const CustomerProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [drawerState, setDrawerState] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  // <-- modal fn
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleYesAction = () => {
    logout();
    setOpenModal(false);
    navigate("/login")
  };
  const handleNoAction = () => {
    //close the modal
    setOpenModal(false);
  };
  // modal code -->

  const logout = async () => {
    await localStorage.clear();
    dispatch({ type: "reset" });
    navigate("/login");
  };

  const settings = useMemo(
    () => [
      {
        label: "My Orders",
        icon: <ShoppingBagOutlinedIcon />,
        redirect: () => {
          navigate("/myorders");
        },
      },
      {
        label: "Address book",
        icon: <LocationOnOutlinedIcon />,
        redirect: () => {
          navigate("/address-book");
        },
      },
      {
        label: "Redeem Points",
        icon: <MdRedeem />,
        redirect: () => {
          navigate("/loyalty-points");
        },
      },
      {
        label: "Choose your language",
        icon: <TranslateOutlinedIcon />,
        redirect: () => {
          toggleDrawer(true);
        },
      },
      {
        label: "About us",
        icon: <InfoOutlinedIcon />,
        redirect: () => {
          navigate("/aboutus");
        },
      },
      {
        label: "Settings",
        icon: <SettingsOutlinedIcon />,
        redirect: () => {
          navigate("/settings");
        },
      },
      {
        label: "FAQ's",
        icon: <HelpOutlineOutlinedIcon />,
        redirect: () => {
          navigate("/faq");
        },
      },
      {
        label: "Logout",
        icon: <ExitToAppOutlinedIcon />,
        redirect: () => {
          handleOpenModal();
        },
      },
    ],
    []
  );

  const cards = [
    {
      label: "Wishlist",
      icon: (
        <FavoriteBorderIcon
          fontSize="40px"
          color="#3e3f48"
          sx={{
            height: "2.5rem",
            width: "2.5rem",
          }}
        />
      ),
      path: "/favourites",
    },
    {
      label: "Wallet",
      icon: <HiMiniWallet fontSize="40px" color="#3e3f48" />,
      path: "/wallet",
    },
    {
      label: "Support",
      icon: <LuMessagesSquare fontSize="40px" color="#3e3f48" />,
      path: "/support",
    },
  ];

  const toggleDrawer = (val) => {
    setDrawerState(val);
  };

  const user = useSelector(getUserData);
  const userDetails = JSON.parse(localStorage.getItem("@user"));
  return (
    <Box
      //  pt={2}
      pb={!user?.nonLoggedIn && 2}
      className="customer-profile-root-div"
    >
      <Menuback
        margin={false}
        head={true}
        text="Profile"
        bg={colorConstant.baseBackground}
        wishlist={user?.name || (userDetails?.name && true)}
      />

      {user?.nonLoggedIn ? (
        <GuestLogin text={"Login/Create Account to manage order."} />
      ) : (
        <>
          <Box className="customer-profile-main-box">
            <Card className="profile-main-card">
              <Avatar sx={{ width: 75, height: 75, bgcolor: "#c1c7d3" }}>
                <Typography
                  variant="h2"
                  fontSize={28}
                  fontWeight="bold"
                  color="#3e3f48"
                >
                  {user?.name
                    ? user.name[0].toUpperCase()
                    : userDetails?.name
                    ? userDetails.name[0].toUpperCase()
                    : ""}
                </Typography>
              </Avatar>
              <Box className="profile-details">
                <Heading text={user?.name || userDetails?.name} />
                <Text
                  text={`+91-${user?.phoneNumber || userDetails?.phoneNumber}`}
                />
                <Box onClick={() => navigate("/settings/edit-profile")}>
                  <Text text="View Profile >" tint="cornflowerblue" />
                </Box>
              </Box>
            </Card>
          </Box>
          <Box className="card-main-box">
            {cards?.map((e, i) => (
              <Card
                className="card-content"
                key={i}
                onClick={() => navigate(e.path)}
              >
                {e.icon}
                <Text text={e.label} fontsize={10} />
              </Card>
            ))}
          </Box>
          {settings?.map((setting, index) => (
            <Fragment key={index}>
              <Box onClick={setting?.redirect} className="settings-card">
                <Box className="settings-card-content">
                  <div className="settings-card-icon">{setting?.icon}</div>
                  <Text text={setting?.label} />
                </Box>
                <KeyboardArrowRightIcon />
              </Box>
            </Fragment>
          ))}
          <Drawer
            anchor={"bottom"}
            open={drawerState}
            onClose={() => toggleDrawer(false)}
          >
            <CloseSharpIcon
              className="drawer-cancel-button"
              onClick={() => toggleDrawer(false)}
            />
            <Box p={2} className="drawer-main-box">
              <FormControl>
                <FormLabel
                  id="demo-radio-buttons-group-label"
                  className="language-font-style"
                >
                  Choose your language
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="english"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="english"
                    control={<Radio />}
                    label="English"
                  />
                  <FormControlLabel
                    value="tamil"
                    control={<Radio />}
                    label="Tamil"
                  />
                  <FormControlLabel
                    value="hindi"
                    control={<Radio />}
                    label="Hindi"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Drawer>
          <PopupScreen
            open={openModal}
            handleClose={handleCloseModal}
            modalTitle={"Logout"}
            modalContent="Are you sure you want to logout?"
            handleYes={handleYesAction}
            handleNo={handleNoAction}
            handleNoText={"Cancel"}
          />
        </>
      )}
    </Box>
  );
};

export default CustomerProfile;
