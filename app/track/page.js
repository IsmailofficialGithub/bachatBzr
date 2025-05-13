"use client"
import Layout from "@/components/layout/Layout"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Track() {
    const router = useRouter();
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [isAutoFilled, setIsAutoFilled] = useState(false);

    // Extract order ID from URL hash when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.substring(1); // Remove the '#'
            if (hash) {
                setOrderId(hash);
                setIsAutoFilled(true);
            }
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your tracking logic here
        console.log('Tracking order:', orderId, 'with email:', email);
        // You would typically make an API call here to fetch order details
    };

    return (
        
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Track">
                <section className="track-area pt-80 pb-80">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-7">
                                <div className="tptrack__product">
                                    <div className="tptrack__thumb">
                                        <img src="/assets/img/banner/track-bg.jpg" alt="" />
                                    </div>
                                    <div className="tptrack__content grey-bg-3">
                                        <div className="tptrack__item d-flex mb-20">
                                            <div className="tptrack__item-icon">
                                                <img src="/assets/img/icon/track-1.png" alt="" />
                                            </div>
                                            <div className="tptrack__item-content">
                                                <h4 className="tptrack__item-title">Track Your Order</h4>
                                                <p>To track your order please enter your Order ID in the box below and press the "Track" button. This was  given to you on your receipt and in the confirmation email you should have received.</p>
                                            </div>
                                        </div>
                                        <div className="tptrack__id mb-10">
                                            <form action={'/user'}>
                                                <span><i className="fal fa-address-card" /></span>
                                                <input type="text" placeholder="Order ID" value={orderId} onChange={((e)=>{setOrderId(e.target.value)})}/>
                                            </form>
                                        </div>
                                        <div className="tptrack__email mb-10">
                                            <form action="#">
                                                <span><i className="fal fa-envelope" /></span>
                                                <input type="email" placeholder="Billing email" value={email} onChange={((e)=>{setEmail(e.target.value)})}/>
                                            </form>
                                        </div>
                                        <div className="tptrack__btn">
                                            <button className="tptrack__submition" onClick={handleSubmit}>Track Now<i className="fal fa-long-arrow-right" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </Layout>
        </>
    )
}