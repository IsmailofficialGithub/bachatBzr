

import React, { useMemo } from "react";
import Link from "next/link";
import { applyDiscount } from "@/lib/discountHandler";

const ShopCard = React.memo(({ item, addToCart, addToWishlist,soldProducts }) => {
  const { starCount, rating } = useMemo(() => {
    return {
      starCount: Math.floor(Math.random() * (4 - 3 + 1)) + 3,
      rating: Math.floor(Math.random() * (200 - 30 + 1)) + 30
    };
  }, [item._id]); 
  const isSold = soldProducts.includes(item._id);
  return (
    <>
      <div className="col">
        <div className="tpproduct tpproductitem mb-50 p-relative ">
          <div className="tpproduct__thumb">
            <div
              className="tpproduct__thumbitem p-relative"
              style={{ height: "250px" }}
            >
  <div className={`product-wrapper ${isSold ? "blocked" : ""}`}>
      {isSold && (
        <div className="sold-overlay">
          <h2>SOLD</h2>
        </div>
      )}

      <Link
        href={isSold ? "#" : `/shop/${item._id}`}
        onClick={(e) => isSold && e.preventDefault()}
      >
        <img
        loading="lazy"
          src={item.images[0]}
          alt="product-thumb"
          className="product-image"
        />
        <img
        loading="lazy"
          className="thumbitem-secondary product-image"
          src={item.images[1]}
          alt="product-thumb"
        />
      </Link>

      <style jsx>{`
        .product-wrapper {
          position: relative;
          display: inline-block;
        }

        .product-image {
          height: 250px;
          object-fit: cover;
          display: block;
        }

        .blocked {
          cursor: not-allowed;
        }

        .sold-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: slideDown 0.5s ease-out forwards;
          z-index: 10;
        }

        .sold-overlay h2 {
          color: #ff3b3b;
          font-size: 3rem;
          font-weight: bold;
          margin: 0;
        }

        @keyframes slideDown {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>

              
              <div className="tpproduct__thumb-bg">
                <div className="tpproductactionbg">
                  <a
                    onClick={() => addToCart(item._id)}
                    className="add-to-cart"
                  >
                    <i className="fal fa-shopping-basket" />
                  </a>
                 
                  <Link href={`/shop/${item._id}`} target="_blank">
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
              <div className="tpproduct__ammount"style={{display: "flex", justifyContent: "space-between"}}>
                <span>PKR {item.discounted_price?applyDiscount(item.price,item.discounted_price):item.price}.00</span>
                <span>{item.product_condition}/10</span>
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