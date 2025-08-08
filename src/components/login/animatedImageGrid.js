import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { motion, useAnimation } from "framer-motion";

const imageUrls = [
  "https://storage.googleapis.com/twinleaves_pos_releases/Pallet%20Images/brocli.png",
  "https://storage.googleapis.com/twinleaves_pos_releases/Pallet%20Images/apple.png",
  "https://storage.googleapis.com/twinleaves_pos_releases/Pallet%20Images/coke.png",
  "https://storage.googleapis.com/twinleaves_pos_releases/Pallet%20Images/fog.png",
  "https://storage.googleapis.com/twinleaves_pos_releases/Pallet%20Images/surf.png",
  "https://storage.googleapis.com/twinleaves_pos_releases/Pallet%20Images/silk.png",
  "https://storage.googleapis.com/twinleaves_pos_releases/Pallet%20Images/vim.png",
  "https://storage.googleapis.com/twinleaves_pos_releases/Pallet%20Images/shampoo.png",
  "https://storage.googleapis.com/twinleaves_bucket/FrontEnd/marketing/Untitled%20design%20(30).png",
  "https://storage.googleapis.com/twinleaves_bucket/FrontEnd/marketing/Untitled%20design%20(34).png",
  "https://storage.googleapis.com/twinleaves_bucket/FrontEnd/marketing/Untitled%20design%20(22).png",
];

const AnimatedImage = ({ url }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls?.start({
      opacity: [1, 0.3, 1],
      transition: {
        duration: Math.random() * 2 + 1,
        repeat: Infinity,
        repeatType: "reverse",
      },
    });
  }, [controls]);

  return (
    <motion.img
      src={url}
      alt="product"
      style={{
        width: "100px",
        height: "100px",
        borderRadius: "8px",
        objectFit: "cover",
      }}
      animate={controls}
    />
  );
};

const AnimatedImagesGrid = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
        marginTop: 4,
      }}
    >
      {imageUrls?.map((url, index) => (
        <AnimatedImage key={index} url={url} />
      ))}
    </Box>
  );
};

export default AnimatedImagesGrid;
