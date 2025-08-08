import React, { memo, useState } from "react";
import "./UPIIntents.css";
import useRazropayConfig from "../useRazropayConfig";
import CustomInput from "../UI/CustomInput";
import CustomButton from "../UI/CustomButton";
import CustomText from "../CustomText";
import { colorConstant } from "../color";
import Menuback from "../../../components/menuback";
import { getBillingData } from "../../../redux/reducers/cartReducer";
import { useSelector } from "react-redux";

const AddUpi = () => {
  const [vpa, setVpa] = useState("");
  const [loading, setLoading] = useState(false);
  const billData = useSelector(getBillingData);
  const { verifyVPA, capturePayment } = useRazropayConfig();

  const handlePay = async () => {
    if (!vpa) {
      alert("Please enter a UPI ID");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyVPA(vpa);
      setLoading(false);

      if (res?.error) {
        alert("Invalid UPI ID");
        return;
      }

     capturePayment({
        method: "upi",
        save: 1,
        vpa,
      });
    } catch (error) {
      setLoading(false);
      alert("Error processing payment. Please try again.");
    }
  };

  return (
    <>
      <Menuback 
        head={true} 
        text={"Payment Methods"} 
        bg={colorConstant.baseBackground} 
        redirect={"/payment/methods"} 
        wishlist={true} 
        totalPayment={billData?.totalCartValue} 
      />
      <div className="add-upi-container">
        <div
          style={{
            width: '90vw',
            alignSelf: "center",
            margin: '0 auto',
          }}
        >
          <CustomText text={`Add new UPI ID`} heading margin={`3.5rem 0 1rem`} />
          <CustomInput
            style={{ width: '100%' }}
            value={vpa}
            onChange={(e) => setVpa(e.target.value)}
            label={"Enter UPI Id"}
          />
          <CustomButton
            loading={loading}
            disabled={!vpa}
            title="Verify & Pay"
            onClick={handlePay}
            style={{ color: 'white' }}
          />
        </div>
      </div>
    </>
  );
};

export default memo(AddUpi);
