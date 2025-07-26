"use client"
import "@/public/assets/css/tailwind-cdn.css"

import React from 'react';
import { Package, MapPin, Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react';

export const RouteTracker = ({ trackingData }) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case 'out for delivery':
        return <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />;
      case 'in transit':
      case 'dispatched':
        return <Package className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      case 'order received':
      case 'order confirmed':
      case 'pending':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'out for delivery':
        return 'bg-blue-500';
      case 'in transit':
      case 'dispatched':
        return 'bg-yellow-500';
      case 'order received':
      case 'order confirmed':
      case 'pending':
        return 'bg-gray-500';
      default:
        return 'bg-orange-500';
    }
  };

  const getProgressPercentage = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 100;
      case 'out for delivery':
        return 85;
      case 'in transit':
        return 60;
      case 'dispatched':
        return 40;
      case 'order confirmed':
        return 20;
      default:
        return 10;
    }
  };

  // Parse delivery address from JSON string or object
  const parseDeliveryAddress = (deliveryAddress) => {
    try {
      const address = typeof deliveryAddress === 'string' 
        ? JSON.parse(deliveryAddress) 
        : deliveryAddress;
      
      return {
        fullName: `${address.firstName || ''} ${address.lastName || ''}`.trim(),
        cityName: address.city?.city_name || address.city || 'Unknown City',
        fullAddress: `${address.address || ''} ${address.apartment || ''}`.trim(),
        phone: address.phone || '',
        email: address.email || '',
        postcode: address.postcode || '',
        country: address.country || ''
      };
    } catch (error) {
      console.error('Error parsing delivery address:', error);
      return {
        fullName: 'Customer',
        cityName: 'Unknown City',
        fullAddress: 'Address not available',
        phone: '',
        email: '',
        postcode: '',
        country: ''
      };
    }
  };

  const deliveryInfo = trackingData.order_info?.delivery_address 
    ? parseDeliveryAddress(trackingData.order_info.delivery_address)
    : null;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mt-4 sm:mt-8 mx-2 sm:mx-0">
      {/* API Status Alert */}
      {trackingData.api_status !== 'available' && (
        <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border-l-4 ${
          trackingData.api_status === 'pending_dispatch' 
            ? 'bg-blue-50 border-blue-500 text-blue-800'
            : trackingData.api_status === 'delivery_partner_unavailable'
            ? 'bg-yellow-50 border-yellow-500 text-yellow-800'
            : 'bg-orange-50 border-orange-500 text-orange-800'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold mb-1 text-sm sm:text-base">
                {trackingData.api_status === 'pending_dispatch' && 'Order Being Prepared'}
                {trackingData.api_status === 'delivery_partner_unavailable' && 'Service Temporarily Unavailable'}
                {trackingData.api_status === 'tracking_unavailable' && 'Tracking Information Pending'}
                {trackingData.api_status === 'network_error' && 'Connection Issue'}
              </h4>
              <p className="text-xs sm:text-sm break-words">{trackingData.error_message}</p>
              {trackingData.retry_after && (
                <p className="text-xs mt-2 opacity-75">
                  Please try again after: {new Date(trackingData.retry_after).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Package Info Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold break-words">
              {trackingData.order_info ? `Order #${trackingData.order_info.id}` : `#${trackingData.track_number}`}
            </h2>
            <p className="opacity-90 text-sm sm:text-base">
              {trackingData.order_info ? 
                `Ordered on ${new Date(trackingData.order_info.created_at).toLocaleDateString()}` :
                `Booked on ${trackingData.booking_date}`
              }
            </p>
            {trackingData.track_number && (
              <p className="text-xs sm:text-sm opacity-75 break-all">Tracking: {trackingData.track_number}</p>
            )}
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(trackingData.booked_packet_status)}
              <span className="font-semibold text-sm sm:text-base">{trackingData.booked_packet_status}</span>
            </div>
            <p className="text-xs sm:text-sm opacity-90">Last updated: {trackingData.activity_date}</p>
          </div>
        </div>
      </div>

      {/* Route Visualization */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Package Journey</h3>
        
        {/* Mobile-friendly Route */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 px-2 sm:px-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex-shrink-0"></div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{trackingData.origin_city_name}</p>
              <p className="text-xs sm:text-sm text-gray-600">Origin</p>
            </div>
          </div>
          
          <div className="flex-1 mx-4 sm:mx-8 order-3 sm:order-2">
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${getStatusColor(trackingData.booked_packet_status)}`}
                  style={{ width: `${getProgressPercentage(trackingData.booked_packet_status)}%` }}
                ></div>
              </div>
              <div className="absolute -top-2 right-2 sm:right-4">
                <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 order-2 sm:order-3">
            <div className="min-w-0 flex-1 text-left sm:text-right">
              <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {deliveryInfo?.cityName || trackingData.destination_city_name}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">Destination</p>
            </div>
            <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 ${
              trackingData.booked_packet_status?.toLowerCase() === 'delivered' 
                ? 'bg-green-500' 
                : 'bg-gray-300'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Detailed Tracking Timeline */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Tracking Timeline</h3>
        
        <div className="space-y-3 sm:space-y-4">
          {trackingData["Tracking Detail"]?.map((detail, index) => (
            <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getStatusIcon(detail.Status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">{detail.Status}</span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium text-white self-start ${getStatusColor(detail.Status)}`}>
                    {detail["Activity Date"]}
                  </span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base break-words">{detail.Reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sender & Receiver Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Sender Information
          </h4>
          <p className="text-gray-700 text-sm sm:text-base">
            {trackingData.shipment_name_eng || 'Your Store Name'}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">{trackingData.origin_city_name}</p>
        </div>
        
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Receiver Information
          </h4>
          <div className="space-y-1">
            <p className="text-gray-700 text-sm sm:text-base font-medium">
              {deliveryInfo?.fullName || trackingData.consignment_name_eng || 'Customer'}
            </p>
            {deliveryInfo?.phone && (
              <p className="text-xs sm:text-sm text-gray-600 break-all">📞 {deliveryInfo.phone}</p>
            )}
            {deliveryInfo?.email && (
              <p className="text-xs sm:text-sm text-gray-600 break-all">✉️ {deliveryInfo.email}</p>
            )}
            <p className="text-xs sm:text-sm text-gray-600">
              📍 {deliveryInfo?.cityName || trackingData.destination_city_name}
            </p>
            {deliveryInfo?.fullAddress && deliveryInfo.fullAddress !== '' && (
              <p className="text-xs text-gray-500 break-words">
                {deliveryInfo.fullAddress}
                {deliveryInfo.postcode && `, ${deliveryInfo.postcode}`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Back to Search Button */}
      <div className="text-center mt-6 sm:mt-8">
        <button 
          onClick={() => window.location.reload()}
          className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Track Another Order
        </button>
      </div>
    </div>
  );
};