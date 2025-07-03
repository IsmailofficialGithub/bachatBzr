import { CheckRouteRole } from "@/lib/auth-token";
import { supabase } from "@/lib/supabaseSetup";;
import { NextResponse } from 'next/server';


export async function PATCH(request) {
    const {  success, error } = await CheckRouteRole(req,["admin"]);
 if (error || !success) {
    return NextResponse.json({ error }, { status: 401 })
  }
    try {
        const { track_number,orderId } = await request.json();

        if (!track_number || !orderId) {
            return NextResponse.json({ success:false,message:"error: 'Missing track_number or orderId'",error: 'Missing track_number or orderId' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ packet_tracking_id: track_number })
            .eq('id', orderId)
            .single();

        if (error) {
            return NextResponse.json({ 
            success: false, 
            message: 'Failed to update packet_tracking_id', 
            error: error.message 
            }, { status: 500 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'packet_tracking_id updated successfully', 
            error: null, 
            data 
        },{ status: 200 });

    } catch (err) {
        return NextResponse.json({success:false,message:"Failed to update status", error: err.message }, { status: 500 });
    }
}