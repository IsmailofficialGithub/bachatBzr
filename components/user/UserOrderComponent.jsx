// components/OrderPage.js
"use client"
import { useState } from 'react';
import theme from '@/data.js';

const OrderPage = () => {
  const { primary, secondary } = theme.color;

  // Enhanced color palette
  const colorScheme = {
    primary: primary || '#d59243',
    secondary: secondary || '#f3eee7',
    accent: '#7a6f5d',
    text: '#333333',
    lightBg: '#f9f7f3'
  };

  // Sample order data
  const [orders, setOrders] = useState([
    {
      id: '#ORD-78945',
      date: '2023-06-15',
      status: 'Delivered',
      items: 3,
      total: 149.99,
      products: [
        { name: 'Wireless Headphones', price: 89.99, quantity: 1 },
        { name: 'Phone Case', price: 25.00, quantity: 2 }
      ]
    },
    {
      id: '#ORD-78123',
      date: '2023-06-10',
      status: 'Shipped',
      items: 2,
      total: 75.50,
      products: [
        { name: 'Smart Watch', price: 65.50, quantity: 1 },
        { name: 'Screen Protector', price: 10.00, quantity: 1 }
      ]
    },
    {
      id: '#ORD-77654',
      date: '2023-05-28',
      status: 'Cancelled',
      items: 1,
      total: 42.99,
      products: [
        { name: 'Bluetooth Speaker', price: 42.99, quantity: 1 }
      ]
    }
  ]);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen w-full p-4 md:p-8" style={{ backgroundColor: colorScheme.lightBg }}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: colorScheme.primary }}>My Orders</h1>
          <p className="text-gray-600">View your order history and track shipments</p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Order List Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b" style={{ backgroundColor: colorScheme.secondary }}>
            <div className="col-span-3 font-medium" style={{ color: colorScheme.accent }}>Order ID</div>
            <div className="col-span-2 font-medium" style={{ color: colorScheme.accent }}>Date</div>
            <div className="col-span-2 font-medium" style={{ color: colorScheme.accent }}>Items</div>
            <div className="col-span-2 font-medium" style={{ color: colorScheme.accent }}>Total</div>
            <div className="col-span-2 font-medium" style={{ color: colorScheme.accent }}>Status</div>
            <div className="col-span-1"></div>
          </div>

          {/* Order List */}
          {orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">You haven't placed any orders yet.</p>
              <button 
                className="mt-4 px-6 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: colorScheme.primary }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border-b last:border-b-0">
                {/* Order Summary */}
                <div 
                  className="grid grid-cols-2 md:grid-cols-12 gap-4 p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrderDetails(order.id)}
                >
                  <div className="col-span-2 md:col-span-3">
                    <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Order ID</div>
                    <div className="font-medium" style={{ color: colorScheme.primary }}>{order.id}</div>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Date</div>
                    <div>{new Date(order.date).toLocaleDateString()}</div>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Items</div>
                    <div>{order.items}</div>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Total</div>
                    <div>${order.total.toFixed(2)}</div>
                  </div>
                  <div className="col-span-2 md:col-span-2">
                    <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Status</div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="col-span-2 md:col-span-1 flex justify-end">
                    <button 
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOrderDetails(order.id);
                      }}
                    >
                      <svg 
                        className={`h-5 w-5 transform transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Order Details - Collapsible */}
                {expandedOrder === order.id && (
                  <div className="px-4 pb-4 md:px-6 md:pb-6">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="hidden md:grid grid-cols-12 gap-4 p-3 border-b" style={{ backgroundColor: colorScheme.secondary }}>
                        <div className="col-span-6 font-medium" style={{ color: colorScheme.accent }}>Product</div>
                        <div className="col-span-2 font-medium text-right" style={{ color: colorScheme.accent }}>Price</div>
                        <div className="col-span-2 font-medium text-right" style={{ color: colorScheme.accent }}>Quantity</div>
                        <div className="col-span-2 font-medium text-right" style={{ color: colorScheme.accent }}>Subtotal</div>
                      </div>
                      
                      {order.products.map((product, index) => (
                        <div key={index} className="grid grid-cols-2 md:grid-cols-12 gap-4 p-3 border-b last:border-b-0">
                          <div className="col-span-2 md:col-span-6">
                            <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Product</div>
                            <div>{product.name}</div>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Price</div>
                            <div className="text-right">${product.price.toFixed(2)}</div>
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Qty</div>
                            <div className="text-right">{product.quantity}</div>
                          </div>
                          <div className="col-span-2 md:col-span-2">
                            <div className="md:hidden text-xs font-medium" style={{ color: colorScheme.accent }}>Subtotal</div>
                            <div className="text-right font-medium">
                              ${(product.price * product.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="p-3 border-t">
                        <div className="flex justify-end">
                          <div className="grid grid-cols-2 gap-4 w-full md:w-1/3">
                            <div className="text-right font-medium" style={{ color: colorScheme.accent }}>Subtotal:</div>
                            <div className="text-right">${order.total.toFixed(2)}</div>
                            <div className="text-right font-medium" style={{ color: colorScheme.accent }}>Shipping:</div>
                            <div className="text-right">$0.00</div>
                            <div className="text-right font-medium" style={{ color: colorScheme.accent }}>Tax:</div>
                            <div className="text-right">$0.00</div>
                            <div className="text-right font-bold text-lg" style={{ color: colorScheme.primary }}>Total:</div>
                            <div className="text-right font-bold text-lg">${order.total.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
                      <button 
                        className="px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        style={{ borderColor: colorScheme.primary, color: colorScheme.primary }}
                      >
                        Track Order
                      </button>
                      <button 
                        className="px-4 py-2 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: colorScheme.primary }}
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderPage;