// react
import React from "react";

// mui
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

// constants
import { colorConstant } from "../../constants/colors";


export default function PopupScreen({
  open,
  handleClose,
  modalTitle,
  modalContent,
  handleYes,
  handleYesText,
  handleNo,
  handleNoText,
}) {
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{modalTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {modalContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleNo}
            className="modal-btn"
            sx={{
              textTransform: "capitalize",
              backgroundColor: "indianred",
              color: colorConstant.white,
              "&:hover": {
                backgroundColor: "indianred",
                color: colorConstant.white,
              },
            }}
          >
            {handleNoText ? handleNoText : "No"}
          </Button>
          <Button
            onClick={handleYes}
            className="modal-btn"
            sx={{
              textTransform: "capitalize",
              backgroundColor: colorConstant.primaryColor,
              color: colorConstant.white,
              "&:hover": {
                backgroundColor: colorConstant.primaryColor,
                color: colorConstant.white,
              },
            }}
          >
            {handleYesText ? handleYesText : "Yes"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
