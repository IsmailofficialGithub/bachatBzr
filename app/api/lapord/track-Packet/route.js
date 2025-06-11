import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { track_numbers } = await request.json();

    const response = await axios.post('https://merchantapi.leopardscourier.com/api/trackBookedPacket/format/json/', {
      api_key: process.env.LEOPARDS_API_KEY,
      api_password: process.env.LEOPARDS_API_PASSWORD,
      track_numbers,
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch tracking info',
      details: error?.response?.data || error.message,
    }, { status: 500 });
  }
}
