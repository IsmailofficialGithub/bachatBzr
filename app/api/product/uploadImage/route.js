import { uploadImageToCloudinary } from "@/lib/helper";
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
    const uploadImage = await uploadImageToCloudinary();
    if (uploadImage.success) {
      return NextResponse.json(
        {
          success: true,
          message: "Image uploaded successFully",
          imageUrl: uploadImage.secure_url,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to Upload image . Please Retry",
          error: "Internel Error",
        },
        { status: 300 },
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload data ",
        error,
      },
      { status: 500 },
    );
  }
};
