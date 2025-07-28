"use client"

import React, { useEffect } from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import Link from "next/link"

export default function Slider1() {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: { perView: 1, spacing: 30 },
    created: (slider) => {
      animateSlide(0)
      // Start autoplay after creation
      let timeout
      let mouseOver = false
      
      const clearNextTimeout = () => {
        clearTimeout(timeout)
      }
      
      const nextTimeout = () => {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
          slider.next()
        }, 3000) // 3 second delay
      }
      
      slider.on("created", () => {
        nextTimeout()
      })
      
      slider.on("dragStarted", clearNextTimeout)
      slider.on("animationEnded", nextTimeout)
      slider.on("updated", nextTimeout)
      
      // Pause on hover
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true
        clearNextTimeout()
      })
      
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false
        nextTimeout()
      })
    },
    slideChanged(slider) {
      resetAnimations()
      animateSlide(slider.track.details.rel)
    },
  })

  const resetAnimations = () => {
    const elements = document.querySelectorAll(
      ".tp-slide-item__sub-title, .tp-slide-item__title, .tp-slide-item__slide-btn"
    )
    elements.forEach((el) => {
      el.style.animation = "none"
      // Force reflow to reset animation
      el.offsetHeight
    })
  }

  const animateSlide = (index) => {
    // Add a small delay to ensure DOM is ready
    setTimeout(() => {
      const slides = document.querySelectorAll(".keen-slider__slide")
      const activeSlide = slides[index]
      if (!activeSlide) return

      const subTitle = activeSlide.querySelector(".tp-slide-item__sub-title")
      const title = activeSlide.querySelector(".tp-slide-item__title")
      const btn = activeSlide.querySelector(".tp-slide-item__slide-btn")

      if (subTitle) {
        subTitle.style.animation = "fadeInUp 0.8s both"
        subTitle.style.animationDelay = "0.6s"
      }
      if (title) {
        title.style.animation = "fadeInUp 1s both"
        title.style.animationDelay = "0.8s"
      }
      if (btn) {
        btn.style.animation = "fadeInUp 1.2s both"
        btn.style.animationDelay = "1s"
      }
    }, 50)
  }

  // Add CSS for fadeInUp animation
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translate3d(0, 100%, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <section className="slider-area pb-25">
      <div className="container">
        <div className="row justify-content-xl-end">
          <div className="col-xl-9 col-xxl-7 col-lg-9">
            <div className="tp-slider-area p-relative">
              <div ref={sliderRef} className="keen-slider">
                {/* sliders */}
                <div className="keen-slider__slide">
                  <div className="tp-slide-item">
                    <div className="tp-slide-item__content">
                      <h4 className="tp-slide-item__sub-title">T-Shirts</h4>
                      <h3 className="tp-slide-item__title mb-25">
                        Up To {''}
                        <i>
                          35% Off {''}
                          <img src="/assets/img/icon/title-shape-02.jpg" alt="" />
                        </i>
                        Latest Creations
                      </h3>
                      <Link className="tp-slide-item__slide-btn tp-btn" href="/category/tshirt">
                        Shop Now <i className="fal fa-long-arrow-right" />
                      </Link>
                    </div>
                    <div className="tp-slide-item__img">
                      <img src="/assets/img/slider/banner-1.png" alt="" />
                    </div>
                  </div>
                </div>
                <div className="keen-slider__slide">
                  <div className="tp-slide-item">
                    <div className="tp-slide-item__content">
                      <h4 className="tp-slide-item__sub-title">Shoes</h4>
                      <h3 className="tp-slide-item__title mb-25">
                        Up To {""}
                        <i>
                          50% Off {''}
                          <img src="/assets/img/icon/title-shape-02.jpg" alt="" />
                        </i>
                        Premium Collection
                      </h3>
                      <Link className="tp-slide-item__slide-btn tp-btn" href="/category/shoes">
                        Shop Now <i className="fal fa-long-arrow-right" />
                      </Link>
                    </div>
                    <div className="tp-slide-item__img">
                      <img src="/assets/img/slider/banner-3.png" alt="" />
                    </div>
                  </div>
                </div>
                <div className="keen-slider__slide">
                  <div className="tp-slide-item">
                    <div className="tp-slide-item__img">
                      <img src="/assets/img/slider/banner-2.png" alt="" />
                    </div>
                    <div className="tp-slide-item__content">
                      <h4 className="tp-slide-item__sub-title">Fashion</h4>
                      <h3 className="tp-slide-item__title mb-25">
                        Up To {''}
                        <i>
                          60% Off {''}
                          <img src="/assets/img/icon/title-shape-02.jpg" alt="" />
                        </i>
                        Latest Creations
                      </h3>
                      <Link className="tp-slide-item__slide-btn tp-btn" href="/shop">
                        Shop Now <i className="fal fa-long-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-xxl-3 col-lg-3">
            <div className="row">
              <div className="col-lg-12 col-md-6">
                <div className="tpslider-banner tp-slider-sm-banner mb-30">
                  <Link href="/category/tshirt">
                    <div className="tpslider-banner__img">
                      <img src="/assets/img/slider/banner-slider-01.jpeg" alt="" />
                      <div className="tpslider-banner__content">
                        <span className="tpslider-banner__sub-title">Brand New</span>
                        <h4 className="tpslider-banner__title" style={{color:'#FFFAE6'}}>
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
                      <img src="/assets/img/slider/banner-slider-02.png" alt="banner-slider" />
                      <div className="tpslider-banner__content">
                        <span className="tpslider-banner__sub-title">Popular</span>
                        <h4 className="tpslider-banner__title" style={{color:'#FFFAE6'}}>
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
  )
}