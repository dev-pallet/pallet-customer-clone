import { Button, CircularProgress } from "@mui/material";
import React, { memo } from "react";
import { colorConstant } from "../color";
import "./Customs.css";
const CustomButton = ({ title, loading, ...props }) => {
  return (
    <Button
      variant="outlined"
      className="btn"
      sx={{
        // backgroundColor: colorConstant.primaryColor,
        color: "#fff",
        width: "90%",
      }}
      {...props}
    >
      {loading ? <CircularProgress color="inherit" size={20} /> : title}
    </Button>
  );
};

export default memo(CustomButton);
