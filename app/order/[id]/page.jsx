"use client"
import Layout from '@/components/layout/Layout'
import "@/public/assets/css/tailwind-cdn.css";
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'react-toastify'
import axios from 'axios'
import UserOrderDetailComponent from '@/components/user/UserOrderDetailsComponent'
import OrderDetailsSkeleton from '@/components/skeleton/orderDetailSkeleton'
import { supabase } from "@/lib/supabaseSetup";

const OrderDetail = () => {
    const { id } = useParams();
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true)

    const fetchOrderDetails = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`/api/orders/singleOrder?orderId=${id}`);
            if (response.data.success) {
                setOrderDetail(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to get order details");
            }
        } catch (error) {
            console.error(error.response.data.error.message);
            toast.error(`Something went wrong while fetching order details . ${error.response.data.error.message}`);
        } finally {
            setLoading(false)
        }
    }

    // Set up realtime subscription
    useEffect(() => {
        if (!id) return;

        // Initial fetch
        fetchOrderDetails();

        // Realtime subscription
        const channel = supabase
            .channel('order_changes')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${id}`
                },
                (payload) => {
                    setOrderDetail(payload.new);
                    toast.info("Some changes have been made to your order");
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, supabase]);

    return (
        <Layout headerStyle={3} footerStyle={1} headTitle={'OrderDetails - BacharBzr'}>
            {loading ? (
                <OrderDetailsSkeleton />
            ) : orderDetail ? (
                <UserOrderDetailComponent order={orderDetail} />
            ) : (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-gray-500">No order details found</p>
                </div>
            )}
        </Layout>
    )
}

export default OrderDetail