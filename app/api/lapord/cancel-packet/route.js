import { NextResponse } from "next/server";
import axios from "axios";
import { CheckRouteRole } from "@/lib/auth-token";

export async function POST(req) {
  
const {  success, error } = await CheckRouteRole(req,["admin"]);
 if (error || !success) {
    return NextResponse.json({ error }, { status: 401 })
  }
  try {
    const body = await req.json();

    const { cn_numbers } = body;

    if (!cn_numbers) {
      return NextResponse.json(
        {success:false,message:"Missing Tracking number", error: "Missing required field: cn_numbers" },
        { status: 400 }
      );
    }

    const api_key = process.env.LEOPARDS_API_KEY;
    const api_password = process.env.LEOPARDS_API_PASSWORD;

    if (!api_key || !api_password) {
      return NextResponse.json(
        { success:false,message:"Api keys Requried",error: "API credentials missing " },
        { status: 500 }
      );
    }

    const payload = {
      api_key,
      api_password,
      cn_numbers, // Single CN or comma-separated list of CNs
    };

    const response = await axios.post(
      "https://merchantapi.leopardscourier.com/api/cancelBookedPackets/format/json/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, message: "Successfully order cancel", data: response.data });
  } catch (error) {
    console.error("Cancel Packet Error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to cancel booked packet",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
      
    );
  }
}
