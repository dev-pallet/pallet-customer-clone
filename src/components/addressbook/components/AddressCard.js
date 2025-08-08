import { Box, Card, Checkbox } from "@mui/material";
import React from "react";
import SquareCheckBox from "../../custom-components/Checkbox";
import Heading from "../../custom-components/Heading";
import Text from "../../custom-components/Text";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useNavigate } from "react-router-dom/dist";
import { useDispatch } from "react-redux";
import { setAddressInfo } from "../../../redux/reducers/addressReducer";

export default function AddressCard({
  address,
  handleDeleteSelectedAddress,
  isChecked,
  chooseAddress,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEditSelectedAddress = () => {
    // store selected address in redux
    dispatch(
      setAddressInfo({
        actionType: "edit",
        address: address,
      })
    );

    localStorage.setItem("triggerAddressAction", "edit");
    localStorage.setItem(
      "editAddress",
      JSON.stringify({
        lat: Number(address?.latitude),
        lng: Number(address?.longitude),
      })
    );
    navigate("/mapview");
  };

  return (
    <Box mt={1} px={1} sx={{ cursor: "pointer" }}>
      <Card className="address-book-card">
        {/* <SquareCheckBox checked={isChecked}/> */}
        <Checkbox checked={isChecked} onClick={() => chooseAddress(address)} />
        <Box
          onClick={(e) => {
            e.stopPropagation();
            chooseAddress(address);
          }}
          sx={{ flex: 1 }}
        >
          <Heading
            text={
              address?.addressType === "OTHER"
                ? address?.otherName
                : address?.addressType
            }
            fontweight={600}
            fontsize={15}
          />
          <Text
            text={address?.addressLine1}
            textoverflow="ellipsis"
            whitespace="nowrap"
            overflow="hidden"
          />
          <Text text={address?.addressLine2} />
          <Text
            text={`${address?.city}, ${address?.state}`}
            tint="rgb(134,140,150)"
          />
          <Text text={address?.pincode} tint="rgb(134,140,150)" />
          <Text text={address?.phoneNumber} tint="rgb(134,140,150)" />
        </Box>
        <CreateOutlinedIcon
          className="edit-icon-address"
          onClick={handleEditSelectedAddress}
        />
        <DeleteOutlineOutlinedIcon
          className="delete-icon-address"
          onClick={() => handleDeleteSelectedAddress(address)}
        />
      </Card>
    </Box>
  );
}
