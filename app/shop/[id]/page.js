"use client";
import Layout from "@/components/layout/Layout";
import { addCart } from "@/features/shopSlice";
import { addWishlist } from "@/features/wishlistSlice";
import { applyDiscount } from "@/lib/discountHandler";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import SocialShare from "@/components/socialShare/socialShare";
import { Loader } from "lucide-react";
import SingleProductSkeleton from '@/components/skeleton/singleProductSkeleton'

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 5,
  spaceBetween: 25,
  autoplay: {
    delay: 3500,
  },
  breakpoints: {
    1400: {
      slidesPerView: 5,
    },
    1200: {
      slidesPerView: 5,
    },
    992: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 2,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
  navigation: {
    nextEl: ".tprelated__nxt",
    prevEl: ".tprelated__prv",
  },
};

const ShopSingleDynamicV1 = () => {
  const params = useParams();
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(false);
  const [relatedTags, setRelatedTags] = useState([]);
  const [relatedProducts, setRelatedProduct] = useState([]);
  const id = params.id;
  const [activeIndex, setActiveIndex] = useState(2);

  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  const fetchingProduct = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/product/getSingle/${id}`,
      );
      if (response.data.success) {
        setProduct(response.data.product);
        console.log(response.data)
        setRelatedTags(response.data.product.tags);
      } else {
        toast.error("SomeThing went wrong while fetching Product");
      }
    } catch (error) {
      toast.error("SomeThing went wrong while fetching Product");
    } finally {
      setLoading(false);
    }
  };
  const fetchingRelatedProduct = async (tags) => {
    try {
      const response = await axios.post(
        `/api/product/relatedProduct`,
        { tags },
      );
      if (response.data.success) {
        setRelatedProduct(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Falied to fetched related Products");
    }
  };

  useEffect(() => {
    if (relatedTags.length > 0) {
      fetchingRelatedProduct(relatedTags);
    }
  }, [relatedTags]);

  useEffect(() => {
    if (!id) <h1>Loading...</h1>;
    else fetchingProduct();
    return () => {};
  }, [id]);

  const dispatch = useDispatch();

  const addToCart = () => {
    if (product && !product.sold) {
      dispatch(addCart({ product }));
    } else {
      toast.error("Just missed it! This item is no longer available.");
    }
  };
  const addToWishlist = () => {
    if (product && !product.sold) {
      dispatch(addWishlist({ product }));
    } else {
      toast.error("Just missed it! This item is no longer available.");
    }
  };
  const RelatedaddToCart = (item) => {
    dispatch(addCart({ product: item }));
  };
  const RelatedaddToWishlist = (item) => {
    dispatch(addWishlist({ product: item }));
  };

  return (
    <>
      <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Product Details">
        <section className="product-area pt-6 pb-6 ">
          <div className="container">
            <div className="row">
            
               <div className="col-lg-5 col-md-12" >
                {/* all Images logic */}
              <div className="tpproduct-details__list-img">
                  {loading
                    ? <SingleProductSkeleton type={"image"}/>
                    : product?.images?.map((image, index) => (
                        <div
                          className="tpproduct-details__list-img-item"
                          key={index}
                        >
                          <img
                            src={image}
                            alt="Product image is Failed to Load"
                          />
                        </div>
                      ))}
                </div>
              </div>
              <div className="col-lg-5 col-md-7">
                {
                  loading?
                  <SingleProductSkeleton type={"content"}/>
                  :

                  <div className="tpproduct-details__content tpproduct-details__sticky">
                  <div className="tpproduct-details__tag-area d-flex align-items-center mb-5">
                    <span className="tpproduct-details__tag">
                      {
                        product?.name
                      }
                    </span>
                    <div className="tpproduct-details__rating">
                      <Link href="#">
                        <i className="fas fa-star" />
                      </Link>
                      <Link href="#">
                        <i className="fas fa-star" />
                      </Link>
                      <Link href="#">
                        <i className="fas fa-star" />
                      </Link>
                      <Link href="#">
                        <i className="fas fa-star" />
                      </Link>
                    </div>
                  </div>
                  <div className="tpproduct-details__title-area d-flex align-items-center flex-wrap mb-5">
                    <h3 className="tpproduct-details__title">
                      {product?.name}
                    </h3>
                    <span className="tpproduct-details__stock">{product?.sold?"SOLD":"In Stock"}</span>
                  </div>
                  <div className="tpproduct-details__price mb-30">
                    {product?.discounted_price ? (
                      <del>PKR {product.price}</del>
                    ) : (
                      ""
                    )}
                    <span>
                      PKR{" "}
                      {
                        applyDiscount(product.price, product.discounted_price)
                      }
                    </span>
                  </div>
                  <div className="tpproduct-details__pera">
                    <p>
                      {product.short_description
                      }{" "}
                    </p>
                  </div>
                  {!product ? (
                    ""
                  ) : (
                    <div className="tpproduct-details__count d-flex align-items-center flex-wrap mb-25">
                      <div className="tpproduct-details__cart ml-20">
                        <button onClick={addToCart}>
                          <i className="fal fa-shopping-cart" /> Add To Cart
                        </button>
                      </div>
                      <div className="tpproduct-details__wishlist ml-20">
                        <button>
                          <i className="fal fa-heart" onClick={addToWishlist} />
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="tpproduct-details__information tpproduct-details__code">
                    <p>SKU:</p>
                    <span>BO1D0MX8SJ</span>
                  </div>
                  <div className="tpproduct-details__information tpproduct-details__categories">
                    <p>Categories:</p>
                    {
                      product?.categories?.map((category, index) => (
                        <span key={index}>
                          <Link href={`/categories/${category}`}>
                            {category}
                          </Link>
                          {index !== product.categories.length - 1 && ","}{" "}
                          {/* Adds comma except for the last item */}
                        </span>
                      ))
                    }
                  </div>
                  <div className="tpproduct-details__information tpproduct-details__categories">
                    <p>Condition:</p>
                    { <span>{product.product_condition} / 10</span>
                    }
                  </div>
                  <div className="tpproduct-details__information tpproduct-details__tags">
                    <p>Tags:</p>
                    { product.tags?.length > 0 ? (
                      product.tags.map((tag, index) => (
                        <span key={index}>
                          <Link href="">{tag}</Link>
                          {index !== product.tags.length - 1 && ","}{" "}
                        </span>
                      ))
                    ) : (
                      "No tags avaliable"
                    )}
                  </div>
                  <SocialShare title={`Check out ${product.name}`} />
                </div>
                }
              </div>
            
             
              <div className="col-lg-2 col-md-5">
                <div className="tpproduct-details__condation">
                  <ul>
                    <li>
                      <div className="tpproduct-details__condation-item d-flex align-items-center">
                        <div className="tpproduct-details__condation-thumb">
                          <img
                            src="/assets/img/icon/product-det-1.png"
                            alt=""
                            className="tpproduct-details__img-hover"
                          />
                        </div>
                        <div className="tpproduct-details__condation-text">
                          <p>Free Shipping apply to all orders over PKR 5000</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="tpproduct-details__condation-item d-flex align-items-center">
                        <div className="tpproduct-details__condation-thumb">
                          <img
                            src="/assets/img/icon/product-det-2.png"
                            alt=""
                            className="tpproduct-details__img-hover"
                          />
                        </div>
                        <div className="tpproduct-details__condation-text">
                          <p>
                            100% Authentic, Quality Assured, and Exactly as{" "}
                            <br /> Shown in the Image.
                          </p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="tpproduct-details__condation-item d-flex align-items-center">
                        <div className="tpproduct-details__condation-thumb">
                          <img
                            src="/assets/img/icon/product-det-3.png"
                            alt=""
                            className="tpproduct-details__img-hover"
                          />
                        </div>
                        <div className="tpproduct-details__condation-text">
                          <p>
                            3 Day Easy Returns if you change
                            <br />
                            your mind
                          </p>
                        </div>
                      </div>
                    </li>
                    <li></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="product-setails-area">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="tpproduct-details__navtab mb-60">
                  <div className="tpproduct-details__nav mb-30">
                    <ul
                      className="nav nav-tabs pro-details-nav-btn"
                      id="myTabs"
                      role="tablist"
                    >
                      <li className="nav-item" onClick={() => handleOnClick(1)}>
                        <button
                          className={
                            activeIndex == 1 ? "nav-links active" : "nav-links"
                          }
                        >
                          Description
                        </button>
                      </li>
                      <li className="nav-item" onClick={() => handleOnClick(2)}>
                        <button
                          className={
                            activeIndex == 2 ? "nav-links active" : "nav-links"
                          }
                        >
                          Additional information
                        </button>
                      </li>
                    </ul>
                  </div>
                  <div
                    className="tab-content tp-content-tab"
                    id="myTabContent-2"
                  >
                    <div
                      className={
                        activeIndex == 1
                          ? "tab-para tab-pane fade show active"
                          : "tab-para tab-pane fade"
                      }
                    >
                      {loading ? (
                        <h3 style={{ textAlign: "center" }}>
                          Loading content{" "}
                        </h3>
                      ) : (
                        <>
                          <p className="mb-30">{product?.short_description}</p>
                          <p>{product?.long_description}</p>
                        </>
                      )}
                    </div>
                    <div
                      className={
                        activeIndex == 2
                          ? "tab-pane fade show active"
                          : "tab-pane fade"
                      }
                    >
                      <div className="product__details-info table-responsive">
                        <table className="table table-striped">
                          <tbody>
                            {!product?.additional_information ? (
                              <tr>
                                <td colSpan="2">
                                  <h3 style={{ textAlign: "center" }}>
                                    {loading
                                      ? "Loading Content"
                                      : "No Additional Information "}
                                  </h3>
                                </td>
                              </tr>
                            ) : (
                              Object.entries(
                                product.additional_information,
                              ).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="add-info">{key}</td>
                                  <td className="add-info-list">
                                    {Array.isArray(value)
                                      ? value.join(", ")
                                      : value}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="related-product-area pt-80 pb-50 related-product-border">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <div className="tpsection mb-40">
                  <h4 className="tpsection__title">Related Products</h4>
                </div>
              </div>
              <div className="col-sm-6">
                <div className="tprelated__arrow d-flex align-items-center justify-content-end mb-40">
                  <div className="tprelated__prv">
                    <i className="far fa-long-arrow-left" />
                  </div>
                  <div className="tprelated__nxt">
                    <i className="far fa-long-arrow-right" />
                  </div>
                </div>
              </div>
            </div>
            <div className="swiper-container related-product-active">
              <Swiper {...swiperOptions}>
                {!relatedProducts.length > 0 ? (
                  <h3 style={{ textAlign: "center" }}>
                    No Related Products Found
                  </h3>
                ) : (
                  relatedProducts.map((relatedproduct, index) => (
                    <SwiperSlide key={relatedproduct._id}>
                      <div className="tpproduct pb-15 mb-30">
                        <div className="tpproduct__thumb p-relative sm:bg-slate-600">
                          <Link
                            href={`/shop/${relatedproduct._id}`}
                          >
                            <div >
                              <img
                              loading="lazy"
                                style={{objectFit:"cover",width:"100%",height:"250px" }}
                                src={relatedproduct.images[0]}
                                alt="product-thumb"
                              />
                              <img
                              loading="lazy"
                                style={{objectFit:"cover",width:"100%",height:"250px" }}
                                className="product-thumb-secondary"
                                src={relatedproduct.images[1]}
                                alt=""
                              />
                            </div>
                          </Link>
                          <div className="tpproduct__thumb-action" style={{marginTop:"20px"}}>
                            <Link className="quckview" href="#">
                              <i className="fal fa-eye" />
                            </Link>
                            <Link
                              className="wishlist"
                              href="#"
                              onClick={() => {
                                RelatedaddToWishlist(relatedproduct);
                              }}
                            >
                              <i className="fal fa-heart" />
                            </Link>
                          </div>
                        </div>
                        <div className="tpproduct__content">
                          <h3 className="tpproduct__title">
                            <Link href="/shop-details">
                              {relatedproduct.name}
                            </Link>
                          </h3>
                          <div className="tpproduct__priceinfo p-relative">
                            <div className="tpproduct__priceinfo-list">
                              <span>
                                {relatedproduct.discounted_price ? (
                                  <>
                                    <span>
                                      PKR 
                                      {' '}
                                      {applyDiscount(
                                        relatedproduct.price,
                                        relatedproduct.discounted_price,
                                      )}
                                    </span>

                                    <span
                                      style={{
                                        textDecoration: "line-through",
                                        color: "red",
                                        marginLeft: "2px",
                                      }}
                                    >
                                      PKR {relatedproduct.price}
                                    </span>
                                  </>
                                ) : (
                                  relatedproduct.price
                                )}
                              </span>
                            </div>
                            <div className="tpproduct__cart">
                              <Link
                                href="#"
                                onClick={() => {
                                  RelatedaddToCart(relatedproduct);
                                }}
                              >
                                <i className="fal fa-shopping-cart" />
                                Add To Cart
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                )}
              </Swiper>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ShopSingleDynamicV1;
