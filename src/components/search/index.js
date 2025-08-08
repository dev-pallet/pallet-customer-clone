// react
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// mui components
import { Box, Chip } from "@mui/material";

// custom components
import CustomInput from "../custom-components/CustomInput";
import Text from "../custom-components/Text";
import ProductListing from "../home/components/productListing";

// icons
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { CircularLoader } from "../custom-components/CircularLoader";
import { CircularProgress } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// constants
import { colorConstant } from "../../constants/colors";

// api
import { getFilterProducts } from "../../config/services/catalogService";

// images
import noSearchResult from "../../assets/animation-json/search.json";
import { getServiceable, getStoreType } from "../../redux/reducers/miscReducer";
import Heading from "../custom-components/Heading";
import SuggestionSkeleton from "./components/suggestionSkeleton";
import SuggestionsSearch from "./components/suggestionsSearch";

//libraries
import Lottie from "react-lottie";
//css
import ViewCart from "../home/components/viewCart";
import "./index.css";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

//import hooks
import { useProductData } from "../../custom hooks/useProductData";
import SearchResturantProducts from "../searchResturantProducts";
import RestaurantIcon from "@mui/icons-material/Restaurant";

import MenuList from "../home/components/MenuItems/menuItemModal";
import Header from "../header";
import Menuback from "../menuback";
import { getNearByStore } from "../../redux/reducers/locationReducer";

