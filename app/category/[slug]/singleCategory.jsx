"use client";
import Layout from "@/components/layout/Layout";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import ShopCard from "@/components/shop/ShopCard";
import { useDispatch } from "react-redux";
import ProductSkeleton from "@/components/skeleton/ProductCardSkeleton";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import NoProductsAvailable from "../../../components/Product/noProductAvaliable";
import { supabase } from "@/lib/supabaseSetup";
import PaginationComponent from "@/app/components/pagination";
import { PriceFilterPopover } from "@/app/components/PriceFilterPopover";

const SingleCategories = () => {
  const searchParams = useSearchParams();
  const pageParms = searchParams.get("page") || "1";
  const [filters, setFilters] = useState({
    min: null,
    max: null,
    sizes: [],
  });
  const [priceFilter, setPriceFilter] = useState({ min: null, max: null });

  const [products, setProducts] = useState(null);
  const { slug } = useParams();
  const [loading, setloading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [soldProducts, setSoldProducts] = useState([]);
  const page = useRef(pageParms);
  const dispatch = useDispatch();

  const handlePageChange = (newPage) => {
    page.current = newPage;
    fetchingProduct();
  };
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

  const handleFilterChange = async (newFilters) => {
    setloading(true);

    // Check if any filter was previously active
    const wasFilterActive =
      filters.min !== null ||
      filters.max !== null ||
      (filters.sizes && filters.sizes.length > 0);

    if (!wasFilterActive) {
      page.current = 1; // Reset to first page only when applying filter for the first time
    }

    // Validate that at least one filter is provided
    const hasMinPrice =
      newFilters.min !== null && newFilters.min !== 0 && newFilters.min !== "";
    const hasMaxPrice =
      newFilters.max !== null && newFilters.max !== 0 && newFilters.max !== "";
    const hasSizes =
      newFilters.sizes &&
      Array.isArray(newFilters.sizes) &&
      newFilters.sizes.length > 0;

    if (!hasMinPrice && !hasMaxPrice && !hasSizes) {
      setloading(false);
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
      const query = `/api/categories/product/filter?${params.toString()}&category=${slug}&limit=${limit}`;

      const response = await axios.get(query);

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);

        // Create success message based on applied filters
        const appliedFilters = [];
        if (hasMinPrice || hasMaxPrice) {
          const priceRange =
            hasMinPrice && hasMaxPrice
              ? `$${newFilters.min}-$${newFilters.max}`
              : hasMinPrice
              ? `$${newFilters.min}+`
              : `<$${newFilters.max}`;
          appliedFilters.push(`Price: ${priceRange}`);
        }
        if (hasSizes) {
          appliedFilters.push(`Sizes: ${newFilters.sizes.join(", ")}`);
        }

        toast.success(`Filters applied: ${appliedFilters.join(" | ")}`);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      toast.error(
        "Failed to apply filters: " +
          (error.response?.data?.message || error.message),
      );
    } finally {
      setloading(false);
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

  const handleDeletePriceFilter = () => {
    setPriceFilter({ min: null, max: null });
    page.current = 1;
    fetchingProduct();
    toast.success("All filters removed successfully");
  };

  const fetchingProduct = async () => {
    setloading(true);
    try {
      const response = await axios.get(
        `/api/categories/product/${slug}?page=${page.current}&limit=${limit}`,
      );
      if (response.data.success) {
        if (response.data.data.length > 0) {
          setProducts(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
        }
      }
    } catch (error) {
      toast.error(`Unexpected Error , ${error.message}`);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    fetchingProduct();
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

  return (
    <Layout
      breadcrumbTitle={`Category - ${slug}`}
      headerStyle={3}
      footerStyle={1}
    >
      <div className="row mb-50 mt-50">
        <div className="col-lg-12">
          <div className="tab-content" id="nav-tabContent">
            {/* new content */}

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
                        onFilterChange={handleFilterChange}
                        onClearFilter={handleDeletePriceFilter}
                        initialMin={priceFilter.min || ""}
                        initialMax={priceFilter.max || ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* new content */}
            <div>
              <div className="row row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))
                ) : products && products.length > 0 ? (
                  products.map((item, i) => (
                    <Fragment key={i}>
                      <ShopCard
                        soldProducts={soldProducts}
                        item={item}
                        addToCart={() => addToCart(item._id)}
                        addToWishlist={() => addToWishlist(item._id)}
                      />
                    </Fragment>
                  ))
                ) : (
                  <NoProductsAvailable />
                )}
              </div>
              <PaginationComponent
                currentPage={Number(page.current)}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8 "
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleCategories;
