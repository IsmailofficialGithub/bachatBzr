"use client"
import React, { useEffect, useState } from "react";
import { TrackingLoaderComponent } from "@/components/loader/trackOrderComponent";
import { useRouter } from "next/navigation";
import { RouteTracker } from "@/components/track/RouteTracker";
import Layout from "@/components/layout/Layout";
import axios from "axios";

export default function Track() {
    const router = useRouter();
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAutoFilled, setIsAutoFilled] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Extract order ID from URL hash when component mounts
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hash = window.location.hash.substring(1);
            if (hash) {
                setOrderId(hash);
                setIsAutoFilled(true);
            }
        }
    }, []);

    const gettingOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/orders/leopard-track', {
                order_id: orderId,
                customer_email: email // Optional: for additional verification
            });

            if (response.data.status === 1 && response.data.tracking_data) {
                // Successfully got tracking data
                setOrderDetail({
                    ...response.data.tracking_data,
                    order_info: response.data.order_data,
                    api_status: 'available'
                });
            } else {
                // Handle different error scenarios
                const errorData = {
                    track_number: `ORD-${orderId}`,
                    booking_date: new Date().toLocaleDateString(),
                    origin_city_name: "Store Location",
                    destination_city_name: "Delivery Location",
                    activity_date: new Date().toLocaleDateString(),
                    order_info: response.data.order_data || null,
                    api_status: response.data.order_status || 'error',
                    error_message: response.data.error,
                    retry_after: response.data.retry_after
                };

                // Customize based on error type
                switch (response.data.order_status) {
                    case 'pending_dispatch':
                        errorData.booked_packet_status = 'Order Received';
                        errorData["Tracking Detail"] = [
                            {
                                "Status": "Order Confirmed",
                                "Activity Date": new Date().toISOString().split('T')[0],
                                "Reason": "Your order has been confirmed and is being prepared for dispatch"
                            }
                        ];
                        break;
                    case 'delivery_partner_unavailable':
                        errorData.booked_packet_status = 'Service Unavailable';
                        errorData["Tracking Detail"] = [
                            {
                                "Status": "Service Temporarily Unavailable",
                                "Activity Date": new Date().toISOString().split('T')[0],
                                "Reason": "Delivery partner service is currently unavailable. Please check back later."
                            }
                        ];
                        break;
                    case 'tracking_unavailable':
                        errorData.booked_packet_status = 'Tracking Pending';
                        errorData["Tracking Detail"] = [
                            {
                                "Status": "Dispatched",
                                "Activity Date": new Date().toISOString().split('T')[0],
                                "Reason": "Package has been dispatched. Tracking information will be available soon."
                            }
                        ];
                        break;
                    default:
                        // Set default mock data for unknown errors
                        errorData.booked_packet_status = 'Pending';
                        errorData["Tracking Detail"] = [
                            {
                                "Status": "Order Processing",
                                "Activity Date": new Date().toISOString().split('T')[0],
                                "Reason": "Your order is being processed"
                            }
                        ];
                        break;
                }

                setOrderDetail(errorData);
            }
            setShowResults(true);

        } catch (error) {
            console.error('Error tracking order:', error);
            
            // Show error state with mock data
            setOrderDetail({
                track_number: `ORD-${orderId}`,
                booking_date: new Date().toLocaleDateString(),
                booked_packet_status: 'Connection Error',
                origin_city_name: "Store Location",
                destination_city_name: "Delivery Location",
                activity_date: new Date().toLocaleDateString(),
                api_status: 'network_error',
                error_message: 'Unable to connect to tracking service',
                "Tracking Detail": [
                    {
                        "Status": "Connection Error",
                        "Activity Date": new Date().toISOString().split('T')[0],
                        "Reason": "Unable to connect to tracking service. Please try again later."
                    }
                ]
            });
            setShowResults(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!orderId || !email) {
            alert('Please enter both Order ID and Email');
            return;
        }
        gettingOrderDetails();
    };

    const resetForm = () => {
        setShowResults(false);
        setOrderDetail(null);
        setOrderId('');
        setEmail('');
    };

    return (
        <>
            <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Track">
                <section className="track-area pt-3 pb-3">
                    <div className="container">
                        <div className="row justify-content-center">
                            {!showResults ? (
                                <div className="col-12 col-md-8 col-lg-7">
                                    {/* Original tracking form with mobile improvements */}
                                    <div className="tptrack__product">
                                        <div className="tptrack__thumb d-none d-md-block">
                                            <img src="/assets/img/banner/track-bg.jpg" alt="" />
                                        </div>
                                        <div className="tptrack__content grey-bg-3">
                                            <div className="tptrack__item d-flex mb-3 mb-md-4">
                                                <div className="tptrack__item-icon me-3">
                                                    <img src="/assets/img/icon/track-1.png" alt="" />
                                                </div>
                                                <div className="tptrack__item-content">
                                                    <h4 className="tptrack__item-title fs-5 fs-md-4">Track Your Order</h4>
                                                    <p className="small">To track your order please enter your Order ID in the box below and press the "Track" button. This was given to you on your receipt and in the confirmation email you should have received.</p>
                                                </div>
                                            </div>
                                            <div className="tptrack__id mb-3">
                                                <form>
                                                    <div className="position-relative">
                                                        <span className="position-absolute start-0 top-50 translate-middle-y ms-3">
                                                            <i className="fal fa-address-card" />
                                                        </span>
                                                        <input 
                                                            type="text" 
                                                            className="form-control ps-5"
                                                            placeholder="Order ID" 
                                                            value={orderId} 
                                                            onChange={(e) => setOrderId(e.target.value)}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="tptrack__email mb-3">
                                                <form>
                                                    <div className="position-relative">
                                                        <span className="position-absolute start-0 top-50 translate-middle-y ms-3">
                                                            <i className="fal fa-envelope" />
                                                        </span>
                                                        <input 
                                                            type="email" 
                                                            className="form-control ps-5"
                                                            placeholder="Billing email" 
                                                            value={email} 
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            disabled={loading}
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                            <div className={`tptrack__btn ${!orderId || !email ? 'd-none' : ''}`}>
                                                <button 
                                                    className="tptrack__submition w-100 w-md-auto" 
                                                    onClick={handleSubmit} 
                                                    disabled={!orderId || !email || loading}
                                                >
                                                    Track Now {loading ? 
                                                        <i className="fas fa-spinner fa-spin ms-2" /> : 
                                                        <i className="fal fa-long-arrow-right ms-2" />
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : loading ? (
                                <div className="col-12">
                                    <TrackingLoaderComponent />
                                </div>
                            ) : (
                                <div className="col-12">
                                    <RouteTracker trackingData={orderDetail} />
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
}