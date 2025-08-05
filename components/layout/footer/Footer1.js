import Image from "next/image"
import Link from "next/link"
import { toast } from "react-toastify"

export default function Footer1(isMobileMenu) {
    const handleSubscribe=async()=>{
        const input=document.getElementsByClassName("SubscribeInput");
        input.value=""
        toast.success("Request send Successfully")
    }
    return (
        <>
            <footer>
                <div className="footer-area theme-bg pt-65">
                    <div className="container">
                        <div className="main-footer pb-15 mb-30">
                            <div className="row">
                                <div className="col-lg-3 col-md-4 col-sm-6">
                                    <div className="footer-widget footer-col-1 mb-40">
                                        <div className="footer-logo mb-30">
                                            <Link href="/"><Image src="/assets/img/logo/logo1.png" alt="logo" width={isMobileMenu?150:auto } height={isMobileMenu?100:auto}/></Link>
                                        </div>
                                        <div className="footer-content">
                                            <p>BachatBzr is your go-to marketplace for <br />top-brand, second-hand products in great condition
                                                <br />  from fashion and shoes to accessories <br /> all at unbeatable prices.</p>
                                        </div>
                                        <div className="footer-content">
                                            <p>BachatBzr – Branded Deals, Second-Hand Steals</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-4 col-sm-6">
                                    <div className="footer-widget footer-col-2 ml-30 mb-40">
                                        <h4 className="footer-widget__title mb-30">Information</h4>
                                        <div className="footer-widget__links">
                                            <ul>
                                                <li><Link href="/contact">Custom Service</Link></li>
                                                <li><Link href="/faqs">FAQs</Link></li>
                                                <li><Link href="/track">Ordering Tracking</Link></li>
                                                <li><Link href="/contact">Contacts</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-4 col-sm-6">
                                    <div className="footer-widget footer-col-3 mb-40">
                                        <h4 className="footer-widget__title mb-30">My Account</h4>
                                        <div className="footer-widget__links">
                                            <ul>
                                                <li><Link href="/track">Delivery Information</Link></li>
                                                <li><Link href="/about">Privacy Policy</Link></li>
                                                <li><Link href="/contact">Custom Service</Link></li>
                                                <li><Link href="/about">Terms  Condition</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-2 col-md-4 col-sm-6">
                                    <div className="footer-widget footer-col-4 mb-40">
                                        <h4 className="footer-widget__title mb-30">Social Network</h4>
                                        <div className="footer-widget__links">
                                            <ul>
                                                <li><Link href="https://www.facebook.com/share/15jd1gX7CA/"><i className="fab fa-facebook-f" />Facebook</Link></li>
                                                <li><Link href="https://twitter.com/bachatbzr"><i className="fab fa-twitter" />Twitter</Link></li>
                                                <li><Link href="https://www.instagram.com/bachatbzr"><i className="fab fa-instagram" />Instagram</Link></li>
                                                <li><Link href="https://www.tiktok.com/@bachatbzr"><i className="fab fa-tiktok" />Tiktok</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-4">
                                    <div className="footer-widget footer-col-5 mb-40">
                                        <h4 className="footer-widget__title mb-30">Get Newsletter</h4>
                                        <p>Get on the list and get 10% off your first order!</p>
                                        <div className="footer-widget__newsletter">
                                            {/* <form action="#"> */}
                                                <input type="email" placeholder="Enter email address" className="SubscribeInput" />
                                                <button className="footer-widget__fw-news-btn tpsecondary-btn" onClick={handleSubscribe}>Subscribe Now<i className="fal fa-long-arrow-right" /></button>
                                            {/* </form> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="footer-cta pb-20">
                            <div className="row justify-content-between align-items-center">
                                <div className="col-xl-6 col-lg-4 col-md-4 col-sm-6">
                                    <div className="footer-cta__contact">
                                        <div className="footer-cta__icon">
                                            <i className="far fa-phone" />
                                        </div>
                                        <div className="footer-cta__text">
                                            <Link href="#">980. 029. 666. 99</Link>
                                            <span>Working 8:00 - 22:00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-8 col-md-8 col-sm-6">
                                <div className="footer-cta__contact">
                                        <div className="footer-cta__icon">
                                            <i className="far fa-phone" />
                                        </div>
                                        <div className="footer-cta__text">
                                            <Link href="#">contact@bachatbzr.com</Link>
                                            <span>Working 8:00 PM - 8:00 AM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-copyright footer-bg">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-6 col-lg-7 col-md-5 col-sm-12">
                                    <div className="footer-copyright__content">
                                        <span>Copyright {new Date().getFullYear()} <Link href="/">©BachatBzr</Link>. All rights reserved. Developed by Ismail Abbasi , Powered by BachatBzr.</span>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-lg-5 col-md-7 col-sm-12">
                                    <div className="footer-copyright__brand">
                                        <img src="/assets/img/footer/f-brand-icon-01.png" alt="footer-brand" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

        </>
    )
}
