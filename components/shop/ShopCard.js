

import React, { useMemo } from "react";
import Link from "next/link";
import { applyDiscount } from "@/lib/discountHandler";

const ShopCard = React.memo(({ item, addToCart, addToWishlist }) => {
  const { starCount, rating } = useMemo(() => {
    return {
      starCount: Math.floor(Math.random() * (4 - 3 + 1)) + 3,
      rating: Math.floor(Math.random() * (200 - 30 + 1)) + 30
    };
  }, [item._id]); 
  return (
    <>
      <div className="col">
        <div className="tpproduct tpproductitem mb-50 p-relative ">
          <div className="tpproduct__thumb">
            <div
              className="tpproduct__thumbitem p-relative"
              style={{ height: "250px" }}
            >
              <Link href={`/shop/${item._id}`}>
                <img
                  src={`${item.images[0]}`}
                  alt="product-thumb"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <img
                  className="thumbitem-secondary"
                  src={`${item.images[1]}`}
                  alt="product-thumb"
                  style={{ height: "250px" }}
                />
              </Link>
              <div className="tpproduct__thumb-bg">
                <div className="tpproductactionbg">
                  <a
                    onClick={() => addToCart(item._id)}
                    className="add-to-cart"
                  >
                    <i className="fal fa-shopping-basket" />
                  </a>
                 
                  <Link href={`shop/${item._id}`}>
                    <i className="fal fa-eye" />
                  </Link>
                  <a
                    onClick={() => addToWishlist(item._id)}
                    className="wishlist"
                  >
                    <i className="fal fa-heart" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="tpproduct__content-area">
            <h3 className="tpproduct__title mb-5">
              <Link href={`/shop/${item._id}`}>{item.name}</Link>
            </h3>
            <div className="tpproduct__priceinfo p-relative">
              <div className="tpproduct__ammount">
                <span>PKR {item.discounted_price?applyDiscount(item.price,item.discounted_price):item.price}.00</span>
              </div>
            </div>
          </div>
          <div className="tpproduct__ratingarea">
            <div className="d-flex align-items-center justify-content-between">
              <div className="tpproductdot">
                <Link
                  className="tpproductdot__variationitem"
                  href={`/shop/${item._id}`}
                >
                  <div className="tpproductdot__termshape">
                    <span className="tpproductdot__termshape-bg" />
                    <span className="tpproductdot__termshape-border" />
                  </div>
                </Link>
                <Link
                  className="tpproductdot__variationitem"
                  href={`/shop/${item._id}`}
                >
                  <div className="tpproductdot__termshape">
                    <span className="tpproductdot__termshape-bg red-product-bg" />
                    <span className="tpproductdot__termshape-border red-product-border" />
                  </div>
                </Link>
                <Link
                  className="tpproductdot__variationitem"
                  href={`/shop/${item._id}`}
                >
                  <div className="tpproductdot__termshape">
                    <span className="tpproductdot__termshape-bg orange-product-bg" />
                    <span className="tpproductdot__termshape-border orange-product-border" />
                  </div>
                </Link>
                <Link
                  className="tpproductdot__variationitem"
                  href={`/shop/${item._id}`}
                >
                  <div className="tpproductdot__termshape">
                    <span className="tpproductdot__termshape-bg purple-product-bg" />
                    <span className="tpproductdot__termshape-border purple-product-border" />
                  </div>
                </Link>
              </div>
              <div className="tpproduct__rating">
                <ul>
                  <li>
                    {[...Array(5)].map((_, index) => (
                      <Link href="#" key={index}>
                        <i
                          className={
                            index < starCount ? "fas fa-star" : "far fa-star"
                          }
                        />
                      </Link>
                    ))}
                  </li>
                  <li>
                    <span>
                      ({rating})
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default ShopCard;