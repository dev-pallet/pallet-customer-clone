import React, { useState, useEffect, memo } from "react";
import { useNavigate } from "react-router";
import { isEqual } from "lodash";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../productCard";
import HomeListingComponent from "../HomeListingComponent";
import { getNearByStore } from "../../../../redux/reducers/locationReducer";
import {
  fetchTags,
  getFilterProducts,
} from "../../../../config/services/catalogService";
import { setSelectedTagData } from "../../../../redux/reducers/productReducer";
import { store } from "../../../../redux/store";
import noProductFound from "../../../../assets/images/no-results.png";
import { no_image } from "../../../../constants/imageUrl";
import "./index.css";
import ProductsListingSkeleton from "../../../skeleton/productsListingSkeleton";
import { useSnackbar } from "../../../../custom hooks/SnackbarProvider";
import {
  getCachedTags,
  setCachedTags,
} from "../../../../redux/reducers/categoryReducer";
import Skeleton from "@mui/material/Skeleton";
const Tags = ({ tagData, tagId, tagDataValue }) => {
  const nearByStore = useSelector(getNearByStore);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tagsList, setTagsList] = useState([]);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cachedTags = useSelector(getCachedTags);
  const isSmallScreen = useMediaQuery(
    "(min-width:390px) and (max-width:844px)"
  );

  // const getTagsList = () => {
  //   try {
  //     setLoading(true);

  //     if (cachedTags?.[tagId]?.length) {
  //       setLoading(false);
  //       return;
  //     }

  //     if (nearByStore?.id) {
  //       const payload = {
  //         orgIds: [String(nearByStore?.id)],
  //         locationIds: [String(nearByStore?.locId)],
  //         tagIds: [tagId],
  //         sort: {
  //           creationDateSortOption: "DEFAULT",
  //           tagPriority: "DEFAULT",
  //         },
  //       };
  //       fetchTags(payload).then((res) => {
  //         if (res?.data?.status === "SUCCESS") {
  //           const tagDataArray = res?.data?.data?.data?.data || [];
  //           const temp = tagDataArray?.map((e) => ({
  //             tagName: e?.tagName,
  //             gtins: e?.gtins,
  //             tagIds: e?.tagId,
  //           }));
  //           if (Array.isArray(tagDataArray)) {
  //             setTagsList(temp);
  //           }
  //         }
  //       });
  //     }
  //   } catch (e) {
  //     showSnackbar(e?.message || e?.response?.data?.message, "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   getTagsList();
  //   if (cachedTags?.[tagId]) {
  //     setList(cachedTags?.[tagId]);
  //     setTagsList(cachedTags?.[tagId]);
  //   }
  // }, [nearByStore, tagId]);

  useEffect(() => {
    if (tagDataValue) {
      setTagsList(tagDataValue);
    }
  }, [tagDataValue]);

  const getProductsData = async () => {
    const payload = {
      page: 1,
      pageSize: 20,
      storeLocations: [String(nearByStore?.locId)],
      //storeLocationId: String(nearByStore?.locId?.toLowerCase()),
      barcode: tagsList?.length > 0 ? tagsList?.[0]?.gtins : [],
    };

    setLoading(true);
    // if (cachedTags?.[tagId]?.length) {
    //   setList(cachedTags?.[tagId]);
    //   setTagsList(cachedTags?.[tagId]);
    //   setLoading(false);
    //   return;
    // }
    try {
      const res = await getFilterProducts(payload);
      if (res?.data?.status !== "SUCCESS") return;
      const temp = res?.data?.data?.data?.data || [];

      // const tagObject = {};
      // tagObject[tagId] = temp?.map((item) => ({
      //   ...item,
      //   tagName: tagsList?.[0]?.tagName,
      // }));
      // dispatch(setCachedTags({ ...cachedTags, ...tagObject }));
      setList([...list, ...temp]);
    } catch (err) {
      showSnackbar(err?.message || err?.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nearByStore && tagsList?.length > 0) {
      getProductsData();
    }
  }, [nearByStore, tagsList]);

  const renderTagContent = () => {
    // if (loading) {
    //   return (
    //     <HomeListingComponent
    //       title={tagsList?.[0]?.tagName}
    //       onClick={() => {
    //         store.dispatch(setSelectedTagData(tagsList?.[0]));
    //         navigate(`/product-listing/tags/${tagsList?.[0]?.tagName}`);
    //       }}
    //     >
    //       <Box className="products-by-category">
    //         <ProductsListingSkeleton listingType="horizontal" />
    //       </Box>
    //     </HomeListingComponent>
    //   );
    // }

    if (list?.length > 0) {
      return (
        <HomeListingComponent
          title={tagsList?.[0]?.tagName}
          onClick={() => {
            store.dispatch(setSelectedTagData(tagsList?.[0]));
            navigate(`/product-listing/tags/${tagsList?.[0]?.tagName}`);
          }}
        >
          <Box className="products-by-category">
            {list?.map((item, index) => {
              return (
                <ProductCard
                  key={item?.id}
                  // imageUrl={item["product"]?.images?.front || no_image}
                  imageUrl={item?.variants?.[0]?.images?.front || no_image}
                  discountText={
                    item?.["inventorySync"]?.mrp
                      ? `${Math.abs(
                          parseInt(
                            parseFloat(
                              ((item?.variants?.[0]?.["inventorySync"]?.mrp -
                                item?.variants?.[0]?.["inventorySync"]
                                  ?.sellingPrice) /
                                item?.variants?.[0]?.["inventorySync"]?.mrp) *
                                100
                            ).toFixed(2)
                          )
                        )}% OFF`
                      : "Best Price"
                  }
                  productName={item?.["companyDetail"]?.brand}
                  productDescription={item?.name}
                  productQuantity={`${
                    item?.variants?.[0]?.weightsAndMeasures?.[0]?.grossWeight ||
                    "NA"
                  } ${
                    item?.variants?.[0]?.weightsAndMeasures?.[0]
                      ?.measurementUnit || ""
                  }`}
                  // originalPrice={item?.["inventorySync"]?.mrp}
                  // discountedPrice={item?.["inventorySync"]?.sellingPrice}
                  originalPrice={
                    item?.variants?.[0]?.["inventorySync"]?.mrp || 0
                  }
                  discountedPrice={
                    item?.variants?.[0]?.["inventorySync"]?.sellingPrice || 0
                  }
                  productData={item}
                />
              );
            })}
          </Box>
        </HomeListingComponent>
      );
    }
    {
      /* <HomeListingComponent
            title={tagsList?.[0]?.tagName}
            onClick={() => navigate("/product-listing")}
            noData={true}
          >
            <Box className="no-products-found">
              <img
                src={noProductFound}
                className="no-products-found-img"
                alt="No products found"
              />
            </Box>
          </HomeListingComponent> */
    }
    return (
      <>
        {loading ? (
          <Skeleton
            variant="rectangular"
            width={isSmallScreen ? "95vw" : "95vw"}
            height={isSmallScreen ? 200 : 300}
            sx={{
              borderRadius: 2,
              backgroundColor: "#a7a7b575",
              margin: "12px",
            }}
            animation="wave"
          />
        ) : null}
      </>
    );
  };

  return <>{renderTagContent()}</>;
};

export default memo(Tags, isEqual);
