"use client";
import "@/public/assets/css/tailwind-cdn.css";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import { Fragment, useEffect, useRef, useState } from "react";
import ProductGrid from "@/components/Product/ProductGrid"
import { useDispatch } from "react-redux";
import ShopCard from "./ShopCard";
import ShopCardList from "./ShopCardList";
import axios from "axios";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import PaginationComponent from "@/app/components/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import ProductSkeleton from "../skeleton/ShopSkeleton";
import ProductSkeleton2 from "../skeleton/ShopSkeleton2";
import { Button } from "../ui/button";
import { PriceFilterPopover } from "@/app/components/PriceFilterPopover";
const FilterShopBox = () => {
  const searchParams = useSearchParams();
  const pageParms = searchParams.get("page") || "1";
  const searchQuery = searchParams.get("q") || "";
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(25);
  const [soldProducts, setSoldProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState({ min: null, max: null });
  const page = useRef(pageParms);
  const handlePriceFilterChange = async (newFilter) => {
    setLoading(true);
    const wasFilterActive =
      priceFilter.min !== null || priceFilter.max !== null;
    if (!wasFilterActive) {
      page.current = 1; // Reset to first page only when applying filter for the first time
    }
    setPriceFilter(newFilter);
    try {
      let query = `/api/product/priceFilter?page=${page.current}&limit=${limit}&`;
      const max = Number(newFilter.max);
      const min = Number(newFilter.min);
      // Only add min/max if they are not null and not zero
      if ((min === null || min === 0) && (max === null || max === 0)) {
        return toast.error("Please provide at least one price filter");
      }
      if (min !== null && min !== 0) query += `min=${min}&`;
      if (max !== null && max !== 0) query += `max=${max}&`;

      // Remove trailing '&' or '?' if present
      query = query.replace(/[&?]$/, "");

      const response = await axios.get(query);
      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        toast.success("Filter applied successfully");
      }
    } catch (error) {
      console.error("Error applying filter:", error);
      toast.error("Failed to apply filter" + error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePriceFilter = () => {
    setPriceFilter({ min: null, max: null });
    page.current = 1;
    fetchProducts();
    toast.success("Filter removed successfully");
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
        if(newFilter){
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
        setError("Failed to fetch products");
      }
    } catch (error) {
      setError("An error occurred while fetching products");
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

  // per page handler
  const perPageHandler = (e) => {
    setLimit(e.target.value);
  };

  useEffect(() => {
    fetchProducts();
  }, [limit]);
  // clear all filters
  const clearAll = () => {
    setLimit(25);
    toast.success("Filter removed successfully");
  };

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
                  onFilterChange={searchQuery? fetchProducts:handlePriceFilterChange}
                  onClearFilter={handleDeletePriceFilter}
                  initialMin={priceFilter.min || ""}
                  initialMax={priceFilter.max || ""}
                />
              </div>

              <div className="tp-shop-selector">
                {limit !== 25 ? (
                  <button
                    onClick={clearAll}
                    className="btn btn-danger text-nowrap me-2 "
                    style={{ minHeight: "20px" }}
                  >
                    Clear All
                  </button>
                ) : undefined}

                <select
                  onChange={perPageHandler}
                  className="chosen-single form-select ms-3 "
                  value={limit}
                >
                  wellcome to the filter
                  <option value=""> ( Default )</option>
                  <option value="15">15 per page</option>
                  <option value="25">25 per page</option>
                  <option value="35">35 per page</option>
                </select>
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

      {products.length > 0 &&(
        <ProductGrid Products={products}/>
      )}
      {/* <div className="row mb-50">
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
              <div className="row row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct">
                {loading ? (
                  Array.from({ length: 10 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))
                ) : products.length > 0 && !loading ? (
                  products.map((item, i) => (
                    <Fragment key={i}>
                      <ShopCard
                        soldProducts={soldProducts}
                        item={item}
                        addToCart={addToCart}
                        addToWishlist={addToWishlist}
                      />
                    </Fragment>
                  ))
                ) : (
                  <>
                    {searchQuery && (
                      <>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          NO PRODUCT AVALIABLE at this query "${searchQuery}"
                        </div>
                        <Button onClick={() => router.push("/shop")}>
                          Shop
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div> */}

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
