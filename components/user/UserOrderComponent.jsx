"use client"
import { useState, useEffect } from 'react';
import theme from '@/data.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchAuthSession } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { applyDiscount } from '@/lib/discountHandler';
import { supabase } from "@/lib/supabaseSetup";

const OrderPage = () => {
  const { primary, secondary } = theme.color;
  const dispatch = useDispatch();

  const colorScheme = {
    primary: primary || '#d59243',
    secondary: secondary || '#f3eee7',
    accent: '#7a6f5d',
    text: '#333333',
    lightBg: '#f9f7f3',
    webtheme: "#d51243"
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'card':
        return 'Card';
      case 'cash_on_delivery':
        return 'COD';
      default:
        return method;
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await dispatch(fetchAuthSession());
        if (response.payload?.user) {
          const userid = response.payload.user.id;
          setUserId(userid);
          await gettingOrders(userid);
          setupRealtimeSubscription(userid);
        }
      } catch (error) {
        toast.error("Failed to fetch user session");
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  const setupRealtimeSubscription = (userid) => {
    const subscription = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${userid}`
        },
        (payload) => {
          handleOrderChange(payload);
        }
      )
      .subscribe();

    return subscription;
  };

  const handleOrderChange = (payload) => {
    switch (payload.eventType) {
      case 'INSERT':
        setOrders(prev => [...prev, payload.new]);
        break;
      case 'UPDATE':
        setOrders(prev => prev.map(order => 
          order.id === payload.new.id ? payload.new : order
        ));
        break;
      case 'DELETE':
        setOrders(prev => prev.filter(order => order.id !== payload.old.id));
        break;
      default:
        break;
    }
  };

  const gettingOrders = async (userid) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/orders/user/${userid}`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data?.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full p-2 sm:p-4 flex items-center justify-center" 
           style={{ backgroundColor: colorScheme.lightBg }}>
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2" 
             style={{ borderColor: colorScheme.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-2 sm:p-4 md:p-8" style={{ backgroundColor: colorScheme.lightBg }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2" 
              style={{ color: colorScheme.primary }}>
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">Track your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 md:p-8 text-center">
            <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">No orders yet.</p>
            <Link href="/shop">
              <button 
                className="px-4 sm:px-6 py-2 rounded-md sm:rounded-lg font-medium text-white hover:opacity-90 transition-opacity text-sm sm:text-base"
                style={{ backgroundColor: colorScheme.primary }}
              >
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {orders.map((order) => {
              const deliveryAddress = order.delivery_address ? JSON.parse(order.delivery_address) : null;
              
              return (
                <div key={order.id} className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
                  {/* Order Header - Simplified */}
                  <div className="p-3 sm:p-4 md:p-6 border-b" 
                       style={{ backgroundColor: colorScheme.secondary }}>
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm sm:text-base truncate" 
                            style={{ color: colorScheme.primary }}>
                          #{order.id.substring(0, 6)}...
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right ml-2">
                        <p className="font-bold text-sm sm:text-base" style={{ color: colorScheme.primary }}>
                          PKR {order.total_amount?.final_total?.toFixed(0) || '0'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getPaymentMethodText(order.payment_method)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Pills */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                      <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                    </div>
                  </div>

                  {/* Order Content - Simplified */}
                  <div className="p-3 sm:p-4 md:p-6">
                    {/* Products Section - Compact */}
                    <div className="mb-4">
                      <h4 className="font-medium text-sm sm:text-base mb-2 sm:mb-3" 
                          style={{ color: colorScheme.accent }}>
                        Items ({order.products.length})
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        {order.products.slice(0, 2).map((product, index) => (
                          <div key={index} className="flex justify-between items-start">
                            <div className="flex-1 min-w-0 mr-2">
                              <p className="font-medium text-xs sm:text-sm truncate">{product.name}</p>
                              <p className="text-xs text-gray-500">Qty: 1</p>
                            </div>
                            <div className="text-right">
                              {product.discounted_price ? (
                                <div>
                                  <p className="font-medium text-xs sm:text-sm">
                                    PKR {applyDiscount(product.price, product.discounted_price).toFixed(0)}
                                  </p>
                                  <span className="text-xs line-through text-gray-400">
                                    PKR {product.price.toFixed(0)}
                                  </span>
                                </div>
                              ) : (
                                <p className="font-medium text-xs sm:text-sm">
                                  PKR {product.price.toFixed(0)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {order.products.length > 2 && (
                          <p className="text-xs sm:text-sm text-gray-500 italic">
                            +{order.products.length - 2} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info - Minimal */}
                    {deliveryAddress && (
                      <div className="mb-4">
                        <h5 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Delivery To:</h5>
                        <p className="text-xs sm:text-sm">
                          {deliveryAddress.firstName} - {deliveryAddress.city?.city_name || deliveryAddress.city}
                        </p>
                        <p className="text-xs text-gray-500">{deliveryAddress.phone}</p>
                      </div>
                    )}
                  </div>

                  {/* Order Footer - Compact */}
                  <div className="px-3 py-2 sm:p-4 md:p-6 border-t bg-gray-50">
                    <div className="flex gap-2">
                      <Link href={`/order/${order.id}`} className="flex-1">
                        <button 
                          className="w-full px-3 sm:px-4 py-2 rounded-md sm:rounded-lg font-medium text-white hover:opacity-90 transition-opacity text-xs sm:text-sm"
                          style={{ backgroundColor: colorScheme.primary }}
                        >
                          Details
                        </button>
                      </Link>
                      <Link href={`/track#${order.id}`} className="flex-1">
                        <button 
                          className="w-full px-3 sm:px-4 py-2 rounded-md sm:rounded-lg font-medium text-white hover:opacity-90 transition-opacity text-xs sm:text-sm"
                          style={{ backgroundColor: colorScheme.webtheme }}
                        >
                          Track
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;