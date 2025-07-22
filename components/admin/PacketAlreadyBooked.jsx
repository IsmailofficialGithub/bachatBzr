import { Info } from "lucide-react";
import { useState } from "react";

const PacketAlreadyBooked = ({ orderDetails, trackingId }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Mock data for demo purposes
  const mockOrderDetails = orderDetails || {
    data: {
      id: "GK7504498324",
      Receiver: "John Doe"
    }
  };
  const mockTrackingId = trackingId || "GK7504498324";

  const slipUrl = `https://merchantapi.leopardscourier.com/api/booked_packet_slip_api/${mockTrackingId}?api_key_secure=NDg3RjdCMjJGNjgzMTJEMkMxQkJDOTNCMUFFQTQ0NUIxNzQ4NzAwODA1&api_key_password_secure=NjU0OTYw`;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const downloadSlip = async () => {
    try {
      // Alternative approach: fetch the image server-side or through a proxy
      window.open(slipUrl, '_blank');
    } catch (error) {
      console.error('Error downloading slip:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-8 text-center">
          <Info className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Packet Already Booked</h1>
          <p className="text-gray-600 mb-6">
            This order has already been booked for courier delivery.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="text-left space-y-2">
              <p><strong>Order ID:</strong> {mockOrderDetails.data.id}</p>
              <p><strong>Tracking ID:</strong> {mockTrackingId}</p>
              <p><strong>Customer:</strong> {mockOrderDetails.data.Receiver}</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-semibold mb-3">Booking Slip</h3>
            
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={downloadSlip}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              View Full Slip
            </button>
          </div>
          
          </div>

        </div>
      </div>
    </div>
  );
};

export default PacketAlreadyBooked;