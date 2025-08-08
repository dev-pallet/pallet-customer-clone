import { Typography } from "@mui/material";
import React from "react";
import { colorConstant } from "./color";

const CustomText = ({
  wrap,
  text,
  heading = false,
  tint = false,
  ...props
}) => {
  return (
    <Typography
      style={{
        fontSize: heading ? 16 : 14,
        color: tint ? "grey" : colorConstant.iconColor,
        fontWeight: heading ? 800 : 500,
        ...props,
      }}
    >
      {text}
    </Typography>
  );
};

export default CustomText;
