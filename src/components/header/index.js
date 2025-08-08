import { Box } from "@mui/material";
import { memo } from "react";
import sakuraLogo from "../../assets/images/retail-sakura-cafe.png";
import "./header.css";

const Header = () => {
  return (
    <>
      <Box className=" header-wrapper">
        <img src={sakuraLogo} width={100} height={100} />
        <p className="restro-title">36 Sakura Cafe </p>
      </Box>
    </>
  );
};

export default memo(Header);
