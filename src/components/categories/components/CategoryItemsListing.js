// react
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import Pagination from "@mui/material/Pagination";

// redux
import { getNearByStore } from "../../../redux/reducers/locationReducer";

// mui components
import { Box, Chip } from "@mui/material";

// custom components
import HeaderDropdown from "../../custom-components/HeaderDropdown";
import ProductCard from "../../home/components/productCard";
import Menuback from "../../menuback";

// constants
import { colorConstant } from "../../../constants/colors";
import { ScrollToTop } from "../../../constants/commonFunction";

// api
import {
  fetchCategories,
  fetchLevel1Cat,
  fetchLevel2Cat,
  getFilterProducts,
} from "../../../config/services/catalogService";

// loader
import Loader from "../../custom-components/Loader";

// skeleton
import ProductsListingSkeleton from "../../skeleton/productsListingSkeleton";
import NothingFound from "../../custom-components/NothingFound";
import ViewCart from "../../home/components/viewCart";
import { getDeliverySubOrderType } from "../../../redux/reducers/cartReducer";

export default function CategoryItemsListing() {
  const params = useParams();
  const nearByStore = useSelector(getNearByStore);
  const [totalResults, setTotalResults] = useState(null);
  const [mainCatResults, setMainCatResults] = useState(0);
  const [mainCat, setMainCat] = useState("");

  const [payload, setFilterPayload] = useState(null);
  const [products, setProducts] = useState([]);
  const [level1Cat, setLevel1Cat] = useState("");

  const [catList, setCatList] = useState([]);
  const [level1CatList, setLevel1CatList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const getSubOrderType = useSelector(getDeliverySubOrderType);

  useMemo(() => {
    if (params?.mainCategoryId) {
      setMainCat(params?.mainCategoryId);
      return;
    }
    if (params?.type === "main") {
      setMainCat(params?.id);
    } else {
      setMainCat(params?.mainCat);
      setLevel1Cat(params?.id);
    }
    setFilterPayload(params?.data);
  }, [params]);

  // fn to get selected category products
  const getProducts = async (page) => {
    // setCategoryLoading(true);
    try {
      const res = await getFilterProducts({
        page,
        pageSize: 20,
        ...payload,
      });
      const productVal = res?.data?.data?.data?.data;

      setCategoryLoading(false);
      if (res?.data?.status === "SUCCESS") {
        if (res?.data?.data?.data?.data?.length) {
          setPage(parseInt(res?.data?.data?.data?.currentPage));
          setTotalPage(res?.data?.data?.data?.totalPages);
          // setProducts((prev) => [...prev, ...res?.data?.data?.data?.data]);
          setProducts(res?.data?.data?.data?.data);
          if (payload?.mainCategory) {
            setMainCatResults(res?.data?.data?.data?.totalRecords);
          }
          setTotalResults(res?.data?.data?.data?.totalRecords);
          return;
        }

        if (
          res?.data?.data?.data?.data?.length === 0 &&
          page < res?.data?.data?.data?.totalPages
        ) {
          setPage((prev) => prev + 1);
          setCategoryLoading(false);
        }
      }
    } catch (e) {
      showSnackbar(e?.message || e?.response?.data?.message, "error");
      setCategoryLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom
      if (
        document.documentElement.scrollTop + window.innerHeight + 1 >=
        document.documentElement.scrollHeight
      ) {
        // Call function when reaching the bottom
        if (page <= totalPage) {
          setLoading(true);
          setPage((prev) => prev + 1);
        }
        if (page === totalPage) {
          setLoading(false);
        }
      }
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, totalPage]);

  useEffect(() => {
    if (payload) {
      setCategoryLoading(true);
      getProducts(page);
    }
  }, [payload, page]);

  // fetch the main Categories list
  useEffect(() => {
    try {
      fetchCategories({
        page: 1,
        pageSize: 10,
        sourceId: [nearByStore?.id],
        sourceLocationId: [nearByStore?.locId],
        sort: {
          creationDateSortOption: "DEFAULT",
          tagPriority: "DEFAULT",
        },
      }).then((res) => {
        if (res?.data?.status !== "SUCCESS") {
          return;
        }
        const temp = res?.data?.data?.data?.data[0]?.categoryData;
        const categoryLevel1Name = temp?.find(
          (e) => e?.categoryId === mainCat
        )?.categoryName;
        setCatList(temp);
        setPage(1);
        setProducts([]);
        setFilterPayload({
          appCategories: {
            // categoryLevel1: [
            //   temp?.find((e) => {
            //     if (e?.categoryId === mainCat) {
            //       return e;
            //     }
            //   })?.categoryName,
            // ],
            categoryLevel1: categoryLevel1Name ? [categoryLevel1Name] : [],
            // categoryLevel2: [],
            // categoryLevel3: [],
          },
          productStatus: [],
          preferredVendors: [],
          sortByPrice: "DEFAULT",
          names: [],
          brands: [],
          manufacturers: [],
          query: "",
          salesChannels: [getSubOrderType],
        });
        setLoading(false);
      });
    } catch (e) {
      setLoading(false);
    }
  }, [params]);

  // fetch category level 1 list
  useEffect(() => {
    if (mainCat) {
      try {
        setLoading(true);
        fetchLevel1Cat({ mainCategoryId: [mainCat] }).then((res) => {
          if (res?.data?.status === "SUCCESS") {
            setLevel1CatList(res?.data?.data?.results);
          } else {
            setLevel1CatList([]);
          }
          setLoading(false);
        });

        // fetchLevel2Cat()
      } catch (e) {
        showSnackbar(e?.message || "Something went wrong", "error");
        setLevel1CatList([]);
        setLoading(false);
      }
    }
  }, [mainCat]);

  useEffect(() => {
    ScrollToTop();
  }, []);

  return (
    <>
      <Box className="category-items-root-div">
        {!catList?.length ? <Loader /> : null}
        <Box className="category-items-header">
          <Menuback
            head={true}
            search={true}
            categoryListing={true}
            bg={colorConstant?.baseBackground}
            headerDropdown={
              catList ? (
                <HeaderDropdown
                  text1={
                    catList?.find((item) => {
                      if (item?.categoryId === mainCat) {
                        return item;
                      }
                    })?.categoryName
                  }
                  isHome={false}
                  text2={totalResults}
                  mainCategories={catList}
                />
              ) : null
            }
          />

          {/* display cat level 1 in form of chips  */}
          {level1CatList?.length ? (
            <Box className="chip_display_box" sx={{ margin: "0.5rem" }}>
              {level1CatList?.map((item, index) => (
                <Chip
                  label={item?.categoryName}
                  key={index}
                  // sx={{
                  //   marginRight: "10px",
                  //   backgroundColor: `${
                  //     item?.level1Id === level1Cat
                  //       ? colorConstant?.tintColor
                  //       : colorConstant?.white
                  //   } !important`,
                  //   border: "1px solid gainsboro",
                  //   color: `${
                  //     item?.level1Id === level1Cat
                  //       ? colorConstant?.primaryColor
                  //       : colorConstant.defaultText
                  //   } !important`,
                  //   height: "30px !important",
                  // }}
                  size="small"
                  onClick={() => {
                    setPage(1);
                    setProducts([]);
                    setFilterPayload({
                      appCategories: {
                        categoryLevel2: [item?.categoryName],
                      },
                    });
                    setLevel1Cat(item?.level1Id);
                  }}
                />
              ))}
            </Box>
          ) : null}
        </Box>

        <Box className="category-items-list">
          {catList?.length ? (
            categoryLoading ? (
              <ProductsListingSkeleton listingType="vertical" />
            ) : !categoryLoading && products?.length ? (
              products?.map((item) => {
                const variantItems = item?.variants?.filter((variant) => {
                  return variant;
                });
                const variantItem = variantItems?.[0]?.inventorySync;

                return (
                  <ProductCard
                    verticalListing={true}
                    imageUrl={
                      item?.imageUrls !== null
                        ? item?.imageUrls || variantItem?.images
                        : "No Image"
                    }
                    discountText={`${Math.abs(
                      parseInt(
                        parseFloat(
                          ((item?.["inventorySync"]?.mrp ||
                            variantItem?.mrp -
                              item?.["inventorySync"]?.sellingPrice ||
                            variantItem?.sellingPrice) /
                            item?.["inventorySync"]?.mrp || variantItem?.mrp) *
                            100
                        ).toFixed(2)
                      )
                    )}% OFF`}
                    // productName={`${item?.brand} ? ${item?.brand} : "No Data"`}
                    productName={item?.brand}
                    productDescription={item?.name}
                    productQuantity={`${
                      item?.weight || variantItem?.weight || ""
                    } ${item?.weightUnit || variantItem?.weightUnit || ""}`}
                    originalPrice={
                      item?.["inventorySync"]?.mrp || variantItem?.mrp || 0
                    }
                    discountedPrice={
                      item?.["inventorySync"]?.sellingPrice ||
                      variantItem?.sellingPrice ||
                      0
                    }
                    productData={item}
                    key={uuidv4()}
                  />
                );
              })
            ) : (
              !categoryLoading &&
              !products?.length && (
                <NothingFound
                  message={"We're busy stocking up! New products coming soon"}
                  width={"200px"}
                />
              )
            )
          ) : null}
          <Pagination
            count={Math.floor(totalResults / 10)}
            page={page}
            onChange={(e, value) => {
              setPage(value);
            }}
            variant="outlined"
          />
        </Box>

        <ViewCart adjustView={true} />
      </Box>
    </>
  );
}
