import { applyDiscount } from "@/lib/discountHandler";
import Link from "next/link";
const ShopCardList = ({ item, addToCart, addToWishlist,soldProducts }) => {
  const isSold = soldProducts.includes(item._id);
  
  return (
    <>
      <div className="row mb-40">
        <div className="col-lg-4 col-md-12">
          <div className="tpproduct__thumb">
            <div className="tpproduct__thumbitem p-relative">
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
          src={item.images[0]}
          alt="product-thumb"
          className="product-image"
        />
        <img
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

            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-12">
          <div className="filter-product ml-20 pt-30">
            <h3 className="filter-product-title">
              <Link href={`/shop/${item._id}`} >
                {item?.name}{" "}
                {item?.discounted_price ? (
                  <span style={{ color: "rgb(213 18 67)", marginLeft: "4px" }}>
                    {item.discounted_price}%OFF
                  </span>
                ) : (
                  ""
                )}
              </Link>
            </h3>
            <div className="tpproduct__ammount">
              {item.discounted_price ? (
                <>
                  <span>
                    {applyDiscount(item.price, item.discounted_price)} PKR
                  </span>
                  <del>{item.price} PKR</del>
                </>
              ) : (
                <span>{item.price} PKR</span>
              )}
            </div>
          
            <div className="tpproduct__rating mb-15">
              <ul>
                <li>
                  {(() => {
                    const rating = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
                    const stars = [];

                    for (let i = 1; i <= 5; i++) {
                      stars.push(
                        <Link href="#" key={i}>
                          <i
                            className={
                              i <= rating ? "fas fa-star" : "far fa-star"
                            }
                          />
                        </Link>,
                      );
                    }

                    return stars;
                  })()}
                </li>

                <li>
                  <span>
                    (
                    {(() => {
                      const num =
                        Math.floor(Math.random() * (1000 - 40 + 1)) + 40;
                      return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num;
                    })()}
                    )
                  </span>
                </li>
              </ul>
            </div>
            <div>
                <p>category : {item.categories}</p>
            </div>
           
            <p>{item.short_description}.</p>
            <p>{item.long_description}.</p>

            <div className="tpproduct__action">
              <Link className="quckview" href={`/shop/${item._id}`}>
                <i className="fal fa-eye" />
              </Link>
              <a onClick={() => addToWishlist(item._id)} className="wishlist">
                <i className="fal fa-heart" />
              </a>
              <a onClick={() => addToCart(item._id)}>
                <i className="fal fa-shopping-basket cursor-pointer" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopCardList;
