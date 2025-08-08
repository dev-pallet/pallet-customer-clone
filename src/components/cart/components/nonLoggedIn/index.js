import React from "react";
import { useNavigate } from "react-router-dom";

//css
import "./index.css";

// mui components
import { Box } from "@mui/material";

//custom components
import Text from "../../../custom-components/Text";
import StyledButton from "../../../custom-components/Button";
import Heading from "../../../custom-components/Heading";

const NonLoggedIn = () => {
  const navigate = useNavigate();

  const handleNonLoggedInBtn = () => {
    navigate("/login");
  };

  return (
    <Box className="non-logged-in">
      <Box className="non-logged-in-details">
        <Heading text={"Almost There"} fontWeight={800} />
        <Text
          text={"Login or Signup to place your order"}
          fontSize={12}
          tint="grey"
        />
      </Box>
      <Box className="non-logged-in-btn">
        <StyledButton
          variant="contained"
          text="Proceed with phone number"
          borderRadius="2rem"
          onClick={handleNonLoggedInBtn}
          textTransform="capitalize"
          className="non-logged-btn"
          width="96%"
          height="2.5rem"
        />
      </Box>
    </Box>
  );
};

export default NonLoggedIn;
