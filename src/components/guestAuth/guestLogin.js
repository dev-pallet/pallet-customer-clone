// react
import React from "react";
import { useNavigate } from "react-router-dom";

// mui components
import { Box } from "@mui/material";

// custom components
import Text from "../custom-components/Text";
import StyledButton from "../custom-components/Button";

// styles
import "./index.css";

// constants
import { colorConstant } from "../../constants/colors";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";

export default function GuestLogin({ text }) {
  const navigate = useNavigate();

  const goToLogin = () => {
    // if (retailType !== "RESTAURANT") {
    navigate("/login");
    // }
  };

  const retailType = useSelector(getStoreType);
  const dyanmicStyle = {
    display: "flex",
    flexDirection: "column",
    // gap: '1rem', // Uncomment if needed
    height: "90vh",
    padding: "0.5rem",
    backgroundColor:
      retailType === "RESTAURANT" ? colorConstant?.showdowColor : "#f4f7fc",
    marginTop: "3rem",
  };

  return (
    <Box
      // className="guestLogin"
      sx={dyanmicStyle}
    >
      <Text
        text={"Account"}
        tint={
          retailType === "RESTAURANT"
            ? colorConstant?.defaultButtonText
            : colorConstant?.primaryColor
        }
      />
      <Text text={text} tint="rgb(134,140,150)" />
      <StyledButton
        text={"Login / Register"}
        fw={"bold"}
        onClick={goToLogin}
        mg={"10px 0"}
        borderRadius={"1rem"}
        textTransform={"capitalize"}
      />
    </Box>
  );
}
