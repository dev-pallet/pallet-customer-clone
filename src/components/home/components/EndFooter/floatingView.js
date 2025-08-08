import React from "react";
import { motion } from "framer-motion";
import "./floatingView.css";

const FloatingView = ({ children, style }) => {
  return (
    <motion.div
      className="floating-wrapper"
      style={style}
      animate={{
        y: [0, -5, 5, 0],
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <div className="floating-border">{children}</div>
    </motion.div>
  );
};

export default FloatingView;
