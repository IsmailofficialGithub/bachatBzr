"use client";
import { addQty, deleteCart } from "@/features/shopSlice";
import { applyDiscount } from "@/lib/discountHandler";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

export default function HeaderCart({ isCartSidebar, handleCartSidebar }) {
  const { cart } = useSelector((state) => state.shop) || {};
  const dispatch = useDispatch();

  // delete cart item
  const deleteCartHandler = (id) => {
    dispatch(deleteCart(id));
  };

  // qty handler
  let total = 0;
  cart?.forEach((item) => {
    const price = item.discounted_price? applyDiscount(item.price,item.discounted_price):item.price;
    total = total + price;
  });
  return (
    <>
      <div
        className={`tpcartinfo tp-cart-info-area p-relative ${
          isCartSidebar ? "tp-sidebar-opened" : ""
        }`}
      >
        <button className="tpcart__close" onClick={handleCartSidebar}>
          <i className="fal fa-times" />
        </button>
        <div className="tpcart">
          <h4 className="tpcart__title">Your Cart</h4>
          <div className="tpcart__product">
            <div className="tpcart__product-list">
              <ul>
                {cart?.map((item, i) => (
                  <li key={i}>
                    <div className="tpcart__item">
                      <div className="tpcart__img">
                        <img src={`${item?.images?.[0]}`} alt="" />
                        <div
                          className="tpcart__del"
                          onClick={() => deleteCartHandler(item?._id)}
                        >
                          <Link href="">
                            <i className="far fa-times-circle" />
                          </Link>
                        </div>
                      </div>
                      <div className="tpcart__content">
                        <span className="tpcart__content-title">
                          <Link href={`/shop/${item._id}`}>{item.name}</Link>
                        </span>
                        <div className="tpcart__cart-price">
                         {item.discounted_price &&  <span className="new-price">PKR {applyDiscount(item.price,item.discounted_price)}</span>}
                         <br/>
                          <span className={`new-price ${item.discounted_price&& "line-through"}`}>PKR  {item?.price}</span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="tpcart__checkout">
              <div className="tpcart__total-price d-flex justify-content-between align-items-center">
                <span> Subtotal:</span>
                <span className="heilight-price"> PKR {total.toFixed(2)}</span>
              </div>
              <div className="tpcart__checkout-btn">
                <Link className="tpcart-btn mb-10" href="/cart">
                  View Cart
                </Link>
                <Link className="tpcheck-btn" href="/checkout">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
          <div className="tpcart__free-shipping text-center">
            <span>
              Free shipping for orders <b>under 1km</b>
            </span>
          </div>
        </div>
      </div>
      <div
        className={`cartbody-overlay ${isCartSidebar ? "opened" : ""}`}
        onClick={handleCartSidebar}
      />
    </>
  );
}
