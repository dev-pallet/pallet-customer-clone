// mui component
import { Box, CircularProgress } from "@mui/material";

// custom components
import Text from "./Text";

// constatnt
import { colorConstant } from "../../constants/colors";

export const CircularLoader = ({ text }) => {
  const styles = {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  };

  const retailType = localStorage.getItem("retailType");
  return (
    <Box sx={styles}>
      <CircularProgress
        sx={{
          color:
            retailType === "RESTAURANT"
              ? colorConstant?.sakuraRestroColor
              : colorConstant.primaryColor,
          width: "10px !important",
          height: "10px !important",
        }}
      />
      <Text
        text={text || "Loading"}
        tint={
          retailType === "RESTAURANT"
            ? colorConstant?.sakuraRestroColor
            : colorConstant.primaryColor
        }
      />
    </Box>
  );
};
