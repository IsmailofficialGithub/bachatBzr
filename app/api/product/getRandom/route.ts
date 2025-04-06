import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Fetch 12 random products using PostgreSQL's RANDOM()
    const { data, error } = await supabase.rpc("get_random_products");
     

    // Handle Supabase errors
    if (error){
      return NextResponse.json({ success: false, message: "Failed to fetch random products", error }, { status: 500 });
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Random products retrieved successfully.",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching random products:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error. Please try again later.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
    
    // This route fetches 12 random products from the  products  table in the database using the  order("random()", { ascending: false })  method. The  ascending: false  option ensures that the products are returned in a random order. 
    // The route returns a JSON response with the fetched products if the operation is successful. If an error occurs during the operation, the route returns an error response. 
    // Step 3: Create a React component to display random products 
    // Next, create a React component to display the random products on the homepage. 
    // Create a new file named  RandomProducts.tsx  in the  components  directory and add the following code: