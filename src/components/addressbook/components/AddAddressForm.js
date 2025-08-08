// react
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

// mui components
import { Box, Checkbox, Chip } from "@mui/material";

// icons

// custom components
import { useNavigate } from "react-router-dom";
import StyledButton from "../../custom-components/Button";
import Text from "../../custom-components/Text";
import CustomInput from "../../custom-components/CustomInput";
import { colorConstant } from "../../../constants/colors";
import Heading from "../../custom-components/Heading";
import { getAddressInfo } from "../../../redux/reducers/addressReducer";
import {
  getUserData,
  setDeliveryAddress,
} from "../../../redux/reducers/userReducer";
import {
  addAddress,
  updateAddress,
} from "../../../config/services/customerService";
import moment from "moment";
import {
  getNearestServiceableStores,
  getNearestServiceableStoresBasedOnUserLocaion,
} from "../../../config/services/serviceabilityService";
import { updateCart } from "../../../config/services/cartService";
import {
  getCartId,
  setCartBill,
  setCartId,
  setCartProducts,
  setShippingAddress,
} from "../../../redux/reducers/cartReducer";
import { useSnackbar } from "../../../custom hooks/SnackbarProvider";
import { getRetailTypeApi } from "../../../config/services/userService";
import { setStoreType } from "../../../redux/reducers/miscReducer";

