"use client";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const swiperOptions = {
  modules: [Autoplay, Pagination, Navigation],
  slidesPerView: 6,
  spaceBetween: 25,
  autoplay: {
    delay: 3500,
  },
  breakpoints: {
    1400: {
      slidesPerView: 6,
    },
    1200: {
      slidesPerView: 5,
    },
    992: {
      slidesPerView: 4,
    },
    768: {
      slidesPerView: 3,
    },
    576: {
      slidesPerView: 2,
    },
    0: {
      slidesPerView: 1,
    },
  },
};
const imagesData = [
  {
    Imageurl: "/assets/img/instagram/post1.jpeg",
    redirectUrl: "https://www.instagram.com/p/DMm28w_Nvhi/",
  },
  {
    Imageurl: "/assets/img/instagram/post2.jpeg",
    redirectUrl: "https://www.instagram.com/p/DMmwaG2N9fe/",
  },
  {
    Imageurl: "/assets/img/instagram/post3.jpeg",
    redirectUrl: "https://www.instagram.com/p/DMsK0cUtOaP",
  },
  {
    Imageurl: "/assets/img/instagram/post4.jpeg",
    redirectUrl: "https://www.instagram.com/p/DMmxBhgtpML/",
  },
  {
    Imageurl: "/assets/img/instagram/post5.jpeg",
    redirectUrl: "https://www.instagram.com/p/DMpdcYQNxW0/",
  },
  {
    Imageurl: "/assets/img/instagram/post6.jpeg",
    redirectUrl: "https://www.instagram.com/p/DMpXaL3N90Q/",
  },
];

export default function Shop() {
  return (
    <>
      <section className="shop-area pb-100">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="tpsectionarea text-center mb-35">
                <h5 className="tpsectionarea__subtitle">Follow On</h5>
                <h4 className="tpsectionarea__title">
                  <i className="fab fa-instagram" />{" "}
                  <a href="https://www.instagram.com/bachatbzr" target="_black">
                    {" "}
                    Instagram
                  </a>{" "}
                </h4>
              </div>
            </div>
          </div>
          <div className="shopareaitem">
            <div className="shopslider-active swiper-container">
              <Swiper {...swiperOptions}>
                {imagesData.map((image, index) => (
                  <SwiperSlide className="tpshopitem" key={index}>
                    <Link href={image.redirectUrl} legacyBehavior>
                      <a
                        className="popup-image"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={image.Imageurl} alt="shop-thumb" />
                      </a>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
