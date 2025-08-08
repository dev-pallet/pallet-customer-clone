import { Box } from "@mui/material";
import React from "react";
import Menuback from "../../menuback";
import AddAddressForm from "./AddAddressForm";
import { useSelector } from "react-redux";
import { getAddressInfo } from "../../../redux/reducers/addressReducer";
import { colorConstant } from "../../../constants/colors";

export default function AddAddress() {
  const addressInfo = useSelector(getAddressInfo);

  const heading =
    addressInfo?.actionType === "add"
      ? "Enter Address Details"
      : addressInfo?.actionType === "edit"
      ? "Update Address Details"
      : null;

  return (
    <Box>
      <Menuback
        head={true}
        text={heading}
        bg={colorConstant?.baseBackground}
        redirect="/address-book"
      />
      <AddAddressForm />
    </Box>
  );
}
