import React from "react";
import { Box, Typography } from "@mui/material";
import appLogo from "../../assets/images/twinleaves.png";
import blurBackground from "../../assets/images/blur.png";
import Heading from "../custom-components/Heading";
import Text from "../custom-components/Text";

const LoginHeroSection = () => {
  return (
    <Box
      sx={{
        // backgroundImage: `url(${blurBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ mb: 1 }} />
      <img
        src={appLogo}
        alt="App Logo"
        style={{ width: 100, height: 100, objectFit: "contain" }}
      />
      <Heading
        text="All in one place"
        variant="h4"
        fontWeight={900}
        color="#00A86B"
        mt={2}
      />

      <Text
        text="Shop 20,000+ products from 11 different categories"
        variant="body1"
        color="textSecondary"
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

export default LoginHeroSection;
