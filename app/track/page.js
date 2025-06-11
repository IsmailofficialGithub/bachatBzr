"use client"
import Layout from "@/components/layout/Layout"
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
export default function Track() {
    const router = useRouter();
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [orderDetail, setOrderDetail] = useState([])
    const [loading, setLoading] = useState(false)
    const [isAutoFilled, setIsAutoFilled] = useState(false);


    const gettingOrderDetails=async()=>{
        setLoading(true)
        if(!orderId || orderId === ""){
            return toast.error("Order Id is required");
        }
        try {
            const response=await axios.post('/api/lapord/shipment',{
                shipment_order_id:[orderId]
            })
            if(response.data.success){
          setOrderDetail(response.data.order);
            }else{
                toast.error(`Failed to get order details . ${response.data.message || response.data.error || ""}`)
            }
            
        } catch (error) {
            console.log('error',error)
        }finally{
            setLoading(false)
        }
    }

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
gettingOrderDetails();
      
    };

    return (
        
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Track">
                <section className="track-area pt-3 pb-3">
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
                                        <div className={`tptrack__btn ${!orderId || !email ? 'hidden' : ''}`}>
                                            <button className={`tptrack__submition `} onClick={handleSubmit} disabled={!orderId || !email}>Track Now {loading?<i class="fas fa-spinner fa-spin"></i>:<i className="fal fa-long-arrow-right " />}</button>
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