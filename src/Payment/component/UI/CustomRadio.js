import React from "react";
import Radio from "@mui/material/Radio";
import { colorConstant } from "../color";
const CustomRadio = ({ value, ...props }) => {
  return (
    <Radio
      //   checked={selectedValue === "a"}
      //   onChange={handleChange}
      //   value="a"
      //   color={colorConstant.primaryColor}
      name="radio-buttons"
      size="small"
      sx={{ color: colorConstant?.primaryColor }}
      {...props}
    />
  );
};

export default CustomRadio;
