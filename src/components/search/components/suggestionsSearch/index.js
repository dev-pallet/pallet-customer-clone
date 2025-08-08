import React from "react";

// material ui
import { Box } from "@mui/material";

//css
import { colorConstant } from "../../../../constants/colors";
import { truncateText } from "../../../../constants/commonFunction";
import { no_image } from "../../../../constants/imageUrl";
import Text from "../../../custom-components/Text";
import "./index.css";

const SuggestionsSearch = ({ data, text, onChange }) => {
  return (
    <Box className="suggestion-search-list">
      {data?.length
        ? data?.map((item, index) => {
            return (
              <>
                <Box
                  className="suggestion-search-item"
                  key={index}
                  onClick={() => {
                    onChange({
                      text: item?.name,
                      category: item?.appCategories?.categoryLevel1?.[0],
                    });
                  }}
                >
                  <Box className="suggestion-item-img">
                    <img
                      className="suggestion-search-item-img"
                      src={item?.variants?.[0]?.images?.front || no_image}
                      onError={(e) => (e.target.src = no_image)}
                    />
                  </Box>
                  <Box className="suggestion-item-description">
                    <Box className="search-item-top-text">
                      <Text
                        // text={truncateText(item?.name, 40) || text}
                        text={item?.name}
                        textTransform="capitalize"
                      />
                    </Box>
                    <Box className="search-item-bottom-text">
                      <Text text={`in category`} />
                      <Text
                        fontweight={800}
                        tint={colorConstant?.primaryColor}
                        text={`${item?.appCategories?.categoryLevel1?.[0]}`}
                      />
                    </Box>
                  </Box>
                </Box>
                <Box className="search-seperator"></Box>
              </>
            );
          })
        : null}
    </Box>
  );
};

export default SuggestionsSearch;
