// react
import React, { useMemo, useState } from "react";

// custom-components
import HomeListingComponent from "../../home/components/HomeListingComponent";
import Text from "../../custom-components/Text";

// material ui
import { Box } from "@mui/material";

// constants
import { boxShadow } from "../../../constants/cssStyles";

export default function OrderAddressModal({ item }) {
  const [data, setData] = useState(null);
  useMemo(() => {
    setData(item);
  }, [item]);

  return (
    <>
      {/* shipping address  */}
      <HomeListingComponent title="Shipping Address">
        <Box
          className="order-details-shipping-address"
          sx={{ boxShadow: boxShadow }}
        >
          <Text
            text={
              "# " +
              data?.shippingAddress?.addressLine1 +
              data?.shippingAddress?.addressLine2
            }
          />
          <Text text={data?.shippingAddress?.city} />
          <Text text={data?.shippingAddress?.state} />
          <Text text={data?.shippingAddress?.pincode} />
        </Box>
      </HomeListingComponent>

      {/* billing address  */}
      <HomeListingComponent title="Billing Address">
        <Box
          className="order-details-billing-address"
          sx={{ boxShadow: boxShadow }}
        >
          <Text
            text={
              "# " +
              data?.billingAddress?.addressLine1 +
              data?.billingAddress?.addressLine2
            }
          />
          <Text text={data?.shippingAddress?.city} />
          <Text text={data?.shippingAddress?.state} />
          <Text text={data?.shippingAddress?.pincode} />
        </Box>
      </HomeListingComponent>
    </>
  );
}
