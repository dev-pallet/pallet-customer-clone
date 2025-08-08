import React, { useEffect, useState } from "react";
import NothingFound from "../../../custom-components/NothingFound";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeliveryAddress,
  getUserData,
  setDeliveryAddress,
  setUserData,
} from "../../../../redux/reducers/userReducer";
import NoAddressFound from "../../../../assets/images/No-Address-found.png";
import { CircularLoader } from "../../../custom-components/CircularLoader";
import {
  deleteAddress,
  getAllAddress,
} from "../../../../config/services/customerService";
import {
  getRefreshState,
  setRefreshState,
  setServiceable,
  setSlot,
  setStoreType,
} from "../../../../redux/reducers/miscReducer";
import AddressCard from "../AddressCard";
import {
  getCartProducts,
  getCartStatus,
  getDeliverySubOrderType,
  getShippingAddress,
  setCartBill,
  setCartId,
  setCartProducts,
  setCartStatus,
  setDeliveryType,
  setShippingAddress,
} from "../../../../redux/reducers/cartReducer";
import {
  getNearestServiceableStores,
  getNearestServiceableStoresBasedOnUserLocaion,
} from "../../../../config/services/serviceabilityService";
import {
  createCart,
  updateCart,
  updateResturantCart,
} from "../../../../config/services/cartService";
import moment from "moment";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import { useNavigate } from "react-router-dom";
import { getRetailTypeApi } from "../../../../config/services/userService";
import { restaurantCreateCartApi } from "../../../../utils/restaurantCartApi";

