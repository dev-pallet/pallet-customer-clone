import React from "react";
import CardUI from "../CardUI";
import { ChevronRight } from "@mui/icons-material";
import "./NetBanking.css";
import useRazropayConfig from "../useRazropayConfig";
import CustomText from "../CustomText";
import { CircularProgress } from "@mui/material";

const NetBankingCard = ({ bank, bankId }) => {
  const { capturePayment, paymentLoader } = useRazropayConfig();
  const handlePay = () => {
    capturePayment({
      method: "netbanking",
      bank: bankId,
    });
  };
  return (
    <CardUI onClick={handlePay} style={{ margin: `0.5rem 0` }}>
      <section className="bankCard">
        <CustomText text={bank} />

        {paymentLoader ? (
          <CircularProgress color="inherit" size={20} />
        ) : (
          <ChevronRight />
        )}
      </section>
    </CardUI>
  );
};

export default NetBankingCard;
