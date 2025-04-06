"use client";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ShopCard from "./ShopCard";
import { fetchRandomProducts } from "@/util/api";
import { toast } from "sonner";


const FilterShopBox2 = ({ tab }) => {
  const [FirstReRender,setFirstReRender] = useState(true)
  const dataFetchedRef = useRef(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Function to filter products based on the tab
  const handleProductFilter = (tab) => {
    if (tab === 1) return products;
    if (tab === 2) return products.filter((item) => item.offer_name);
    if (tab === 3) return products.filter((item) => item.price <= 1500);
    return products;
  };

  const loadProducts = useCallback(async () => {
    const response = await fetchRandomProducts();
    if (response.success) {
      setProducts(response.data);
    } else {
      toast.error("Failed to fetch products", {
        description: "Could not retrieve product data",
      });
    }
  }, []);
  // Fetch products on component mount
  useEffect(() => {
    if (dataFetchedRef.current === false) {
      dataFetchedRef.current = true;
      loadProducts();
    }
    console.log('rerender');
  }, []);

  // Filter products whenever the tab or products change
  useEffect(() => {
      setFilteredProducts(handleProductFilter(tab));
  }, [tab, products]);

 
  const dispatch = useDispatch();

  // Add to cart function
  const addToCart = (id) => {
    const item = products.find((item) => item._id === id);
    if (item) {
      dispatch(addCart({ product: item }));
    } else {
      toast.error("Failed to add item to cart", {
        description: "Could not get item ID for cart",
      });
    }
  };

  // Add to wishlist function
  const addToWishlist = (id) => {
    const item = products.find((item) => item._id === id);
    if (item) {
      dispatch(addWishlist({ product: item }));
    } else {
      toast.error("Failed to add item to wishlist", {
        description: "Could not get item ID for wishlist",
      });
    }
  };

 

  // Render products
  const content = filteredProducts.map((item, i) => (
    <ShopCard
      key={i}
      item={item}
      addToCart={addToCart}
      addToWishlist={addToWishlist}
    />
  ));

  

  return (
    <>
      {filteredProducts.length > 0
        ? content
        : "No product now avaliable at this Query"}
    </>
  );
};

export default FilterShopBox2;
