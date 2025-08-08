import React, { useEffect, useState } from "react";

//mui components
import { Box } from "@mui/material";
import Menuback from "../menuback";

//css
import "./index.css";

//custom components
import Heading from "../custom-components/Heading";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";

// images
import { colorConstant } from "../../constants/colors";
import { ScrollToTop } from "../../constants/commonFunction";

//redux
import { useSelector } from "react-redux";
import { getCoupons } from "../../config/services/couponsService";
import { getNearByStore } from "../../redux/reducers/locationReducer";
import { getUserData } from "../../redux/reducers/userReducer";
import Loader from "../custom-components/Loader";
import CouponItem from "./couponItem";

const Coupons = () => {
  const nearByStore = useSelector(getNearByStore);
  const showSnackbar = useSnackbar();
  const user =
    useSelector(getUserData) || JSON.parse(localStorage.getItem("@user"));
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchCoupon = async () => {
    const payload = {
      orgId: nearByStore?.id,
      orgLocId: nearByStore?.locId,
      uidx: user?.uidx,
      userType: "END_USER",
      channel: "APP",
    };

    try {
      const res = await getCoupons(payload);
      if (res?.data?.status !== "SUCCESS") {
        setLoading(false);
        return;
      } else {
        setCoupons(res?.data?.data?.coupon);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    ScrollToTop();
  }, []);

  useEffect(() => {
    fetchCoupon();
  }, [nearByStore]);

  return (
    <Box>
      <Menuback
        head={true}
        text="Coupons For You"
        bg={colorConstant?.baseBackground}
        wishlist={true}
      />
      {!coupons?.length ? (
        <Loader />
      ) : (
        <Box className="coupons">
          <Box className="coupons-header">
            <Heading
              text="Available Coupons"
              fontWeight={600}
              style={{ marginTop: "60px" }}
            />
            <Box className="coupons-details">
              {coupons?.length > 0
                ? coupons?.map((item) => <CouponItem couponData={item} />)
                : null}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Coupons;
