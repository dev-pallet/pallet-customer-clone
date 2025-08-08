import {
  configureStore,
  applyMiddleware,
  combineReducers,
} from "@reduxjs/toolkit";

//persist redux-store
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

//reducers
import locationReducer from "./reducers/locationReducer";
import userReducer from "./reducers/userReducer";
import cartReducer from "./reducers/cartReducer";
import miscReducer from "./reducers/miscReducer";
import productReducer from "./reducers/productReducer";
import orderReducer from "./reducers/orderReducer";
import addressReducer from "./reducers/addressReducer";
import categoryReducer from "./reducers/categoryReducer";
import planReducer from "./reducers/planReducer";

const reducer = combineReducers({
  user: userReducer,
  misc: miscReducer,
  product: productReducer,
  cart: cartReducer,
  location: locationReducer,
  address: addressReducer,
  order: orderReducer,
  category: categoryReducer,
  plan: planReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "cart", "misc", "product", "location"],
  //specify the reducers you want to persist
};

const persistedReducer = persistReducer(persistConfig, reducer);

const rootReducer = (state, action) => {
  if (action.type === "reset") {
    // check for action type
    state = undefined;
  }
  return persistedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  devTools: {
    trace: false,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
