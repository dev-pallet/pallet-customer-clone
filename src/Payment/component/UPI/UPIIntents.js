import React, { memo, useEffect, useState } from "react";
import "./UPIIntents.css";
import CustomText from "../CustomText";
import CardUI from "../CardUI";
import AddPaymentMethodCard from "../AddPaymentMethodCard";
import { useNavigate } from "react-router-dom";
import { paymentRoutesConstant } from "../../RouteConstants";
import useRazropayConfig from "../useRazropayConfig";
import CustomImage from "../CustomImage";
import UPI from "../../Assets/Images/upi.png";

import CustomRadio from "../UI/CustomRadio";
import CustomButton from "../UI/CustomButton";

const UPIIntents = ({ tokens }) => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [selectedIntent, setSelectedIntent] = useState("");
  const { capturePayment, paymentLoader } = useRazropayConfig();

  useEffect(() => {
    // emit({ type: "fetchUpiApps" });
  }, []);

  const payViaApp = async (app) => {
    await capturePayment({
      method: "upi",
      upi_app_package_name: app,
    });
  };
  const handleVpa = (token) => {
    capturePayment({
      method: "upi",
      token,
    });
  };

  return (
    <div className="upi-container">
      <CustomText text={"Pay by any UPI app"} margin={`.5rem 0`} />
      {/* <AddUpi /> */}
      <CardUI>
        {apps?.length > 0 &&
          apps?.map(
            (item) =>
              item && (
                <div
                  style={{
                    padding: ".5rem 1rem",
                    margin: `.2rem 0`,
                    display: "flex",
                    flex: 1,
                    borderBottom: `1px solid #e5e5e5`,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  >
                    <CustomImage source={item?.appLogo} />
                  </div>
                  <div className="upi-app-card">
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                      onClick={() => {
                        if (selectedIntent === item?.packageName) {
                          setSelectedIntent("");
                        } else setSelectedIntent(item?.packageName);
                      }}
                    >
                      <CustomText text={`${item?.appName}`} margin={`0 1rem`} />
                      <CustomRadio
                        checked={selectedIntent === item?.packageName}
                        // style={{ alignSelf: "flex-end" }}
                      />
                    </div>
                    {selectedIntent === item?.packageName ? (
                      <div style={{ width: "90%" }}>
                        <CustomButton
                          title={"Pay"}
                          loading={paymentLoader}
                          onClick={() => {
                            payViaApp(item?.packageName);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              )
          )}

        {tokens &&
          tokens?.map((item) => (
            <>
              <div
                className="saved-vpa-card"
                onClick={() => {
                  if (selectedIntent) setSelectedIntent("");
                  else setSelectedIntent(item?.id);
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                    }}
                  >
                    <CustomImage source={UPI} />
                  </div>
                  <CustomText
                    margin={`0 1rem`}
                    text={`${item?.vpa?.username}@${item?.vpa?.handle}`}
                  />
                </div>
                <CustomRadio checked={selectedIntent === item?.id} />
              </div>
              {selectedIntent === item?.id && (
                <CustomButton
                  loading={paymentLoader}
                  title={"Pay"}
                  onClick={() => {
                    handleVpa(item?.token);
                  }}
                />
              )}
            </>
          ))}
        <AddPaymentMethodCard
          title={"Add UPI ID"}
          subTitle={"You need to have a registered UPI ID"}
          onClick={() => {
            navigate(paymentRoutesConstant.ADD_UPI);
          }}
        />
      </CardUI>
    </div>
  );
};

export default memo(UPIIntents);
