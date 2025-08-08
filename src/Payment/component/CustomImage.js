import React, { memo } from "react";

const CustomImage = ({ source, ...props }) => {
  return (
    <img
      src={source}
      style={{ width: "100%", height: "100%", objectFit: "contain" }}
      {...props}
      //   alt={item.title}
      loading="lazy"
    />
  );
};

export default memo(CustomImage);