export default function AddressList() {
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const refresh = useSelector(getRefreshState);
  const shippingAddress = useSelector(getShippingAddress);
  const shippingAddressFromLs = localStorage.getItem("shippingAddress");
  const subOrderType = useSelector(getDeliverySubOrderType);
  // const addressChangeFromCart = localStorage.getItem(
  //   "address_change_from_cart"
  // );
  const orgId = user?.organizationId;
  const cartStatus = useSelector(getCartStatus);

  const deliveryAddress = useSelector(getDeliveryAddress);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [addressChanged, setAddressChanged] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(
    deliveryAddress?.id || null
  );

  const cartId = localStorage.getItem("cartId");
  const cartProduct = useSelector(getCartProducts) || [];
  const getDeliveryType = useSelector(getDeliverySubOrderType);
  const fetchAddress = async () => {
    setLoading(true);
    await getAllAddress(user?.id).then((res) => {
      setLoading(false);
      if (res?.data?.es === 0) {
        const addresses = res?.data?.addresses;
        const selectedAddress = addresses?.filter(
          (el) => el?.id === deliveryAddress?.id
        );
        const nonSelectedAddress = addresses?.filter(
          (el) => el?.id !== deliveryAddress?.id
        );
        const reorderedAddress = selectedAddress?.concat(nonSelectedAddress);
        setList(reorderedAddress);
        dispatch(
          setUserData({
            ...user,
            addresses: reorderedAddress,
          })
        );
      } else {
        setList([]);
      }
    });
  };

  const handleDeleteSelectedAddress = async (address) => {
    const payload = {
      addressId: address?.id,
      updatedBy: user?.uidx,
    };
    try {
      const res = await deleteAddress(payload);
      if (res?.data?.es === 0) {
        if (
          address?.id ===
          (shippingAddress?.addressId || shippingAddressFromLs?.addressId)
        ) {
          dispatch(setServiceable(false));
          dispatch(setDeliveryAddress(null));
          dispatch(setShippingAddress(null));
        }
        dispatch(setSlot(null));
      }
      fetchAddress();
      showSnackbar(
        res?.data?.message || err?.response?.data?.message,
        "success"
      );
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const getResturantCartData = async () => {
    const payload = {
      cartId: cartId,
      userName: user?.name,
      userId: user?.id,
      tableNumber: "1",
      mobileNo: user?.phoneNumber,
      enableWhatsapp: true,
      createdBy: user?.uidx,
      updatedBy: user?.uidx,
      locationId: locationId,
      // sourceId: user?.organizationId,
      sourceId: sourceId,
      // licenseId: "LIC000051",
      // terminalName: "TER-01",
      orderType: "RESTAURANT_ORDER",
      subOrderType: getDeliveryType,
      sourceLocationId: locationId,
      sourceType: "RETAIL",
      channel: "B2C",
      loggedInUser: user?.uidx,
      sourceApp: "B2C",
      // destinationId: user?.organizationId,
      destinationId: sourceId,
      destinationLocationId: locationId,
      destinationType: "RETAIL",
      // sessionId: "RLC_8320250328103719",
    };

    await restaurantCreateCartApi({
      payload,
      onSuccess: (result) => {
        if (result?.data?.status === "SUCCESS") {
          showSnackbar(result?.data?.status, "success");
        }
      },
      onError: (msg) => {
        showSnackbar(msg, "error");
      },
      dispatchers: {
        setCartId: (id) => dispatch(setCartId(id)),
        setCartProducts: (products) => dispatch(setCartProducts(products)),
        setCartStatus: (products) => dispatch(setCartStatus(products)),
        setCartBill: (bill) => dispatch(setCartBill(bill)),
        setShippingAddress: (addr) => dispatch(setShippingAddress(addr)),
        setAppliedCoupon: (coupon) => dispatch(setAppliedCoupon(coupon)),
        setLoyalityPoints: (loyalty) => dispatch(setLoyalityPoints(loyalty)),
        setDeliveryType: (deliveryType) =>
          dispatch(setDeliveryType(deliveryType)),
      },
    });
  };

  const handleCart = async (payload, address) => {
    try {
      // const res = await createCart(payload);
      let res;
      if (cartId) {
        // Update existing cart
        res = await updateResturantCart({
          ...payload,
          cartId, // Ensure the existing cartId is used
        });
      } else {
        // Create new cart
        res =
          retailType === ""
            ? await getResturantCartData()
            : await createCart(payload);
      }

      if (res?.data?.data?.es === 0) {
        setAddressChanged(!addressChanged);
        const result = res?.data?.data?.data;

        dispatch(setCartId(result?.cartId));
        dispatch(
          setCartProducts(result?.data?.cartProducts || payload?.cartProducts)
        );
        dispatch(setCartBill(result?.data?.billing));
        dispatch(setShippingAddress(result?.data?.shippingAddress));
        dispatch(setDeliveryAddress(address));
        dispatch(setRefreshState(!refresh));
        dispatch(setSlot(null));
        dispatch(setDeliveryType(result?.data?.subOrderType));
        localStorage.setItem("cartId", result?.cartId);
        // return;
      } else {
        showSnackbar(res?.data?.message || "Failed to update cart", "error");
      }
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const chooseAddress = async (item) => {
    if (selectedAddressId === item?.id) {
      // Deselect
      setSelectedAddressId(null);
      dispatch(setDeliveryAddress(null));
      dispatch(setShippingAddress(null));
      dispatch(setSlot(null));
      return;
    }

    setSelectedAddressId(item?.id);

    try {
      const locationPayload = {
        lat: Number(item?.latitude),
        long: Number(item?.longitude),
      };

      // Run both API calls in parallel
      const [storeResponse, storeBasedOnLocationResponse] = await Promise.all([
        getNearestServiceableStores(locationPayload),
        getNearestServiceableStoresBasedOnUserLocaion(locationPayload),
      ]);

      // Check if serviceable
      if (!storeResponse?.serviceable) {
        showSnackbar(
          "Currently we cannot deliver here. Please choose different location",
          "error"
        );
        dispatch(setServiceable(true));
        return;
      }
      // Get retail type
      const res = await getRetailTypeApi(
        storeResponse?.response?.sourceLocationId
      );
      const data = res?.data?.branch?.branchType;
      localStorage.setItem("retailType", data);
      dispatch(setStoreType(data));

      // Prepare cart payload
      const cartPayload = {
        cartId: cartId || null,
        shippingAddress: {
          ...item,
          addressId: item?.id,
          pinCode: item?.pincode,
          addressType:
            item?.addressType === "OTHER" ? item?.otherName : item?.addressType,
          updatedOn: moment(new Date()).toISOString(),
          phoneNo: item?.phoneNumber || user?.phoneNumber,
        },
        billingAddress: {
          ...item,
          addressId: item?.id,
          pinCode: item?.pincode,
          addressType:
            item?.addressType === "OTHER" ? item?.otherName : item?.addressType,
          updatedOn: moment(new Date()).toISOString(),
          phoneNo: item?.phoneNumber || user?.phoneNumber,
        },
        subOrderType: subOrderType,
      };

      await handleCart(cartPayload, item);

      // Navigate
      setTimeout(() => {
        if (cartId) {
          navigate("/cart");
        } else {
          navigate("/home");
        }
      }, 300);
    } catch (err) {
      showSnackbar(
        err?.message ||
          err?.response?.data?.message ||
          "Something went wrong in choosing address",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchAddress();
  }, [addressChanged]);

  useEffect(() => {
    if (!list?.length) {
      dispatch(setSlot(null));
    }
  }, [list]);

  if (loading) return <CircularLoader text={"Fetching Address"} />;

  return (
    <>
      {/* address list if user is logged in  */}
      {!user?.nonLoggedIn && (
        <>
          {/* when user logged in but no saved address found  */}
          {!list?.length ? (
            <NothingFound
              src={NoAddressFound}
              message={"Uh-oh! Your address seems to be missing. Add one!"}
              alt={"no address found"}
            />
          ) : null}
          {/* when user logged in and saved address found  */}
          {list?.length
            ? list?.map((address) => {
                return (
                  <AddressCard
                    key={address?.id}
                    address={address}
                    handleDeleteSelectedAddress={handleDeleteSelectedAddress}
                    isChecked={selectedAddressId === address?.id}
                    chooseAddress={chooseAddress}
                  />
                );
              })
            : null}
        </>
      )}
    </>
  );
}
