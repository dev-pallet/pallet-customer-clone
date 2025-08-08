import { Typography } from "@mui/material";
import { toPascalCase } from "../../constants/commonFunction";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";
import { colorConstant } from "../../constants/colors";

const Heading = ({
  text,
  overflow,
  fontsize,
  whitespace,
  textoverflow,
  fontweight,
  width,
  tint,
  ...rest
}) => {
  const retailType = useSelector(getStoreType);
  const renderText = () => {
    if (typeof text === "string") {
      return toPascalCase(text);
    }
    return text; // JSX element like <img />, <Box>, icon + text, etc.
  };
  return (
    <Typography
      variant="h4"
      textTransform={"capitalize"}
      fontSize={fontsize ? fontsize : 12}
      fontWeight={fontweight ? fontweight : 500}
      overflow={overflow}
      textOverflow={textoverflow}
      whiteSpace={whitespace}
      width={width}
      //   color={
      //     tint
      //       ? retailType === "RESTAURANT"
      //         ? colorConstant?.sakuraRestroColor
      //         : tint
      //       : "#3e3f48"
      //   }
      color={retailType === "RESTAURANT" ? "#333333" : "#3e3f48"}
      {...rest}
    >
      {renderText()}
    </Typography>
  );
};

export default Heading;
