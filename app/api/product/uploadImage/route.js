import { uploadImageToCloudinary2 } from "@/lib/helper";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image");
    
    if (!imageFile || imageFile.length < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Image is not Provided",
        },
        { status: 400 },
      );
    }

    // Upload as temporary with auto-delete after 2 hours
    const uploadImage = await uploadImageToCloudinary2(imageFile, {
      folder: "temp-uploads",
      tags: ["temporary", `expires_${Date.now() + (2 * 60 * 60 * 1000)}`],
      context: {
        status: "temporary",
        uploaded_at: Date.now().toString()
      },
      // Auto-delete after 2 hours if not confirmed
      eager: [{ fetch_format: "auto", quality: "auto" }],
    });

    if (uploadImage.success) {
      return NextResponse.json(
        {
          success: true,
          message: "Image uploaded successfully (temporary)",
          imageUrl: uploadImage.secure_url,
          publicId: uploadImage.public_id, // Include public_id for confirmation
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to Upload image. Please Retry",
          error: "Internal Error",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload data",
        error: error.message,
      },
      { status: 500 },
    );
  }
};