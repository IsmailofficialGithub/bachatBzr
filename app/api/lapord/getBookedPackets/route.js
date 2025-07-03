// app/api/get-packets/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { CheckRouteRole } from "@/lib/auth-token";

export async function GET(req) {
    
const {  success, error } = await CheckRouteRole(req,["admin"]);
 if (error || !success) {
    return NextResponse.json({ error }, { status: 401 })
  }
  const { searchParams } = new URL(req.url);
  const fromDate = searchParams.get("from_date");
  const toDate = searchParams.get("to_date");

  if (!fromDate || !toDate) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Both 'from_date' and 'to_date' are required in YYYY-MM-DD format.",
        error: "Missing date parameters",
      },
      { status: 400 },
    );
  }

  const api_key = process.env.LEOPARDS_API_KEY;
  const api_password = process.env.LEOPARDS_API_PASSWORD;

  const query = new URLSearchParams({
    api_key,
    api_password,
    from_date: fromDate,
    to_date: toDate,
  });

  try {
    const response = await axios.get(
      `https://merchantapi.leopardscourier.com/api/getBookedPacketLastStatus/format/json/?${query}`,
    );

    const { status, error, packet_list } = response.data;

    if (status === 1) {
      // ✅ Reverse the list to show newest packets first
      const sortedList = [...packet_list].reverse();

      return NextResponse.json({
        success: true,
        message: "Booked packets retrieved successfully.",
        data: sortedList,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Leopard API returned an error.",
          error,
          data: [],
        },
        { status: 502 },
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to connect to Leopard API.",
        error: err.message,
      },
      { status: 500 },
    );
  }
}