export default function AddAddressForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const addressInfo = useSelector(getAddressInfo);
  const showSnackbar = useSnackbar();
  const cartId = useSelector(getCartId) || localStorage.getItem("cartId");
  const [isChecked, setIsChecked] = useState(false);
  const [addressLabel, setAddressLabel] = useState(
    addressInfo?.address?.addressType || null
  );

  const inputs = [
    {
      label: "House No. & Floor",
      placeholder: "Appartment/ House no. /Street*",
      type: "text",
      name: "addressLine1",
      disabled: false,
      // required: true,
      required: "House No. & Floor is required",
      minLength: {
        value: 5,
        message: "House No. & Floor must be at least 10 characters long",
      },
    },
    {
      label: "Building & Block No.",
      placeholder: "Area Details*",
      type: "text",
      name: "addressLine2",
      disabled: false,
      // required: true,
      required: "Building & Block No. is required",
      minLength: {
        value: 5,
        message: "Building & Block No. must be at least 5 characters long",
      },
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      addressLine1: "",
      addressLine2: "",
      addressType: "",
      otherName: "",
    },
  });

  useEffect(() => {
    if (addressInfo?.address) {
      setValue("addressLine1", addressInfo?.address?.addressLine1 || "");
      setValue("addressLine2", addressInfo?.address?.addressLine2 || "");
      setValue("addressType", addressInfo?.address?.addressType || "");
      if (addressInfo?.address?.addressType === "OTHER") {
        setValue("otherName", addressInfo?.address?.otherName || "");
      }
    }
  }, [addressInfo, setValue]);

  const handleCart = async (payload, cartId) => {
    try {
      const res = await updateCart(payload, cartId);
      if (res?.data?.status === "SUCCESS") {
        dispatch(setCartId(res?.data?.data?.cartId));
        dispatch(setCartProducts(res?.data?.data?.cartProducts));
        dispatch(setCartBill(res?.data?.data?.billing));
        dispatch(setShippingAddress(res?.data?.data?.shippingAddress));
        dispatch(setDeliveryAddress(res?.data?.data?.shippingAddress));
        navigate("/address-book");
        return;
      }
    } catch (err) {
      showSnackbar(
        err?.message || err?.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  const saveAddress = async (data) => {
    if (!isLabelSelected) {
      showSnackbar("Please select add address label", "error");
      return;
    }

    const basePayload = {
      ...data,
      customerId: user?.id,
      city: addressInfo?.address?.city,
      state: addressInfo?.address?.state,
      country: addressInfo?.address?.country,
      pincode: addressInfo?.address?.pincode,
      defaultShipping: isChecked,
      defaultBilling: isChecked,
      phoneNumber: user?.phoneNumber,
      latitude: addressInfo?.position?.lat,
      longitude: addressInfo?.position?.lng,
      createdBy: user?.uidx,
    };

    try {
      const res = await addAddress(basePayload);

      if (res?.data?.es !== 0) {
        const resMessage = res?.data?.message?.replace(/_/g, " ");
        showSnackbar(resMessage || "Something went wrong !!", "error");
        return;
      }

      if (isChecked) {
        const item = res?.data?.address;

        try {
          // Get nearest stores
          const locationPayload = {
            lat: Number(item?.latitude),
            long: Number(item?.longitude),
          };

          const [storeResponse, storeBasedOnLocationResponse] =
            await Promise.all([
              getNearestServiceableStores(locationPayload),
              getNearestServiceableStoresBasedOnUserLocaion(locationPayload),
            ]);

          if (!storeResponse?.serviceable) {
            showSnackbar(
              "Currently we cannot deliver here. Please choose different location",
              "error"
            );
            dispatch(setServiceable(true));
            return;
          }

          // Get retail type
          const retailRes = await getRetailTypeApi(
            storeResponse?.response?.sourceLocationId
          );
          const branchType = retailRes?.data?.branch?.branchType;

          localStorage.setItem("retailType", branchType);
          dispatch(setStoreType(branchType));

          // Prepare cart payload
          const cartPayload = {
            userName: user?.name,
            userId: user?.id,
            mobileNo: user?.phoneNumber,
            enableWhatsapp: true,
            updatedBy: user?.uidx,
            locationId: user?.uidx,
            sourceId: user?.id,
            loggedInUser: user?.uidx,
            sourceLocationId: user?.uidx,
            comments: "string",
            address: {
              billingAddress: {
                addressId: item?.id,
                country: item?.country,
                state: item?.state,
                city: item?.city,
                pinCode: item?.pincode,
                addressLine1: item?.addressLine1,
                addressLine2: item?.addressLine2,
                longitude: addressInfo?.position?.lng,
                latitude: addressInfo?.position?.lat,
                addressType:
                  item?.addressType === "OTHER"
                    ? item?.otherName
                    : item?.addressType,
                updatedOn: moment(new Date()).toISOString(),
                phoneNo: item?.phoneNumber || user?.phoneNumber,
                updatedBy: user?.uidx,
              },
              shippingAddress: {
                addressId: item?.id,
                country: item?.country,
                state: item?.state,
                city: item?.city,
                pinCode: item?.pincode,
                addressLine1: item?.addressLine1,
                addressLine2: item?.addressLine2,
                longitude: addressInfo?.position?.lng,
                latitude: addressInfo?.position?.lat,
                addressType:
                  item?.addressType === "OTHER"
                    ? item?.otherName
                    : item?.addressType,
                updatedOn: moment(new Date()).toISOString(),
                phoneNo: item?.phoneNumber || user?.phoneNumber,
                updatedBy: user?.uidx,
              },
            },
          };

          await handleCart(cartPayload, cartId);
          dispatch(setDeliveryAddress(item));
        } catch (err) {
          showSnackbar(
            err?.message ||
              err?.response?.data?.message ||
              "Failed to process address.",
            "error"
          );
          return;
        }
      }

      navigate("/address-book");
    } catch (err) {
      showSnackbar(
        err?.message ||
          err?.response?.data?.message ||
          "Failed to save address.",
        "error"
      );
    }
  };

  const handleEditAddress = async (data) => {
    let temp = { ...addressInfo?.address };
    const id = temp?.id;
    delete temp?.active;
    delete temp?.enabled;
    delete temp?.id;
    delete temp?.addressLine1;
    delete temp?.addressLine2;
    delete temp?.addressType;
    delete temp?.otherName;

    const payload = {
      ...temp,
      ...data,
      addressId: id,
      updatedBy: user?.uidx,
      latitude: Number(temp?.latitude),
      longitude: Number(temp?.longitude),
    };

    try {
      const res = await updateAddress(payload);

      if (res?.data?.es === 0) {
        navigate("/address-book");
      } else {
        showSnackbar(res?.data?.message, "success");
      }
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const addressTypes = ["HOME", "WORK", "OTHER"];

  const activeChipBackground = (item) =>
    addressLabel === item ? colorConstant?.tintColor : colorConstant?.white;
  const activeChipColor = (item) =>
    addressLabel === item
      ? colorConstant?.primaryColor
      : colorConstant?.defaultText;

  const isLabelSelected = addressTypes?.some((item) => item === addressLabel);

  return (
    <Box
      sx={{ backgroundColor: colorConstant?.baseBackground, height: "100vh" }}
    >
      <form
        onSubmit={handleSubmit(
          addressInfo?.actionType === "edit" ? handleEditAddress : saveAddress
        )}
      >
        <Heading text="Create Your Account" fontweight="bold" pt={1} px={1} />
        <Box p={2}>
          {inputs?.map((item, index) => (
            <Box key={index} label={"card number"}>
              <Controller
                name={item?.name}
                control={control}
                rules={{
                  // required: true,
                  // minLength: 12,
                  required: item?.required,
                  minLength: item?.minLength,
                }}
                render={({ field: { onChange, value } }) => (
                  <>
                    <CustomInput
                      label={item?.label}
                      inputAdornmentIcon={item?.icon}
                      placeholder={item?.placeholder}
                      name={item?.name}
                      value={value}
                      type={item?.type}
                      required={item?.required}
                      maxLength={item?.maxLength}
                      minLength={item?.minLength ? item?.minLength : ""}
                      onChange={onChange}
                    />
                  </>
                )}
              />
              {errors[item.name] && (
                <Text
                  text="This field is Required"
                  my={"3px"}
                  fontsize={"10px"}
                  tint={colorConstant?.requiredColor}
                />
              )}
            </Box>
          ))}
          <Box>
            <Text
              text={"Add address label"}
              tint="#000000"
              align="left"
              fontweight={"bold"}
              marginBottom="5px"
            />
            <Box>
              {addressTypes?.map((item, index) => (
                <Chip
                  label={item}
                  key={index}
                  sx={{
                    marginRight: "10px",
                    backgroundColor: `${activeChipBackground(item)} !important`,
                    border: "1px solid gainsboro",
                    color: `${activeChipColor(item)} !important`,
                    height: "30px !important",
                  }}
                  size="small"
                  onClick={() => {
                    setValue("addressType", item);
                    setAddressLabel(item);
                  }}
                />
              ))}
            </Box>
            {errors?.addressType && (
              <Text
                text={errors?.addressType?.message}
                my="3px"
                fontsize="10px"
                tint={colorConstant?.requiredColor}
              />
            )}
          </Box>
          {addressLabel === "OTHER" && (
            <Box mt={1}>
              <Controller
                name={"otherName"}
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <>
                    <CustomInput
                      placeholder={"Enter your own label"}
                      name={"otherName"}
                      value={value}
                      type={"text"}
                      required={true}
                      onChange={onChange}
                    />
                    {errors?.otherName && (
                      <Text
                        text={errors?.otherName?.message}
                        my="3px"
                        fontsize="10px"
                        tint={colorConstant?.requiredColor}
                      />
                    )}
                  </>
                )}
              />
            </Box>
          )}

          <Box className="content-left" mt={1}>
            <Checkbox
              sx={{ padding: "9px 0px" }}
              checked={isChecked}
              onClick={() => setIsChecked(!isChecked)}
            />
            <Text text="Make it as a default address" />
          </Box>
          <StyledButton
            variant="contained"
            text="Save & Continue"
            width="100%"
            mg="8px 0px 5px"
            borderRadius="1rem"
            fw="bold"
            textTransform="capitalize"
            type="submit"
          />
        </Box>
      </form>
    </Box>
  );
}
