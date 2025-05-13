"use client";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchRandomProducts } from "@/util/api";
import { toast } from "sonner";
import ShopCardMain from "./shopCardMain";
import ProductCardSkeleton from "../skeleton/ProductCardSkeleton";

const FilterShopBox2 = ({ tab }) => {
  const dataFetchedRef = useRef(false);
  const [products, setProducts] = useState([]);
  const [loading,setloading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Function to filter products based on the tab
  const handleProductFilter = (tab) => {
    if (tab === 1) return products;
    if (tab === 2) return products.filter((item) => item.offer_name);
    if (tab === 3) return products.filter((item) => item.price <= 1500);
    return products;
  };

  const loadProducts = useCallback(async () => {
    setloading(true);
    const response = await fetchRandomProducts();
    if (response.success) {
      setProducts(response.data);
    }
    setloading(false);
  }, []);
  // Fetch products on component mount
  useEffect(() => {
    if (dataFetchedRef.current === false) {
      dataFetchedRef.current = true;
      loadProducts();
    }
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
    <ShopCardMain
      key={i}
      item={item}
      addToCart={addToCart}
      addToWishlist={addToWishlist}
    />
  ));

  return (
    <>
      {filteredProducts.length > 0 ? (
          content
      ) : (
        loading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))
        ) : (
          <div>No product now available at this Query</div>
        )
      )}
    </>
  );
};

export default FilterShopBox2;
