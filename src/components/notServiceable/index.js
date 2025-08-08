//react
import React from "react";
import { useNavigate } from "react-router-dom";

//@mui
import { Box } from "@mui/material";

//css
import "./index.css";

//assets
import Unreachable from "../../assets/images/unreachable.png";

//custom-components
import Heading from "../custom-components/Heading";
import Text from "../custom-components/Text";
import StyledButton from "../custom-components/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const NotServiceable = () => {
  const navigate = useNavigate();

  const handleChangeAddress = () => {
    navigate("/address-book");
  };

  return (
    <Box className="not-serviceable">
      <Box className="unreachable-image">
        <img src={Unreachable} className="not-serviceable-img" />
      </Box>
      <Box className="not-serviceable-top-heading">
        <Heading
          text={"Currently we cannot deliver to this location"}
          textAlign="center"
          fontSize={16}
        />
      </Box>
      <Box className="not-serviceable-sub-heading">
        <Text
          textAlign="center"
          text={`We are currently serving to 40+ pincodes in Salem and Erode`}
        />
      </Box>
      <Box className="change-address-btn">
        <StyledButton
          variant="contained"
          text="Change Address"
          borderRadius="2rem"
          onClick={handleChangeAddress}
          textTransform="capitalize"
          endIcon={<ArrowForwardIcon fontSize="small" />}
        />
      </Box>
    </Box>
  );
};

export default NotServiceable;
