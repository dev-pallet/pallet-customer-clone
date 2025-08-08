// react 
import React from "react";
// material ui 
import { Box } from "@mui/material";
// custom-components 
import Text from "./Text";
// images 
import NoResults from "../../assets/images/no-results.png";

export default function NothingFound({ src, message, width }) {
  return (
    <Box sx={{textAlign:"center"}}>
      <img src={src ? src : NoResults} alt={message} width={width ? width : "100%"} />
      <br/>
      <br/>
      <Text text={message} fontweight={"bold"} textAlign={"center"} />
    </Box>
  );
}
