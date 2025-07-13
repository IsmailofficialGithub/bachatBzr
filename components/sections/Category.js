import Image from "next/image";
import Link from "next/link";
import theme from '@/data'
export default function Category() {
  const categories = [
    {
      title: "Shoes",
      subTitle: "Men Sport",
      link: "/category/shoes",
      imgSrc: "/assets/img/svg/shoes.svg",
      count: 2,
    },
    {
      title: "T-Shirts",
      subTitle: "Casual Wear",
      link: "/category/tshirt",
      imgSrc: "/assets/img/svg/tshirt.svg",
      count: 5,
    },
    {
      title: "Hoodies",
      subTitle: "Winter Collection",
      link: "/category/hoodie",
      imgSrc: "/assets/img/svg/hoodie.svg",
      count: 3,
    },
    {
      title: "Tracksuits",
      subTitle: "Athletic Fit",
      link: "/category/tracksuit",
      imgSrc: "/assets/img/svg/tracksuit.svg",
      count: 10,
    },
    {
      title: "Sneakers",
      subTitle: "Trendy & Comfortable",
      link: "/category/sneakers",
      imgSrc: "/assets/img/svg/sneakers.svg",
      count: 1,
    },
    {
      title: "Kids Sneakers",
      subTitle: "Trendy & Comfortable",
      link: "/category/kids Shoes",
      imgSrc: "/assets/img/svg/sneakers.svg",
      count: 1,
    },
  ];

  return (
    <>
      <section className="category-area pt-70 bg-green-500" style={{ backgroundColor: theme.color.primary,borderRadius:"13px"}}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="tpsection mb-40">
                <h4 className="tpsection__title">
                  Top{" "}
                  <span className="text-green-600" style={{ color: theme.color.secondary }}>
                    {" "}
                    Categories{" "}
                    <img src="/assets/img/icon/title-shape-01.jpg" alt="" />
                  </span>
                </h4>
              </div>
            </div>
          </div>
          <div className="custom-row category-border pb-45 justify-content-xl-between">
            {categories.map((category, index) => (
              <div key={index} className="tpcategory mb-40">
                    <Link href={category.link}>

                <div className="tpcategory__icon p-relative">
                  <Image src={category.imgSrc} alt="" className="fn__svg" width={60} height={60}/>
                  <span>{category.count}</span>
                </div>
                </Link>
                <div className="tpcategory__content">
                  <h5 className="tpcategory__title">
                    <Link href={category.link}>
                      {category.title} <br /> {category.subTitle}
                    </Link>
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
