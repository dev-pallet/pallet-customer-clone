import { Box } from "@mui/material";
import React from "react";
import "./index.css";
import StyledButton from "../../../custom-components/Button";
import CurrencyRupee from "@mui/icons-material/CurrencyRupee";

export default function PaymentMethod() {
  return (
    <Box className="payment-method-div">
      <Box></Box>
      <Box></Box>
      <Box>
        <StyledButton
          text={`Place Order | ${(<CurrencyRupee />)}219.20`}
          textTransform="capitalize"
        />
      </Box>
    </Box>
  );
}
