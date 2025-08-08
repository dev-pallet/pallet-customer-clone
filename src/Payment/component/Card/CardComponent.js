import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import "../../../App.css";
import { paymentRoutesConstant } from "../../RouteConstants";
import AddPaymentMethodCard from "../AddPaymentMethodCard";
import CardUI from "../CardUI";
import CustomText from "../CustomText";
import "./CardComponent.css";
import SavedCard from "./SavedCard";

const CardComponent = ({ tokens }) => {
  const navigate = useNavigate();
  const handleAddCard = () => {
    navigate(paymentRoutesConstant.ADD_CARD);
  };

  return (
    <div className="payment-type">
      <CustomText text={"Pay by Credit or Debit Card"} margin={`.5rem 0`} />
    <div>
    </div>
      <CardUI margin={`-2rem `}>
        {tokens && tokens.length > 0 && tokens.map((item, i) => <SavedCard card={item} key={i} />)}
        <AddPaymentMethodCard onClick={handleAddCard} title={"Add new card"} subTitle={"Save and pay via cards"} />
      </CardUI>
    </div>
  );
};

export default memo(CardComponent);
