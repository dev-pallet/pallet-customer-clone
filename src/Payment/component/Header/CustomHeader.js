import { Stack } from "@mui/material";
import React from "react";
import CustomText from "../CustomText";
import { ChevronLeft } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./customHeader.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getOrder } from "../../../redux/Reducers/customerReducer";

const CustomHeader = ({ title, subTitle, onBackPress }) => {
  const navigate = useNavigate();
  const orderData = useSelector(getOrder);
  return (
    <div className="payment-methods-header">
      <ArrowBackIcon
        onClick={
          onBackPress
            ? onBackPress
            : () => {
                navigate(-1);
              }
        }
      />
      <div style={{ marginLeft: "1rem" }}>
        <CustomText heading text={title} fontSize={18} />
        <CustomText
          tint
          text={subTitle || (orderData && `Total: \u20b9${orderData?.amount} `)}
        />
      </div>
    </div>
  );
};

export default CustomHeader;
