import CloseRoundedIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import "./clearInput.css";

// clear input function for softInput
export const ClearInput = ({ clearInput }) => ( 
  <Box className="clear-div">
    <CloseRoundedIcon onClick={clearInput} fontSize="small" sx={{height:"16px"}}/>
  </Box>
);
