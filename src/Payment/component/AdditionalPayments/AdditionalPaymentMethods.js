import { CircularProgress } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import CustomText from "../CustomText";
import CardUI from "../CardUI";
import "./AdditionalPayments.css";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { colorConstant } from "../color";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useNavigate } from "react-router-dom";
import { paymentRoutesConstant } from "../../RouteConstants";
import useRazropayConfig from "../useRazropayConfig";
import { useSelector } from "react-redux";
import { getUserPlan } from "../../../redux/reducers/planReducer";
import { getStoreType } from "../../../redux/reducers/miscReducer";

const AdditionalPaymentMethods = () => {
  const navigate = useNavigate();
  const { paymentLoader, capturePayment } = useRazropayConfig();
  const [loading, setLoading] = useState(null);
  const [canShowNetBanking, setCanShowNetBanking] = useState(false);
  const userPlan = useSelector(getUserPlan);

  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  useEffect(() => {
    const showNetBanking =
      retailType !== "RESTAURANT" ||
      (retailType === "RESTAURANT" && userPlan === "premium");

    setCanShowNetBanking(showNetBanking);
  }, [userPlan, retailType]);

  const options = [
    ...(canShowNetBanking
      ? [
          {
            title: "NetBanking",
            subTitle: "Select from a list of banks",
            icon: (
              <AccountBalanceIcon style={{ color: colorConstant?.iconColor }} />
            ),
            onclick: () => {
              navigate(paymentRoutesConstant.NETBANKING);
            },
          },
        ]
      : []),

    {
      title: "Cash On Delivery",
      icon: <LocalAtmIcon style={{ color: colorConstant?.iconColor }} />,
      subTitle: "Pay in cash or pay online",
      onclick: () => {
        capturePayment({
          method: "cod",
        });
      },
    },
  ];
  const renderMethods = (item, i) => {
    return (
      <div
        className="additional-methods"
        key={i}
        onClick={() => {
          setLoading(item?.title);
          item?.onclick();
        }}
        style={
          userPlan !== "premium" && retailType === "RESTAURANT"
            ? { margin: "3.2rem" }
            : { margin: ".2rem 0" }
        }
      >
        <div className="additional-method-icon">{item?.icon}</div>
        <div className="additional-method-text-view">
          <CustomText text={item?.title} heading />
          <CustomText text={item?.subTitle} tint />
        </div>
        {loading === item?.title ? (
          <CircularProgress color="inherit" size={20} />
        ) : (
          <ChevronRightIcon
            style={{ color: "gray", flex: 0.1, display: "flex" }}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <CustomText text={"More Payment Options"} />
      <CardUI style={{ padding: "0 !important" }}>
        {options?.map(renderMethods)}
      </CardUI>
    </div>
  );
};
export default memo(AdditionalPaymentMethods);
