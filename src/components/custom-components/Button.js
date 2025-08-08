import { Button } from "@mui/material";

//css
import "./Button.css";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";
import { colorConstant } from "../../constants/colors";

const StyledButton = ({
  variant,
  text,
  bg,
  clr,
  fs,
  fw,
  mg,
  width,
  height,
  icon,
  endIcon,
  border,
  borderRadius,
  textTransform,
  type,
  disabled,
  ...rest
}) => {
  const retailType = useSelector(getStoreType);
  return (
    <Button
      variant={variant}
      className="styled-btn"
      sx={{
        backgroundColor: bg
          ? bg
          : retailType === "RESTAURANT"
          ? colorConstant?.sakuraRestroColor
          : "rgb(12, 121, 36)",
        color: clr ? clr : "white",
        width: width ? width : "100%",
        height: height ? height : "37px",
        fontSize: fs ? fs : "10px",
        fontWeight: fw ? fw : "normal",
        margin: mg ? mg : "2%",
        border: border,
        borderRadius: borderRadius,
        textTransform: textTransform,
        "&:hover": {
          backgroundColor: bg
            ? bg
            : retailType === "RESTAURANT"
            ? colorConstant?.showdowColor
            : "rgb(12, 121, 36)",
          color: clr ? clr : "white",
        },
      }}
      disabled={disabled ? disabled : false}
      {...rest}
      startIcon={icon}
      endIcon={endIcon}
      type={type}
    >
      {text}
    </Button>
  );
};

export default StyledButton;
