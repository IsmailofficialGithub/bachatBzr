import Link from "next/link";
import CartShow from "../elements/CartShow";
import NotificationListShow from "../elements/NotificationListShow";
import { Bell } from "lucide-react";

export default function HeaderMobSticky({
  scroll,
  isMobileMenu,
  handleMobileMenu,
  isCartSidebar,
  handleCartSidebar,
  AccountredirectUrl,
}) {
  return (
    <>
      <div
        id="header-mob-sticky"
        className={`tp-md-lg-header d-md-none  ${
          scroll ? "header-sticky" : ""
        }`}
      >
        <div className="container">
          <div className="row align-items-center" style={{height:"60px"}}>
            <div className="col-3 d-flex align-items-center">
              <div className="header-canvas flex-auto">
                <button className="tp-menu-toggle" onClick={handleMobileMenu}>
                  <i className="far fa-bars" />
                </button>
              </div>
            </div>
            <div className="col-3">
              <div className="logo text-center">
                <Link href="/">
                  <img src="/assets/img/logo/logo.png" alt="logo" width={80} />
                </Link>
              </div>
            </div>
            <div className="col-6">
              <div className="header-meta-info d-flex align-items-center justify-content-end ml-25">
                <div className="header-meta m-0 d-flex align-items-center">
                  <div className="header-meta__social d-flex align-items-center">
                    <button
                      style={{ marginRight: "10px" }}
                      className="header-cart p-relative tp-cart-toggle"
                      onClick={handleMobileMenu}
                    >
                    <i className="fal fa-search" />
                    </button>
                    <button
                      className="header-cart p-relative tp-cart-toggle"
                      onClick={handleCartSidebar}
                    >
                      <i className="fal fa-shopping-cart" />
                      <CartShow />
                    </button>

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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
