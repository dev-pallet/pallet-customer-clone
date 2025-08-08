import { useMediaQuery } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./restroCategories.css";
import RestroCategoriesModal from "./restroCategoriesModal";
import { setStoreType } from "../../../../redux/reducers/miscReducer";
import { useDispatch } from "react-redux";

//Zomato Horizontal Categories
const HorizontalCategories = ({
  categoryVal,
  homePage = false,
  footer = true,
}) => {
  // const { loading, list, level1Cat, level2Cat, error, refresh } =
  //   useCategoryData();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [visibleItems, setVisibleItems] = useState([]);
  const isMobile = useMediaQuery("(max-width: 770px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (categoryVal) {
      setLoading(false);
    }
    const visibleData = isMobile ? categoryVal?.slice(0, 3) : categoryVal;
    setVisibleItems(visibleData);
  }, [categoryVal]);

  // if all button clicked by user, land to /home page
  const handleNavigate = (categoryName) => {
    if (!categoryName) {
      navigate("/home");
    } else {
      navigate(`/allMenu/${categoryName}`);
      // navigate(`/product-listing/category/${categoryId}`);
    }
  };

  const storedRetailType = localStorage.getItem("retailType");
  useEffect(() => {
    if (storedRetailType) {
      dispatch(setStoreType(storedRetailType));
    }
  }, [storedRetailType]);

  return (
    <>
      <div className="horizontal-scroll-container">
        {loading ? (
          <p>Loading ....</p>
        ) : (
          <>
            {/* <div
              className="category-badge"
              onClick={() => handleNavigate(null)}
            >
              <p
                style={{
                  color: "white",
                  fontFamily: "sans-serif",
                  cursor: "pointer",
                }}
              >
                All
              </p>
            </div> */}
            {visibleItems?.map((item, index) => {
              if (!item?.categoryName) {
                return null; // Skip rendering if categoryName is not present
              }

              return (
                <div className="category-badge" key={index}>
                  <p
                    style={{
                      color: "white",
                      fontFamily: "sans-serif",
                      cursor: "pointer",
                    }}
                    onClick={() => handleNavigate(item?.categoryName)}
                  >
                    {item?.categoryName}
                  </p>
                </div>
              );
            })}

            {isMobile && visibleItems?.length > 5 && (
              <div
                className="category-badge view-all-badge"
                onClick={() => setOpenModal(true)}
              >
                <span>View All</span>
              </div>
            )}
          </>
        )}
      </div>

      {openModal && (
        <RestroCategoriesModal
          level1Cat={visibleItems}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};

export default memo(HorizontalCategories);
