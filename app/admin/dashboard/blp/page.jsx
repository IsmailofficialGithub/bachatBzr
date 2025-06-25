"use client";
import React, { useState, useEffect } from "react";
import {
  Calendar,
  Package,
  Trash2,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";
import "@/public/assets/css/tailwind-cdn.css";
import DashboardWrapper from "@/app/components/DashboardWrapper";
import { toast } from "react-toastify";
import axios from "axios";

const BookedPacketsPage = () => {
  const [packets, setPackets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    status: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get default date range (last 14 days)
  const getDefaultDateRange = () => {
    const today = new Date();
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(today.getDate() - 14);

    return {
      fromDate: fourteenDaysAgo.toISOString().split("T")[0],
      toDate: today.toISOString().split("T")[0],
    };
  };

  // Initialize filters with default date range
  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    setFilters((prev) => ({
      ...prev,
      ...defaultRange,
    }));
  }, []);

  // Handle cancel packet (mock function)
  const handlecancel = async (trackingNumber) => {
    try {
      const response = await axios.post("/api/lapord/cancel-packet", {
        cn_numbers: trackingNumber,
      });

      if (response.data.success) {
        setPackets((prev) =>
          prev.map((p) =>
            p.tracking_number === trackingNumber
              ? { ...p, booked_packet_status: "Cancelled" }
              : p,
          ),
        );
        toast.success("Packet Cancelled successfully.");
      } else {
        toast.error("Failed to cancel packet. " + response.data.message);
        setError(
          "Failed to cancel packet. " + response.data.message,
        );
      }
    } catch (error) {
      console.log(error);
      setError("Failed to cancel packet. Please try again later.");
      toast.error("Failed to cancel packet. Please try again later.");
    }
  };

  // Fetch packets from API
  const fetchPackets = async (fromDate, toDate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/lapord/getBookedPackets?from_date=${fromDate}&to_date=${toDate}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch packets");
      }

      const data = await response.json();

      if (data.success && data.data) {
        setPackets(data.data);
      } else {
        throw new Error(data.error || "Failed to load packets");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching packets:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch packets when filters change
  useEffect(() => {
    if (filters.fromDate && filters.toDate) {
      fetchPackets(filters.fromDate, filters.toDate);
    }
  }, [filters.fromDate, filters.toDate]);

  // Filter packets by status
  const filteredPackets = packets.filter((packet) => {
    if (filters.status === "all") return true;
    return packet.booked_packet_status
      .toLowerCase()
      .includes(filters.status.toLowerCase());
  });

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pickup request not send":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in transit":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Reset to default date range
  const resetToDefault = () => {
    const defaultRange = getDefaultDateRange();
    setFilters((prev) => ({
      ...prev,
      ...defaultRange,
      status: "all",
    }));
  };

  return (
    <DashboardWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-indigo-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Booked Packets
                </h2>
                <p className="text-sm text-gray-500">
                  {filteredPackets.length} packets found
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button
                onClick={resetToDefault}
                className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Last 14 Days
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 p-4 border-t bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-black">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) =>
                      handleFilterChange("fromDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) =>
                      handleFilterChange("toDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pickup request not send">
                      Pickup Request Not Send
                    </option>
                    <option value="delivered">Delivered</option>
                    <option value="in transit">In Transit</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="text-gray-600">Loading packets...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="w-5 h-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Error: {error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Packets List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredPackets.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No packets found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your date range or filters.
                </p>
              </div>
            ) : (
              filteredPackets.map((packet) => (
                <div
                  key={packet.tracking_number}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Main Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">
                              {formatDate(packet.booking_date)}
                            </span>
                            <Calendar className="w-4 h-4 text-gray-400" />
                          </div>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                              packet.booked_packet_status,
                            )}`}
                          >
                            {packet.booked_packet_status}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-gray-900 font-medium">
                            Tracking: {packet.tracking_number}
                          </p>
                          <p className="text-sm text-gray-600">
                            {packet.consignment_address}
                          </p>
                          <p className="text-xs text-gray-500">
                            {packet.origin_city} → {packet.destination_city}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            window.open(
                              `/admin/dashboard/blp/details/${packet.tracking_number}`,
                              "_blank",
                            )
                          }
                          className="flex items-center justify-center px-3 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">View</span>
                        </button>

                        {packet.booked_packet_status !== "Cancelled" && (
                          <button
                            onClick={() => {
                              // cancel logic will be added later
                              handlecancel(packet.tracking_number);
                              console.log(
                                "cancel packet:",
                                packet.tracking_number,
                              );
                            }}
                            className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline ml-1">
                              Cancel
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardWrapper>
  );
};

export default BookedPacketsPage;
