import React from "react";
import CustomText from "./CustomText";
import "./AddPaymentMethodCard.css";
import CardUI from "./CardUI";
import AddIcon from "@mui/icons-material/Add";
import { colorConstant } from "./color";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const AddPaymentMethodCard = ({ title, onClick, subTitle }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div className="add-card">
        <div
          style={{
            padding: "2px 4px",
            border: `1px solid grey`,
            borderRadius: `5px`,
            margin: `0 10px`,
          }}
        >
          <AddIcon
            style={{
              color: colorConstant?.primaryColor,
            }}
          />
        </div>

        <div>
          <CustomText
            text={title}
            heading
            color={colorConstant?.primaryColor}
          />
          <CustomText
            text={subTitle}
            color={colorConstant?.primaryColor}
            fontSize={12}
          />
        </div>
      </div>
      <ChevronRightIcon sx={{ margin: `0 1rem`, color: "gray" }} />
    </div>
  );
};

export default AddPaymentMethodCard;
