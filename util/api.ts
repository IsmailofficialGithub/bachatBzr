import axios from "axios";

export const fetchRandomProducts = async () => {
  try {
    const response = await axios.get("/api/product/getRandom");
    return response.data; // Returns { success, message, data }
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, message: "Failed to fetch products",error};
  }
};
