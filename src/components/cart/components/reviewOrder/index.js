import React from "react";

// mui components
import { Box } from "@mui/material";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

//css
import "./index.css";

//custom-components
import Heading from "../../../custom-components/Heading";
import Text from "../../../custom-components/Text";

const ReviewOrder = () => {
  return (
    <Box className="review-order">
      <Box className="review-order-header">
        <Box
          my="2px"
          flex="1"
          alignItems="center"

          // borderLeft="4px solid yellow"
        >
          <Heading
            text={"Review Order To Avoid Cancellation"}
            paddingLeft="5px"
            fontsize={12}
            sx={{ color: "#0B0B0B" }}
          />
        </Box>
      </Box>
      <Box className="review-order-details">
        <Box className="order-details-top">
          <WatchLaterIcon className="review-order-clock-icon" />
          <Text
            text={
              "Orders cannot be cancelled and are non-refundable once packed for delivery."
            }
            sx={{
              color: "#0B0B0B",
            }}
            fontsize={11}
          />
        </Box>
        <Box className="order-details-bottom">
          <Box className="review-order-rupee-icon">
            <CurrencyRupeeIcon className="rupee-icon" />
          </Box>
          <Text
            text={
              "In case of unexpected delays or issues, a refund will be provided"
            }
            sx={{
              color: "#0B0B0B",
            }}
            fontsize={11}
          />
        </Box>
        {/* <hr className="review-horizontal-line" /> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#efeeee",
            margin: "6px",
            borderRadius: "3px",
          }}
        >
          <Text text={"Note: "} fontsize={9} tint={"rgb(173, 26, 25)"} />

          <Text
            text={
              "Check your order and address details before placing the order"
            }
            padding={"0.5rem"}
            fontsize={"9px"}
            tint={"rgb(173, 26, 25)"}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ReviewOrder;
