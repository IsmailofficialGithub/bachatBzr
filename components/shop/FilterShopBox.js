"use client";
import "@/public/assets/css/tailwind-cdn.css"
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ShopCard from "./ShopCard";
import ShopCardList from "./ShopCardList";
import axios from "axios";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";
import PaginationComponent from "@/app/components/pagination";
import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";

const FilterShopBox = () => {
  const searchParams = useSearchParams();
  const pageParms = searchParams.get("page") || "1";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
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
      console.error(error);
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
          console.log("Change detected:", payload);

          setProducts((prevProducts) => {
            let updatedProducts = [...prevProducts];

            if (payload.eventType === "INSERT") {
              // Add new product to the list
              updatedProducts = [payload.new, ...prevProducts];
            } else if (payload.eventType === "UPDATE") {
              // Update existing product
              updatedProducts = prevProducts.map((product) =>
                product._id === payload.new._id ? payload.new : product,
              );
            } else if (payload.eventType === "DELETE") {
              // Remove deleted product
              updatedProducts = prevProducts.filter(
                (product) => product._id !== payload.old._id,
              );
            }

            return updatedProducts;
          });
        },
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(productSubscription);
    };
  }, []);

  const { shopList, shopSort } = useSelector((state) => state.filter);
  const { price, category, color, brand } = shopList || {};

  const { sort, perPage } = shopSort;

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
    toast("sortHandle");
  };

  // per page handler
  const perPageHandler = (e) => {
    toast("pagehandle");
  };

  // clear all filters
  const clearAll = () => {
    toast("clear");
  };

  return (
    <>
   
      <div className="product-filter-content mb-40">
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
                {price?.min !== 0 ||
                price?.max !== 100 ||
                category?.length !== 0 ||
                color?.length !== 0 ||
                brand?.length !== 0 ||
                sort !== "" ||
                perPage.start !== 0 ||
                perPage.end !== 0 ? (
                  <button
                    onClick={clearAll}
                    className="btn btn-danger text-nowrap me-2"
                    style={{ minHeight: "45px", marginBottom: "15px" }}
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
                  value={JSON.stringify(perPage)}
                >
                  <option
                    value={JSON.stringify({
                      start: 0,
                      end: 0,
                    })}
                  >
                    All
                  </option>
                  <option
                    value={JSON.stringify({
                      start: 0,
                      end: 10,
                    })}
                  >
                    10 per page
                  </option>
                  <option
                    value={JSON.stringify({
                      start: 0,
                      end: 20,
                    })}
                  >
                    20 per page
                  </option>
                  <option
                    value={JSON.stringify({
                      start: 0,
                      end: 30,
                    })}
                  >
                    30 per page
                  </option>
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
              {!loading
                ? "loading"
                : products.map((item, i) => (
                    <Fragment key={i}>
                      <ShopCardList
                        item={item}
                        addToCart={addToCart}
                        addToWishlist={addToWishlist}
                      />
                    </Fragment>
                    // End all products
                  ))}
            </div>
            <div
              className={
                activeIndex == 2 ? "tab-pane fade show active" : "tab-pane fade"
              }
            >
              <div className="row row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-1 tpproduct">
                {
                   loading?
                    <Loader className="animate-spin w-1/5 flex items-center justify-center" />
                    :
                    products.map((item, i) => (
                        <Fragment key={i}>
                          <ShopCard
                            item={item}
                            addToCart={addToCart}
                            addToWishlist={addToWishlist}
                          />
                        </Fragment>
      
                      ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    
     
     <PaginationComponent
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-8"
      />
   
    </>
  );
};

export default FilterShopBox;
