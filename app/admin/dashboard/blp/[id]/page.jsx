// i can chnage something ,i want if order cannot find then user cannot book packet and it show other compoent invaied or order not found compoent , so main compoenet is load when order api is called successfully then check that order packet_tracking_id is null or empty or not if not empty then other component that packet already booked

"use client";
import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import "@/public/assets/css/tailwind-cdn.css";
import { useForm } from "react-hook-form";
import {
  Loader2,
  Package,
  User,
  MapPin,
  Settings,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { applyDiscount } from "@/lib/discountHandler";

// new
import OrderNotFound from '@/components/admin/OrderNotFound';
import PacketAlreadyBooked from '@/components/admin/PacketAlreadyBooked';
import { getAccessToken } from "@/util/getAccessToken";
// new

const LeopardsCourierForm = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [destinitionCityID, setDestinitionCityID] = useState(null);
  const [orderId, setOrderId] = useState("");
  // new

  const [orderNotFound, setOrderNotFound] = useState(false);
const [packetAlreadyBooked, setPacketAlreadyBooked] = useState(false);
const [trackingId, setTrackingId] = useState(null);
  // new

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      origin_city: "self",
      destination_city: "",
      shipment_name_eng: "self",
      shipment_email: "self",
      shipment_phone: "self",
      shipment_address: "self",
      shipment_type: "overnight",
      is_vpc: false,
      pieces: 1,
      collection_amount: 0,
    },
  });

  // Get order ID from URL params or search params
  useEffect(() => {
    const id =
      params?.id || searchParams?.get("orderId") || searchParams?.get("id");
    if (id) {
      setOrderId(id);
    }
  }, [params, searchParams]);

//  new

const fetchOrderDetail = async (orderIdToFetch) => {
  if (!orderIdToFetch) return;

  setIsLoadingOrder(true);
  setOrderNotFound(false);
  setPacketAlreadyBooked(false);
  setTrackingId(null);
  
  try {
    const response = await fetch(
      `/api/orders/singleOrder?orderId=${orderIdToFetch}`,
    );
    const data = await response.json();

    if (data.success && data.data) {
      // Check if packet is already booked
      console.log(data.data)
      if (data.data.packet_tracking_id && data.data.packet_tracking_id.trim() !== "") {
        setPacketAlreadyBooked(true);
        setTrackingId(data.data.packet_tracking_id);
        setOrderDetails(data);
        return;
      }

      // Order found and not booked yet - proceed normally
      setOrderDetails(data);
      const Delivery = JSON.parse(data.data.delivery_address);
      setDestinitionCityID(Delivery.city.city_id);
      populateFormFromOrder(data.data);
    } else {
      // Order not found
      setOrderNotFound(true);
      setSubmitStatus({ type: "error", message: "Order details not found" });
    }
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    setOrderNotFound(true);
    setSubmitStatus({
      type: "error",
      message: "Failed to fetch order details",
    });
  } finally {
    setIsLoadingOrder(false);
  }
};

