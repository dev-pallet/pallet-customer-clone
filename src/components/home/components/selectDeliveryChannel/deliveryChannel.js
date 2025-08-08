import React, { useState, useEffect } from "react";
import "./deliveryChannel.css";
import { getInstantSlots } from "../../../../config/services/serviceabilityService";
import { useDispatch, useSelector } from "react-redux";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";
import {
  getSelectedSlot,
  setSlot,
} from "../../../../redux/reducers/miscReducer";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  getDeliverySubOrderType,
  setDeliveryType,
} from "../../../../redux/reducers/cartReducer";
import { CircularProgress } from "@mui/material";
import { CircularLoader } from "../../../custom-components/CircularLoader";
import { colorConstant } from "../../../../constants/colors";

const DeliveryChannel = () => {
  const [selected, setSelected] = useState("Delivery");
  const [loading, setLoading] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("INSTANT");
  const [instantDeliveryTime, setInstantDeliveryTime] = useState("");

  const slot = useSelector(getSelectedSlot);
  const nearByStore = useSelector(getNearByStore);
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const getDeliveryType = useSelector(getDeliverySubOrderType);

  const tabs = [
    { label: "Delivery" },
    { label: "Takeaway", sub: "Select Store" },
    // { label: "Dine-in", sub: "Select Store" },
  ];

  //set   dispatch(setDeliveryCharges()) on the basis of tabs selected,
  // also called

  useEffect(() => {
    if (nearByStore) {
      fetchInstantSlot(nearByStore);
    }
  }, [nearByStore]);

  async function fetchInstantSlot(nearByStore) {
    try {
      setLoading(true);
      const res = await getInstantSlots({ id: nearByStore?.regionId });

      const duration = res?.data?.data?.data?.data?.duration;
      const instantDeliveryId = res?.data?.data?.data?.data?.instantDeliveryId;
      if (duration) {
        setInstantDeliveryTime(duration);
      }

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
  const handleTabClick = async (tabLabel) => {
    setSelected(tabLabel);

    if (tabLabel === "Delivery") {
      try {
        setDeliveryStatus("INSTANT"); // need to change the state name
        dispatch(setDeliveryType(selected.toUpperCase()));
        setLoading(true);

        const res = await getInstantSlots({
          id: nearByStore?.regionId,
        });
        const duration = res?.data?.data?.data?.data?.duration;
        const instantDeliveryId =
          res?.data?.data?.data?.data?.instantDeliveryId;

        if (duration) {
          setInstantDeliveryTime(duration);
        }

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
    } else {
      //if take-away
      setLoading(true);
      navigate("/location-list");
    }
  };
  {
    /* ${
                  instantDeliveryTime % 60
                } sec */
  }
  return (
    <div className="tabs">
      {tabs?.map((tab) => (
        <button
          key={tab?.label}
          className={`tab ${selected === tab?.label ? "selected" : ""}`}
          onClick={() => handleTabClick(tab?.label)}
        >
          <div className="tab-title">{tab?.label}</div>
          <div className="tab-sub">
            {tab?.label === "Delivery" ? (
              loading ? (
                <CircularLoader
                  sx={{
                    color: "black !important",
                    width: "10px !important",
                    height: "10px !important",
                  }}
                />
              ) : (
                `${Math.floor(instantDeliveryTime / 60)} min `
              )
            ) : loading ? (
              <CircularLoader
                sx={{
                  color: "black !important",
                  width: "10px !important",
                  height: "10px !important",
                }}
              />
            ) : (
              tab?.sub
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default DeliveryChannel;
