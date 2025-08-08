import React, { useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { createBrowseOnlyToken } from "../../config/services/userService";
import storageConstants from "../../constants/storageConstants";
import ExtractDataFromGzip from "../../middlewares/ExtractDataFromGzip";
import { setUserData } from "../../redux/reducers/userReducer";
import { storeData } from "../../middlewares/localStorage";

import AnimatedImagesGrid from "./animatedImageGrid";
import StyledButton from "../custom-components/Button";
import CustomInput from "../custom-components/CustomInput";
import CustomText from "../../Payment/component/CustomText";

import "./index.css"; // optional if needed

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();

  const [phoneNumber, setPhoneNumber] = useState("");
  const phoneNumberRegex = /^\d{0,10}$/;

  const handlePhoneNumber = ({ target }) => {
    const value = target.value;
    if (phoneNumberRegex.test(value)) {
      setPhoneNumber(value);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const payload = { deviceId: uuidv4() };
      const response = await createBrowseOnlyToken(payload);
      const accessToken = response?.data?.data?.at;

      storeData(storageConstants?.TOKEN, accessToken);

      const extractPayload = await ExtractDataFromGzip(accessToken);
      const extractPayloadParsed = JSON.parse(extractPayload);

      dispatch(
        setUserData({
          uidx: extractPayloadParsed?.deviceId,
          nonLoggedIn: extractPayloadParsed?.nonLoggedIn,
        })
      );

      await storeData(storageConstants.STORAGE_KEY_USER_DATA, {
        uidx: extractPayloadParsed?.deviceId,
        nonLoggedIn: extractPayloadParsed?.nonLoggedIn,
      });

      navigate("/activity-screen");
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        backgroundColor: "#eef4ee",
        zIndex: 100,
        border: "1px solid green",
      }}
    >
      {/* Blurred background */}
      <Box
        sx={{
          filter: "blur(8px)",
          transform: "scale(1.05)",
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      >
        <AnimatedImagesGrid />
      </Box>

      {/* Foreground login box */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          px: 2,
        }}
      >
        {/* Skip button */}
        <IconButton
          onClick={handleGuestLogin}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            backgroundColor: "lightgrey",
            color: "white",
            border: "1px solid #eef4ee",
            borderRadius: "5px",
            px: 2,
          }}
        >
          <CustomText text="Skip" color="#fff" />
        </IconButton>

        {/* Login form */}
        <Box
          sx={{
            width: "60%",
            maxWidth: 360,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            padding: 4,
            borderRadius: 3,
            boxShadow: 3,
            backdropFilter: "blur(5px)",
          }}
        >
          <CustomInput
            inputAdornmentText="+91"
            placeholder="Enter your number"
            value={phoneNumber}
            onChange={handlePhoneNumber}
            maxLength={10}
          />
          <StyledButton
            variant="contained"
            text="Get OTP"
            width="100%"
            mg="20px 0 0"
            borderRadius="0.5rem"
            fw="bold"
            textTransform="none"
            disabled={phoneNumber?.length !== 10}
            onClick={() => navigate(`/otp/${phoneNumber}`)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
