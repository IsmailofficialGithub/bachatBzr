'use client'
import Layout from "@/components/layout/Layout"
import FilterShopBox from "@/components/shop/FilterShopBox"

export default function Shop() {
  
    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Shop">
                <div className="product-filter-area pt-65 pb-80">
                    <div className="container">
                        <FilterShopBox />
                    </div>
                </div>

            </Layout>
        </>
    )
}