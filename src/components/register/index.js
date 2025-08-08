// react
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";

// mui components
import { Box, CircularProgress } from "@mui/material";

// icons
import PersonIcon from "@mui/icons-material/Person";
import { HiPhone } from "react-icons/hi2";
import EmailIcon from "@mui/icons-material/Email";

// custom components
import Heading from "../custom-components/Heading";
import CustomInput from "../custom-components/CustomInput";
import StyledButton from "../custom-components/Button";
import Text from "../custom-components/Text";

// constants
import { colorConstant } from "../../constants/colors";
import { getAsyncStorageData, storeData } from "../../middlewares/localStorage";
import storageConstants from "../../constants/storageConstants";
import ExtractDataFromGzip from "../../middlewares/ExtractDataFromGzip";
import { createCustomer } from "../../config/services/customerService";
import STORE_DATA from "../../constants/storeData";
import { setUserData } from "../../redux/reducers/userReducer";
import { useNavigate } from "react-router";
import { setOffer } from "../../redux/reducers/miscReducer";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get user phone number from ls
  const newUserPhoneNumber = localStorage.getItem("new_user_phone_number");
  const showSnackbar = useSnackbar();
  const [loading, setLoading] = useState(false);

  const inputs = [
    {
      label: "Name",
      icon: <PersonIcon size="18px" />,
      placeholder: "eg. John Doe",
      maxLength: "30",
      minLength: "4",
      type: "text",
      name: "name",
      disabled: false,
      required: true,
    },
    {
      label: "Mobile Number",
      icon: <HiPhone size="18px" />,
      placeholder: "1234567890",
      type: "text",
      maxLength: "10",
      minLength: "10",
      name: "phoneNumber",
      disabled: true,
      required: false,
    },
    {
      label: "Email",
      icon: <EmailIcon size="18px" />,
      placeholder: "Enter valid email address",
      type: "email",
      maxLength: "80",
      name: "emailId",
      disabled: false,
      required: false,
    },
  ];

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      name: "",
      emailId: "",
      phoneNumber: newUserPhoneNumber,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = await getAsyncStorageData(storageConstants.TOKEN);
      const jwtData = await ExtractDataFromGzip(token);
      const parsedJwtData = jwtData?.length && JSON.parse(jwtData);

      const payload = {
        ...data,
        uidx: parsedJwtData?.uidx,
        createdBy: parsedJwtData?.uidx,
        organizationId: STORE_DATA?.id,
        platform: "web",
        firebaseToken: null,
        razorPayCustomerId: null,
      };

      const response = await createCustomer(payload);
      const result = response?.data;

      if (result?.es === 0) {
        dispatch(setUserData(result?.customer));
        storeData(storageConstants.STORAGE_KEY_USER_DATA, result?.customer);
        dispatch(setOffer(result?.customer?.registrationOffer));
        localStorage.removeItem("new_user_phone_number");
        navigate("/activity-screen");
      }
    } catch (err) {
      showSnackbar(
        err?.message ||
          err?.response?.data?.message ||
          "Something went wrong on submission",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{ backgroundColor: colorConstant?.baseBackground, height: "100vh" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Heading text="Create Your Account" fontweight="bold" pt={1} px={1} />
        <Box p={2}>
          {inputs?.map((item, index) => (
            <Box key={index}>
              <Controller
                name={item?.name}
                control={control}
                rules={{
                  required: item?.required,
                  minLength: item?.name === "name" && {
                    value: 4,
                    message:
                      "Please enter your full name (at least 4 characters).",
                  },
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
                      disabled={item?.disabled}
                      required={item?.required}
                      maxLength={item?.maxLength}
                      minLength={item?.minLength ? item?.minLength : ""}
                      onChange={onChange}
                    />
                  </>
                )}
              />
              {item?.name !== "emailId"
                ? formState?.errors?.[item?.name] && (
                    <Text
                      text="This field is Required"
                      my={"3px"}
                      fontsize={"10px"}
                      tint={colorConstant?.requiredColor}
                    />
                  )
                : null}
            </Box>
          ))}
          <StyledButton
            variant="contained"
            text={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Submit"
              )
            }
            width="100%"
            mg="8px 0px 5px"
            borderRadius="1rem"
            fw="bold"
            textTransform="none"
            type="submit"
            disabled={loading}
          />
        </Box>
      </form>
    </Box>
  );
}
