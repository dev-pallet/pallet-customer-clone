//react
import React, { useState, useRef, useEffect } from "react";

//google maps api
import {
  GoogleMap,
  Marker,
  Circle,
  StandaloneSearchBox,
} from "@react-google-maps/api";

//styles
import "./index.css";

//icons
import SearchIcon from "@mui/icons-material/Search";

//mui components
import { Box, Card, CircularProgress } from "@mui/material";

//custom components
import Text from "../../../custom-components/Text";
import Heading from "../../../custom-components/Heading";
import StyledButton from "../../../custom-components/Button";

//services
import {
  getNearestServiceableStores,
  getNearestServiceableStoresBasedOnUserLocaion,
} from "../../../../config/services/serviceabilityService";

//react-redux
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAddressFromLatLong } from "../../../../constants/ConvertLatLongToAddress";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { setAddressInfo } from "../../../../redux/reducers/addressReducer";
import {
  setServiceable,
  setStoreType,
} from "../../../../redux/reducers/miscReducer";
import { setDeliveryAddress } from "../../../../redux/reducers/userReducer";
import {
  setCartBill,
  setCartId,
  setCartProducts,
  setShippingAddress,
} from "../../../../redux/reducers/cartReducer";
import { getRetailTypeApi } from "../../../../config/services/userService";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";

const Map = (props) => {
  const showSnackbar = useSnackbar();
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const triggerAddressAction =
    localStorage.getItem("triggerAddressAction") || null;

  const [loader, setLoader] = useState(false);
  const [circleRadius, setCircleRadius] = useState(10000);
  const [address, setAddress] = useState("");
  const [locName, setLocName] = useState("");
  const [maptext, setMapText] = useState("");
  const [position, setPosition] = useState(null);
  const [editAddress, setEditAddress] = useState(
    JSON.parse(localStorage.getItem("editAddress")) || null
  );

  const nearByStore = useSelector(getNearByStore);
  const locId = nearByStore?.sourceLocationId;
  const [mapCenter, setMapCenter] = useState(null);

  const [circleCenter, setCircleCenter] = useState({
    lat: 13.067439,
    lng: 80.237617,
  });
  const [current, setCurrent] = useState(true);
  const locationId = localStorage.getItem("locationId");

  function handleLoad(map) {
    mapRef.current = map;
  }

  const mapContainerStyle = {
    position: "relative",
    height: "100dvh",
    width: "100%",
  };

  useEffect(() => {
    if (window.google) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            setAddress(results[0]?.formatted_address);
            setLocName(results[0]?.address_components?.[1]?.long_name);
            setTimeout(() => {
              setMapText("Oh, here you are");
            }, 1000);
          }
        }
      });
    }
  }, [position]);

  useEffect(() => {
    if (editAddress !== null) {
      setPosition(editAddress);
      setMapCenter(editAddress);
    }
  }, [editAddress]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setPosition(currentPosition);
        setMapCenter(currentPosition);
      });
    } else {
      showSnackbar("Geolocation is not supported by this browser.", "error");
    }
  };

  function handleCenterChanged() {
    setMapText("Let's find out where you are!");
    if (!mapRef.current) return;
    const newPos = mapRef.current.getCenter().toJSON();
    setPosition(newPos);
  }

  const handlePlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places?.length > 0) {
      setLocName(places?.[0]?.address_components?.[1]?.long_name);
      setAddress(places?.[0]?.formatted_address || "");
      const location = places?.[0]?.geometry?.location;
      setPosition({ lat: location.lat(), lng: location.lng() });
      setMapCenter({ lat: location.lat(), lng: location.lng() });
    }
  };

  useEffect(() => {
    if (localStorage.getItem("currentLocation") === "true") {
      handleGetCurrentLocation();
      setCurrent(false);
    }
  }, []);

  const storedRetailType = localStorage.getItem("retailType");
  useEffect(() => {
    if (storedRetailType) {
      dispatch(setStoreType(storedRetailType));
    }
  }, [storedRetailType]);

  const handleConfirmLocationAddress = async () => {
    const payload = {
      lat: position.lat,
      long: position.lng,
    };
    let result = await getNearestServiceableStores(payload);

    if (!result?.serviceable) {
      showSnackbar(
        "Currently we cannot deliver here. Please choose different location",
        "error"
      );
      dispatch(setServiceable(true));
      return;
    }
    getAddressFromLatLong(payload?.lat, payload?.long).then((res) => {
      if (res) {
        dispatch(setDeliveryAddress({ ...res }));
        // dispatch(setCartBill(null));
        dispatch(setCartId(null));
        dispatch(setCartProducts(null));
        dispatch(setShippingAddress(null));
      }
    });
    const res = await getRetailTypeApi(result?.response?.sourceLocationId);
    const data = res?.data?.branch?.branchType;

    localStorage.setItem("retailType", data);
    dispatch(setStoreType(data));

    await getNearestServiceableStoresBasedOnUserLocaion(payload);
    navigate("/home");
  };

  const goToAddOrEditAddress = () => {
    if (triggerAddressAction === "add") {
      getAddressFromLatLong(position?.lat, position?.lng).then((res) => {
        dispatch(
          setAddressInfo({
            actionType: triggerAddressAction,
            address: res,
            position: position,
          })
        );
      });
    }
    localStorage.removeItem("editAddress");
    navigate("/address-book/add-or-edit");
  };

  return (
    <>
      {loader ? (
        <CircularProgress />
      ) : (
        <Box sx={mapContainerStyle}>
          <GoogleMap
            onLoad={handleLoad}
            onCenterChanged={handleCenterChanged}
            zoom={props.zoom}
            center={mapCenter}
            id="map"
          >
            <Marker position={position} />
            <StandaloneSearchBox
              onLoad={(ref) => (searchBoxRef.current = ref)}
              onPlacesChanged={handlePlacesChanged}
            >
              <div className="map-search-input-container">
                <SearchIcon className="map-search-icon" />
                <input
                  type="text"
                  placeholder="Search for area, district or pincode"
                  style={{
                    boxSizing: "border-box",
                    border: "1px solid transparent",
                    width: "100%",
                    height: "37px",
                    padding: "0 16px",
                    borderRadius: "3px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
                    fontSize: "14px",
                    outline: "none",
                    position: "absolute",
                    top: "60px",
                    left: "10px",
                    zIndex: "1",
                  }}
                  className="map-search-input"
                />
              </div>
            </StandaloneSearchBox>
            <Circle
              center={circleCenter}
              radius={circleRadius}
              options={{
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
              }}
            />
          </GoogleMap>
          <Card className="location-details-card">
            <Text text={maptext} fontsize={17} fontweight={500} />
            <hr />
            <Heading text={locName} fontweight={600} />
            <Text text={address} fontweight={500} />
            <StyledButton
              text={
                triggerAddressAction === "add" ||
                triggerAddressAction === "edit"
                  ? "Enter Complete Details"
                  : "Confirm & Continue"
              }
              variant="contained"
              mg="0px"
              className="location-details-btn"
              textTransform={"capitalize"}
              onClick={() => {
                if (
                  triggerAddressAction === "add" ||
                  triggerAddressAction === "edit"
                ) {
                  goToAddOrEditAddress();
                } else {
                  handleConfirmLocationAddress();
                }
              }}
            />
          </Card>
        </Box>
      )}
    </>
  );
};

export default Map;
