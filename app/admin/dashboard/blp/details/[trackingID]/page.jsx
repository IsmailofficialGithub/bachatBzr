"use client";
import "@/public/assets/css/tailwind-cdn.css";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Search,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  Weight,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import axios from "axios";

export default function TrackPacket() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  // Call API on first render using tracking number from URL params
  useEffect(() => {
    const trackingNumberFromUrl = params?.trackingID;
    if (trackingNumberFromUrl) {
      setTrackingNumber(trackingNumberFromUrl);
      fetchTrackingData(trackingNumberFromUrl);
    }
  }, [params]);

  const fetchTrackingData = async (trackNum) => {
    setLoading(true);
    setError("");
    console.log(trackNum);

    try {
      const response = await axios.post("/api/lapord/track-Packet", {
        track_numbers: trackNum,
      });

      setData(response.data);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || "Failed to track packet";
      setError(message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (trackingNumber) {
      fetchTrackingData(trackingNumber);
    }
  };

  const getStatusColor = (status) => {
    if (status.toLowerCase().includes("delivered"))
      return "text-green-600 bg-green-50";
    if (
      status.toLowerCase().includes("transit") ||
      status.toLowerCase().includes("pickup")
    )
      return "text-blue-600 bg-blue-50";
    if (
      status.toLowerCase().includes("pending") ||
      status.toLowerCase().includes("not send")
    )
      return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getStatusIcon = (status) => {
    if (status.toLowerCase().includes("delivered"))
      return <CheckCircle className="w-4 h-4" />;
    if (status.toLowerCase().includes("transit"))
      return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Tracking Your Packet
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Please wait while we fetch your tracking information...
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Tracking:{" "}
            <span className="font-mono font-medium">{trackingNumber}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-3 sm:p-4 bg-blue-600 rounded-full">
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            Package Tracking
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Tracking Number:{" "}
            <span className="font-mono font-medium text-blue-600">
              {trackingNumber}
            </span>
          </p>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm sm:text-base">{error}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {data && (
          <div className="space-y-4">
            {data.status === 1 && data.packet_list ? (
              data.packet_list.map((packet, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  {/* Status Header */}
                  <div
                    className={`p-3 sm:p-4 ${getStatusColor(
                      packet.booked_packet_status,
                    )} border-b`}
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(packet.booked_packet_status)}
                      <span className="font-medium text-sm sm:text-base">
                        {packet.booked_packet_status}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    {/* Tracking Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">
                          Track Number
                        </div>
                        <div className="font-mono font-bold text-sm sm:text-base text-gray-800">
                          {packet.track_number}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs sm:text-sm text-gray-600 mb-1">
                          Booking Date
                        </div>
                        <div className="font-medium text-sm sm:text-base text-gray-800">
                          {packet.booking_date}
                        </div>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-sm sm:text-base text-gray-800">
                          Route Information
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="text-center sm:text-left">
                            <div className="text-xs text-gray-600">FROM</div>
                            <div className="font-medium text-sm text-blue-600">
                              {packet.origin_city_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {packet.origin_country_name}
                            </div>
                          </div>
                          <div className="hidden sm:block">
                            <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"></div>
                          </div>
                          <div className="text-center sm:text-right">
                            <div className="text-xs text-gray-600">TO</div>
                            <div className="font-medium text-sm text-green-600">
                              {packet.destination_city_name}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 sm:mb-6">
                      <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <Weight className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs text-gray-600">Weight</div>
                        <div className="font-medium text-xs sm:text-sm">
                          {packet.booked_packet_weight} kg
                        </div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <Package className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs text-gray-600">Pieces</div>
                        <div className="font-medium text-xs sm:text-sm">
                          {packet.booked_packet_no_piece}
                        </div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs text-gray-600">Amount</div>
                        <div className="font-medium text-xs sm:text-sm">
                          ₨{packet.booked_packet_collect_amount}
                        </div>
                      </div>
                      <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                        <Package className="w-4 h-4 mx-auto mb-1 text-gray-600" />
                        <div className="text-xs text-gray-600">ID</div>
                        <div className="font-medium text-xs sm:text-sm">
                          {packet.track_number_short}
                        </div>
                      </div>
                    </div>

                    {/* Sender & Receiver Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Sender */}
                      <div className="border rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-sm sm:text-base text-gray-800">
                            Sender
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-sm sm:text-base text-gray-800">
                            {packet.shipment_name_eng}
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {packet.shipment_phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {packet.shipment_email}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {packet.shipment_address}
                          </div>
                        </div>
                      </div>

                      {/* Receiver */}
                      <div className="border rounded-lg p-3 sm:p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-sm sm:text-base text-gray-800">
                            Receiver
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="font-medium text-sm sm:text-base text-gray-800">
                            {packet.consignment_name_eng}
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            {packet.consignment_phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            {packet.consignment_email}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            {packet.consignment_address}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {packet.special_instructions && (
                      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="font-medium text-sm sm:text-base text-yellow-800 mb-1">
                          Special Instructions
                        </div>
                        <div className="text-xs sm:text-sm text-yellow-700">
                          {packet.special_instructions}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 sm:mt-6 text-center">
  <button
    onClick={() => {
      const slipUrl = `https://merchantapi.leopardscourier.com/api/booked_packet_slip_api/${packet.track_number}?api_key_secure=NDg3RjdCMjJGNjgzMTJEMkMxQkJDOTNCMUFFQTQ0NUIxNzQ4NzAwODA1&api_key_password_secure=NjU0OTYw`;
      window.open(slipUrl, '_blank');
    }}
    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
  >
    <Package className="w-4 h-4" />
    View Booking Slip
  </button>
</div>
                  </div>
                </div>
              ))
              
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
                <div className="p-3 sm:p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                  No Packet Found
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {data.error ||
                    "Please check your tracking details and try again."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
