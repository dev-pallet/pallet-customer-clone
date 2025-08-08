// react
import React, { useEffect, useState } from "react";

// mui components
import { Box } from "@mui/material";

// images
import fssaiLogo from "../../../../assets/images/fssai-logo.png";
import sakurafooter from "../../../../assets/gif/sakurafooter.gif";

// custom components
import Text from "../../../custom-components/Text";
import { useSelector } from "react-redux";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";
import STORE_DATA from "../../../../constants/storeData";
import "./endFooter.css";
import endFooterImage from "../../../../assets/images/endFooter.png";
import FloatingView from "./floatingView";
import { getStoreType } from "../../../../redux/reducers/miscReducer";

export default function EndFooter() {
  const nearByStore = useSelector(getNearByStore);
  const [license, setLicence] = useState("");
  const retailType = useSelector(getStoreType);

  useEffect(() => {
    if (nearByStore !== null) {
      if (nearByStore?.locId === STORE_DATA?.locId) {
        setLicence(`11222999000690`);
      } else {
        setLicence(`12423018002361`);
      }
    }
  }, [nearByStore]);

  return (
    <Box p="2" mx={1}>
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-text">
            {/* <div className="footer-text-row"> */}
            {retailType === "RESTAURANT" ? (
              <div className="quotes">
                {"Good Food, Good Life".split(" ")?.map((word, i) => (
                  <span
                    key={word}
                    className={`footer-word ${i === 4 ? "highlight" : ""}`}
                  >
                    {word}
                  </span>
                ))}

                <FloatingView>
                  {retailType === "RESTAURANT" && (
                    <img
                      src={sakurafooter}
                      alt="End Footer"
                      className="footer-image"
                    />
                  )}
                </FloatingView>
              </div>
            ) : (
              <>
                {"Delivered In Minutes".split(" ")?.map((word, i) => (
                  <span
                    key={word}
                    className={`footer-word ${i === 3 ? "highlight" : ""}`}
                  >
                    {word}{" "}
                  </span>
                ))}
              </>
            )}

            <div className="footer-heart-row">
              <span className="footer-made">Made with</span>
              <span className="footer-heart">❤️</span>
              <span className="footer-made">in India</span>
            </div>

            <div className="footer-fssai">
              <img src={fssaiLogo} width={"50px"} height={"25px"} />

              <Text
                text={`Lic. No. ${license}`}
                tint="rgb(134,140,150)"
                // marginTop="10px"
              />
            </div>

            {/* </div> */}
          </div>
          <div className="footer-img-wrapper">
            <FloatingView>
              {retailType !== "RESTAURANT" && (
                <img
                  src={endFooterImage}
                  alt="End Footer"
                  className="footer-image"
                />
              )}
            </FloatingView>
          </div>
        </div>
      </div>
    </Box>
  );
}
