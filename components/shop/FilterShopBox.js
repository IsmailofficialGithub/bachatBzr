"use client";
import "@/public/assets/css/tailwind-cdn.css";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ShopCard from "./ShopCard";
import ShopCardList from "./ShopCardList";
import axios from "axios";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import PaginationComponent from "@/app/components/pagination";
import { useSearchParams } from "next/navigation";
import ProductSkeleton from "../skeleton/ShopSkeleton";
import ProductSkeleton2 from "../skeleton/ShopSkeleton2";
const FilterShopBox = () => {
  const searchParams = useSearchParams();
  const pageParms = searchParams.get("page") || "1";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("");
  const [soldProducts, setSoldProducts] = useState([]);
  const page = useRef(pageParms);

  const handlePageChange = (newPage) => {
    page.current = newPage;
    fetchProducts();
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/get?page=${page.current}&limit=${limit}`,
      );

      if (response.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      setError("An error occurred while fetching products");
    } finally {
      setLoading(false);
    }
  };
  const handlesort = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product/sort?page=${page.current}&limit=${limit}&sort=${sort}`,
      );
      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        toast.error("Failed to sort product");
      }
    } catch (error) {
      toast.error("SomeThing wents wrong");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchProducts(pageParms)
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
                    prev.filter((p) => p._id !== newProduct._id)
                  );
                }, 30000);
              }
  
              // Always update product in list
              updatedProducts = prevProducts.map((p) =>
                p._id === newProduct._id ? newProduct : p
              );
            } else if (payload.eventType === "DELETE") {
              updatedProducts = prevProducts.filter(
                (p) => p._id !== oldProduct._id
              );
            }
  
            return updatedProducts;
          });
        }
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

  const [activeIndex, setActiveIndex] = useState(2);
  const handleOnClick = (index) => {
    setActiveIndex(index);
  };
  // sort handler
  const sortHandler = (e) => {
    setSort(e.target.value);
    handlesort();
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
    setLimit(10);
    setSort("");
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
              <div className="tp-shop-selector">
                {limit !== 10 || sort !== "" ? (
                  <button
                    onClick={clearAll}
                    className="btn btn-danger text-nowrap me-2 "
                    style={{ minHeight: "20px" }}
                  >
                    Clear All
                  </button>
                ) : undefined}

                <select
                  value={sort}
                  className="chosen-single form-select"
                  onChange={sortHandler}
                >
                  <option value="">Sort by (default)</option>
                  <option value="asc">Newest</option>
                  <option value="des">Oldest</option>
                </select>

                <select
                  onChange={perPageHandler}
                  className="chosen-single form-select ms-3 "
                  value={limit}
                >
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
              ) : (
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
              )}
            </div>
            <div
              className={
                activeIndex == 2 ? "tab-pane fade show active" : "tab-pane fade"
              }
            >
              <div className="row row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct">
                {loading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <ProductSkeleton key={i} />
                    ))
                  : products.map((item, i) => (
                      <Fragment key={i}>
                        <ShopCard
                          soldProducts={soldProducts}
                          item={item}
                          addToCart={addToCart}
                          addToWishlist={addToWishlist}
                        />
                      </Fragment>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-8 "
      />
    </>
  );
};

export default FilterShopBox;
