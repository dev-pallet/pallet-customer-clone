//react
import { useNavigate } from 'react-router-dom';

//mui components
import { Box } from "@mui/material";

//custom components
import Heading from "../custom-components/Heading"
import Menuback from "../menuback"
import Text from "../custom-components/Text";
import { useState } from 'react';
import PopupScreen from '../modal';
import { useDispatch, useSelector } from 'react-redux';
import { getUserData } from '../../redux/reducers/userReducer';
import { deleteCustomer } from '../../config/services/customerService';
import { useSnackbar } from '../../custom hooks/SnackbarProvider';

const Settings = () => {
    const user = useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
    const showSnackbar = useSnackbar();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState(false);
    // <-- modal fn
    const handleOpenModal = () => {
      setOpenModal(true);
    };
    const handleCloseModal = () => {
      setOpenModal(false);
    };
    const handleYesAction = () => {
      handleDeleteAccount();
      setOpenModal(false);
    };
    const handleNoAction = () => {
      //close the modal
      setOpenModal(false);
    };
    // modal code -->

    // delete user account fn 
    const handleDeleteAccount = async() => {
        try{
            const payload = {
                customerId: user?.id,
                updatedBy: user?.uidx,
            }

            const res = await deleteCustomer(payload);
            if(res?.data?.es === 0){
                localStorage.clear();
                dispatch({ type: "reset" });
                navigate("/");
                return;
            }else{
                showSnackbar('Unable to delete your account','error');
            }
        }catch(err){
            showSnackbar(err?.message || err?.response?.data?.message, "error");
        }
    }

    const settingsArray = [
        { label: "Notifications", text: "Define what alerts and notifications you want to see", path: "/settings/notifications" },
        { label: "Edit Profile", text: "Change your name, email and mobile number", path: "/settings/edit-profile" },
        { label: "Delete Account", text: "Delete your account here", fn: handleOpenModal }
    ]
    return (
        <Box>
            <Menuback  head={true} text="Settings" />
            <Box mt={8} p={1}>
                {settingsArray?.map((e, i) => {
                    return (
                        <Box onClick={() => {
                            if(e.fn){
                                e.fn();
                            }else{
                                navigate(e.path)
                            }
                        }} key={i}>
                            <Heading text={e.label} fontsize={14} fontweight={600} />
                            <Text text={e.text} fontsize={11} fontweight={400} />
                            <hr style={{ opacity: 0.3 }} />
                        </Box>
                    )
                })}
            </Box>
            <PopupScreen
                open={openModal}
                handleClose={handleCloseModal}
                modalTitle={"Delete Account"}
                modalContent="Are you sure you want to delete your account?"
                handleYes={handleYesAction}
                handleYesText="Delete"
                handleNo={handleNoAction}
                handleNoText={"Cancel"}
            />
        </Box>
    )
}

export default Settings;