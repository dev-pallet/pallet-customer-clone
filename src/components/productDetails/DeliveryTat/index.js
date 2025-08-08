import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
//services
import { getExpectedDelivery } from "../../../config/services/serviceabilityService";

//redux
import { getDeliveryAddress } from "../../../redux/reducers/userReducer";
import { setPromise } from "../../../redux/reducers/miscReducer";

const DeliveryTat = ({ locId }) => {
  const address = useSelector(getDeliveryAddress);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (address !== null || address !== undefined) {
      getExpectedDelivery({
        locId,
        id: address?.pinCode || address?.pincode,
      })
        .then((res) => {
          if (res?.data?.data?.status) {
            setData(res?.data?.data);
          }
        })
        .catch((e) => {});
    }
  }, [address]);

  useEffect(() => {
    if (data) {
      dispatch(setPromise(data));
    }
  }, [data, dispatch]);

  const expectedDelivery = (() => {
    const temp = data
      ? extractDaysFromHrs(
          data?.expectedHours,
          Number(data?.orderWithInMinutes)
        )
      : null;
    dispatch(setPromise(data));
    return temp;
  })();

  return (
    <div>{expectedDelivery && `Expected Delivery: ${expectedDelivery}`}</div>
  );
};

export default DeliveryTat;
