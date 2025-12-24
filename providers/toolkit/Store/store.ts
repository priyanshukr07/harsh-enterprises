import { configureStore } from "@reduxjs/toolkit";
import { UserRegisterSlice } from "../features/RegisterUserSlice";
import { CreateProductSlice } from "../features/CreateProductSlice";
import { productsApi } from "../features/GetAllProductsSlice";
import { userAPI } from "../features/GetAllUserSlice";
import { AddToCartSlice } from "../features/AddToCartSlice";
import { GetCartItemSlice } from "../features/GetUserAllCartitems";
import { DeleteCartItemSlice } from "../features/DeleteCartItemSlice";
import { CreateAddressForOrderSlice } from "../features/CreateAddressForOrderSlice";
import { GetOrdersSlice } from "../features/GetOrdersSlice";
import { GetProductsByCategorySlice } from "../features/GetProductsByCategorySlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      [productsApi.reducerPath]: productsApi.reducer,
      [userAPI.reducerPath]: userAPI.reducer,
      user: UserRegisterSlice.reducer,
      product: CreateProductSlice.reducer,
      cart: AddToCartSlice.reducer,
      cartItems: GetCartItemSlice.reducer,
      deleteCartItem: DeleteCartItemSlice.reducer,
      address: CreateAddressForOrderSlice.reducer,
      orders: GetOrdersSlice.reducer,
      category: GetProductsByCategorySlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(productsApi.middleware, userAPI.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
