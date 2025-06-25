import { NextResponse } from "next/server";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cityName = searchParams.get("name")?.toLowerCase();

    if (!cityName || cityName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "City name must be at least 2 characters",
          error: "Invalid input",
          data: null,
        },
        { status: 400 }
      );
    }

    const api_key = process.env.LEOPARDS_API_KEY;
    const api_password = process.env.LEOPARDS_API_PASSWORD;

    const response = await axios.post(
      "https://merchantapi.leopardscourier.com/api/getAllCities/format/xml/",
      { api_key, api_password },
      { headers: { "Content-Type": "application/json" } }
    );

    const parser = new XMLParser();
    const parsed = parser.parse(response.data);

    const cityList = parsed.xml?.city_list?.item || [];
    const cities = Array.isArray(cityList) ? cityList : [cityList];

    const matchedCities = cities
      .filter((city) => city.name?.toLowerCase().includes(cityName))
      .map((city) => ({
        id: city.id,
        name: city.name,
        allow_as_origin: city.allow_as_origin,
        allow_as_destination: city.allow_as_destination,
      }));

    if (matchedCities.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No matching cities found",
          error: "No match",
          data: [],
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Cities matched successfully",
      error: null,
      data: matchedCities,
    });
  } catch (error) {
    console.error("City search error:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cities",
        error: error.message,
        data: null,
      },
      { status: 500 }
    );
  }
}
