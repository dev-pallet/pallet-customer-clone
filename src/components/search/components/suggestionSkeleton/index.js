import React, { useState } from "react";

// material ui
import { Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

//css
import "./index.css";

const SuggestionSkeleton = () => {
  const [skeleton, setSkeleton] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  return (
    <Box className="suggestion-skeleton">
      {skeleton.length &&
        skeleton.map((item) => (
          <Box className="skeleton-suggestion-item">
            <Box className="skeleton-img">
              <Skeleton
                variant="circular"
                width={60}
                height={60}
                animation="wave"
              />
            </Box>
            <Box className="skeleton-suggestion-description">
              <Skeleton animation="wave" />
              <Skeleton animation="wave" width="50%" />
            </Box>
          </Box>
        ))}
    </Box>
  );
};

export default SuggestionSkeleton;
