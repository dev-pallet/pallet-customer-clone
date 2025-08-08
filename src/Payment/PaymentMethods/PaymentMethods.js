import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menuback from "../../components/menuback";
import { updateCustomer } from "../../config/services/customerService";
import { getBillingData } from "../../redux/reducers/cartReducer";
import { getUserData, setUserData } from "../../redux/reducers/userReducer";
import AdditionalPaymentMethods from "../component/AdditionalPayments/AdditionalPaymentMethods";
import CardComponent from "../component/Card/CardComponent";
import { colorConstant } from "../component/color";
import UPIIntents from "../component/UPI/UPIIntents";
import {
  createRazorpayCustomer,
  fetchAllMethods,
  fetchCustomerTokens,
} from "../nodeServices";
import { getUserPlan } from "../../redux/reducers/planReducer";
import { getStoreType } from "../../redux/reducers/miscReducer";

const PaymentMethods = () => {
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const dispatch = useDispatch();
  const [savedToken, setSavedTokens] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [canShowPayments, setCanShowPayments] = useState(false);
  const billData = useSelector(getBillingData);
  const userPlan = useSelector(getUserPlan);
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  const updateCustomerDetails = async (razorPayId) => {
    const payload = {
      id: user?.id,
      emailId: user?.emailId,
      name: user?.name,
      updatedBy: user?.uidx,
      firebaseToken: null,
      razorPayCustomerId: razorPayId,
    };

    try {
      const res = await updateCustomer(payload);
      const result = res?.data;
      if (result?.es === 0) {
        dispatch(setUserData(result?.customer));
        return;
      }
    } catch (err) {}
  };

  useEffect(() => {
    if (user?.razorPayCustomerId !== null) {
      fetchCustomerTokens({ id: user?.razorPayCustomerId }).then((res) => {
        if (res?.data?.status !== "SUCCESS") {
          return;
        } else {
          setSavedTokens(res?.data?.data?.items);
        }
      });
    } else {
      try {
        createRazorpayCustomer({
          name: user?.name,
          contact: `91${user?.phoneNumber}`,
          email: user?.emailId,
        }).then((res) => {
          if (res?.data?.status == "SUCCESS") {
            const razorPayId = res?.data?.data?.id;
            updateCustomerDetails(razorPayId);
          }
        });
      } catch (error) {}
    }
  }, []);

  useEffect(() => {
    fetchAllMethods().then((res) => {
      if (res?.data?.status === "SUCCESS") {
        setPaymentMethods(res?.data?.data);
      }
    });
  }, []);

  //condition to show payment methods
  useEffect(() => {
    const showPayments =
      retailType !== "RESTAURANT" ||
      (retailType === "RESTAURANT" && userPlan === "premium");

    setCanShowPayments(showPayments);
  }, [userPlan, retailType]);

  return (
    <div>
      <Menuback
        head={true}
        text={"Payment Methods"}
        bg={colorConstant?.baseBackground}
        redirect={"/cart"}
        wishlist={true}
        totalPayment={billData?.totalCartValue}
      />
      <div style={{ margin: "1rem" }}>
        {canShowPayments && paymentMethods?.card && (
          <CardComponent
            tokens={
              savedToken &&
              savedToken?.filter((item) => item?.method === "card")
            }
          />
        )}
        {canShowPayments && paymentMethods?.upi && (
          <UPIIntents
            tokens={
              savedToken && savedToken?.filter((item) => item?.method === "upi")
            }
          />
        )}
        <AdditionalPaymentMethods />
      </div>
    </div>
  );
};

export default memo(PaymentMethods);
