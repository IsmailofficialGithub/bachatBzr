"use client";
import CartShow from "@/components/elements/CartShow";
import WishListShow from "@/components/elements/WishListShow";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderMobSticky from "../HeaderMobSticky";
import HeaderSticky from "../HeaderSticky";
import HeaderTabSticky from "../HeaderTabSticky";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Header3({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {
  const { user } = useSelector((state) => state.auth);
  const [isToggled, setToggled] = useState(false);
  const [categories, setCategories] = useState([]);
  const handleToggle = () => setToggled(!isToggled);

  const fetchingCategories = async () => {
    try {
      const response = await axios.get(`/api/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchingCategories();
  }, []);

  return (
    <>
      <header>
        <div className="header-top tertiary-header-top space-bg">
          <div className="container">
            <div className="row">
              <div className="col-xl-7 col-lg-12 col-md-12 ">
                <div className="header-welcome-text">
                  <span>
                    Welcome to our Main shop! Enjoy free shipping on orders 5000
                    PKR up.
                  </span>
                  <Link href="/shop">
                    {" "}
                    Shop Now
                    <i className="fal fa-long-arrow-right" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-5 d-none d-xl-block">
                <div className="headertoplag d-flex align-items-center justify-content-end">
                  <div className="headertoplag__lang">
                    <ul>
                      <li>
                        <Link href={user ? "/user/account" : "/authentication"}>
                          <i className="fal fa-user" /> Account
                        </Link>
                        <Link
                          className="order-tick"
                          href={user ? "/user/account" : "/authentication"}
                        >
                          <i className="fal fa-plane-departure" /> Track Your
                          Order
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="menu-top-social">
                    <Link href="#">
                      <i className="fab fa-facebook-f" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-twitter" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-behance" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-youtube" />
                    </Link>
                    <Link href="#">
                      <i className="fab fa-linkedin" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="logo-area green-logo-area mt-30 d-none d-xl-block">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-3">
                <div className="logo">
                  <Link href="/">
                    <img src="/assets/img/logo/logo.png" alt="logo" />
                  </Link>
                </div>
              </div>
              <div className="col-xl-10 col-lg-9">
                <div className="header-meta-info d-flex align-items-center justify-content-between">
                  <div className="header-search-bar">
                    <form action="#">
                      <div className="search-info p-relative">
                        <button className="header-search-icon">
                          <i className="fal fa-search" />
                        </button>
                        <input type="text" placeholder="Search products..." />
                      </div>
                    </form>
                  </div>
                  <div className="header-meta header-brand d-flex align-items-center">
                    <div className="header-meta__social d-flex align-items-center ml-25">
                      <button
                        className="header-cart p-relative tp-cart-toggle"
                        onClick={handleCartSidebar}
                      >
                        <i className="fal fa-shopping-cart" />
                        <CartShow />
                      </button>
                      <Link href={user ? "/user/dashboard" : "/authentication"}>
                        <i className="fal fa-user" />
                      </Link>
                      <Link
                        href="/wishlist"
                        className="header-cart p-relative tp-cart-toggle"
                      >
                        <i className="fal fa-heart" />
                        <WishListShow />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-menu-area tertiary-main-menu mt-25 d-none d-xl-block">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-3">
                <div className="cat-menu__category p-relative">
                  <a onClick={handleToggle} href="#">
                    <i className="fal fa-bars" />
                    Categories
                  </a>
                  <div
                    className="category-menu"
                    style={{ display: `${isToggled ? "block" : "none"}` }}
                  >
                    <ul className="cat-menu__list">
                      {categories.map((category) => (
                        <li
                          key={category.id}
                          className={
                            category.parent_id ? "menu-item-has-children" : ""
                          }
                        >
                          <Link href="/shop-2">
                            <i class="fal fa-gift" /> {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {/* <div className="coupon-offer d-flex align-items-center justify-content-between">
                                            <span>Coupon: <Link href="/shop">Offers50</Link></span>
                                            <Link href="#"> <i className="fal fa-copy" /></Link>
                                        </div> */}
                  </div>
                </div>
              </div>
              <div className="col-xl-7 col-lg-6">
                <div className="main-menu">
                  <nav id="mobile-menu">
                    <ul>
                      <li className="has-dropdown">
                        <Link href="/">Home</Link>
                        <ul className="submenu">
                          <li>
                            <Link href="/">Shoes Home</Link>
                          </li>
                          <li>
                            <Link href="/index-2">Cloths Home</Link>
                          </li>
                          <li>
                            <Link href="/index-3">Mens Home</Link>
                          </li>
                          <li>
                            <Link href="/index-4">T-shirts Home</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="has-dropdown">
                        <Link href="/shop">Shop</Link>
                        <ul className="submenu">
                          <li>
                            <Link href="/shop">Shop</Link>
                          </li>
                          {/* <li><Link href="/shop-location">Shop Location</Link></li> */}
                          <li>
                            <Link href="/cart">Cart</Link>
                          </li>
                          <li>
                            <Link href="/authentication">Sign In</Link>
                          </li>
                          <li>
                            <Link href="/checkout">Checkout</Link>
                          </li>
                          <li>
                            <Link href="/wishlist">Wishlist</Link>
                          </li>
                          <li>
                            <Link href="/track">Product Track</Link>
                          </li>
                        </ul>
                      </li>
                      <li className="has-dropdown has-megamenu">
                        <Link href="/about">Pages</Link>
                        <ul className="submenu mega-menu">
                          <li>
                            <a className="mega-menu-title">Page layout</a>
                            <ul>
                              <li>
                                <Link href="/categories">Categories</Link>
                              </li>
                              <li>
                                <Link href="/">Home</Link>
                              </li>
                              <li>
                                <Link href="/shop-location">
                                  Shop List view
                                </Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a className="mega-menu-title">Page layout</a>
                            <ul>
                              <li>
                                <Link href="/about">About</Link>
                              </li>
                              <li>
                                <Link href="/cart">Cart</Link>
                              </li>
                              <li>
                                <Link href="/checkout">Checkout</Link>
                              </li>
                              <li>
                                <Link href="/authentication">Sign In</Link>
                              </li>
                              <li>
                                <Link href="/authentication">Log In</Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <a className="mega-menu-title">Page type</a>
                            <ul>
                              <li>
                                <Link href="/track">Product Track</Link>
                              </li>
                              <li>
                                <Link href="/wishlist">Wishlist</Link>
                              </li>
                              <li>
                                <Link href="/not-found">404 / Error</Link>
                              </li>
                              <li>
                                <Link href="/coming-soon">Coming Soon</Link>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <Link href="/contact">Contact</Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-xl-3 col-lg-3">
                <div className="menu-contact">
                  <ul>
                    <li>
                      <div className="menu-contact__item">
                        <div className="menu-contact__icon">
                          <i className="fal fa-phone" />
                        </div>
                        <div className="menu-contact__info">
                          <Link href="#">+93255028225</Link>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="menu-contact__item">
                        <div className="menu-contact__icon">
                          <i className="fal fa-map-email-alt" />
                        </div>
                        <div className="menu-contact__info">
                          <Link href="/shop-location">
                            lalagggg786@gmail.com
                          </Link>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <HeaderSticky
        scroll={scroll}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
      <HeaderTabSticky
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
      <HeaderMobSticky
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
    </>
  );
}
