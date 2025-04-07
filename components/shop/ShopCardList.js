import { applyDiscount } from "@/lib/discountHandler";
import Link from "next/link";
const ShopCardList = ({ item, addToCart, addToWishlist }) => {
  return (
    <>
      <div className="row mb-40">
        <div className="col-lg-4 col-md-12">
          <div className="tpproduct__thumb">
            <div className="tpproduct__thumbitem p-relative">
              <Link href="/shop-details">
                <img
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                  src={`${item?.images?.[0]}`}
                  alt={item.name}
                />
                <img
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                  className="thumbitem-secondary"
                  src={item?.images?.[1]}
                  alt={item.name}
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-12">
          <div className="filter-product ml-20 pt-30">
            <h3 className="filter-product-title">
              <Link href="/shop-details">
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
              <Link className="quckview" href={`${process.env.NEXT_PUBLIC_API_URL}/shop/${item._id}`}>
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
