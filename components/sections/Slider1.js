// 'use client'
// import { Autoplay, Navigation, Pagination } from "swiper/modules"
// import { Swiper, SwiperSlide } from "swiper/react"

// const swiperOptions = {
//     modules: [Autoplay, Pagination, Navigation],
//     slidesPerView: 1,
//     spaceBetween: 30,
//     autoplay: {
//         delay: 102500,
//     },

//     // Navigation
//     navigation: {
//         nextEl: '.h1n',
//         prevEl: '.h1p',
//     },

//     // Pagination
//     pagination: {
//         el: '.slider-pagination',
//         clickable: true,
//     },

// }

// import Link from "next/link"

// export default function Slider1() {
//     return (
//         <>
//             <section className="slider-area pb-25">
//                 <div className="container">
//                     <div className="row justify-content-xl-end">
//                         <div className="col-xl-9 col-xxl-7 col-lg-9">
//                             <div className="tp-slider-area p-relative">
//                                 <div className="swiper-container slider-active">
//                                     <Swiper {...swiperOptions}>
//                                         <SwiperSlide>
//                                             <div className="tp-slide-item">
//                                                 <div className="tp-slide-item__content">
//                                                     <h4 className="tp-slide-item__sub-title">Shoes</h4>
//                                                     <h3 className="tp-slide-item__title mb-25"> Up To
//                                                         <i> 60% Off
//                                                             <img src="/assets/img/icon/title-shape-02.jpg" alt="" />
//                                                         </i>

//                                                         Latest Creations
//                                                     </h3>
//                                                     <Link className="tp-slide-item__slide-btn tp-btn" href="/shop">Shop Now <i className="fal fa-long-arrow-right" /></Link>
//                                                 </div>
//                                                 <div className="tp-slide-item__img">
//                                                     <img src="/assets/img/slider/banner-1.jpg" alt="" />
//                                                 </div>
//                                             </div>
//                                         </SwiperSlide>
//                                         <SwiperSlide>
//                                             <div className="tp-slide-item">
//                                                 <div className="tp-slide-item__content">
//                                                     <h4 className="tp-slide-item__sub-title">T-Shirts</h4>
//                                                     <h3 className="tp-slide-item__title mb-25">Up To <i>35% Off <img src="/assets/img/icon/title-shape-02.jpg" alt="" /></i> latest
//                                                         Creations</h3>
//                                                     <Link className="tp-slide-item__slide-btn tp-btn" href="/shop">Shop Now <i className="fal fa-long-arrow-right" /></Link>
//                                                 </div>
//                                                 <div className="tp-slide-item__img">
//                                                     <img src="/assets/img/slider/banner-1.png" alt="" />
//                                                 </div>
//                                             </div>
//                                         </SwiperSlide>
//                                         <SwiperSlide>
//                                             <div className="tp-slide-item">
//                                                 <div className="tp-slide-item__img">
//                                                     <img src="/assets/img/slider/banner-3.png" alt="" />
//                                                 </div>
//                                             </div>
//                                         </SwiperSlide>
//                                     </Swiper>
//                                 </div>
//                                 <div className="slider-pagination" />
//                             </div>
//                         </div>

//                         <div className="col-xl-3 col-xxl-3 col-lg-3">
//                             <div className="row">
//                                 <div className="col-lg-12 col-md-6">
//                                     <div className="tpslider-banner tp-slider-sm-banner mb-30">
//                                         <Link href="/shop">
//                                             <div className="tpslider-banner__img">
//                                                 <img src="/assets/img/slider/banner-slider-01.jpg" alt="" />
//                                                 <div className="tpslider-banner__content">
//                                                     <span className="tpslider-banner__sub-title">Hand made</span>
//                                                     <h4 className="tpslider-banner__title">New Modern  Stylist <br /> Crafts</h4>
//                                                 </div>
//                                             </div>
//                                         </Link>
//                                     </div>
//                                 </div>
//                                 <div className="col-lg-12 col-md-6">
//                                     <div className="tpslider-banner">
//                                         <Link href="/shop">
//                                             <div className="tpslider-banner__img">
//                                                 <img src="/assets/img/slider/banner-slider-02.jpg" alt="" />
//                                                 <div className="tpslider-banner__content">
//                                                     <span className="tpslider-banner__sub-title">Popular</span>
//                                                     <h4 className="tpslider-banner__title">Energy with our <br /> newest
//                                                         collection</h4>
//                                                 </div>
//                                             </div>
//                                         </Link>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </>
//     )
// }

