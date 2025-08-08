// react
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

// material ui
import { Box } from "@mui/material";

// custom components
import CartBillDetails from "../cart/components/billDetails";
import Text from "../custom-components/Text";
import HomeListingComponent from "../home/components/HomeListingComponent";
import Menuback from "../menuback";
import OrderAddressModal from "./components/orderAddressModal";
import OrderedItems from "./components/orderedItems";

// constants
import { colorConstant } from "../../constants/colors";
import { formatDateTime, ScrollToTop } from "../../constants/commonFunction";
import { boxShadow } from "../../constants/cssStyles";

// service
import { fetchOrderDetailsById } from "../../config/services/orderService";

// middlewares
import { convertUTC } from "../../middlewares/convertUTCtoIST";

// styles
import "./index.css";
import { applyDeliveryCharges } from "../../config/services/cartService";
import {
  getDonationAmount,
  getTipAmount,
  setDonationAmount,
  setUserSelectedTip,
} from "../../redux/reducers/cartReducer";

export default function OrderDetails({ page }) {
  const params = useParams();
  const [orderDetail, setOrderDetail] = useState({});
  const [orderedItems, setOrderedItems] = useState([]);
  const [orderBillingDetails, setOrderBillingDetails] = useState({});

  const getOrderDetails = async () => {
    try {
      await fetchOrderDetailsById({ id: params?.orderId }).then((res) => {
        if (res?.data?.status === "ERROR") {
          showSnackbar(res?.data?.message, "error");
          return;
        }
        setOrderDetail(res?.data?.data);
        setOrderedItems(res?.data?.data?.baseOrderResponse?.orderItemList);
        setOrderBillingDetails(res?.data?.data?.orderBillingDetails);

        dispatch(
          setUserSelectedTip(orderData?.orderBillingDetails?.tip ?? null)
        );
        dispatch(
          setDonationAmount(orderData?.orderBillingDetails?.donation ?? null)
        );
      });
    } catch (err) {
      setOrderedItems([]);
    }
  };
  useEffect(() => {
    getOrderDetails();
  }, [params]);

  useEffect(() => {
    ScrollToTop();
  }, []);

  const handleDelivery = async (data) => {
    try {
      const res = await applyDeliveryCharges(data);
      dispatch(setCartBill(res?.data?.data?.billing));
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };
  return (
    <Box className="order-details-root-div">
      {!page && (
        <Menuback
          bg={colorConstant?.baseBackground}
          head={true}
          text="Order Summary"
          wishlist={true}
        />
      )}
      <Box marginTop={!page && "3rem"}>
        {/* items ordered  */}
        {orderedItems && (
          <HomeListingComponent title={"Items Ordered"}>
            <OrderedItems items={orderedItems} />
          </HomeListingComponent>
        )}
        {/* Bill Details */}
        <CartBillDetails
          page="orderDetails"
          orderBillingDetails={orderBillingDetails}
        />
        {/* order details  */}
        <HomeListingComponent title={"Order Details"}>
          <Box className="order-details-card" sx={{ boxShadow: boxShadow }}>
            {/* OrderId */}
            <Box mb={1}>
              <Text text={"Order ID"} tint={colorConstant?.lightgraytext} />
              <Text
                text={orderDetail?.baseOrderResponse?.orderId}
                fontweight={"bold"}
              />
            </Box>
            {/* Order On Date */}
            <Box mb={1}>
              <Text text="Ordered On" tint={colorConstant?.lightgraytext} />
              <Text
                text={`${formatDateTime(
                  orderDetail?.baseOrderResponse?.createdAt,
                  "DD-MMM-YYYY"
                )} | ${formatDateTime(
                  orderDetail?.baseOrderResponse?.createdAt,
                  "hh:mm a"
                )}`}
                fontweight={"bold"}
              />
            </Box>
            {/* Delivery date and time */}
            <Box mb={1} className="content-space-between">
              <Box>
                <Text
                  text="Delivery Date"
                  tint={colorConstant?.lightgraytext}
                />
                <Text
                  text={moment(orderDetail?.baseOrderResponse?.endTime).format(
                    "DD-MM-YYYY"
                  )}
                  fontweight={"bold"}
                />
              </Box>
              <Box>
                <Text
                  text="Expected Delivery Time"
                  tint={colorConstant?.lightgraytext}
                />
                <Text
                  text={`${formatDateTime(
                    orderDetail?.baseOrderResponse?.startTime,
                    "hh:mm a"
                  )} - ${formatDateTime(
                    orderDetail?.baseOrderResponse?.endTime,
                    "hh:mm a"
                  )}`}
                  fontweight={"bold"}
                />
              </Box>
            </Box>
            {/* mode of payment  */}
            <Box mb={1}>
              <Text text="Payment" tint={colorConstant?.lightgraytext} />
              <Text
                text={
                  orderDetail?.orderBillingDetails?.paymentMethod === "COD"
                    ? "Cash On Delivery"
                    : orderDetail?.orderBillingDetails?.paymentMethod
                }
                fontweight={"bold"}
              />
            </Box>
          </Box>
        </HomeListingComponent>

        {/* shipping and billing address */}
        <OrderAddressModal item={orderDetail?.addressEntityModel} />
      </Box>
    </Box>
  );
}
