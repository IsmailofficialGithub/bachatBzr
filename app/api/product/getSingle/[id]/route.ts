import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// Initialize Supabase client

export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
    try {
        const { id } =await params;

        // Fetch product from Supabase
        const { data, error } = await supabase
          .from("products") // Replace with your actual table name
          .select("*")
          .eq("_id", id)
          .single(); // Fetch only one record
      
        if (error) {
          return NextResponse.json({success:false,message:"Failed to get Product data error in supabase", error: error.message }, { status: 400 });
        }
      
        return NextResponse.json({success:true,message:"SuccessFully getting product data",product:data}, { status: 200 });
        
    } catch (error) {
        console.log(error)
    }
}
