'use client'
import Layout from "@/components/layout/Layout"
import FilterShopBox from "@/components/shop/FilterShopBox"

export default function Shop() {
    // mobile-p-10 in spacing.css
  
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop">
                <div className="product-filter-area pt-65 pb-65 mobile-p-10">
                    <div className="container">
                        <FilterShopBox />
                    </div>
                </div>

            </Layout>
        </>
    )
}