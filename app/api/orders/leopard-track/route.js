// app/api/leopard-track/route.js

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseSetup';

// Initialize Supabase client

// Leopard API credentials from environment
const LEOPARD_API_KEY = process.env.LEOPARDS_API_KEY;
const LEOPARD_API_PASSWORD = process.env.LEOPARDS_API_PASSWORD;

export async function POST(request) {
  try {
    const { order_id } = await request.json();

    // Validate required fields
    if (!order_id) {
      return NextResponse.json(
        { 
          error: 'Missing required field: order_id',
          status: 'error'
        },
        { status: 400 }
      );
    }

    // Check if API credentials are available
    if (!LEOPARD_API_KEY || !LEOPARD_API_PASSWORD) {
      console.error('Leopard API credentials not configured');
      
      // Update order status to indicate delivery partner unavailable
      await updateOrderStatus(order_id, 'delivery_partner_unavailable', 'Delivery partner API credentials not configured');
      
      return NextResponse.json({
        status: 0,
        error: 'Delivery partner service is currently unavailable. Please try again later.',
        order_status: 'delivery_partner_unavailable',
        message: 'Order is pending - delivery partner integration is not available'
      });
    }

    // Get order details from Supabase
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('id, packet_tracking_id, order_status, created_at, delivery_address')
      .eq('id', order_id)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { 
          error: 'Order not found',
          status: 'error',
          details: orderError?.message 
        },
        { status: 404 }
      );
    }

    // Check if tracking_id exists
    if (!orderData.tracking_id) {
      await updateOrderStatus(order_id, 'pending_dispatch', 'Order has not been dispatched to delivery partner yet');
      
      return NextResponse.json({
        status: 0,
        error: 'Order has not been assigned to delivery partner yet',
        order_status: 'pending_dispatch',
        order_data: {
          id: orderData.id,
          status: 'pending_dispatch',
          created_at: orderData.created_at,
          customer_name: orderData.customer_name,
          message: 'Your order is being prepared for dispatch'
        }
      });
    }

    // Try to track with Leopard API
    try {
      const leopardData = await trackWithLeopardAPI(orderData.tracking_id);
      
      if (leopardData.status === 1 && leopardData.packet_list && leopardData.packet_list.length > 0) {
        const trackingInfo = leopardData.packet_list[0];
        
        // Update order status based on Leopard response
        const orderStatus = mapLeopardStatusToOrderStatus(trackingInfo.booked_packet_status);
        await updateOrderStatus(order_id, orderStatus, `Last update: ${trackingInfo.activity_date}`);
        
        // Return successful tracking data
        return NextResponse.json({
          status: 1,
          error: 0,
          order_data: {
            id: orderData.id,
            tracking_id: orderData.tracking_id,
            status: orderStatus,
            created_at: orderData.created_at,
            customer_name: orderData.customer_name
          },
          tracking_data: trackingInfo,
          message: 'Package tracking retrieved successfully'
        });
      } else {
        // Leopard API returned error
        await updateOrderStatus(order_id, 'tracking_unavailable', leopardData.error || 'Unable to fetch tracking information');
        
        return NextResponse.json({
          status: 0,
          error: leopardData.error || 'Tracking information not available',
          order_status: 'tracking_unavailable',
          order_data: {
            id: orderData.id,
            tracking_id: orderData.tracking_id,
            status: 'tracking_unavailable',
            created_at: orderData.created_at,
            customer_name: orderData.customer_name
          },
          message: 'Order exists but tracking information is currently unavailable'
        });
      }
    } catch (apiError) {
      console.error('Leopard API Error:', apiError);
      
      // API is down or unreachable
      await updateOrderStatus(order_id, 'delivery_partner_unavailable', 'Delivery partner service temporarily unavailable');
      
      return NextResponse.json({
        status: 0,
        error: 'Delivery partner service is temporarily unavailable',
        order_status: 'delivery_partner_unavailable',
        order_data: {
          id: orderData.id,
          tracking_id: orderData.tracking_id,
          status: 'delivery_partner_unavailable',
          created_at: orderData.created_at,
          customer_name: orderData.customer_name
        },
        message: 'Please check back later for tracking updates',
        retry_after: new Date(Date.now() + 30 * 60 * 1000).toISOString() // Suggest retry after 30 minutes
      });
    }

  } catch (error) {
    console.error('Unexpected error in tracking API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error occurred while tracking package',
        status: 'error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Helper function to call Leopard API
async function trackWithLeopardAPI(trackingId) {
  const apiUrl = 'https://merchantapi.leopardscourier.com/api/trackBookedPacket/format/json/';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: LEOPARD_API_KEY,
      api_password: LEOPARD_API_PASSWORD,
      track_numbers: trackingId
    }),
    timeout: 10000 // 10 second timeout
  });

  if (!response.ok) {
    throw new Error(`Leopard API HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// Helper function to update order status in Supabase
async function updateOrderStatus(orderId, status, statusMessage = null) {
  try {
    const updateData = {
      status: status,
      updated_at: new Date().toISOString()
    };

    if (statusMessage) {
      updateData.status_message = statusMessage;
    }

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order status:', error);
    }
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
  }
}

// Helper function to map Leopard status to internal order status
function mapLeopardStatusToOrderStatus(leopardStatus) {
  const statusMap = {
    'packet booked': 'dispatched',
    'in transit': 'in_transit',
    'out for delivery': 'out_for_delivery',
    'delivered': 'delivered',
    'returned': 'returned',
    'pending': 'pending_delivery',
    'cancelled': 'cancelled'
  };

  const normalizedStatus = leopardStatus.toLowerCase();
  return statusMap[normalizedStatus] || 'unknown_status';
}

// Optional: Handle GET requests for direct access (with order_id in query)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const order_id = searchParams.get('order_id');

  if (!order_id) {
    return NextResponse.json(
      { error: 'Missing required query parameter: order_id' },
      { status: 400 }
    );
  }

  // Reuse POST logic
  return POST(new Request(request.url, {
    method: 'POST',
    body: JSON.stringify({ order_id })
  }));
}