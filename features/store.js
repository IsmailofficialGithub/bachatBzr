import { configureStore } from "@reduxjs/toolkit"
import filterSlice from "./filterSlice"
import productSlice from "./productSlice"
import shopSlice from "./shopSlice"
import wishlistSlice from "./wishlistSlice"
import authReducer from "./auth/authSlice"
import categoriesReducer from './categoriesSlice';

export const store = configureStore({
    reducer: {
        product: productSlice,
        filter: filterSlice,
        shop: shopSlice,
        wishlist: wishlistSlice,
        auth: authReducer,
        categories: categoriesReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
})
