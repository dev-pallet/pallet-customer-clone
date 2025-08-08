import { TextField } from "@mui/material";
import React, { memo } from "react";

const CustomInput = ({ ...props }) => {
  return (
    <TextField
      variant="outlined"
      size="small"
      sx={{
        fontSize: `12 !important`,
        color: "#000",
        backgroundColor: "#fff",
      }}
      {...props}
    />
  );
};

export default memo(CustomInput);
