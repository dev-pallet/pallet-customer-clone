import React, { useState, useEffect } from "react";

//redux
import { setCoords } from "../redux/reducers/locationReducer";
import { useDispatch } from "react-redux";

const useCurrenLocation = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setData({
          latitude: position?.coords?.latitude,
          longitude: position?.coords?.longitude,
          // latitude: "11.341625736190393",
          // longitude: "77.71717066315132",

          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        dispatch(
          setCoords({
            latitude: position.coords?.latitude,
            longitude: position?.coords?.longitude,
            // latitude: "11.341625736190393",
            // longitude: "77.71717066315132",
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          })
        );
      });
    }
  }, []);

  return data;
};

export default useCurrenLocation;
