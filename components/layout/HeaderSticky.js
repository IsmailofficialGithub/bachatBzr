import Link from "next/link";
import CartShow from "../elements/CartShow";
import WishListShow from "../elements/WishListShow";
import NotificationListShow from "../elements/NotificationListShow";
import { Bell } from "lucide-react";

export default function HeaderSticky({
  scroll,
  isCartSidebar,
  handleCartSidebar,
  AccountredirectUrl,
  InputChange,
  searchClick,
}) {
  return (
    <>
      <div
        id="header-sticky"
        className={`logo-area tp-sticky-one mainmenu-5 ${
          scroll ? "header-sticky" : ""
        }`}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-xl-2 col-lg-3">
              <div className="logo">
                <Link href="/">
                  <img src="/assets/img/logo/logo.png" alt="logo" width={150} />
                </Link>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6">
              <div className="main-menu">
                <nav>
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
                    <li className="has-dropdown">
                      <Link href="/blog">Blog</Link>
                      <ul className="submenu">
                        <li>
                          <Link href="/blog">Blog</Link>
                        </li>
                        <li>
                          <Link href="/blog-details">Blog Details</Link>
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
            <div className="col-xl-4 col-lg-9">
              <div className="header-meta-info d-flex align-items-center justify-content-end">
                <div className="header-meta__social  d-flex align-items-center">
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
                  <Link href={AccountredirectUrl}>
                    <i className="fal fa-user" />
                  </Link>
                </div>
                <div className="header-meta__search-5 ml-25">
                  <div className="header-search-bar-5">
                    <form action="#">
                      <div className="search-info-5 p-relative">
                        <button className="header-search-icon-5">
                          <i className="fal fa-search" onClick={searchClick} />
                        </button>
                        <input
                          type="text"
                          placeholder="Search products..."
                          onChange={InputChange}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
