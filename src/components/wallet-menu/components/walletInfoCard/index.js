import React from "react";

// mui compnents
import { Box, Divider } from "@mui/material";

//cutsom-components
import Text from "../../../custom-components/Text";
import { useSelector } from "react-redux";
import { getStoreType } from "../../../../redux/reducers/miscReducer";
import { colorConstant } from "../../../../constants/colors";

const WalletInfoCard = ({ item }) => {
  const [key, value] = item;
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  return (
    <Box className="content-space-between">
      <Text
        text={key === "DEFAULT" ? "Twinleaves Credits" : "Gift Card Balance"}
        style={{
          color:
            retailType === "RESTAURANT"
              ? colorConstant?.showdowColor
              : colorConstant?.primaryColor,
        }}
      />
      <Text
        text={`\u20b9${value?.reduce((prev, nxt) => prev + nxt?.amount, 0)}`}
        fontWeight={700}
      />
    </Box>
  );
};

export default WalletInfoCard;
