import React, { createContext, useContext, useState, forwardRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "./snackbarProvider.css";
import { ThemeProvider, createTheme } from "@mui/material";

const SnackbarContext = createContext();

const customTheme = createTheme({
  palette: {
    success: {
      main: "#F0FDF4",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
  },
});

export function useSnackbar() {
  return useContext(SnackbarContext);
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SnackbarProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  // severity types - success, info, warning, error
  // light green - #F0FDF4, dark green - #10823D
  const [vertical, horizontal] = ["top", "center"];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const showSnackbar = (message, severity = "success") => {
    const defaultMsg = "Something went wrong. Please try again.";
    setMessage(message || defaultMsg);
    setSeverity(severity);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      <ThemeProvider theme={customTheme}>
        {children}
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{
              width: "100%",
              ".MuiAlert-message": {
                color: severity === "error" ? "#ffffff" : "#000000",
              },
              borderLeft:
                severity === "error" ? "#D32F2F" : "7px solid #10823D",
              borderRadius: "0.5rem",
              fontWeight: "bold",
            }}
          >
            {message}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </SnackbarContext.Provider>
  );
}
