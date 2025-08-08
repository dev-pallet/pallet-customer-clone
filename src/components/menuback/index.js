//react
import { useNavigate } from "react-router-dom";

//icons
import WestIcon from "@mui/icons-material/West";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

//styles
import "./index.css";

//mui components
import { Box } from "@mui/material";

//custom components
import Text from "../custom-components/Text";
import { truncateText } from "../../constants/commonFunction";

// constants
import { colorConstant } from "../../constants/colors";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";

const Menuback = ({
  head,
  headerDropdown,
  text,
  search,
  wishlist,
  totalPayment,
  categoryListing,
  color,
  bg,
  redirect,
  headingClassName,
}) => {
  const navigate = useNavigate();
  const retailType = useSelector(getStoreType);

  const goToPreviousPath = () => {
    if (categoryListing) {
      navigate("/home");
    } else if (redirect) {
      navigate(redirect);
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      className={`menu-back-heading ${headingClassName || ""}`}
      sx={{
        justifyContent: "space-between",
        backgroundColor:
          retailType === "RESTAURANT" ? colorConstant?.sakuraRestroColor : bg,
      }}
    >
      <Box sx={{ display: headerDropdown && "flex" }}>
        <WestIcon
          onClick={goToPreviousPath}
          sx={{
            color:
              retailType === "RESTAURANT" ? colorConstant?.white : color,
          }}
        />
        {headerDropdown ? headerDropdown : null}
      </Box>

      {head && headerDropdown === undefined ? (
        <Box ml={!search && !wishlist && "-40px"}>
          {/* <Text
            text={truncateText(text || "", 30)}
            fontsize={17}
            fontweight={600}
            textTransform="capitalize"
          /> */}
          {typeof text === "string" ? (
            <Text
              text={truncateText(text, 30)}
              fontsize={17}
              fontweight={600}
              textTransform="capitalize"
              color={colorConstant?.white}
            />
          ) : (
            <Box
              sx={{
                fontSize: 12,
                fontWeight: 500,
                textTransform: "capitalize",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "4px",
                fontFamily: "sans-serif",
                ...(color ? {color: color} : {}) 
              }}
            >
              {text}
            </Box>
          )}
          {totalPayment && (
            <Text
              text={`Total: ₹${totalPayment}`}
              tint={
                retailType === "RESTAURANT"
                  ? colorConstant?.defaultButtonText
                  : colorConstant?.primaryColor
              }
              style={{ textAlign: "center" }}
            />
          )}
        </Box>
      ) : null}

      {search ? (
        <Box sx={{ marginRight: "15px" }}>
          <SearchOutlinedIcon
            onClick={() => navigate("/search")}
            sx={{
              color:
                retailType === "RESTAURANT"
                  ? colorConstant?.showdowColor
                  : colorConstant?.defaultButtonText,
            }}
          />
        </Box>
      ) : wishlist ? (
        <Box className="wishlist-div">
          <FavoriteBorderIcon
            onClick={() => navigate("/favourites")}
            sx={{ mt: "4px" }}
          />
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
};

export default Menuback;