export default function Search() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(3);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [storeQueryValue, setStoreQueryValue] = useState("");
  const [value, setValue] = useState(0);
  const [openMenuList, setOpenMenuList] = useState(false);
  const [index, setIndex] = useState(0);
  //for restaurant purpose
  const [resturantShowSuggestion, setResturantSuggestion] = useState();
  const isServiceable = useSelector(getServiceable);
  const nearByStore = useSelector(getNearByStore);
  const locId = nearByStore?.locId;
  const observer = useRef();
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const navigate = useNavigate();

  const handleOpen = () => {
    setOpenMenuList(true);
  };

  const handleClose = () => {
    setOpenMenuList(false);
  };

  const {
    loading: loader,
    restaurantData,
    error,
    errorMessage,
    totalResults: totalResultsPage,
    setQuerySearch,
    querySearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductData();

  const lastElementRef = useCallback(
    (node) => {
      if (loading || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasNextPage, isFetchingNextPage, fetchNextPage]
  );
  const animationOptions = {
    loop: true,
    autoplay: true,
    animationData: noSearchResult,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    if (text) {
      setProductSearchText(text);
    }
  }, []);

  const goToPreviousPath = () => {
    navigate(-1);
  };

  const fetchSearchedProducts = async () => {
    setLoading(true);
    if (text?.length === 0 || text === "") {
      setData([]);
      setLoading(false);
    } else {
      await getFilterProducts({
        page,
        pageSize: 20,
        names: [text],
      }).then((res) => {
        if (res?.data?.status !== "SUCCESS") {
          return;
        }
        // let temp = res?.data?.data?.data?.response?.filter(
        //   (item) => item?.inventoryData !== null
        // );
        let temp = res?.data?.data?.data?.data;
        const mappedData = temp
          ?.map((item) => {
            const matchedVariant = item?.variants?.filter((variant) => {
              return variant?.barcodes?.some((barcode) =>
                payload?.barcode?.includes(barcode)
              );
            });

            return matchedVariant || null;
          })
          .filter(Boolean);
        const tempVal = mappedData?.flatMap((item) => {
          return item;
        });

        setTotalPage(res?.data?.data?.data?.totalPages);
        setTotalResults(res?.data?.data?.data?.totalRecords);
        setData([...data, ...tempVal]);
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (text && text?.length === 0) {
      setData([]);
    } else {
      fetchData(text);
    }
  }, [page]);

  const fetchData = async (text) => {
    if (isServiceable) {
      try {
        if (text?.length === 0 || text === "") {
          setData([]);
          setLoading(false);
        } else {
          await getFilterProducts({
            page,
            pageSize: 50,
            query: text,
            // displayApp: false,
            barcode: [],
            brands: [],
            manufacturers: [],
            mergedProductShow: false,
            name: [],
            preferredVendors: [],
            productStatus: [],
            storeLocations: [locId],
          }).then((res) => {
            setLoading(false);
            if (res?.data?.status !== "SUCCESS") {
              return;
            }
            let temp = res?.data?.data?.data?.data;
            setData((prev) => {
              return [...prev, ...temp];
            });

            //for resturant showing all products with variants
            setTotalPage(parseInt(res?.data?.data?.data?.totalPages));
            setTotalResults(parseInt(res?.data?.data?.data?.totalRecords));

            // setData(temp);
            setLoading(false);
          });
        }
      } catch (error) {
        setLoading(false);
      }
    } else {
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    const timeOut = setTimeout(() => {
      setData([]);
      setPage(1);
      setTotalPage(2);
      fetchData(text);
      return;
    }, 630);
    return () => {
      clearTimeout(timeOut);
      setLoading(false);
    };
  }, [text]);

  // to handle suggestion
  const handleSuggestionChange = (result) => {
    setData([]);
    setShowSuggestion(false);
    setText(result?.text); // grocery
    setQuerySearch(result?.text);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setShowSuggestion(false);

      setText(event.target.value);
    }
  };

  //to handle resturant
  const handleKeyPressRestro = (event) => {
    if (event.key === "Enter") {
      setShowSuggestion(false);
      setQuerySearch(event.target.value);
    }
  };

  // on change input fn
  const handleInputChange = (event) => {
    setShowSuggestion(true);
    setData([]);
    setText(event.target.value);
  };

  // on change input fn resturant
  const handleInputChangeRestro = (event) => {
    setShowSuggestion(true);
    // setRestaurantData([]);
    setQuerySearch(event.target.value);
    setStoreQueryValue(event.target.value);
  };

  // clear input fn
  const handleClearText = () => {
    setText("");
    // setData([]);
    setPage(1);
    setTotalResults(0);
    setTotalPage(2);

    setStoreQueryValue("");
    setQuerySearch("");
  };

  //clear input fn restro
  const handleClearTextRestaurant = () => {
    setStoreQueryValue("");
    setQuerySearch("");
    // setRestaurantData([]);
    setPage(1);
    setTotalResults(0);
    setTotalPage(2);
  };

  const handleSearchIcon = () => {
    setText(text);
    setShowSuggestion(false);

    setQuerySearch(storeQueryValue);
  };

  const handleSearchIconRestro = () => {
    setQuerySearch(text);
    setShowSuggestion(false);
  };

  const tags = [
    "Vim Bar",
    "Sugar",
    "Fruits",
    "Vegetables",
    "Anil Semiya",
    "Toor Dal Eco",
    "Ashirvad Atta",
    "Surf Excel",
  ];
  const styles = {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % suggestions?.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [suggestions?.length]);
  const suggestions = [
    "Pizza",
    "Wings",
    "Skewers",
    "Burger",
    "Biryani",
    "Tacos",
  ];
  return (
    <>
      {retailType !== "RESTAURANT" ? (
        <Box bgcolor={colorConstant?.baseBackground} px="5px" height="100vh">
          <CustomInput
            inRef={true}
            placeholder="Search over 20,000+ products here"
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            clearInput={text && handleClearText}
            searchIconInput={text && handleSearchIcon}
            // inputAdornmentIcon={
            //   <ArrowBackIosNewIcon
            //     onClick={goToPreviousPath}
            //     style={{
            //       zIndex: 1000,
            //       color: "darkgray",
            //       height: "15px",
            //     }}
            //     fontSize="small"
            //   />
            // }
          />

          <Box className="popular-search">
            {text === "" && (
              <>
                <Box
                  flex="1"
                  alignItems="center"
                  borderLeft="4px solid yellow"
                  sx={{
                    margin: "1rem 0",
                  }}
                >
                  <Heading text="Popular Searches" paddingLeft="5px" />
                </Box>
                {tags?.map((tag) => (
                  <Chip
                    onClick={() => {
                      setText(tag);
                      setShowSuggestion(true);
                    }}
                    key={tag}
                    size="small"
                    label={
                      <Box sx={{ display: "flex" }}>
                        <OpenInNewIcon
                          sx={{
                            marginRight: "10px",
                            width: "15px",
                            height: "15px",
                          }}
                        />
                        {tag}
                      </Box>
                    }
                    sx={{
                      marginRight: "10px",
                      marginBottom: "10px",
                      padding: "5px",
                      backgroundColor: `${colorConstant?.white} !important`,
                      border: "1px solid gainsboro",
                      color: `${colorConstant?.defaultText} !important`,
                      height: "30px !important",
                    }}
                  />
                ))}
              </>
            )}
          </Box>

          {!isServiceable && text?.length && !loading ? (
            <Box className="no-search-results">
              <Lottie options={animationOptions} height={200} width="100%" />
              <Text
                text={`Sorry we coudn't find any results.`}
                fontsize={14}
                textTransform="lowercase"
              />
            </Box>
          ) : null}
          {showSuggestion && text?.length ? (
            loading ? (
              <SuggestionSkeleton />
            ) : (
              <SuggestionsSearch
                data={data}
                text={text}
                onChange={handleSuggestionChange}
              />
            )
          ) : null}
          {loading && !showSuggestion && text?.length && !data?.length ? (
            <CircularLoader />
          ) : null}
          {!showSuggestion && text?.length && data?.length ? (
            <ProductListing
              isSearch={true}
              searchItem={text}
              itemsList={data}
            />
          ) : (
            <p>No data found</p>
          )}
        </Box>
      ) : (
        <>
          <Box
            className="header-top"
            sx={{
              background:
                "linear-gradient(rgb(0, 0, 0) 5%, rgba(217, 217, 217, 1) 146%)",
              padding: 0,
              marginBottom: 0,

              // borderBottom: "1px solid white",
            }}
          >
            <Header />
          </Box>

          <Box
            bgcolor={colorConstant?.baseBackground}
            // px="5px"
            // paddingRight={1}
            height="100vh"
            display="flex"
            flexDirection="column"
          >
            {openMenuList && (
              <MenuList handleOpen={handleOpen} handleClose={handleClose} />
            )}

            <Box className="popular-search">
              {storeQueryValue === "" && (
                <>
                  <Box
                    flex="1"
                    alignItems="center"
                    borderLeft="4px solid yellow"
                    sx={{
                      margin: "1rem 0",
                    }}
                  >
                    <Heading
                      // text={
                      //   retailType !== "RESTAURANT"
                      //     ? "Popular Searches"
                      //     : "All Product"
                      // }
                      paddingLeft="5px"
                      style={{
                        color: "black",
                        fontFamily: "sans-serif",
                        fontWeight: "400",
                      }}
                    />
                  </Box>
                </>
              )}
            </Box>

            {!isServiceable && storeQueryValue?.length && !loading ? (
              <Box className="no-search-results">
                <Lottie options={animationOptions} height={200} width="100%" />
                <Text
                  text={`Sorry we coudn't find any results.`}
                  fontsize={14}
                  textTransform="lowercase"
                />
              </Box>
            ) : null}

            {/* {storeQueryValue?.length && storeQueryValue?.length ? ( */}

            {loading ? (
              <Box sx={styles}>
                <CircularProgress
                  sx={{
                    color: colorConstant?.sakuraRestroColor,
                    width: "30px !important",
                    height: "30px !important",
                  }}
                />
                <Text
                  text={text || "Loading"}
                  tint={colorConstant?.sakuraRestroColor}
                />
              </Box>
            ) : (
              <Box sx={{ paddingBottom: "100px" }}>
                <SearchResturantProducts
                  isSearch={true}
                  searchItem={storeQueryValue}
                  itemsList={restaurantData}
                  loadSearchPage={loader}
                  loading={loading}
                  lastElementRef={lastElementRef}
                />
              </Box>
            )}
            {/* ) : (
            <p>No data found</p>
          )} */}
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: 0,
              // bottom: -9,
              width: "99.5%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              left: "0",
              right: "0",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            }}
          >
            <CustomInput
              inRef={false}
              placeholder={
                retailType !== "RESTAURANT"
                  ? "Search over 20,000+ products here"
                  : `Search "${suggestions[index]}"`
              }
              type="text"
              value={storeQueryValue}
              onChange={handleInputChangeRestro}
              onKeyPress={handleKeyPressRestro}
              clearInput={storeQueryValue && handleClearTextRestaurant}
              searchIconInput={storeQueryValue && handleSearchIconRestro}
              inputAdornmentIcon={
                <>
                  {/* <ArrowBackIosNewIcon
                    onClick={goToPreviousPath}
                    style={{
                      zIndex: 1000,
                      color: "darkgray",
                      height: "15px",
                    }}
                    fontSize="small"
                  /> */}

                  <SearchIcon
                    className="search-icon"
                    color={colorConstant?.sakuraRestroColor}
                  />
                </>
              }
              customStyles={{
                borderRadius: "0px",
                padding: "10px 10px",
                // border: "2px solid orange",
                // "& input": {
                //   color: "red",
                // },
                // "&.MuiOutlinedInput-root": {
                //   "&.Mui-focused fieldset": {
                //     borderColor: "orange",
                //   },
                // },
              }}
            />

            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              sx={{
                backgroundColor:
                  retailType === "RESTAURANT"
                    ? colorConstant?.defaultButtonText
                    : "#fff",
                flex: 1,
                borderRadius: "35px",
              }}
            >
              {retailType === "RESTAURANT" && (
                <BottomNavigationAction
                  label="Menu"
                  icon={<RestaurantIcon />}
                  onClick={handleOpen}
                  style={{
                    color: value === 0 ? "white" : "grey",
                    backgroundColor: value === 0 ? "#2f2f37" : "black",
                  }}
                />
              )}
            </BottomNavigation>
          </Box>
        </>
      )}

      <ViewCart adjustView={true} />
    </>
  );
}
