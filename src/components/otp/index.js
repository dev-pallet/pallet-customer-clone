//react
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//libraries
import moment from "moment";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import OtpInput from "react-otp-input";

//redux
import { useDispatch, useSelector } from "react-redux";

// mui components
import { Box } from "@mui/material";

// custom components
import StyledButton from "../custom-components/Button";
import Heading from "../custom-components/Heading";
import Text from "../custom-components/Text";

// styles
import "./index.css";

// constants
import { colorConstant } from "../../constants/colors";
import storageConstants from "../../constants/storageConstants";
import STORE_DATA from "../../constants/storeData";
import { storeData } from "../../middlewares/localStorage";

//services
import { checkCustomer } from "../../config/services/customerService";
import { getOtp, verifyOtp } from "../../config/services/userService";

//reducer
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import { setUserData } from "../../redux/reducers/userReducer";
import Menuback from "../menuback";
import { getStoreType } from "../../redux/reducers/miscReducer";

export default function OtpPage() {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [timer, setTimer] = useState(60);
  const [otp, setOtp] = useState("");
  const [otpLength, setOtpLength] = useState("");
  const [pinValue, setPinValue] = useState("");
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  const checkUserExist = async () => {
    const payload = {
      orgId: STORE_DATA?.id || localStorage.getItem("retailId"),
      mobile: params?.mobile,
    };

    try {
      const response = await checkCustomer(payload);
      if (response?.data?.es == 1) {
        // add phone number to localstorage
        localStorage.setItem("new_user_phone_number", params?.mobile);
        navigate("/register");
      }
      if (response?.data?.es == 0) {
        dispatch(setUserData(response?.data?.customer));
        await storeData(
          storageConstants.STORAGE_KEY_USER_DATA,
          response?.data?.customer
        );
        navigate("/activity-screen");
      }
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const fetchOtp = async () => {
    const payload = {
      mobile: params?.mobile,
    };
    try {
      const response = await getOtp(payload);
      if (response?.data?.status == "SUCCESS") {
        const accessToken = response?.data?.data?.at;
        await storeData(storageConstants.TOKEN, accessToken || null);
      }
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const validateOtp = async (otpVal) => {
    const payload = {
      otp: otpVal,
    };

    try {
      const response = await verifyOtp(payload);
      if (response?.data?.data?.status !== "ERROR") {
        await storeData(storageConstants.TOKEN, response?.data?.data?.at);
        await storeData(storageConstants.STORAGE_KEY_REFRESH_TOKEN, {
          rt: response?.data?.data?.rt,
          timeStamp: moment(new Date()),
        });
        checkUserExist({
          orgId: STORE_DATA?.id,
          mobile: params?.mobile,
        });
      }
    } catch (res) {
      showSnackbar(res?.data?.data?.message, "error");
    }
  };

  const handleResendOtp = () => {
    fetchOtp();
    setTimer(60);
  };

  const handleOtpInput = (value, index) => {
    setPinValue(value);
    setOtp(value);
    setOtpLength(index + 1);
  };

  const handleCompleteOtp = (value, index) => {
    validateOtp(value);
  };

  useEffect(() => {
    fetchOtp();
  }, []);

  useEffect(() => {
    if (pinValue.length == 6) {
      validateOtp(pinValue);
    }
  }, [pinValue]);

  return (
    <Box pt={2} mx={2}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Menuback
          head={true}
          // text="All Products"
          // headingClassName="custom-heading-position"
        />
        <Heading
          text="Account Verification"
          fontsize={13}
          tint="grey"
          // width={22}
        />
      </Box>

      <Text
        text="Enter 6-digit verification code sent to your mobile number"
        mt={3}
        tint="grey"
      />
      <Heading
        fontSize={12}
        text={`+91-${params?.mobile}`}
        fontweight="normal"
        mb={3}
      />
      {timer > 0 && (
        <Box className="content-center">
          <CountdownCircleTimer
            isPlaying
            size={100}
            strokeWidth={3}
            duration={timer}
            onComplete={(e) => {
              setTimer(0);
            }}
            colors={colorConstant.iconColor}
          >
            {({ remainingTime }) => (
              <Box
                sx={{
                  flexDirection: "column",
                  margin: "auto",
                  textAlign: "center",
                }}
              >
                <Text
                  text={"Remaining Time"}
                  fontsize={9}
                  tint={
                    retailType === "RESTAURANT"
                      ? colorConstant?.sakuraRestroColor
                      : colorConstant?.primaryColor
                  }
                />
                <Text
                  text={remainingTime}
                  fontSize={28}
                  mt="-10px"
                  // tint={colorConstant.primaryColor}
                  tint={
                    retailType === "RESTAURANT"
                      ? colorConstant?.sakuraRestroColor
                      : colorConstant?.primaryColor
                  }
                />

                <Text
                  text={"seconds"}
                  mt="-10px"
                  color={
                    retailType === "RESTAURANT"
                      ? colorConstant?.sakuraRestroColor
                      : colorConstant?.primaryColor
                  }
                />
              </Box>
            )}
          </CountdownCircleTimer>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OtpInput
          value={pinValue}
          onChange={(value, index) => handleOtpInput(value, index)}
          numInputs={6}
          separator={<span style={{ width: "8px" }}></span>}
          isInputNum={true}
          shouldAutoFocus={true}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            border: "1px solid darkgrey",
            borderRadius: "10px",
            width: "44px",
            height: "54px",
            fontSize: "14px",
            color: "black",
            fontWeight: "600",
            caretColor: "rgb(12, 121, 36)",
            margin: "6px",
            outline: "none",
          }}
          focusStyle={{
            border: "1px solid rgb(12, 121, 36)",
            outline: "none",
          }}
        />
      </Box>
      {timer === 0 && (
        <Box sx={{ marginTop: "20px", textAlign: "center" }}>
          <StyledButton
            variant="contained"
            text="Resend OTP"
            width="auto"
            borderRadius="1rem"
            fw="bold"
            textTransform="none"
            onClick={() => handleResendOtp()}
          />
        </Box>
      )}
    </Box>
  );
}
