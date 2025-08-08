// react
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// material ui
import { Box, Skeleton } from "@mui/material";

// custom components
import Heading from "../../custom-components/Heading";
import Text from "../../custom-components/Text";
import { useSnackbar } from "../../../custom hooks/SnackbarProvider";

// images
import { no_image } from "../../../constants/imageUrl";

// service
import { getFilterProducts } from "../../../config/services/catalogService";

// constants
import { truncateText } from "../../../constants/commonFunction";

export default function OrderedItemsCard({ data }) {
  const [item, setItem] = useState(null);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const getProductImage = async () => {
    const catalogPayload = {
      barcode: [data?.gtin],
    };
    try {
      await getFilterProducts(catalogPayload).then((res) => {
        const matchedVariant = res?.data?.data?.data?.data?.[0]?.variants?.find(
          (variant) => variant?.barcodes?.includes(data?.gtin)
        );
        const images = matchedVariant?.images;
        setItem({ ...data, image: images });
      });
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    }
  };

  const gotToProductDetail = () => {
    navigate(`/product-details/${data?.gtin}`);
  };

  useEffect(() => {
    getProductImage();
  }, []);

  return (
    <Box>
      {!item ? (
        <Box className="cart-item-card" mb="10px">
          <Box className="cart-item-image" sx={{ fontSize: "10px" }}>
            <Skeleton
              variant="rectangular"
              className="cart-img"
              height="100%"
            />
          </Box>
          <Box
            className="cart-item-details"
            justifyContent={"space-between"}
            flex={1}
          >
            <Box>
              <Skeleton variant="text" width={150} height={20} />
              <Skeleton variant="text" width={150} height={15} />
            </Box>
            <Box className="content-center-right">
              <Skeleton variant="text" height={15} />
            </Box>
          </Box>
        </Box>
      ) : (
        data && (
          <Box
            className="cart-item-card"
            mb="10px"
            onClick={(e) => {
              e.stopPropagation();
              gotToProductDetail();
            }}
          >
            <Box className="cart-item-image" sx={{ fontSize: "10px" }}>
              <img
                src={item?.image?.front || item?.productImage || no_image}
                className="cart-img"
                alt="no image"
                onError={(e) => (e.target.src = no_image)}
              />
            </Box>
            <Box
              className="cart-item-details"
              justifyContent={"space-between"}
              flex={1}
            >
              <Box>
                <Heading
                  text={truncateText(data?.productName, 30)}
                  fontSize={12}
                  fontWeight={"bold"}
                />
                <Text text={`${data?.quantity} peices`} tint={"darkgrey"} />
              </Box>
              <Box className="content-center-right">
                <Text
                  text={`\u20B9 ${parseFloat(
                    data?.sellingPrice * data?.quantity
                  )?.toFixed(2)}`}
                  fontWeight={"bold"}
                  color={"black"}
                  fontSize={12}
                />
              </Box>
            </Box>
          </Box>
        )
      )}
    </Box>
  );
}
