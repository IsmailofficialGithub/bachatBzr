import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
    wishlist: [],
};

export const shopSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {
        addWishlist: (state, { payload }) => {
            const isWishlistExist = state.wishlist.some(
                (item) => item._id === payload.product._id
            );
            if (!isWishlistExist) {
                state.wishlist.push({
                    ...payload.product,
                    qty: payload?.qty ? payload.qty : 1,
                });
                toast.success("This item added to Wishlist.");
            } else {
                toast.error("This item is already in the Wishlist.");
            }
            localStorage.setItem("local-wishlist", JSON.stringify(state.wishlist));
        },
        deleteWishlist: (state, { payload }) => {
            state.wishlist = state.wishlist.filter((item) => item._id !== payload);
            localStorage.setItem("local-wishlist", JSON.stringify(state.wishlist));
            toast.error(`Item ${payload} has been deleted.`);
        },
       
        reloadWishlist: (state, { payload }) => {
            const wishlist = JSON.parse(localStorage.getItem("local-wishlist"));
            if (wishlist) {
                state.wishlist = wishlist;
            }
        },
        orderCreatedWishlist: (state, { payload }) => {
            // Ensure payload is always an array
            const idsToDelete = Array.isArray(payload) ? payload : [payload];
            // Filter out items whose _id is in the idsToDelete array
            state.wishlist = state.wishlist.filter((item) => !idsToDelete.includes(item._id));
            localStorage.setItem("local-wishlist", JSON.stringify(state.wishlist));
        },
    },
});

export const { addWishlist, deleteWishlist, reloadWishlist ,orderCreatedWishlist} = shopSlice.actions;
export default shopSlice.reducer;
