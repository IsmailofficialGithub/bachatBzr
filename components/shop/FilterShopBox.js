"use client";
import "@/public/assets/css/tailwind-cdn.css";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import { Fragment, useEffect, useRef, useState } from "react";
import ProductGrid from "@/components/Product/ProductGrid";
import { useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabaseSetup";
import PaginationComponent from "@/app/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import ProductSkeleton from "../skeleton/ShopSkeleton";
import ProductSkeleton2 from "../skeleton/ShopSkeleton2";
import { Button } from "../ui/button";
import ShopCardList from '@/components/shop/ShopCardList'
import { PriceFilterPopover } from "@/app/components/PriceFilterPopover";
const FilterShopBox = () => {
  const searchParams = useSearchParams();
  const pageParms = searchParams.get("page") || "1";
  const searchQuery = searchParams.get("q") || "";
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [soldProducts, setSoldProducts] = useState([]);
  const [filters, setFilters] = useState({
  min: null,
  max: null,
  sizes: []
});

  const [priceFilter, setPriceFilter] = useState({ min: null, max: null });
  const [sizeFilter, setSizeFilter] = useState([]);
  const page = useRef(pageParms);
const handleFilterChange = async (newFilters) => {
  setLoading(true);
  
  // Check if any filter was previously active
  const wasFilterActive = 
    filters.min !== null || 
    filters.max !== null || 
    (filters.sizes && filters.sizes.length > 0);
  
  if (!wasFilterActive) {
    page.current = 1; // Reset to first page only when applying filter for the first time
  }
  
  // Validate that at least one filter is provided
  const hasMinPrice = newFilters.min !== null && newFilters.min !== 0 && newFilters.min !== '';
  const hasMaxPrice = newFilters.max !== null && newFilters.max !== 0 && newFilters.max !== '';
  const hasSizes = newFilters.sizes && Array.isArray(newFilters.sizes) && newFilters.sizes.length > 0;
  
  if (!hasMinPrice && !hasMaxPrice && !hasSizes) {
    setLoading(false);
    return toast.error("Please provide at least one filter (price or size)");
  }
  
  // Update filter state
  setFilters(newFilters);
  
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("page", page.current.toString());
    params.append("limit", limit.toString());
    
    // Add price filters
    if (hasMinPrice) {
      params.append("min", Number(newFilters.min).toString());
    }
    if (hasMaxPrice) {
      params.append("max", Number(newFilters.max).toString());
    }
    
    // Add size filters
    if (hasSizes) {
      params.append("sizes", JSON.stringify(newFilters.sizes));
    }
    
    // Use your existing products API endpoint (updated one)
    const query = `/api/product/priceFilter?${params.toString()}`;
    
    const response = await axios.get(query);
    
    if (response.data.success) {
      setProducts(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      
      // Create success message based on applied filters
      const appliedFilters = [];
      if (hasMinPrice || hasMaxPrice) {
        const priceRange = hasMinPrice && hasMaxPrice 
          ? `$${newFilters.min}-$${newFilters.max}`
          : hasMinPrice 
            ? `$${newFilters.min}+`
            : `<$${newFilters.max}`;
        appliedFilters.push(`Price: ${priceRange}`);
      }
      if (hasSizes) {
        appliedFilters.push(`Sizes: ${newFilters.sizes.join(', ')}`);
      }
      
      toast.success(`Filters applied: ${appliedFilters.join(' | ')}`);
    }
  } catch (error) {
    console.error("Error applying filters:", error);
    toast.error("Failed to apply filters: " + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};

// Updated clear filter function
const handleDeletePriceFilter = () => {
  setPriceFilter({ min: null, max: null });
  setSizeFilter([]);
  page.current = 1;
  fetchProducts();
  toast.success("All filters removed successfully");
};

// Combined filter change handler for the new component
const handleCombinedFilterChange = async (filters) => {
  // Update both price and size filters
  setPriceFilter({
    min: filters.min,
    max: filters.max
  });
  setSizeFilter(filters.sizes || []);
  
  // Apply the filters
  await handlePriceFilterChange({
    min: filters.min,
    max: filters.max
  });
};

const handleSizeFilterChange = async (sizeFilter) => {
  await handleFilterChange({
    min: filters.min, // Keep existing price filters
    max: filters.max,
    sizes: sizeFilter.sizes
  });
};
const handlePriceFilterChange = async (priceFilter) => {
  await handleFilterChange({
    min: priceFilter.min,
    max: priceFilter.max,
    sizes: filters.sizes // Keep existing size filters
  });
};
  const handlePageChange = (newPage) => {
    page.current = newPage;
    if (priceFilter.min !== null || priceFilter.max !== null) {
      // Use price filter pagination
      handlePriceFilterChange(priceFilter);
    } else {
      // Use regular pagination
      fetchProducts();
    }
  };
  const fetchProducts = async (newFilter) => {
    setLoading(true);
    try {
      let response;

      if (!searchQuery || searchQuery.trim() === "") {
        response = await axios.get(
          `/api/product/get?page=${page.current}&limit=${limit}`,
        );
      } else {
        if (newFilter) {
          setPriceFilter(newFilter);
        }
        response = await axios.get("/api/product/searchQuery", {
          params: {
            q: searchQuery,
            page: page.current,
            limit: limit,
            ...(newFilter && newFilter.min ? { min: newFilter.min } : {}),
            ...(newFilter && newFilter.max ? { max: newFilter.max } : {}),
          },
        });
      }

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error("Failed to fetch products" + response.data?.message);
      }
    } catch (error) {
      toast.error("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(pageParms);
    const productSubscription = supabase
      .channel("realtime:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload) => {
          const newProduct = payload.new;
          const oldProduct = payload.old;

          setProducts((prevProducts) => {
            let updatedProducts = [...prevProducts];

            if (payload.eventType === "INSERT") {
              updatedProducts = [newProduct, ...prevProducts];
            } else if (payload.eventType === "UPDATE") {
              // If product is marked as sold now
              if (newProduct.sold && !oldProduct.sold) {
                // Trigger sold animation
                setSoldProducts((prev) => [...prev, newProduct._id]);

                // Remove after 30 seconds
                setTimeout(() => {
                  setProducts((prev) =>
                    prev.filter((p) => p._id !== newProduct._id),
                  );
                }, 30000);
              }

              // Always update product in list
              updatedProducts = prevProducts.map((p) =>
                p._id === newProduct._id ? newProduct : p,
              );
            } else if (payload.eventType === "DELETE") {
              updatedProducts = prevProducts.filter(
                (p) => p._id !== oldProduct._id,
              );
            }

            return updatedProducts;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productSubscription);
    };
  }, []);

  const dispatch = useDispatch();

  const addToCart = (id) => {
    const item = products?.find((item) => item._id === id);
    dispatch(addCart({ product: item }));
  };
  const addToWishlist = (id) => {
    const item = products?.find((item) => item._id === id);
    dispatch(addWishlist({ product: item }));
  };
  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const [activeIndex, setActiveIndex] = useState(2);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };



  useEffect(() => {
    fetchProducts();
  }, [limit]);


  return (
    <>
      <div className="product-filter-content mb-20">
        <div className="row align-items-center">
          <div className="col-sm-6">
            <div className="product-item-count">
              <span>
                <b>{products?.length}</b> Item On List
              </span>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="product-navtabs d-flex justify-content-end align-items-center">
              <div>
                {" "}
                <PriceFilterPopover
                  onFilterChange={
                    searchQuery ? fetchProducts : handleFilterChange
                  }
                  onClearFilter={handleDeletePriceFilter}
                  initialMin={priceFilter.min || ""}
                  initialMax={priceFilter.max || ""}
                />
              </div>
              <div className="tpproductnav tpnavbar product-filter-nav">
                <nav>
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    <button
                      className={
                        activeIndex == 1 ? "nav-link active" : "nav-link"
                      }
                      onClick={() => handleOnClick(1)}
                    >
                      <i className="fal fa-list-ul" />
                    </button>
                    <button
                      className={
                        activeIndex == 2 ? "nav-link active" : "nav-link"
                      }
                      onClick={() => handleOnClick(2)}
                    >
                      <i className="fal fa-th" />
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-50">
        <div className="col-lg-12">
          <div className="tab-content" id="nav-tabContent">
            <div
              className={
                activeIndex == 1 ? "tab-pane fade show active" : "tab-pane fade"
              }
            >
              {loading ? (
                <div className="flex gap-14 flex-col">
                  <ProductSkeleton2 />
                  <ProductSkeleton2 />
                  <ProductSkeleton2 />
                </div>
              ) : products.length > 0 ? (
                products.map((item, i) => (
                  <Fragment key={i}>
                    <ShopCardList
                      item={item}
                      addToCart={addToCart}
                      addToWishlist={addToWishlist}
                      soldProducts={soldProducts}
                    />
                  </Fragment>
                  // End all products
                ))
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "10px",
                      flexDirection: "column",
                    }}
                  >
                    <p>
                      {" "}
                      NO PRODUCT AVALIABLE{" "}
                      {searchQuery && `at this query "${searchQuery}"`}{" "}
                    </p>

                    <Button onClick={() => router.push("/shop")}>Shop</Button>
                  </div>
                </>
              )}
            </div>
            <div
              className={
                activeIndex == 2 ? "tab-pane fade show active" : "tab-pane fade"
              }
            >
              {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 auto-cols-fr">

                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
                </div>
              ) : (
                products.length > 0 && (
                  <ProductGrid
                    Products={products}
                    addToCart={addToCart}
                    addToWishlist={addToWishlist}
                    soldProducts={soldProducts} 
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <PaginationComponent
        currentPage={page.current}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-8 "
      />
    </>
  );
};

export default FilterShopBox;
