// mui components
import { Typography } from "@mui/material";
import { toPascalCase } from "../../constants/commonFunction";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";
import { colorConstant } from "../../constants/colors";

const Text = ({
  text,
  overflow,
  fontsize,
  whitespace,
  textoverflow,
  textTransform,
  width,
  tint,
  fontweight,
  color,
  ...rest
}) => {
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const resolvedColor =
    color ?? tint ?? (retailType === "RESTAURANT" ? "#333333" : "#3e3f48");
  return (
    <Typography
      variant="h6"
      fontSize={fontsize ? fontsize : 12}
      textTransform={textTransform ? textTransform : "none"}
      fontWeight={fontweight ? fontweight : 600}
      overflow={overflow}
      textOverflow={textoverflow}
      whiteSpace={whitespace}
      width={width}
      {...rest}
      // color={tint ?  tint  : "#3e3f48"}
      color={resolvedColor}
    >
      {toPascalCase(text)}
    </Typography>
  );
};

export default Text;
