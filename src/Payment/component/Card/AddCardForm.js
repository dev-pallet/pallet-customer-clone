import React, { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import useRazropayConfig from "../useRazropayConfig";
import CustomButton from "../UI/CustomButton";
import CustomInput from "../UI/CustomInput";
import CustomText from "../CustomText";
import "./CardComponent.css";
import { FormControl } from "@mui/material";
import { getUserData } from "../../../redux/reducers/userReducer";
import Menuback from "../../../components/menuback";
import { getBillingData } from "../../../redux/reducers/cartReducer";
import { colorConstant } from "../color";
const AddCardForm = () => {
  const { capturePayment, paymentLoader } = useRazropayConfig();
  const billData = useSelector(getBillingData);
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      holderName: "",
      cardNumber: "",
      cardExpiry: "",
      cvv: "",
    },
  });
  const feilds = [
    {
      type: "text",
      label: `Card Number:`,
      name: `cardNumber`,
      formProps: {
        // min: 16,
        // max: 16,
      },
    },
    {
      type: "text",
      label: `Expiry Date (MM/YY)`,
      name: `cardExpiry`,
      formProps: {
        // max: 5,
        // min: 5,
        // maxLength: 5,
      },
    },
    {
      type: "password",
      label: `CVV`,
      name: `cvv`,
      formProps: {
        // min: 3,
        // max: 3,
        // maxLength: 3,
      },
    },
    {
      type: "text",
      label: `Card Holder Name`,
      name: `holderName`,
      formProps: {
        // min: 3,
        // max: 3,
        // maxLength: 3,
      },
    },
  ];

  const handleCard = async (formData) => {
    const expiry = formData?.cardExpiry?.split("/");
    await capturePayment({
      method: "card",
      save: 1,
      "card[number]": formData?.cardNumber?.split(" ")?.join(""),
      "card[expiry_month]": expiry[0],
      "card[expiry_year]": expiry[1],
      "card[cvv]": formData?.cvv,
      "card[name]": formData?.holderName,
    });
  };

  return (
    <>
      <Menuback
        head={true}
        text={"Add Card Details"}
        bg={colorConstant.baseBackground}
        redirect={"/payment/methods"}
        wishlist={true}
        totalPayment={billData?.totalCartValue}
      />
      <div className="add-card-container">
        <CustomText text={"Add Card Details"} heading />
        <FormControl sx={{ margin: `3.5rem 0 2rem` }}>
          {feilds?.map((item, i) => (
            <Controller
              key={i}
              name={item?.name}
              rules={{ ...item?.formProps, required: true }}
              control={control}
              render={({ field }) => (
                <div className="card-form-inputs">
                  <CustomInput
                    {...field}
                    style={{ margin: `0.2rem` }}
                    label={item?.label}
                    type={item?.type}
                  />
                  {errors[item?.name] && (
                    <CustomText
                      text={errors[item?.name]?.message}
                      tint
                      color="red"
                    />
                  )}
                </div>
              )}
            />
          ))}

          <CustomButton
            title={`Submit Payment`}
            loading={paymentLoader}
            onClick={handleSubmit(handleCard)}
          />
        </FormControl>
      </div>
    </>
  );
};

export default memo(AddCardForm);
