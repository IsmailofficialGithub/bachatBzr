import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    cart: [],
};

export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        addCart: (state, { payload }) => {
            const isCartExist = state.cart.some(
                (item) => item._id === payload.product._id
            );
            if (!isCartExist) {
                state.cart.push({
                    ...payload.product,
                    qty: payload?.qty ? payload.qty : 1,
                });
                toast.success("This item added to cart.");
            } else {
                toast.error("This item is already in the cart.");
            }
            localStorage.setItem("local-cart", JSON.stringify(state.cart));
        },
        deleteCart: (state, { payload }) => {
            state.cart = state.cart.filter((item) => item._id !== payload);
            localStorage.setItem("local-cart", JSON.stringify(state.cart));
            toast.error(`Item ${payload} has been deleted.`);
        },
        addQty: (state, { payload }) => {
            state.cart = state.cart.filter((item) => {
                if (item._id === payload._id) {
                    item.qty = payload.qty;
                }
                return item;
            });
            localStorage.setItem("local-cart", JSON.stringify(state.cart));
        },
        reloadCart: (state, { payload }) => {
            const cart = JSON.parse(localStorage.getItem("local-cart"));
            if (cart) {
                state.cart = cart;
            }
        },
        orderCreatedCart: (state, { payload }) => {
            // Ensure payload is always an array
            const idsToDelete = Array.isArray(payload) ? payload : [payload];
            // Filter out items whose _id is in the idsToDelete array
            state.cart = state.cart.filter((item) => !idsToDelete.includes(item._id));
            localStorage.setItem("local-cart", JSON.stringify(state.cart));
        },
        
    },
});

export const { addCart, deleteCart, addQty, reloadCart ,orderCreatedCart} = shopSlice.actions;
export default shopSlice.reducer;
