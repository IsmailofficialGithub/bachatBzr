import Link from "next/link"
import CartShow from "../elements/CartShow"
import WishListShow from "../elements/WishListShow"
import NotificationListShow from "../elements/NotificationListShow"
import { Bell } from "lucide-react"

export default function HeaderTabSticky({ scroll, isMobileMenu, handleMobileMenu, isCartSidebar, handleCartSidebar, AccountredirectUrl, searchClick, InputChange }) {
    return (
        <>
            <div id="header-tab-sticky" className={`tp-md-lg-header d-none d-md-block d-xl-none pt-30 pb-30 ${scroll ? "header-sticky" : ""}`}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-3 col-md-4 d-flex align-items-center">
                            <div className="header-canvas flex-auto">
                                <button className="tp-menu-toggle" onClick={handleMobileMenu}><i className="far fa-bars" /></button>
                            </div>
                            <div className="logo">
                                <Link href="/"><img src="/assets/img/logo/logo.png" alt="logo" width={100} /></Link>
                            </div>
                        </div>
                        <div className="col-lg-9 col-md-8">
                            <div className="header-meta-info d-flex align-items-center justify-content-between">
                                <div className="header-search-bar">
                                    <form action="#">
                                        <div className="search-info p-relative">
                                            <button className="header-search-icon"><i className="fal fa-search" onClick={searchClick} /></button>
                                            <input type="text" placeholder="Search products..." onChange={InputChange} />
                                        </div>
                                    </form>
                                </div>
                                <div className="header-meta__social d-flex align-items-center ml-25">
                                    <button className="header-cart p-relative tp-cart-toggle" onClick={handleCartSidebar}>
                                        <i className="fal fa-shopping-cart" />
                                        <CartShow />
                                    </button>
                                    <Link href="/wishlist" className="header-cart p-relative tp-cart-toggle">
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
                                    <Link href={AccountredirectUrl}><i className="fal fa-user" /></Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
