import { configureStore } from "@reduxjs/toolkit"
import filterSlice from "./filterSlice"
import productSlice from "./productSlice"
import shopSlice from "./shopSlice"
import wishlistSlice from "./wishlistSlice"
import authReducer from "./auth/authSlice"

export const store = configureStore({
    reducer: {
        product: productSlice,
        filter: filterSlice,
        shop: shopSlice,
        wishlist: wishlistSlice,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
})
