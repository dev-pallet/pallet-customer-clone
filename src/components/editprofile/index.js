// react
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

//mui components
import { Box } from "@mui/material";

//custom components
import { useSnackbar } from "../../custom hooks/SnackbarProvider";
import StyledButton from "../custom-components/Button";
import CustomInput from "../custom-components/CustomInput";
import Text from "../custom-components/Text";
import Menuback from "../menuback";

//style
import "./index.css";

// redux
import { useDispatch, useSelector } from "react-redux";
import { getUserData, setUserData } from "../../redux/reducers/userReducer";

// constants
import { colorConstant } from "../../constants/colors";

// services
import { updateCustomer } from "../../config/services/customerService";

const EditProfile = () => {
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const profileDetails = [
    {
      label: "Name",
      name: "name",
      placeholder: "your name",
      type: "text",
      disabled: false,
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      placeholder: "phone number",
      type: "number",
      disabled: true,
    },
    {
      label: "Email",
      name: "emailId",
      type: "text",
      placeholder: "eg:example@gmail.com",
      disabled: false,
    },
  ];

  const { control, handleSubmit, formState } = useForm({
    defaultValues: {
      name: user?.name,
      emailId: user?.emailId,
      phoneNumber: user?.phoneNumber,
    },
  });

  const handleEditProfile = async (formData) => {
    try {
      const data = {
        id: user?.id,
        emailId: formData?.emailId,
        name: formData?.name,
        updatedBy: user?.uidx,
        firebaseToken: null,
      };

      const response = await updateCustomer(data);
      const result = response?.data;

      if (result?.es === 0) {
        dispatch(setUserData(result?.customer));
        navigate(-1);
        return;
      }
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  return (
    <Box className="edit-profile-root-div">
      <Menuback head={true} text="Edit Profile" />
      <Box className="edit-profile-main" mb={1} mt={5}>
        <form onSubmit={handleSubmit(handleEditProfile)}>
          {profileDetails?.map((item, index) => (
            <Box key={index}>
              <Controller
                name={item?.name}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <CustomInput
                      label={item?.label}
                      placeholder={item?.placeholder}
                      name={item?.name}
                      value={value}
                      type={item?.type}
                      disabled={item?.disabled}
                      onChange={onChange}
                    />
                  </>
                )}
              />
              {formState?.errors?.[item?.name] && (
                <Text
                  text="This field is Required"
                  my={"3px"}
                  fontsize={"10px"}
                  tint={colorConstant?.requiredColor}
                />
              )}
            </Box>
          ))}
          <StyledButton
            variant="contained"
            text="Update Info"
            width="100%"
            mg="8px 0px 5px"
            borderRadius="1rem"
            fw="bold"
            textTransform="none"
            type="submit"
          />
        </form>
      </Box>
    </Box>
  );
};

export default EditProfile;
