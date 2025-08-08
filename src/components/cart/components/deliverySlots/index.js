import { Box, Button, Checkbox, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./index.css";
import Text from "../../../custom-components/Text";
import { colorConstant } from "../../../../constants/colors";
import { HiMiniTruck } from "react-icons/hi2";
import Heading from "../../../custom-components/Heading";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { boxShadow } from "../../../../constants/cssStyles";
import BottomDrawer from "../../../drawer";
import {
  getDeliverySlots,
  getInstantSlots,
} from "../../../../config/services/serviceabilityService";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { convertUTC } from "../../../../middlewares/convertUTCtoIST";
import { CircularLoader } from "../../../custom-components/CircularLoader";
import {
  getSelectedSlot,
  getStoreType,
  setSlot,
} from "../../../../redux/reducers/miscReducer";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InstantDeliveryModal from "./instantModal";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { calculateInstantDurationTime } from "../../../../constants/commonFunction";
import {
  getCartProducts,
  getDeliverySubOrderType,
} from "../../../../redux/reducers/cartReducer";

export default function DeliverySlots() {
  const slot = useSelector(getSelectedSlot);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [list, setList] = useState(null);
  const [openInstantModal, setOpenInstantModal] = useState(false);
  const [drawerState, setDrawerState] = useState(false);
  const [deliveryType, setDeliveryType] = useState("INSTANT");
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const showSnackbar = useSnackbar();
  const cartProducts = useSelector(getCartProducts);
  const nearByStore = useSelector(getNearByStore);
  const dispatch = useDispatch();
  const subOrderType = useSelector(getDeliverySubOrderType);
  const toggleDrawer = () => {
    if (slot) {
      // setDrawerState(!drawerState);
      setDrawerState(true);
    }
  };

  // Fetch instant delivery on mount
  useEffect(() => {
    if (nearByStore) {
      fetchInstantSlot(nearByStore, dispatch, setLoading, showSnackbar);
    }
  }, [nearByStore, dispatch]);
  async function fetchInstantSlot(
    nearByStore,
    dispatch,
    setLoading,
    showSnackbar
  ) {
    try {
      setLoading(true);
      const res = await getInstantSlots({ id: nearByStore?.regionId });
      const duration = res?.data?.data?.data?.data?.duration;
      const instantDeliveryId = res?.data?.data?.data?.data?.instantDeliveryId;

      dispatch(
        setSlot({
          deliveryType: "INSTANT",
          expectedDeliveryTime: duration,
          slotId: instantDeliveryId,
        })
      );
    } catch (err) {
      showSnackbar(err?.message, "error");
    } finally {
      setLoading(false);
    }
  }

  const getDeliveryTimeSlot = async () => {
    setLoading(true);
    try {
      await getDeliverySlots(nearByStore?.regionId).then((res) => {
        setLoading(false);
        if (res?.data?.status !== "SUCCESS") {
          return;
        }
        const data = res?.data?.data?.data;
        const firstDay = Object.keys(data)?.[0];
        const firstSlot = Object.values(data)?.[0]?.[0];

        setList(data);
        // setSelectedDay(Object.keys(res?.data?.data?.data)?.[0]);
        setSelectedDay(firstDay);

        if (!selectedSlot) {
          setSelectedSlot(firstSlot?.slot);
        }

        // if (Object.keys(res?.data?.data?.data)?.length) {
        //   const item = Object.values(res?.data?.data?.data)?.[0]?.[0];
        //   dispatch(
        //     setSlot({
        //       deliveryType: "SLOT",
        //       cutoffId: item?.cutoffId,
        //       slotId: item?.slot?.slotId,
        //       startTime: item?.slot?.startTime,
        //       endTime: item?.slot?.endTime,
        //     })
        //   );
        //   setSelectedSlot(item?.slot);
        // }
      });
    } catch (e) {
      showSnackbar(e?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   getDeliveryTimeSlot();
  // }, []);

  // Click handler for "or schedule it"
  const handleScheduleClick = async (e) => {
    e.stopPropagation();
    setDrawerState(true);
    if (!list) {
      await getDeliveryTimeSlot();
    }
  };
  // return (
  //   <Box
  //     className="delivery-slot-root-div"
  //     boxShadow={boxShadow}
  //     onClick={toggleDrawer}
  //   >
  //     {list && Object.keys(list)?.length > 0 ? (
  //       <>
  //         <Box
  //           className="content-left"
  //           alignItems="baseline"
  //           gap="5px"
  //           onClick={(e) => e.stopPropagation()}
  //         >
  //           <Text
  //             text={`Delivering ${
  //               moment(selectedDay).format("YYYY-MM-DD") ===
  //               moment(new Date()).format("YYYY-MM-DD")
  //                 ? "Today"
  //                 : moment(selectedDay).format("dddd")
  //             }`}
  //             fontsize="14px"
  //           />
  //           <Text
  //             text={`${convertUTC((slot || selectedSlot)?.startTime).format(
  //               "hh:mm A"
  //             )} - ${convertUTC((slot || selectedSlot)?.endTime).format(
  //               "hh:mm A"
  //             )}`}
  //             tint="red"
  //           />
  //           {/* <Heading
  //             text={`${
  //               moment(selectedDay).format("YYYY-MM-DD") ===
  //               moment(new Date()).format("YYYY-MM-DD")
  //                 ? "Today"
  //                 : moment(selectedDay).format("dddd")
  //             }`}
  //             tint={colorConstant?.primaryColor}
  //           /> */}
  //         </Box>

  //         <Box
  //           sx={{
  //             display: "flex",
  //             justifyContent: "flex-start",
  //             alignItems: "left",
  //           }}
  //         >
  //           <Text
  //             text="or schedule it"
  //             fontsize="12px"
  //             tint="red"
  //             onClick={(e) => {
  //               e.stopPropagation();
  //               // handleOpenInstantModal();
  //             }}
  //           />
  //           <ArrowForwardIcon fontSize={"small"} color={"error"} />
  //         </Box>
  //         {openInstantModal && (
  //           <Box className="content-space-between select-time-slot-div">
  //             <Box className="content-left" gap="5px">
  //               <HiMiniTruck
  //                 color={
  //                   retailType === "RESTAURANT"
  //                     ? colorConstant?.showdowColor
  //                     : colorConstant?.primaryColor
  //                 }
  //                 fontSize="22px"
  //               />
  //               <Text
  //                 text={`${convertUTC((slot || selectedSlot)?.startTime).format(
  //                   "hh:mm A"
  //                 )} - ${convertUTC((slot || selectedSlot)?.endTime).format(
  //                   "hh:mm A"
  //                 )}`}
  //               />
  //             </Box>
  //             <Box>
  //               <ArrowForwardIosIcon className="dropdown-icon" />
  //             </Box>
  //           </Box>
  //         )}
  //       </>
  //     ) : (
  //       <Box className="content-left">
  //         <ErrorOutlineIcon
  //           fontSize="20px"
  //           sx={{ color: colorConstant?.requiredColor }}
  //         />
  //         <Text
  //           text="No delivery slot available. Please try after sometime."
  //           tint={
  //             retailType === "RESTAURANT"
  //               ? colorConstant?.showdowColor
  //               : colorConstant?.requiredColor
  //           }
  //         />
  //       </Box>
  //     )}

  //     {list && (
  //       <BottomDrawer
  //         sx={{ zIndex: 1301 }}
  //         drawerStateProp={drawerState}
  //         setDrawerStateProp={setDrawerState}
  //         drawerContent={
  //           <>
  //             <Box>
  //               {loading && <CircularLoader />}
  //               {Object.entries(list)?.map(([key, value]) => (
  //                 <Box key={key}>
  //                   <Box sx={{ backgroundColor: "gainsboro", padding: "10px" }}>
  //                     <Text
  //                       text={
  //                         moment(key).format("YYYY-MM-DD") ===
  //                         moment(new Date()).format("YYYY-MM-DD")
  //                           ? "Today"
  //                           : moment(key).format("dddd")
  //                       }
  //                       fontweight="bold"
  //                     />
  //                   </Box>
  //                   {value?.map((item, i) => (
  //                     <Box
  //                       className="content-left"
  //                       key={i}
  //                       onClick={() => {
  //                         dispatch(
  //                           setSlot({
  //                             cutoffId: item?.cutoffId,
  //                             slotId: item?.slot?.slotId,
  //                             startTime: item?.slot?.startTime,
  //                             endTime: item?.slot?.endTime,
  //                           })
  //                         );
  //                         setSelectedSlot(item?.slot);
  //                         setSelectedDay(key);
  //                       }}
  //                     >
  //                       <Checkbox
  //                         size="small"
  //                         checked={
  //                           selectedSlot?.slotId === item?.slot?.slotId
  //                             ? true
  //                             : false
  //                         }
  //                         inputProps={{ "aria-label": "controlled" }}
  //                       />
  //                       <Text
  //                         text={`${convertUTC(item?.slot?.startTime).format(
  //                           "hh:mm A"
  //                         )} - ${convertUTC(item?.slot?.endTime).format(
  //                           "hh:mm A"
  //                         )}`}
  //                       />
  //                     </Box>
  //                   ))}
  //                 </Box>
  //               ))}
  //             </Box>
  //           </>
  //         }
  //       />
  //     )}
  //     {openInstantModal && (
  //       <InstantDeliveryModal
  //         openInstantModal={openInstantModal}
  //         setOpenInstantModal={setOpenInstantModal}
  //         selectedDay={selectedDay}
  //         setSelectedDay={setSelectedDay}
  //       />
  //     )}
  //   </Box>
  // );
  return (
    <Box
      className="delivery-slot-root-div"
      // boxShadow={boxShadow}
    >
      {loading && <CircularLoader />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Text
            text={"Added Items"}
            tint="#0B0B0B"
            color="#0B0B0B"
            fontsize="16px"
            fontweight="600"
          />
          {/* <Text text={`${cartProducts?.length}items`} tint="black" /> */}
        </Box>
        <Box>
          <Box className="content-left" alignItems="baseline" gap="5px">
            {deliveryType === "INSTANT" && subOrderType !== "TAKE_AWAY" ? (
              <>
                <Text
                  text={`Delivery in ${
                    slot?.expectedDeliveryTime
                      ? calculateInstantDurationTime(slot?.expectedDeliveryTime)
                      : ""
                  }`}
                  fontsize="10px"
                  fontweight="600"
                  color="#333333"
                />
              </>
            ) : (
              <>
                <Text
                  text={`Delivering ${
                    moment(selectedDay).format("YYYY-MM-DD") ===
                    moment(new Date()).format("YYYY-MM-DD")
                      ? "Today"
                      : moment(selectedDay).format("dddd")
                  }`}
                  fontsize="10px"
                  fontweight="600"
                  color="#333333"
                />
                <Text
                  text={`${convertUTC(slot?.startTime).format(
                    "hh:mm A"
                  )} - ${convertUTC(slot?.endTime).format("hh:mm A")}`}
                  tint="rgb(173, 26, 25)"
                  fontweight="600"
                  fontsize="9px"
                />
              </>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              cursor: "pointer",
              gap: "6px",
            }}
            onClick={handleScheduleClick}
          >
            <Text
              text="or schedule it"
              fontsize="9px"
              tint="rgb(173, 26, 25)"
              fontweight={"600"}
            />
            <ArrowForwardIcon fontSize={"small"} color={"error"} />
          </Box>
        </Box>
      </Box>
      <BottomDrawer
        sx={{ zIndex: 1301 }}
        drawerStateProp={drawerState}
        setDrawerStateProp={setDrawerState}
        drawerContent={
          <Box>
            <Box
              sx={{
                padding: "16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Heading text="Schedule your delivery" />
              <IconButton onClick={() => setDrawerState(false)}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>

            {/* Instant Delivery Option */}
            {subOrderType !== "TAKE_AWAY" && (
              <Box
                onClick={async () => {
                  setDeliveryType("INSTANT");
                  setDrawerState(false);
                  setLoading(true);
                  const res = await getInstantSlots({
                    id: nearByStore?.regionId,
                  });
                  const duration = res?.data?.data?.data?.data?.duration;
                  const instantDeliveryId =
                    res?.data?.data?.data?.data?.instantDeliveryId;

                  dispatch(
                    setSlot({
                      deliveryType: "INSTANT",
                      expectedDeliveryTime: duration,
                      slotId: instantDeliveryId,
                    })
                  );
                  setLoading(false);
                }}
                className="content-left"
                sx={{
                  cursor: "pointer",
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                }}
              >
                <Checkbox checked={deliveryType === "INSTANT"} />
                <Text text={`Instant delivery`} />
                <Text
                  text={`in ${calculateInstantDurationTime(
                    slot?.expectedDeliveryTime
                  )}`}
                />
              </Box>
            )}

            {/* Scheduled Slots */}
            {list &&
              Object.entries(list)?.map(([day, slots]) => (
                <Box key={day}>
                  <Box sx={{ backgroundColor: "gainsboro", padding: "10px" }}>
                    <Text
                      text={
                        moment(day).format("YYYY-MM-DD") ===
                        moment(new Date()).format("YYYY-MM-DD")
                          ? "Today"
                          : moment(day).format("dddd")
                      }
                      fontweight="bold"
                    />
                  </Box>
                  {slots?.map((item, i) => (
                    <Box
                      key={i}
                      className="content-left"
                      onClick={() => {
                        setDeliveryType("SLOT");
                        dispatch(
                          setSlot({
                            deliveryType: "SLOT",
                            cutoffId: item?.cutoffId,
                            slotId: item?.slot?.slotId,
                            startTime: item?.slot?.startTime,
                            endTime: item?.slot?.endTime,
                          })
                        );
                        setSelectedSlot(item?.slot);
                        setSelectedDay(day);
                        setDrawerState(false);
                      }}
                      sx={{ padding: "8px", cursor: "pointer" }}
                    >
                      <Checkbox
                        checked={
                          deliveryType === "SLOT" &&
                          selectedSlot?.slotId === item?.slot?.slotId
                        }
                      />
                      <Text
                        text={`${convertUTC(item?.slot?.startTime).format(
                          "hh:mm A"
                        )} - ${convertUTC(item?.slot?.endTime).format(
                          "hh:mm A"
                        )}`}
                      />
                    </Box>
                  ))}
                </Box>
              ))}
          </Box>
        }
      />
    </Box>
  );
}
