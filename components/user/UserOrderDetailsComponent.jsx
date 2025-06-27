"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import theme from "@/data.js";
import { applyDiscount } from "@/lib/discountHandler";
import { useRouter } from "next/navigation";

const OrderDetailsPage = ({ order }) => {
  const { primary, secondary } = theme.color;

  const colorScheme = {
    primary: primary || "#d59243",
    secondary: secondary || "#f3eee7",
    accent: "#7a6f5d",
    text: "#333333",
    lightBg: "#f9f7f3",
  };


  const router = useRouter();
  
  const formatAddress = (addressString) => {
    try {
      const address = JSON.parse(addressString);
      return (
        <div className="space-y-1">
          <p className="font-medium text-sm">
            {address.firstName} {address.lastName}
          </p>
          <p className="text-sm">{address.address}</p>
          <p className="text-sm">
            {address.apartment && `${address.apartment}, `}
            {address.city.city_name}
          </p>
          <p className="text-sm">
            {address.state}, {address.postcode}
          </p>
          <p className="text-sm">{address.country}</p>
          <p className="mt-2 text-sm">Phone: {address.phone}</p>
          <p className="text-sm">Email: {address.email}</p>
        </div>
      );
    } catch {
      return <p className="text-sm">Address not available</p>;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Delivered
          </span>
        );
      case "shipped":
        return (
          <span className={`${baseClasses} bg-blue-100 text-blue-800`}>
            Shipped
          </span>
        );
      case "cancelled":
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            Cancelled
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status}
          </span>
        );
    }
  };

  const getPaymentBadge = (status, method) => {
    const baseClasses =
      "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";

    switch (status.toLowerCase()) {
      case "paid":
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            Paid ({method})
          </span>
        );
      case "pending":
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            Pending ({method})
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {status} ({method})
          </span>
        );
    }
  };

  const cleanImageUrl = (url) => {
    return url.replace(/^"+|"+$/g, "");
  };

  return (
    <div
      className="min-h-screen w-full p-2 sm:p-4 md:p-8 mt-3"
      style={{ backgroundColor: colorScheme.lightBg }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header - Optimized for small screens */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2"
            style={{ color: colorScheme.primary }}
          >
            Order #{order.id.substring(0, 8)}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Mobile-first layout - Stack everything on small screens */}
        <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
          {/* Order Status Card - Full width on mobile */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2">Order Status</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    {getStatusBadge(order.order_status)}
                    <span className="text-xs text-gray-500">
                      Updated: {new Date(order.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2">Payment</h2>
                  {getPaymentBadge(order.payment_status, order.payment_method)}
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
              <div className="p-3 sm:p-4 md:p-6 border-b">
                <h2
                  className="text-sm sm:text-base md:text-lg font-semibold"
                  style={{ color: colorScheme.primary }}
                >
                  Products ({order.products.length})
                </h2>
              </div>

              <div className="divide-y">
                {order.productsDetails?.map((product, index) => (
                  <div key={product._id} className="p-3 sm:p-4 md:p-6">
                    <div className="flex gap-3 sm:gap-4">
                      {/* Product Image - Smaller on mobile */}
                      <Link href={`/shop/${product._id}`} className="block">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 hover:opacity-80 transition-opacity">
                          {product.images?.length > 0 ? (
                            <Image
                              src={cleanImageUrl(product.images[0])}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 128px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <Link href={`/shop/${product._id}`}>
                              <h3 className="font-medium text-sm sm:text-base md:text-lg leading-tight hover:underline cursor-pointer" style={{ color: colorScheme.primary }}>
                                {product.name}
                              </h3>
                            </Link>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">
                              {product.short_description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            {product.discounted_price ? (
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                                <span className="font-medium text-sm sm:text-base">
                                  PKR{" "}
                                  {applyDiscount(
                                    product.price,
                                    product.discounted_price,
                                  ).toLocaleString()}
                                </span>
                                <span className="text-xs sm:text-sm line-through text-gray-500">
                                  PKR {product.price.toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <span className="font-medium text-sm sm:text-base">
                                PKR {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Stacked on mobile, sidebar on desktop */}
          <div className="space-y-4 sm:space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
              <h2
                className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4"
                style={{ color: colorScheme.primary }}
              >
                Delivery Address
              </h2>
              <div className="text-xs sm:text-sm">
                {formatAddress(order.delivery_address)}
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
              <h2
                className="text-sm sm:text-base md:text-lg font-semibold mb-3 sm:mb-4"
                style={{ color: colorScheme.primary }}
              >
                Payment Summary
              </h2>

              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>
                    PKR{" "}
                    {order.total_amount?.totalPrice?.toLocaleString() || "0"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee:</span>
                  <span>
                    PKR{" "}
                    {order.total_amount?.shipping_fee?.toLocaleString() || "0"}
                  </span>
                </div>

                {order.payment_method === "cash_on_delivery" &&
                  order.total_amount?.cash_on_delivery_fee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">COD Fee:</span>
                      <span>
                        PKR{" "}
                        {order.total_amount.cash_on_delivery_fee.toLocaleString()}
                      </span>
                    </div>
                  )}

                <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3 flex justify-between font-medium">
                  <span>Total:</span>
                  <span style={{ color: colorScheme.primary }}>
                    PKR{" "}
                    {order.total_amount?.final_total?.toLocaleString() || "0"}
                  </span>
                </div>

                {order.transaction_id && (
                  <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t">
                    <p className="text-gray-600 text-xs sm:text-sm">Transaction ID:</p>
                    <p className="font-mono text-xs break-all mt-1">
                      {order.transaction_id}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Help Card */}
            <div
              className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6"
              style={{ backgroundColor: colorScheme.secondary }}
            >
              <h2
                className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3"
                style={{ color: colorScheme.primary }}
              >
                Need Help?
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Questions about your order? Contact our support team.
              </p>
              <button
                onClick={() => router.push("/contact")}
                className="w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium text-white hover:opacity-90 transition-opacity text-xs sm:text-sm"
                style={{ backgroundColor: colorScheme.primary }}
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;