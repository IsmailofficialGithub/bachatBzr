"use client";
import CartShow from "@/components/elements/CartShow";
import WishListShow from "@/components/elements/WishListShow";
import NotificationListShow from "@/components/elements/NotificationListShow";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import HeaderMobSticky from "../HeaderMobSticky";
import HeaderSticky from "../HeaderSticky";
import HeaderTabSticky from "../HeaderTabSticky";
import { useSelector } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { toast } from "react-toastify";

export default function Header3({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
}) {
  const { user } = useSelector((state) => state.auth);
  const { categories } = useSelector((state) => state?.categories);
  const [isToggled, setToggled] = useState(false);
  const handleToggle = () => setToggled(!isToggled);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  const debounce = (func, delay) => {
    const timer = useRef(null);

    return (...args) => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Function to fetch suggestions
  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm) return setSuggestions([]);

    try {
      const res = await axios.get(
        `api/product/searchSuggestion?q=${searchTerm}`,
      );
      const result = res.data;

      if (result.success) {
        setSuggestions(result.data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Axios fetch error:", error.message);
      setSuggestions([]);
    }
  };

  // Debounced version of the API call
  const debouncedFetch = useCallback(debounce(fetchSuggestions, 500), []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetch(value);
  };
  const handleSearchClick = (e) => {
    e.preventDefault();
    query && router.push(`/shop?q=${query}`);
    setSuggestions([]);
  };

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
                        <Link
                          href={
                            user
                              ? `/${user?.user_metadata?.role}/dashboard`
                              : "/authentication"
                          }
                        >
                          <i className="fal fa-user" /> Account
                        </Link>
                        <Link className="order-tick" href={"/track"}>
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
                    <Link href="https://www.instagram.com/bachatbzr">
                      <i className="fab fa-instagram" />
                    </Link>
                    <Link href="https://www.tiktok.com/@bachatbzr">
                      <i className="fab fa-tiktok" />
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
                    <img
                      src="/assets/img/logo/logo.png"
                      alt="logo"
                      width={200}
                    />
                  </Link>
                </div>
              </div>
              <div className="col-xl-10 col-lg-9">
                <div className="header-meta-info d-flex align-items-center justify-content-between">
                  <div className="header-search-bar">
                    <div className="search-info p-relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={query}
                        onChange={handleChange}
                      />
                      <button
                        className="header-search-icon"
                        onClick={handleSearchClick}
                      >
                        <i className="fal fa-search" />
                      </button>

                      {/* Suggestions Dropdown */}
                      {suggestions.length > 0 && (
                        <ul className="suggestion-list absolute bg-white border mt-2 p-2 rounded shadow">
                          {suggestions.map((item, idx) => (
                            <li
                              key={idx}
                              className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                router.push(`/shop?q=${item}`);
                              }}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
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

                      <Link
                        href="/wishlist"
                        className="header-cart p-relative tp-cart-toggle"
                      >
                        <i className="fal fa-heart" />
                        <WishListShow />
                      </Link>
                      <Link
                        href="/notifications"
                        className="header-cart p-relative tp-cart-toggle"
                      >
                        <Bell size={23} strokeWidth={1.3} />

                        <NotificationListShow />
                      </Link>
                      <Link
                        href={
                         user 
  ? `/${user.user_metadata?.role || 'user'}/dashboard`
  : "/authentication"

                        }
                      >
                        <i className="fal fa-user" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="main-menu-area tertiary-main-menu mt-25 d-none d-xl-block"
          style={{ marginLeft: "5%", marginRight: "5%" }}
        >
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
                      {categories?.map((category) => (
                        <li
                          key={category.id}
                          className={
                            category.parent_id ? "menu-item-has-children" : ""
                          }
                        >
                          <Link href={`/category/${category.name}`}>
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
                            <Link href="/category/shoes">Shoes Home</Link>
                          </li>
                          <li>
                            <Link href="/category/cloths">Cloths Home</Link>
                          </li>
                          <li>
                            <Link href="/category/mens">Mens Home</Link>
                          </li>
                          <li>
                            <Link href="/category/tshirts">T-shirts Home</Link>
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
                                <Link href="/shop">Shop List view</Link>
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
                                <Link href="/authentication?signin=true">
                                  Sign In
                                </Link>
                              </li>
                              <li>
                                <Link href="/authentication?signup=true">
                                  Sign Up
                                </Link>
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
                          <i class="fa fa-envelope" aria-hidden="true" />
                        </div>
                        <div className="menu-contact__info">
                          <Link
                            href="mailto:contact@bachatbzr.com"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                "contact@bachatbzr.com",
                              );
                              toast.success(
                                "Email address copied to clipboard!",
                              );
                            }}
                          >
                            contact@bachatbzr.com
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
        searchClick={handleSearchClick}
        InputChange={handleChange}
        AccountredirectUrl={
          user
            ? `/${user.user_metadata?.role || "user"}/dashboard`
            : "/authentication"
        }
      />
      <HeaderTabSticky
        scroll={scroll}
        searchClick={handleSearchClick}
        isMobileMenu={isMobileMenu}
        AccountredirectUrl={
         user 
  ? `/${user.user_metadata?.role || 'user'}/dashboard`
  : "/authentication"

        }
        handleMobileMenu={handleMobileMenu}
        InputChange={handleChange}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
      <HeaderMobSticky
        scroll={scroll}
        AccountredirectUrl={
         user 
  ? `/${user.user_metadata?.role || 'user'}/dashboard`
  : "/authentication"

        }
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
        isCartSidebar={isCartSidebar}
        handleCartSidebar={handleCartSidebar}
      />
    </>
  );
}
