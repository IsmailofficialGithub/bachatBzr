import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body)
    // Check required fields
    if (
      !body.weight ||
      !body.pieces ||
      !body.destination_city ||
      !body.receiver_name ||
      !body.receiver_phone ||
      !body.receiver_address ||
      !body.shipment_id
    ) {
      return NextResponse.json(
        { 
          error: "Missing required fields",
          required: [
            "weight",
            "pieces", 
            "destination_city",
            "receiver_name",
            "receiver_phone",
            "receiver_address",
            "shipment_id"
          ]
        },
        { status: 400 },
      );
    }

    const api_key = process.env.LEOPARDS_API_KEY;
    const api_password = process.env.LEOPARDS_API_PASSWORD;

    if (!api_key || !api_password) {
      return NextResponse.json(
        { error: "API credentials missing in .env" },
        { status: 500 },
      );
    }

    // Map frontend fields to Leopards API fields
    const payload = {
      api_key,
      api_password,
      
      // Package Details
      booked_packet_weight: parseInt(body.weight),
      booked_packet_no_piece: parseInt(body.pieces) || 1,
      booked_packet_collect_amount: parseInt(body.collection_amount) || 0,
      booked_packet_order_id: body.order_id || "",
      
      // Volume Weight
      booked_packet_vol_weight_w: body.vol_weight_w ? parseInt(body.vol_weight_w) : "",
      booked_packet_vol_weight_h: body.vol_weight_h ? parseInt(body.vol_weight_h) : "",
      booked_packet_vol_weight_l: body.vol_weight_l ? parseInt(body.vol_weight_l) : "",
      
      // Cities
      origin_city: body.origin_city || "self",
      destination_city: body.destination_city,
      shipment_id: parseInt(body.shipment_id),
      
      // Sender Info (always self)
      shipment_name_eng: "self",
      shipment_email: "self", 
      shipment_phone: "self",
      shipment_address: "self",

      // Receiver Info
      consignment_name_eng: body.receiver_name,
      consignment_phone: body.receiver_phone,
      consignment_address: body.receiver_address,
      consignment_email: body.receiver_email || "",
      consignment_phone_two: body.receiver_phone2 || "",
      consignment_phone_three: body.receiver_phone3 || "",

      // Additional Info
      special_instructions: body.special_instructions || "Delivery Package safely",
      shipment_type: body.shipment_type || "overnight",
      custom_data: body.custom_data || [],
      return_address: body.return_address || "",
      return_city: body.return_city ? parseInt(body.return_city) : "",
      is_vpc: body.is_vpc ? 1 : 0,
    };


    const leopardsUrl = "https://merchantapi.leopardscourier.com/api/bookPacket/format/json/"
      
    const response = await axios.post(leopardsUrl, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("Leopards API Response:", response.data);
    return NextResponse.json(response.data);

  } catch (error) {
    console.error("Book Packet Error:", {
      message: error.message,
      response: error?.response?.data,
      status: error?.response?.status
    });

    return NextResponse.json(
      {
        error: "Failed to book packet",
        message: error.message,
        details: error?.response?.data || null,
        status: error?.response?.status || 500
      },
      { status: error?.response?.status || 500 },
    );
  }
}