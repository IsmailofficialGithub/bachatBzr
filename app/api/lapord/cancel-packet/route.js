import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const body = await req.json();

    const { cn_numbers } = body;

    if (!cn_numbers) {
      return NextResponse.json(
        { error: "Missing required field: cn_numbers" },
        { status: 400 }
      );
    }

    const api_key = process.env.LEOPARDS_API_KEY;
    const api_password = process.env.LEOPARDS_API_PASSWORD;

    if (!api_key || !api_password) {
      return NextResponse.json(
        { error: "API credentials missing " },
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

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Cancel Packet Error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Failed to cancel booked packet",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
      
    );
  }
}
