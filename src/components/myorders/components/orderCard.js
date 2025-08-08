// react
import { useNavigate } from "react-router";

//mui components
import { Box, Card, Divider } from "@mui/material";

//cutsom components
import StyledButton from "../../custom-components/Button";
import Text from "../../custom-components/Text";

//middlewares

//ui components
import { OrderItemList } from "./orderItemList";

// constants
import { variables } from "../../../constants/variables";

//styles
import { convertUTC } from "../../../middlewares/convertUTCtoIST";
import "../index.css";

// constants
import { colorConstant } from "../../../constants/colors";
import { boxShadow } from "../../../constants/cssStyles";

// icons
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { memo } from "react";

const OrderCard = ({ data }) => {
  const navigate = useNavigate();

  //   const baseOrderResponse = data?.baseOrderResponse;

  //   const redBgStatus =
  //     baseOrderResponse?.fulfilmentStatus === "CANCELLED" &&
  //     colorConstant.lightRedBackground;

  //   const goToOrderDetails = () => {
  //     navigate(`/order-details/${baseOrderResponse?.orderId}`);
  //   };
  //   const trackOrder = () => {
  //     navigate(`/order-details/track/${baseOrderResponse?.orderId}`);
  //   };

  return (
    <>
      {data?.map((item, index) => {
        const orderStatus =
          item?.baseOrderResponse?.fulfilmentStatus === "DELIVERED"
            ? "deliveredOrder"
            : item?.baseOrderResponse?.fulfilmentStatus === "" ||
              item?.baseOrderResponse?.fulfilmentStatus === "CANCELLED"
            ? "cancelledOrder"
            : "defaultOrderColor";

        const redBgStatus =
          item?.baseOrderResponse?.fulfilmentStatus === "CANCELLED" &&
          colorConstant?.lightRedBackground;

        const goToOrderDetails = () => {
          navigate(`/order-details/${item?.baseOrderResponse?.orderId}`);
        };
        const trackOrder = () => {
          navigate(`/order-details/track/${item?.baseOrderResponse?.orderId}`);
        };
        return (
          <Card
            className="order-card-main"
            sx={{ boxShadow: boxShadow }}
            onClick={goToOrderDetails}
            key={index + 1}
          >
            <Box
              className="order-sub-card"
              sx={{ backgroundColor: redBgStatus }}
            >
              <Box>
                <Text text={"Order Id: " + item?.baseOrderResponse?.orderId} />
                <Text
                  text={`${convertUTC(
                    item?.baseOrderResponse?.createdAt
                  ).format("DD-MM-YYYY")} | ${convertUTC(
                    item?.baseOrderResponse?.createdAt
                  ).format("hh:mm A")} `}
                  tint="rgb(134,140,150)"
                  fontsize={12}
                />
              </Box>
              <Box>
                <Text
                  text={variables[item?.baseOrderResponse?.fulfilmentStatus]}
                  className={`order-status-badge ${orderStatus}`}
                />
              </Box>
            </Box>
            <Divider />
            <Box className="order-cub-card-box">
              <Box>
                {item && (
                  <OrderItemList
                    gtins={item?.baseOrderResponse?.orderItemList?.[0]?.gtin}
                    item={item?.baseOrderResponse?.lineItems}
                  />
                )}
              </Box>
              <Box className="order-card-total" mt={2}>
                <Text text="Total Order Value :" fontsize={12} />
                <Text
                  text={"₹" + item?.orderBillingDetails?.grandTotal}
                  fontsize={12}
                />
              </Box>
              {item?.baseOrderResponse?.fulfilmentStatus !== "CANCELLED" && (
                <Box className="order-card-stat" mt={2}>
                  <StyledButton
                    text={
                      <>
                        <PhoneOutlinedIcon
                          sx={{
                            width: "20px",
                            height: "20px",
                            marginRight: "5px",
                          }}
                        />
                        Support
                      </>
                    }
                    bg={colorConstant?.white}
                    clr={colorConstant?.primaryColor}
                    textTransform={"capitalize"}
                    fw={"bold"}
                    width={"100px"}
                    mg={"0"}
                  />
                  <StyledButton
                    textTransform={"capitalize"}
                    text={"Track Order"}
                    fw={"bold"}
                    width={"100px"}
                    borderRadius={"1rem"}
                    mg={"0"}
                    onClick={(event) => {
                      event.stopPropagation();
                      trackOrder();
                    }}
                  />
                </Box>
              )}
            </Box>
          </Card>
        );
      })}
    </>
  );
};

export default memo(OrderCard);
