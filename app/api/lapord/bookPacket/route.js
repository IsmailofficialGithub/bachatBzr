import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();

    // Check required fields
    if (
      !body.weight ||
      !body.pieces ||
      !body.destinationCity ||
      !body.customerName ||
      !body.customerPhone ||
      !body.customerAddress ||
      !body.shipmentId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const api_key = process.env.LEOPARDS_API_KEY;
    const api_password = process.env.LEOPARDS_API_PASSWORD;

    if (!api_key || !api_password) {
      return NextResponse.json(
        { error: "API credentials missing in .env" },
        { status: 500 }
      );
    }

    const payload = {
      api_key,
      api_password,
      booked_packet_weight: body.weight,
      booked_packet_no_piece: body.pieces || 1,
      booked_packet_collect_amount: body.collectAmount || 0,
      booked_packet_order_id: body.orderId || "",
      origin_city: "self",
      destination_city: body.destinationCity,
      shipment_id: body.shipmentId,

      // Sender Info
      shipment_name_eng: "self",
      shipment_email: "self",
      shipment_phone: "self",
      shipment_address: "self",

      // Receiver Info
      consignment_name_eng: body.customerName,
      consignment_email: body.customerEmail || "",
      consignment_phone: body.customerPhone,
      consignment_phone_two: body.customerPhone2 || "",
      consignment_phone_three: body.customerPhone3 || "",
      consignment_address: body.customerAddress,

      special_instructions: body.instructions || "",
      shipment_type: body.shipmentType || "",
      custom_data: body.customData || [],
      return_address: "",
      return_city: "",
      is_vpc: 0,
    };

    const response = await axios.post(
      "https://merchantapi.leopardscourier.com/api/bookPacket/format/json/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Book Packet Error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to book packet",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
}
