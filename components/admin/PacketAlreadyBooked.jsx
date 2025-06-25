import { Info } from "lucide-react";

const PacketAlreadyBooked = ({ orderDetails, trackingId }) => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-8 text-center">
        <Info className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Packet Already Booked</h1>
        <p className="text-gray-600 mb-6">
          This order has already been booked for courier delivery.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p><strong>Order ID:</strong> {orderDetails.data.id}</p>
          <p><strong>Tracking ID:</strong> {trackingId}</p>
          <p><strong>Customer:</strong> {orderDetails.data.Receiver}</p>
        </div>
      </div>
    </div>
  </div>
);

export default PacketAlreadyBooked;