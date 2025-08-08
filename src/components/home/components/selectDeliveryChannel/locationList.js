import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getStoreType } from "../../../../redux/reducers/miscReducer";
import Header from "../../../header";
import { getLocationByOrgId } from "../../../../config/services/retailService";
import { useState, useEffect } from "react";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import DirectionsIcon from "@mui/icons-material/Directions";
import {
  getSelectedLongLat,
  getStoreLocation,
  getUserSelectedLocationTakeAway,
  setuserSelectedLocationTakeAway,
} from "../../../../redux/reducers/locationReducer";
import {
  getDeliveryAddress,
  getUserData,
} from "../../../../redux/reducers/userReducer";
import { useNavigate } from "react-router-dom";
import Text from "../../../custom-components/Text";
import { CircularLoader } from "../../../custom-components/CircularLoader";
import { colorConstant } from "../../../../constants/colors";
import { set } from "lodash";
import {
  setAppliedCoupon,
  setCartBill,
  setCartId,
  setCartProducts,
  setCartStatus,
  setDeliveryType,
  setLoyalityPoints,
  setShippingAddress,
} from "../../../../redux/reducers/cartReducer";
import { restaurantCreateCartApi } from "../../../../utils/restaurantCartApi";

const LocationList = () => {
  const retailType = useSelector(getStoreType);
  const showSnackBar = useSnackbar();
  const orgId = localStorage.getItem("retailId");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [locationList, setLocationList] = useState([]);
  const [locationListLoader, setLocationListLoader] = useState(false);
  const storeUserSelectedLocationTakeAway = useSelector(
    getUserSelectedLocationTakeAway
  );

  const checkLocation = useSelector(getStoreLocation);

  const data = useSelector(getSelectedLongLat);
  const liveLoc = useSelector(getDeliveryAddress);
  const cartId = localStorage.getItem("cartId");
  const user = useSelector(getUserData) || userData;

  const getResturantCartData = async (location, subOrderType = "TAKE_AWAY") => {
    const payload = {
      cartId, //cart nayi banegi
      userName: user?.name,
      userId: user?.id,
      tableNumber: "1",
      mobileNo: user?.phoneNumber,
      enableWhatsapp: true,
      createdBy: user?.uidx,
      updatedBy: user?.uidx,
      locationId: location?.branchId,
      // sourceId: user?.organizationId,
      sourceId: location?.retailId,
      orderType: "RESTAURANT_ORDER",
      subOrderType: subOrderType,
      sourceLocationId: location?.branchId,
      sourceType: "RETAIL",
      channel: "B2C",
      loggedInUser: user?.uidx,
      sourceApp: "B2C",
      // destinationId: user?.organizationId,
      destinationId: location?.retailId,
      destinationLocationId: location?.branchId,
      destinationType: "RETAIL",
    };

    await restaurantCreateCartApi({
      payload,
      onSuccess: (result) => {
        if (result?.data?.status === "SUCCESS") {
          showSnackBar(result?.data?.status, "success");
        }
      },
      onError: (msg) => {
        showSnackBar(msg, "error");
      },
      dispatchers: {
        setCartId: (id) => dispatch(setCartId(id)),
        setCartProducts: (products) => dispatch(setCartProducts(products)),
        setCartStatus: (products) => dispatch(setCartStatus(products)),
        setCartBill: (bill) => dispatch(setCartBill(bill)),
        setShippingAddress: (addr) => dispatch(setShippingAddress(addr)),
        setAppliedCoupon: (coupon) => dispatch(setAppliedCoupon(coupon)),
        setLoyalityPoints: (loyalty) => dispatch(setLoyalityPoints(loyalty)),
        // setDeliveryType: (deliveryType) =>
        //   dispatch(setDeliveryType(deliveryType)),
      },
    });
  };

  useEffect(() => {
    fetchLocationList();
  }, []);

  const fetchLocationList = async () => {
    try {
      setLocationListLoader(true);
      const response = await getLocationByOrgId(orgId);

      if (response?.data?.es > 0) {
        showSnackBar(response?.data?.message);
        return;
      }

      const data = response?.data;
      const defaultNearestLocation = data?.branches?.[0];
      setLocationList(data?.branches || []);

      if (defaultNearestLocation) {
        dispatch(setuserSelectedLocationTakeAway(defaultNearestLocation));
        await getResturantCartData(defaultNearestLocation, "TAKE_AWAY");

        dispatch(
          setDeliveryType(
            storeUserSelectedLocationTakeAway?.subOrderType || "TAKE_AWAY"
          )
        );
      }
    } catch (err) {
      showSnackBar(err?.message, "error");
    } finally {
      setLocationListLoader(false);
    }
  };

  const getNearestOutletIndex = () => {
    // Assuming nearest = shortest distance
    if (!locationList || locationList.length === 0) return -1;
    return locationList.reduce(
      (nearestIdx, curr, idx, arr) =>
        parseFloat(curr?.distance || Infinity) <
        parseFloat(arr[nearestIdx]?.distance || Infinity)
          ? idx
          : nearestIdx,
      0
    );
  };
  const nearestIndex = getNearestOutletIndex();
  const handleDirections = (destLat, destLng) => {
    if (!navigator.geolocation) {
      showSnackBar("Geolocation not supported", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const originLat =
          liveLoc?.latitude || data?.latitude || position.coords.latitude;
        const originLng =
          liveLoc?.longitude || data?.longitude || position.coords.longitude;

        const origin = liveLoc?.street_address
          ? encodeURIComponent(liveLoc.street_address)
          : `${originLat},${originLng}`;

        const destination = `${destLat},${destLng}`;

        const directionUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;

        window.open(directionUrl, "_blank");
        //localStorage.setItem("fromDirectionsPage", "true");
        //window.location.href = directionUrl; // Open in same tab
      },
      (err) => {
        showSnackBar("Location access denied. Please enable GPS.", "error");
      }
    );
  };

  // useEffect(() => {
  //   if (localStorage.getItem("fromDirectionsPage")) {
  //     showSnackBar("Welcome back! You came from Maps.");
  //     navigate(-1);
  //     localStorage.removeItem("fromDirectionsPage");
  //   }
  // }, []);

  const handleChangeLocation = (loc) => {
    // If selected location is already active, just navigate
    if (storeUserSelectedLocationTakeAway?.branchId === loc?.branchId) {
      navigate("/home");
      return;
    }

    dispatch(setuserSelectedLocationTakeAway(loc));
    getResturantCartData(loc, "TAKE_AWAY");
    navigate("/home");
  };

  return (
    <>
      {locationListLoader ? (
        <CircularLoader
          sx={{
            color: "black",
            width: "10px !important",
            height: "10px !important",
          }}
        />
      ) : (
        <>
          {retailType === "RESTAURANT" && (
            <Box sx={{ backgroundColor: "black" }}>
              <Header />
            </Box>
          )}
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Currently Serving Locations
            </Typography>

            {locationListLoader ? (
              <CircularLoader
                sx={{
                  color: "black",
                  width: "10px !important",
                  height: "10px !important",
                }}
              />
            ) : (
              <Grid container spacing={2}>
                {locationList?.map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={item?.branchId || index}
                  >
                    <Card
                      sx={{
                        border:
                          storeUserSelectedLocationTakeAway?.branchId ===
                          item?.branchId
                            ? "2px solid #ad1a19" // red border for selected
                            : "1px solid #ccc", // light grey for others
                        borderRadius: "12px",
                        position: "relative",
                        backgroundColor:
                          storeUserSelectedLocationTakeAway?.branchId ===
                          item?.branchId
                            ? "#fae6e6" // light red bg for selected
                            : "#f5f5f5", // light grey for unselected
                        cursor: "pointer",
                        transition: "0.3s",
                      }}
                      onClick={() => handleChangeLocation(item)}
                    >
                      <CardContent>
                        {index === nearestIndex && (
                          <Chip
                            label="Nearest available outlet"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              backgroundColor: "#fae6e6",
                              color: "rgb(173, 26, 25)",
                              fontWeight: "bold",
                            }}
                          />
                        )}
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item?.name}, {item?.city || "Bangalore"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {item.address ||
                            "Sy No 83/1 Bommanahalli Main Road Next To Shriram Green Fields Appt, Mandur Post, Hobli, Bidarahalli, Bengaluru, Karnataka 560049"}
                        </Typography>

                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent={"space-between"}
                          mt={1}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent={"flex-start"}
                          >
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {item.distance || "1.2"} km
                            </Typography>
                          </Box>

                          <IconButton
                            onClick={() => handleDirections(13.07, 77.75)}
                          >
                            <DirectionsIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Text
                              text={"Directions"}
                              fontweight={200}
                              fontsize={10}
                            />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default LocationList;
