import { Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import StyledButton from "../custom-components/Button";
import Menuback from "../menuback";
import Text from "../custom-components/Text";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserData } from "../../redux/reducers/userReducer";
import AddressList from "./components/AddressList/AddressList";
import { useEffect } from "react";
import { colorConstant } from "../../constants/colors";
import { getStoreType, setStoreType } from "../../redux/reducers/miscReducer";

const AddressBook = () => {
  const navigate = useNavigate();
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));

  const addressChangeFromCart = localStorage.getItem(
    "address_change_from_cart"
  );

  const handleCurrentLocation = () => {
    localStorage.setItem("currentLocation", true);
    navigate("/mapview", { state: { isCurrentLocation: true } });
  };

  const handleAddCurrentLocation = () => {
    localStorage.setItem("triggerAddressAction", "add");
    handleCurrentLocation();
  };

  useEffect(() => {
    localStorage.removeItem("currentLocation");
    localStorage.removeItem("triggerAddressAction");
    localStorage.removeItem("editAddress");
  }, []);

  // useEffect(() => {
  //   const res = getRetailTypeApi(result?.response?.sourceLocationId);
  //   const data = res?.data?.branch?.branchType;

  //   localStorage.setItem("retailType", data);
  //   dispatch(setStoreType(data));
  // }, []);

  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");

  return (
    <Box>
      <Menuback
        head={true}
        text="Delivery Address"
        redirect={addressChangeFromCart ? "/cart" : null}
        bg={colorConstant?.baseBackground}
        wishlist={user?.name && true}
      />
      <Box mt={8}>
        <Box px={1}>
          <StyledButton
            onClick={handleCurrentLocation}
            text="Use current location"
            icon={<LanguageIcon />}
            varinat="outlined"
            clr={retailType === "RESTAURANT" ? "#000000" : "#3e3f48"}
            bg="white"
            border="1px solid #3e3f48"
            width="100%"
            mg="0"
            borderRadius="1rem"
          />
        </Box>
        {!user?.nonLoggedIn && (
          <Box>
            <Box className="address-book-list-head" mt={1} p={1}>
              <Text
                text="Saved Address"
                tint="rgb(134,140,150)"
                fontsize={12}
              />
              <Text
                text="Add Address"
                tint="rgb(12, 121, 36)"
                fontsize={12}
                onClick={handleAddCurrentLocation}
              />
            </Box>
            <AddressList />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddressBook;
