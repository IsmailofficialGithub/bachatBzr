// /app/api/leopards/cities/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  const api_key = process.env.LEOPARDS_API_KEY;
  const api_password = process.env.LEOPARDS_API_PASSWORD;

  try {
    const response = await axios.post(
      "https://merchantapi.leopardscourier.com/api/getAllCities/format/xml/",
      { api_key, api_password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch cities",
        message: error.message,
        details: error?.response?.data || null,
      },
      { status: error?.response?.status || 500 },
    );
  }
}
