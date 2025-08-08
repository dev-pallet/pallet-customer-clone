import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GOOGLE_MAP_API_KEY } from "./constants/api-key";
import { LoadScript } from "@react-google-maps/api";
import { Provider } from "react-redux";
import { store, persistor } from "../src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { SnackbarProvider } from "./custom hooks/SnackbarProvider";
import ReactQueryWrapper from "./reactQuery/reactQueryWrapper";

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <LoadScript googleMapsApiKey={GOOGLE_MAP_API_KEY} libraries={["places"]}>
    <BrowserRouter>
      <ReactQueryWrapper>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </PersistGate>
        </Provider>
      </ReactQueryWrapper>
    </BrowserRouter>
  </LoadScript>
);

if (process.env.NODE_ENV === "development") {
  if (module["hot"]) {
    module["hot"].accept();
  }
}
