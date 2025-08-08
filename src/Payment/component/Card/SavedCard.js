import React, { memo, useState } from "react";
import CustomText from "../CustomText";
import "./CardComponent.css";
import CustomButton from "../UI/CustomButton";
import CustomInput from "../UI/CustomInput";
import CustomImage from "../CustomImage";
import CustomRadio from "../UI/CustomRadio";
import CARD from "../../Assets/Images/card.png";
import useRazropayConfig from "../useRazropayConfig";

const SavedCard = ({ card }) => {
  const [cvv, setCvv] = useState("");
  const { capturePayment, paymentLoader } = useRazropayConfig();
  const [toggle, setToggle] = useState(false);
  const handlePayViaCard = async () => {
    let payload = {
      token: card?.token,
      method: "card",
      "card[cvv]": cvv,
    };
    await capturePayment(payload);
  };

  return (
    card && (
      <div className="saved-card">
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
          }}
          onClick={() => {
            setToggle(!toggle);
          }}
        >
          <div style={{ width: 40, height: 40 }}>
            <CustomImage source={CARD} />
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between",
              alignItems: "center",
              margin: `0 .5rem`,
            }}
          >
            <div>
              <CustomText text={card?.card?.name || "Personal"} heading />

              <div style={{ display: "flex", alignItems: "center" }}>
                <CustomText
                  tint
                  text={`${Array(8)
                    ?.fill("*")
                    ?.map((item) => item)
                    ?.join("")}`}
                />
                <CustomText tint text={`${card?.card?.last4}`} />
              </div>
            </div>
          </div>
          <CustomRadio checked={toggle} />
        </div>
        {toggle && (
          <div className="cvv-pay-btn">
            <CustomInput
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              label="CVV"
              type="number"
              inputProps={{ maxLength: 3, minLength: 3 }}
              required
            />
            <CustomButton
              title={"Pay"}
              disabled={cvv?.length !== 3}
              onClick={handlePayViaCard}
              loading={paymentLoader}
            />
          </div>
        )}
      </div>
    )
  );
};

export default memo(SavedCard);