"use client";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 1,
  spaceBetween: 30,
  autoplay: {
    delay: 3000,
  },

  // Navigation
  navigation: {
    nextEl: ".h1n",
    prevEl: ".h1p",
  },

  // Pagination
  pagination: {
    el: ".slider-pagination",
    clickable: true,
  },

  // Add callbacks to reset animations
  on: {
    slideChangeTransitionStart: function () {
      // Remove animation classes from all slides
      const slides = document.querySelectorAll(".swiper-slide");
      slides.forEach((slide) => {
        slide.classList.remove("swiper-slide-active");
        const elements = slide.querySelectorAll(
          ".tp-slide-item__sub-title, .tp-slide-item__title, .tp-slide-item__slide-btn",
        );
        elements.forEach((el) => {
          el.style.animation = "none";
        });
      });
    },
    slideChangeTransitionEnd: function () {
      // Re-trigger animations on active slide
      const activeSlide = document.querySelector(".swiper-slide-active");
      if (activeSlide) {
        const subTitle = activeSlide.querySelector(".tp-slide-item__sub-title");
        const title = activeSlide.querySelector(".tp-slide-item__title");
        const btn = activeSlide.querySelector(".tp-slide-item__slide-btn");

        if (subTitle) {
          subTitle.style.animation = "fadeInUp 0.8s both";
          subTitle.style.animationDelay = "0.6s";
        }
        if (title) {
          title.style.animation = "fadeInUp 1s both";
          title.style.animationDelay = "0.8s";
        }
        if (btn) {
          btn.style.animation = "fadeInUp 1.2s both";
          btn.style.animationDelay = "1s";
        }
      }
    },
  },
};

import Link from "next/link";

export default function Slider1() {
  return (
    <>
      <section className="slider-area pb-25">
        <div className="container">
          <div className="row justify-content-xl-end">
            <div className="col-xl-9 col-xxl-7 col-lg-9">
              <div className="tp-slider-area p-relative">
                <div className="swiper-container slider-active">
                  <Swiper {...swiperOptions}>
                    <SwiperSlide>
                      <div className="tp-slide-item">
                        <div className="tp-slide-item__img">
                          <img src="/assets/img/slider/banner-1.jpg" alt="" />
                        </div>
                        <div className="tp-slide-item__content">
                          <h4 className="tp-slide-item__sub-title">Shoes</h4>
                          <h3 className="tp-slide-item__title mb-25">
                            {" "}
                            Up To
                            <i>
                              {" "}
                              60% Off
                              <img
                                src="/assets/img/icon/title-shape-02.jpg"
                                alt=""
                              />
                            </i>
                            Latest Creations
                          </h3>
                          <Link
                            className="tp-slide-item__slide-btn tp-btn"
                            href="/shop"
                          >
                            Shop Now <i className="fal fa-long-arrow-right" />
                          </Link>
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="tp-slide-item">
                        <div className="tp-slide-item__content">
                          <h4 className="tp-slide-item__sub-title">T-Shirts</h4>
                          <h3 className="tp-slide-item__title mb-25">
                            Up To{" "}
                            <i>
                              35% Off{" "}
                              <img
                                src="/assets/img/icon/title-shape-02.jpg"
                                alt=""
                              />
                            </i>{" "}
                            latest Creations
                          </h3>
                          <Link
                            className="tp-slide-item__slide-btn tp-btn"
                            href="/shop"
                          >
                            Shop Now <i className="fal fa-long-arrow-right" />
                          </Link>
                        </div>
                        <div className="tp-slide-item__img">
                          <img src="/assets/img/slider/banner-1.png" alt="" />
                        </div>
                      </div>
                    </SwiperSlide>
                    <SwiperSlide>
                      <div className="tp-slide-item">
                        <div className="tp-slide-item__content">
                          <h4 className="tp-slide-item__sub-title">
                            Accessories
                          </h4>
                          <h3 className="tp-slide-item__title mb-25">
                            Up To{" "}
                            <i>
                              50% Off{" "}
                              <img
                                src="/assets/img/icon/title-shape-02.jpg"
                                alt=""
                              />
                            </i>{" "}
                            Premium Collection
                          </h3>
                          <Link
                            className="tp-slide-item__slide-btn tp-btn"
                            href="/shop"
                          >
                            Shop Now <i className="fal fa-long-arrow-right" />
                          </Link>
                        </div>
                        <div className="tp-slide-item__img">
                          <img src="/assets/img/slider/banner-3.png" alt="" />
                        </div>
                      </div>
                    </SwiperSlide>
                  </Swiper>
                </div>
                <div className="slider-pagination" />
              </div>
            </div>

            <div className="col-xl-3 col-xxl-3 col-lg-3">
              <div className="row">
                <div className="col-lg-12 col-md-6">
                  <div className="tpslider-banner tp-slider-sm-banner mb-30">
                    <Link href="/shop">
                      <div className="tpslider-banner__img">
                        <img
                          src="/assets/img/slider/banner-slider-01.jpg"
                          alt=""
                        />
                        <div className="tpslider-banner__content">
                          <span className="tpslider-banner__sub-title">
                            Hand made
                          </span>
                          <h4 className="tpslider-banner__title">
                            New Modern Stylist <br /> Crafts
                          </h4>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className="col-lg-12 col-md-6">
                  <div className="tpslider-banner">
                    <Link href="/shop">
                      <div className="tpslider-banner__img">
                        <img
                          src="/assets/img/slider/banner-slider-02.jpg"
                          alt=""
                        />
                        <div className="tpslider-banner__content">
                          <span className="tpslider-banner__sub-title">
                            Popular
                          </span>
                          <h4 className="tpslider-banner__title">
                            Energy with our <br /> newest collection
                          </h4>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
