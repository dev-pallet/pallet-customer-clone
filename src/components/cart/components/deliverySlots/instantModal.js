import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import moment from "moment";
import Heading from "../../../custom-components/Heading";
import { colorConstant } from "../../../../constants/colors";
import {
  getDeliverySlots,
  getInstantSlots,
} from "../../../../config/services/serviceabilityService";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";
import { useDispatch, useSelector } from "react-redux";
import {
  getSelectedSlot,
  setSlot,
} from "../../../../redux/reducers/miscReducer";
import {
  calculateInstantDurationTime,
  convertUTC,
  formatDate,
} from "../../../../constants/commonFunction";

const InstantDeliveryModal = ({
  setOpenInstantModal,
  openInstantModal,
  selectedDay,
  setSelectedDay,
}) => {
  const [instantSlot, setInstantSlot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState(null);
  const [prevSlotValue, setPrevSlotValue] = useState(null);
  const nearByStore = useSelector(getNearByStore);
  const dispatch = useDispatch();
  const slot = useSelector(getSelectedSlot);
  const handleClose = () => {
    setOpenInstantModal(false);
  };

  const fetchInstantSlot = async () => {
    try {
      const res = await getInstantSlots({ id: nearByStore?.regionId });
      //   if (res?.data?.es !== 0) {
      //     return;
      //   }

      const duration = res?.data?.data?.data?.data?.duration;
      const instantDeliveryId = res?.data?.data?.data?.data?.instantDeliveryId;

      if (duration) {
        setPrevSlotValue(slot);
        setInstantSlot({
          deliveryType: "INSTANT",
          expectedDeliveryTime: duration,
          slotId: instantDeliveryId,
        });

        dispatch(
          setSlot({
            deliveryType: "INSTANT",
            expectedDeliveryTime: duration,
            slotId: instantDeliveryId,
          })
        );
      }
    } catch (error) {}
  };

  const fetchDeliverySlots = async () => {
    try {
      const res = await getDeliverySlots(nearByStore?.regionId);

      if (res?.data?.status !== "SUCCESS") return;

      const data = res?.data?.data?.data;
      const firstDay = Object.keys(data)?.[0];
      const item = Object.values(res?.data?.data?.data)?.[0]?.[0];
      setList(data);
      setSelectedDay(firstDay);

      dispatch(
        setSlot({
          ...prevSlotValue,
          cutoffId: item?.cutoffId,
          slotId: item?.slot?.slotId,
          startTime: item?.slot?.startTime,
          endTime: item?.slot?.endTime,
        })
      );

      setSelectedSlot(item?.slot);
    } catch (error) {
      // Optional: handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSlots = useCallback(async () => {
    if (!nearByStore) return;

    setLoading(true);
    await fetchInstantSlot();
    await fetchDeliverySlots();
  }, [nearByStore]);

  useEffect(() => {
    fetchAllSlots();
  }, [fetchAllSlots]);

  const deliveryTime = useMemo(() => {
    if (slot?.deliveryType === "INSTANT") {
      return `in ${calculateInstantDurationTime(slot?.expectedDeliveryTime)}`;
    }
    return `${formatDate(slot?.startTime)} (${convertUTC(
      slot?.startTime
    ).format("hh")}-${convertUTC(slot?.endTime).format("hh:mm A")})`;
  }, [slot]);

  return (
    <div>
      <Dialog open={openInstantModal} onClose={handleClose}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <h2>Schedule your Delivery</h2>
          <IconButton onClick={handleClose}></IconButton>
        </Box>
        <DialogContent>
          <Box>
            <p> Instant Delivery</p>
            <p> Expected Delivery {deliveryTime}</p>
            <TaskAltIcon />
          </Box>
        </DialogContent>
        <DialogActions>
          <Box>
            <p>Available Slots</p>
            <Heading
              text={`${
                moment(selectedDay).format("YYYY-MM-DD") ===
                moment(new Date()).format("YYYY-MM-DD")
                  ? "Today"
                  : moment(selectedDay).format("dddd")
              }`}
              tint={colorConstant?.primaryColor}
            />
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InstantDeliveryModal;
