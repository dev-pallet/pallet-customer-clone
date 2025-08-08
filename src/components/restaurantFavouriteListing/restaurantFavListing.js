import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import "./restaurantFavListing.css";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { removeFav } from "../../config/services/customerService";
import {
  getFavourites,
  getUserData,
  setFavourites,
} from "../../redux/reducers/userReducer";
import RestaurantFavouriteDrawer from "./favouriteDrawer";
import { useSnackbar } from "../../custom hooks/SnackbarProvider";

const FILTERS = ["All", "Veg", "Non veg", "Vegan"];

// Memoized FavCard component to prevent unnecessary re-renders
const FavCard = memo(
  ({
    item,
    quantities,
    handleAdd,
    handleQuantityChange,
    removeFromFavourites,
    favLoading,
    wishlistId,
  }) => {
    const variant = item?.variants?.[0];
    const price = variant?.externalSalesChannels?.[0]?.salePrice || 0;
    const quantity = quantities[item?.productId] || 1;

    return (
      <div className="fav-card" key={item?.productId}>
        <div className="fav-card-left">
          <div className="food-type-indicator">
            <img
              src={variant?.images?.front}
              width={40}
              height={40}
              // alt={item?.name}
            />
          </div>
          <div className="item-info">
            <div className="item-name">{item?.name}</div>
            <div className="item-price">₹{price}</div>
          </div>
        </div>

        <button className="restro-add-btn" onClick={() => handleAdd(item)}>
          Add
        </button>
        <IconButton
          className="delete-btn"
          type="button"
          onClick={() => removeFromFavourites(wishlistId)}
          disabled={favLoading || !wishlistId}
        >
          <DeleteIcon fontSize="15" />
        </IconButton>
      </div>
    );
  }
);

const ResturantFavouriteListing = ({ restaurantFavList = [], loading }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [openDetailPage, setOpenDetailPage] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [localFavList, setLocalFavList] = useState(restaurantFavList); // Local state for optimistic updates
  const navigate = useNavigate();
  const [favLoading, setFavLoading] = useState(false);
  const favList = useSelector(getFavourites);
  const dispatch = useDispatch();
  const userVal = localStorage.getItem("@user");
  const user = useSelector(getUserData) || (userVal && JSON.parse(userVal));
  const showSnackbar = useSnackbar();
  // Sync localFavList with restaurantFavList when it changes
  useEffect(() => {
    setLocalFavList(restaurantFavList);
  }, [restaurantFavList]);

  const handleAdd = (item) => {
    setSelectedItem(item);
    setOpenDetailPage(true);
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantities((prev) => {
      const current = prev[productId] || 1;
      const newQuantity = Math.max(1, current + delta);
      return { ...prev, [productId]: newQuantity };
    });
  };

  const filteredList = localFavList?.filter((item) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Veg") return item.attributes?.foodType === "VEG";
    if (selectedFilter === "Non veg")
      return item.attributes?.foodType === "NON_VEG";
    if (selectedFilter === "Vegan") return item.attributes?.vegan === true;
    return true;
  });

  const removeFromFavourites = async (wishlistId, productId) => {
    // if (favLoading) return;

    // Optimistic UI update: Remove item locally before API call
    setLocalFavList((prev) =>
      prev?.filter((item) => item?.productId !== productId)
    );

    try {
      setFavLoading(true);
      const payload = {
        wishlistId: wishlistId,
        updatedBy: user?.uidx,
      };

      const res = await removeFav(payload);

      if (res?.data?.es === 0) {
        // Update Redux store only after successful API call
        dispatch(
          setFavourites(favList?.filter((e) => e?.wishlistId !== wishlistId))
        );
        showSnackbar(res?.data?.message || "Removed from wishlist", "success");
      } else {
        // Revert local state if API call fails
        setLocalFavList(restaurantFavList);

        showSnackbar(
          res?.data?.message || "Failed to remove from wishlist",
          "error"
        );
      }
    } catch (err) {
      // Revert local state on error
      setLocalFavList(restaurantFavList);

      showSnackbar(
        err?.message || err?.response?.data?.message || "An error occurred",
        "error"
      );
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="fav-listing-container">
      {/* if filter needed in fav page uncomment this block */}
      {/* <div className="fav-header">
        <div className="filters">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${
                selectedFilter === filter ? "active" : ""
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div> */}
      <div className="fav-items">
        {filteredList?.length === 0 ? (
          <div className="empty-state">No items found.</div>
        ) : (
          filteredList?.map((item) => {
            const wishlistItem = favList?.find(
              (fav) => fav?.productId === item?.productId
            );

            return (
              <FavCard
                key={item?.productId}
                item={item}
                quantities={quantities}
                handleAdd={handleAdd}
                handleQuantityChange={handleQuantityChange}
                removeFromFavourites={() =>
                  removeFromFavourites(
                    wishlistItem?.wishlistId,
                    item?.productId
                  )
                }
                favLoading={favLoading}
                wishlistId={wishlistItem?.wishlistId}
              />
            );
          })
        )}
      </div>
      {openDetailPage ? (
        <RestaurantFavouriteDrawer
          openDetailDrawer={openDetailPage}
          setOpenDetailDrawer={setOpenDetailPage}
          selectedProduct={selectedItem}
        />
      ) : null}
    </div>
  );
};

export default ResturantFavouriteListing;