const handleRetry = () => {
  setOrderNotFound(false);
  setPacketAlreadyBooked(false);
  setTrackingId(null);
  setOrderId("");
};
//  new
  // Populate form with order data
  const populateFormFromOrder = (orderData) => {
    try {
      // Parse delivery address
      const deliveryAddress = JSON.parse(orderData.delivery_address);

      // Calculate total weight (estimate 500g per product)
      const estimatedWeight = orderData.products.length * 500;

      // Set form values from order data
      setValue("weight", estimatedWeight);
      setValue("pieces", orderData.products.length);
      setValue("collection_amount", orderData.total_amount.final_total);
      setValue("shipment_id", Math.floor(Math.random() * 1000000)); // Generate random shipment ID

      // Destination city - you might need to map city names to city IDs
      setValue("destination_city", deliveryAddress.city.city_name || "");

      // Receiver information
      setValue(
        "receiver_name",
        orderData.Receiver ||
          `${deliveryAddress.firstName} ${deliveryAddress.lastName}`,
      );
      setValue(
        "receiver_phone",
        orderData.phone?.toString() || deliveryAddress.phone,
      );
      setValue("receiver_email", deliveryAddress.email || "");
      setValue(
        "receiver_address",
        `${deliveryAddress.address}, ${deliveryAddress.city.city_name}, ${deliveryAddress.state} ${deliveryAddress.postcode}`,
      );

      // Order ID as reference
      setValue("order_id", orderData.id);

      // Special instructions with product details
      const productNames = orderData.products.map((p) => p.name).join(", ");
      setValue(
        "special_instructions",
        `Order contains: ${productNames}. Payment method: ${orderData.payment_method}`,
      );

      // Custom data with order info
      const customData = [
        {
          order_id: orderData.id,
          payment_method: orderData.payment_method,
          total_products: orderData.products.length,
          order_status: orderData.order_status,
        },
      ];
      setValue("custom_data", JSON.stringify(customData));
    } catch (error) {
      console.error("Error parsing order data:", error);
      setSubmitStatus({ type: "error", message: "Error parsing order data" });
    }
  };
  // update tracking id in order 
  const updateTrackingId = async (trackNumber,orderId) => {
    if(!trackNumber || !orderId) {
      toast.error("Track number and Order ID are required to update tracking.");
      return;
    }
    const token=await getAccessToken()
    const response=await axios.patch("/api/orders/update-book-packet", {
      track_number: trackNumber,
      orderId: orderId,
    },{
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    });
    if(!response.data.success) {
      return toast.error("Failed to update tracking ID.");
    }
  }

  // Load order on component mount if orderId is available
  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    setApiResponse(null);

    try {
      let processedData = { ...data };

      // Handle custom_data JSON parsing
      if (data.custom_data && data.custom_data.trim()) {
        try {
          processedData.custom_data = JSON.parse(data.custom_data);
        } catch (e) {
          throw new Error("Invalid JSON format in Custom Data field");
        }
      } else {
        processedData.custom_data = [];
      }

      // Convert numeric fields to match API expectations
      [
        "weight",
        "pieces",
        "collection_amount",
        "shipment_id",
        "return_city",
        "vol_weight_w",
        "vol_weight_h",
        "vol_weight_l",
      ].forEach((field) => {
        if (processedData[field]) {
          processedData[field] = parseInt(processedData[field]);
        }
      });

      // Clean up undefined values
      Object.keys(processedData).forEach((key) => {
        if (processedData[key] === undefined || processedData[key] === "") {
          delete processedData[key];
        }
      });
      processedData.destination_city = destinitionCityID;
      const token=await getAccessToken()
      const response = await axios.post(
        "/api/lapord/bookPacket",
        JSON.stringify(processedData),
        {
            headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        }
      );
      if (response.data.error === 0) {
        updateTrackingId(response.data.track_number,orderId);
        reset();
        toast.success("Booking submitted successfully!");
        setSubmitStatus({
          type: "success",
          message: "Booking submitted successfully!",
        });
      } else {
        toast.error("Failed to submit booking");
        throw new Error(response.data.error || "Failed to submit booking");
      }
      console.log(response.data)
      setApiResponse(response.data);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to submit booking. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );

  const InputField = ({
    label,
    name,
    type = "text",
    required = false,
    placeholder,
    className = "",
    helpText,
    readOnly = false, // Add this prop
    ...props
  }) => (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        readOnly={readOnly} // Add this attribute
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          errors[name] ? "border-red-300" : "border-gray-300"
        } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`} // Add readonly styling
        {...register(name, {
          required: required ? `${label} is required` : false,
          ...(type === "email" && {
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
          }),
        })}
        {...props}
      />
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

  const SelectField = ({
    label,
    name,
    required = false,
    options,
    className = "",
    helpText,
    ...props
  }) => (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={name}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          errors[name] ? "border-red-300" : "border-gray-300"
        }`}
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

  const TextareaField = ({
    label,
    name,
    required = false,
    placeholder,
    className = "",
    rows = 3,
    helpText,
    readOnly = false, // Add this prop
  }) => (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        readOnly={readOnly} // Add this attribute
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
          errors[name] ? "border-red-300" : "border-gray-300"
        } ${readOnly ? "bg-gray-100 cursor-not-allowed" : ""}`} // Add readonly styling
        {...register(name, {
          required: required ? `${label} is required` : false,
        })}
      />
      {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

  const CheckboxField = ({ label, name, ...props }) => (
    <div className="flex items-center">
      <input
        id={name}
        type="checkbox"
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        {...register(name)}
        {...props}
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  );

  // new
  if (orderNotFound) {
  return <OrderNotFound orderId={orderId} onRetry={handleRetry} />;
}

if (packetAlreadyBooked) {
  return <PacketAlreadyBooked orderDetails={orderDetails} trackingId={trackingId} />;
}
  // new

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Leopards Courier Booking
          </h1>
          <p className="text-gray-600">
            Complete the form below to book your courier package
          </p>
        </div>

        {/* Order ID Input */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center mb-4">
            <ShoppingCart className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">
              Load Order Data
            </h3>
          </div>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Order ID to auto-fill form"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
            <button
              type="button"
              onClick={() => fetchOrderDetail(orderId)}
              disabled={isLoadingOrder || !orderId}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoadingOrder ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Load Order
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        {orderDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-3">
              Order Summary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Order ID:</strong> {orderDetails.data.id}
                </p>
                <p>
                  <strong>Customer:</strong> {orderDetails.data.Receiver}
                </p>
                <p>
                  <strong>Phone:</strong> {orderDetails.data.phone}
                </p>
                <p>
                  <strong>Total Amount:</strong> Rs{" "}
                  {orderDetails.data.total_amount.final_total}
                </p>
              </div>
              <div>
                <p>
                  <strong>Products:</strong> {orderDetails.data.products.length}{" "}
                  items
                </p>
                <p>
                  <strong>Payment Method:</strong>{" "}
                  {orderDetails.data.payment_method}
                </p>
                <p>
                  <strong>Status:</strong> {orderDetails.data.order_status}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(orderDetails.data.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p>
                <strong>Products:</strong>
              </p>
              <ul className="list-disc list-inside text-sm text-blue-700">
                {orderDetails.data.products.map((product, index) => (
                  <li key={index}>
                    {product.name} - RS{" "}
                    {product.discounted_price
                      ? applyDiscount(product.price, product.discounted_price)
                      : product.price}{" "}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {submitStatus && (
          <div
            className={`mb-6 p-4 rounded-md flex items-center ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {submitStatus.type === "success" ? (
              <CheckCircle className="w-5 h-5 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-2" />
            )}
            {submitStatus.message}
          </div>
        )}

        {apiResponse && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              API Response:
            </h4>
            <pre className="text-xs text-blue-700 bg-blue-100 p-2 rounded overflow-auto">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
               <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={() => {
                  const slipUrl = `https://merchantapi.leopardscourier.com/api/booked_packet_slip_api/${apiResponse.track_number}?api_key_secure=NDg3RjdCMjJGNjgzMTJEMkMxQkJDOTNCMUFFQTQ0NUIxNzQ4NzAwODA1&api_key_password_secure=NjU0OTYw`;
                  window.open(slipUrl, '_blank');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Package className="w-4 h-4" />
                View Booking Slip
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Required Package Details */}
          <FormSection title="Package Details (Required)" icon={Package}>
            <InputField
              label="Weight"
              name="weight"
              type="number"
              required
              placeholder="Enter weight in grams"
              helpText="Weight in grams (auto-calculated: 500g per product)"
            />
            <InputField
              label="Number of Pieces"
              name="pieces"
              type="number"
              required
              placeholder="1"
              helpText="Number of pieces (auto-filled from order products)"
            />
            <InputField
              label="Collection Amount"
              name="collection_amount"
              type="number"
              placeholder="0"
              helpText="COD amount (auto-filled from order total)"
              readOnly={!!orderDetails}
            />
            <InputField
              label="Shipment ID"
              name="shipment_id"
              type="number"
              required
              placeholder="Enter shipment ID"
              helpText="Required integer ID (auto-generated)"
              readOnly={!!orderDetails}
            />
            <InputField
              label="Order ID"
              name="order_id"
              placeholder="Enter order ID (optional)"
              helpText="Auto-filled from order data"
              readOnly={!!orderDetails}
            />
            <SelectField
              label="Shipment Type"
              name="shipment_type"
              options={[
                { value: "overnight", label: "Overnight" },
                { value: "same_day", label: "Same Day" },
                { value: "express", label: "Express" },
              ]}
              helpText="Default: overnight"
            />
          </FormSection>

          {/* Volume Weight (Optional) */}
          <FormSection title="Volume Weight (Optional)" icon={Package}>
            <InputField
              label="Width"
              name="vol_weight_w"
              type="number"
              placeholder="Enter width"
              helpText="Width for volume calculation"
            />
            <InputField
              label="Height"
              name="vol_weight_h"
              type="number"
              placeholder="Enter height"
              helpText="Height for volume calculation"
            />
            <InputField
              label="Length"
              name="vol_weight_l"
              type="number"
              placeholder="Enter length"
              helpText="Length for volume calculation"
            />
            <div className="flex items-center">
              <CheckboxField
                label="VPC (Value Protection Coverage)"
                name="is_vpc"
              />
            </div>
          </FormSection>

          {/* Cities (Required) */}
          <FormSection title="Cities (Required)" icon={MapPin}>
            <InputField
              label="Origin City"
              name="origin_city"
              placeholder="self"
              helpText="Use 'self' or city ID"
            />
            <InputField
              label="Destination City"
              name="destination_city"
              required
              placeholder="Enter city ID or 'self'"
              helpText="Auto-filled from order address"
              readOnly={!!orderDetails}
            />
          </FormSection>

          {/* Receiver Information (Required) */}
          <FormSection title="Receiver Information (Required)" icon={MapPin}>
            <InputField
              label="Receiver Name"
              name="receiver_name"
              required
              placeholder="Enter receiver name"
              helpText="Auto-filled from order data"
              readOnly={!!orderDetails}
            />
            <InputField
              label="Receiver Phone"
              name="receiver_phone"
              required
              placeholder="Enter receiver phone"
              helpText="Auto-filled from order data"
              readOnly={!!orderDetails}
            />
            <InputField
              label="Receiver Email"
              name="receiver_email"
              type="email"
              placeholder="Enter receiver email (optional)"
              helpText="Auto-filled from order data"
              readOnly={!!orderDetails}
            />
            <InputField
              label="Receiver Phone 2"
              name="receiver_phone2"
              placeholder="Enter alternate phone (optional)"
              helpText="Optional secondary phone"
              readOnly={!!orderDetails}
            />
            <InputField
              label="Receiver Phone 3"
              name="receiver_phone3"
              placeholder="Enter third phone (optional)"
              helpText="Optional third phone"
              readOnly={!!orderDetails}
            />
            <TextareaField
              label="Receiver Address"
              name="receiver_address"
              readOnly={!!orderDetails}
              required
              placeholder="Enter complete receiver address"
              className="md:col-span-2"
              helpText="Auto-filled from order delivery address"
            />
          </FormSection>

          {/* Additional Information (Optional) */}
          <FormSection
            title="Additional Information (Optional)"
            icon={Settings}
          >
            <InputField
              label="Return City ID"
              name="return_city"
              type="number"
              placeholder="Enter return city ID"
              helpText="Optional: defaults to origin city"
            />
            <TextareaField
              label="Return Address"
              name="return_address"
              placeholder="Enter return address"
              className="md:col-span-2"
              helpText="Optional: defaults to shipper address"
            />
            <TextareaField
              label="Special Instructions"
              name="special_instructions"
              placeholder="Enter any special delivery instructions"
              className="md:col-span-2"
              helpText="Auto-filled with product details"
            />
            <TextareaField
              label="Custom Data (JSON Array)"
              name="custom_data"
              placeholder='[{"key": "value"}, {"priority": "high"}]'
              className="md:col-span-2"
              rows={4}
              helpText="Auto-filled with order metadata"
            />
          </FormSection>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeopardsCourierForm;




