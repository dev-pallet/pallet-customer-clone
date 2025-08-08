import React, { memo, useEffect, useState } from "react";
import { fetchAllMethods } from "../../nodeServices";
import NetBankingCard from "./NetBankingCard";
import { CircularProgress } from "@mui/material";
import { colorConstant } from "../color";
import Menuback from "../../../components/menuback";
import { useSelector } from "react-redux";
import { getBillingData } from "../../../redux/reducers/cartReducer";


import "./NetBanking.css";
import CustomText from "../CustomText";

const NetBankingList = () => {
  const [bankList, setBankList] = useState(null);
  const [loading, setLoading] = useState(true);
  const billData = useSelector(getBillingData);

  useEffect(() => {
    setLoading(true);
    fetchAllMethods()
      .then((res) => {
        if (res?.data?.status === "SUCCESS") {
          setBankList(res?.data?.data?.netbanking);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ margin: "auto", display: "flex", flex: 1 }}>
        <CircularProgress color="inherit" size={50} style={{ margin: "auto" }} />
      </div>
    );

  return (
    <>
      <Menuback
        head={true}
        text={"Payment Methods"}
        bg={colorConstant.baseBackground}
        redirect={"/payment/methods"}
        wishlist={true}
        totalPayment={billData?.totalCartValue}
      />
      <div className="container">
        <CustomText text={`All Banks`} heading margin={`1rem 0`} />
        <div>
          {bankList &&
            Object.entries(bankList).map(([key, value], i) => (
              <NetBankingCard bank={value} bankId={key} key={i} />
            ))}
        </div>
      </div>
    </>
  );
};

export default memo(NetBankingList);
