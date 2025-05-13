import axios from "axios";
import { toast } from "react-toastify";
import { store } from "@/features/store"; // Import the Redux store
import { orderCreatedCart } from "@/features/shopSlice"; // Import the action
import { orderCreatedWishlist } from "@/features/wishlistSlice";
interface OrderInformation {
    product_ids: string[]; // Assuming product IDs are strings
    [key: string]: any; // Allow additional properties
}

// Define the return type
interface OrderResponse {
    success: boolean;
    message: string;
    order?: any; 
    error?: any;
};

export const createOrder = async (information: OrderInformation): Promise<OrderResponse>  => {
    try {
        const response = await axios.post(`/api/orders/add`, information);

        if (response.data.success) {
            // Dispatch the action to update the Redux state
            store.dispatch(orderCreatedCart(information.product_ids));
            store.dispatch(orderCreatedWishlist(information.product_ids))
            toast.success("Order created successfully");


            return {
                success: true,
                message: "Order created successfully",
                order: response.data.order
            };
        } else {
            toast.error(`Error creating order: ${response.data.message}`);
            return {
                success: false,
                message: response.data.message
            };
        }
    } catch (error) {
        toast.error("Error creating order");
        return {
            success: false,
            message: "Failed to create order",
            error: error
        };
    }
};
