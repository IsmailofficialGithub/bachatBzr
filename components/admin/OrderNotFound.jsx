import { XCircle } from "lucide-react";

const OrderNotFound = ({ orderId, onRetry }) => (
  <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
        <p className="text-gray-600 mb-6">
          Order with ID "{orderId}" could not be found in our system.
        </p>
        <button
          onClick={onRetry}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
);

export default OrderNotFound;