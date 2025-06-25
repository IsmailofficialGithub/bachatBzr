"use client"
import { useState, useEffect } from 'react';
import theme from '@/data.js';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchAuthSession } from '@/features/auth/authSlice';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { applyDiscount } from '@/lib/discountHandler';
import { supabase } from '@/lib/supabase';

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
        return 'Credit/Debit Card';
      case 'cash_on_delivery':
        return 'Cash on Delivery';
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
    // Subscribe to changes in the orders table for this user
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
          // Handle different types of changes
          handleOrderChange(payload);
        }
      )
      .subscribe();

    return subscription;
  };

  const handleOrderChange = (payload) => {
    switch (payload.eventType) {
      case 'INSERT':
        // New order added
        setOrders(prev => [...prev, payload.new]);
        break;
      case 'UPDATE':
        // Order updated
        setOrders(prev => prev.map(order => 
          order.id === payload.new.id ? payload.new : order
        ));
        break;
      case 'DELETE':
        // Order deleted
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
      <div className="min-h-screen w-full p-4 md:p-8 flex items-center justify-center" 
           style={{ backgroundColor: colorScheme.lightBg }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" 
             style={{ borderColor: colorScheme.primary }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 md:p-8" style={{ backgroundColor: colorScheme.lightBg }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colorScheme.primary }}>My Orders</h1>
          <p className="text-gray-600">View your order history and track shipments</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link href="/shop">
              <button 
                className="px-6 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colorScheme.primary }}
              >
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const deliveryAddress = order.delivery_address ? JSON.parse(order.delivery_address) : null;
              
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 md:p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center" 
                       style={{ backgroundColor: colorScheme.secondary }}>
                    <div className="mb-3 md:mb-0">
                      <h3 className="font-medium" style={{ color: colorScheme.primary }}>
                        Order #{order.id.substring(0, 8)}...
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                        {order.payment_status}
                      </span>
                      {order.transaction_id && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          {order.transaction_id.substring(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="p-4 md:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Products Section */}
                      <div>
                        <h4 className="font-medium mb-3" style={{ color: colorScheme.accent }}>Products</h4>
                        <div className="space-y-4">
                          {order.products.map((product, index) => (
                            <div key={index} className="flex items-start">
                              <div className="flex-1">
                                <p className="font-medium">{product.name}</p>

                                  {
                                    product.discounted_price ?(
                                      <div className="flex items-center mt-1">
                                      <p className="text-sm text-gray-600 mr-2">
                                    PKR {applyDiscount(product.price,product.discounted_price).toFixed(2)}
                                  </p>
                                   <span className="text-xs line-through text-gray-400">
                                   PKR {product.price.toFixed(2)}
                                 </span>
                                    </div>
                                    ):
                                    <div className="flex items-center mt-1">
                                    <p className="text-sm text-gray-600 mr-2">
                                  PKR {applyDiscount(product.price,product.discounted_price).toFixed(2)}
                                </p></div>
                                  }
                                  
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  PKR {product.discounted_price 
                                    ? (applyDiscount(product.price,product.discounted_price))
                                    : (product.price )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Details Section */}
                      <div>
                        <h4 className="font-medium mb-3" style={{ color: colorScheme.accent }}>Order Details</h4>
                        
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Delivery Address</h5>
                          {deliveryAddress ? (
                            <div className="text-sm">
                              <p>{deliveryAddress.firstName} {deliveryAddress.lastName}</p>
                              <p>{deliveryAddress.address}</p>
                              <p>{deliveryAddress.city.city_name}, {deliveryAddress.state}</p>
                              <p>{deliveryAddress.country}, {deliveryAddress.postcode}</p>
                              <p className="mt-1">Phone: {deliveryAddress.phone}</p>
                              <p>Email: {deliveryAddress.email}</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No address provided</p>
                          )}
                        </div>

                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h5>
                          <p className="text-sm">{getPaymentMethodText(order.payment_method)}</p>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium text-gray-500 mb-1">Order Summary</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>PKR {order.total_amount?.totalPrice?.toFixed(2) || '0.00'}</span>
                            </div>
                            {order.total_amount?.shipping_fee && (
                              <div className="flex justify-between">
                                <span>Shipping Fee:</span>
                                <span>PKR {order.total_amount.shipping_fee.toFixed(2)}</span>
                              </div>
                            )}
                            {order.total_amount?.cash_on_delivery_fee && (
                              <div className="flex justify-between">
                                <span>COD Fee:</span>
                                <span>PKR {order.total_amount.cash_on_delivery_fee.toFixed(2)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-medium pt-2 mt-2 border-t">
                              <span>Total:</span>
                              <span style={{ color: colorScheme.primary }}>
                                PKR {order.total_amount?.final_total?.toFixed(2) || '0.00'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="p-4 md:p-6 border-t flex justify-end">
                    <Link href={`/order/${order.id}`}>
                      <button 
                        className="px-6 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: colorScheme.primary }}
                      >
                       Details
                      </button>
                      </Link>
                      <Link href={`/track#${order.id}`}>
                      <button 
                        className="px-6 py-2 mx-1 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: colorScheme.webtheme }}
                      >
                       Track
                      </button>
                      </Link>
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