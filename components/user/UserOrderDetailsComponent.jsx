"use client";
import { useState } from "react";
import Image from "next/image";
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

  const [expandedProduct, setExpandedProduct] = useState(null);
  const router = useRouter();
  const formatAddress = (addressString) => {
    try {
      const address = JSON.parse(addressString);
      return (
        <div className="space-y-1">
          <p className="font-medium">
            {address.firstName} {address.lastName}
          </p>
          <p>{address.address}</p>
          <p>
            {address.apartment && `${address.apartment}, `}
            {address.city.city_name}
          </p>
          <p>
            {address.state}, {address.postcode}
          </p>
          <p>{address.country}</p>
          <p className="mt-2">Phone: {address.phone}</p>
          <p>Email: {address.email}</p>
        </div>
      );
    } catch {
      return <p>Address not available</p>;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

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
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

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
      className="min-h-screen w-full p-4 md:p-8 mt-3"
      style={{ backgroundColor: colorScheme.lightBg }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold mb-2 "
            style={{ color: colorScheme.primary }}
          >
            <div> Order #{order.id.substring(0, 8)}</div>
           
          </h1>
          <p className="text-gray-600">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-2">Order Status</h2>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.order_status)}
                    <span className="text-sm text-gray-500">
                      Last updated:{" "}
                      {new Date(order.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Payment</h2>
                  {getPaymentBadge(order.payment_status, order.payment_method)}
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2
                  className="text-lg font-semibold"
                  style={{ color: colorScheme.primary }}
                >
                  Products ({order.products.length})
                </h2>
              </div>

              <div className="divide-y">
                {order.productsDetails?.map((product, index) => (
                  <div key={product._id} className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="w-full md:w-32 h-32 relative rounded-lg overflow-hidden bg-gray-100">
                        {product.images?.length > 0 ? (
                          <Image
                            src={cleanImageUrl(product.images[0])}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 128px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {product.short_description}
                            </p>
                          </div>
                          <div className="text-right">
                            {product.discounted_price ? (
                              <>
                                <span className="font-medium">
                                  PKR{" "}
                                  {applyDiscount(
                                    product.price,
                                    product.discounted_price,
                                  ).toLocaleString()}
                                </span>
                                <span className="ml-2 text-sm line-through text-gray-500">
                                  PKR {product.price.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span className="font-medium">
                                PKR {product.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setExpandedProduct(
                              expandedProduct === index ? null : index,
                            )
                          }
                          className="mt-3 text-sm font-medium flex items-center"
                          style={{ color: colorScheme.primary }}
                        >
                          {expandedProduct === index
                            ? "Hide details"
                            : "View details"}
                          <svg
                            className={`ml-1 h-4 w-4 transform transition-transform ${
                              expandedProduct === index ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {expandedProduct === index && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <h4 className="font-medium mb-2">
                              Product Details
                            </h4>
                            <p className="text-sm text-gray-700 mb-2">
                              {product.long_description}
                            </p>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-500">
                                  Condition:
                                </span>{" "}
                                {product.product_condition}
                              </div>
                              <div>
                                <span className="text-gray-500">
                                  Categories:
                                </span>{" "}
                                {product.categories?.join(", ")}
                              </div>
                              <div>
                                <span className="text-gray-500">Tags:</span>{" "}
                                {product.tags?.join(", ") || "None"}
                              </div>
                              <div>
                                <span className="text-gray-500">Status:</span>{" "}
                                {product.sold ? "Sold" : "Available"}
                              </div>
                            </div>

                            {product.images?.length > 1 && (
                              <div className="mt-3">
                                <h4 className="font-medium mb-2">
                                  More Images
                                </h4>
                                <div className="flex gap-2 overflow-x-auto py-2">
                                  {product.images.slice(1).map((img, idx) => (
                                    <div
                                      key={idx}
                                      className="flex-shrink-0 w-20 h-20 relative rounded overflow-hidden bg-gray-100"
                                    >
                                      <Image
                                        src={cleanImageUrl(img)}
                                        alt={`${product.name} ${idx + 2}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Information Sidebar */}
          <div className="space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: colorScheme.primary }}
              >
                Delivery Address
              </h2>
              <div className="text-sm">
                {formatAddress(order.delivery_address)}
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: colorScheme.primary }}
              >
                Payment Summary
              </h2>

              <div className="space-y-3 text-sm">
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
                      <span className="text-gray-600">
                        Cash on Delivery Fee:
                      </span>
                      <span>
                        PKR{" "}
                        {order.total_amount.cash_on_delivery_fee.toLocaleString()}
                      </span>
                    </div>
                  )}

                <div className="border-t pt-3 mt-3 flex justify-between font-medium">
                  <span>Total:</span>
                  <span style={{ color: colorScheme.primary }}>
                    PKR{" "}
                    {order.total_amount?.final_total?.toLocaleString() || "0"}
                  </span>
                </div>

                {order.transaction_id && (
                  <div className="mt-4 pt-3 border-t">
                    <p className="text-gray-600">Transaction ID:</p>
                    <p className="font-mono text-sm break-all">
                      {order.transaction_id}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Help Card */}
            <div
              className="bg-white rounded-xl shadow-sm p-6"
              style={{ backgroundColor: colorScheme.secondary }}
            >
              <h2
                className="text-lg font-semibold mb-3"
                style={{ color: colorScheme.primary }}
              >
                Need Help?
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your order, please contact our
                customer support.
              </p>
              <button
                onClick={() => router.push("/contact")}
                className="w-full py-2 px-4 rounded-lg font-medium text-white hover:opacity-90 transition-opacity"
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
