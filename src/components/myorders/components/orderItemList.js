//react
import { useEffect, useState } from "react";

//mui components
import { Box } from "@mui/material";

//custom components
import Text from "../../custom-components/Text";

//styles
import "../index.css";

//api
import { getFilterProducts } from "../../../config/services/catalogService";

//images
import { colorConstant } from "../../../constants/colors";
import { no_image } from "../../../constants/imageUrl";
import { getNearByStore } from "../../../redux/reducers/locationReducer";
import { useSelector } from "react-redux";

export const OrderItemList = ({ gtins, item }) => {
  const [data, setData] = useState(item);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const gtinArray = gtins?.split(",").map((value) => value);
  const locationId = localStorage.getItem("locationId"); //if refresh then fetch location id from local
  const nearByStore = useSelector(getNearByStore);
  const locId = nearByStore?.locId ? nearByStore?.locId : locationId;

  const getProductImages = async () => {
    const catalogPayload = {
      page: 1,
      pageSize: 20,
      barcode: gtinArray,
      storeLocations: [locId],
    };
    try {
      setLoading(true);
      await getFilterProducts(catalogPayload).then((res) => {
        if (res?.data?.status === "ERROR") {
          showSnackbar(res?.data?.message, "error");
          return;
        }

        if (res?.data?.data?.es !== 0) {
          showSnackbar(res?.data?.data?.message, "error");
          return;
        }
        const result = res?.data?.data.data?.response;
        setImages(result);
      });
      // setLoading(false);
    } catch (error) {
      setLoading(false);
      showSnackbar(error?.message || error?.response?.data?.message, "error");
    }
  };

  useEffect(() => {
    getProductImages();
  }, []);

  return (
    <Box className="order-item-img-box">
      {data?.map((ele, index) =>
        index < 3 ? (
          <Box className="order-item-img-box2" key={index}>
            <img
              className="order-item-img"
              key={index}
              src={images[index]?.product?.images?.front || no_image}
              onError={(e) => (e.target.src = no_image)}
            />
          </Box>
        ) : null
      )}
      {data?.length > 4 ? (
        <Box className="order-balance-count">
          <Text
            text={"+ " + (data?.length - data?.slice(0, 3)?.length)}
            fontsize={"14px"}
            tint={colorConstant?.lightgraytext}
          />
        </Box>
      ) : null}
    </Box>
  );
};
