// react
import { Box } from "@mui/material";

// loader
import loadingGif from "../../assets/gif/loading.gif";
import SakuraLoader from "../../assets/gif/sakuraLoader.gif";
// styles
import "./style.css";
import { useSelector } from "react-redux";
import { getStoreType } from "../../redux/reducers/miscReducer";

const Loader = () => {
  const retailType =
    useSelector(getStoreType) || localStorage.getItem("retailType");
  const dynamicStyle = {
    width: "50%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const groceryStyle = {
    width: "50%",
    height: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  return (
    <Box className="loader-screen-position">
      <img
        className="loader-gif"
        src={retailType === "RESTAURANT" ? SakuraLoader : loadingGif}
        alt=""
        style={retailType === "RESTAURANT" ? dynamicStyle : groceryStyle}
      />
    </Box>
  );
};

export default Loader;
