// react
import React from "react";

// mui components
import { Box } from "@mui/material";

// custom components
import Text from "../../custom-components/Text";

// constants
import { boxShadow } from "../../../constants/cssStyles";
import { colorConstant } from "../../../constants/colors";

// icon
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import SouthWestIcon from "@mui/icons-material/SouthWest";
import NorthEastIcon from "@mui/icons-material/NorthEast";

// styles
import "./transactionCard.css";
import { convertUTC } from "../../../middlewares/convertUTCtoIST";

export default function TransactionCard({ item }) {
  const { created, startingBalance, closingBalance, amount, transactionType } =
    item;

  const RupeeIcon = ({ main }) => (
    <CurrencyRupeeIcon
      className={`rupeeIcon ${main && debitedOrRefundedColor}`}
    />
  );
  const debitedOrRefundedColor =
    transactionType === "REFUND" ? "refundedColor " : "debitedColor";

  return (
    <Box
      sx={{
        boxShadow: boxShadow,
      }}
      className="transaction-card"
    >
      <Box>
        {transactionType === "REFUND" && (
          <SouthWestIcon className="refundIcon" />
        )}
        {transactionType === "DEBIT" && <NorthEastIcon className="debitIcon" />}
      </Box>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Box className="content-space-between">
          <Text
            text={transactionType ? transactionType : "TRANSACTION STATUS"}
            fontweight={"bold"}
          />
          <Box className="content-center" gap={0}>
            <Box className={debitedOrRefundedColor}>
              {transactionType === "REFUND" ? "+" : "-"}
            </Box>
            <RupeeIcon main={true} />
            <Text text={`${amount || 78}`} className={debitedOrRefundedColor} />
          </Box>
        </Box>
        <Text text={`${convertUTC(created)?.format("DD-MM-YYYY | hh:mm a")}`} />
        <Box className="content-left">
          <Text text="Starting Balance" />
          <Box className="content-center" gap={0}>
            <RupeeIcon />
            <Text text={startingBalance || 0} />
          </Box>
        </Box>
        <Box className="content-left">
          <Text text="Closing Balance" />
          <Box className="content-center" gap={0}>
            <RupeeIcon />
            <Text text={closingBalance || 0} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
