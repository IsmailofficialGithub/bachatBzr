import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  
  deleteImagesFromCloudinary,
  uploadImageToCloudinary,
} from "@/lib/helper";
import { json } from "node:stream/consumers";


interface UpdateProductResponse {
  success: boolean;
  message: string;
  updatedProduct?: object;
  error?: string;
}

export async function PUT(request: Request, { params }): Promise<NextResponse> {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required in the URL." },
        { status: 400 },
      );
    }
    // Fetch existing product
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("_id", id)
      .single();
     
    if (fetchError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error fetching product.",
          error: fetchError,
        },
        { status: 500 },
      );
    }

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "No product found with the given ID." },
        { status: 404 },
      );
    }

    // Parse form data
    const formData = await request.formData();

    const newImages = formData.getAll("newImages") as File[] | null;
    const oldImageUrl = formData.get("oldImageUrl") as string | null;


    // Manage images || delete old images from cloudinary
    if (oldImageUrl) {
      const deletingImages = oldImageUrl.includes(",")
        ? oldImageUrl.split(",").map((url) => url.trim())
        : [oldImageUrl];

      const validImagesToDelete = deletingImages.filter((url) =>
        existingProduct.images.includes(url),
      );

      if (validImagesToDelete.length > 0) {

        const { success } = await deleteImagesFromCloudinary(
          validImagesToDelete,
        );
        if (!success) {
          return NextResponse.json({
            success: false,
            message: "Failed to delete old image(s) from Cloudinary",
          });
        }
        existingProduct.images = existingProduct.images.filter(
          (url) => !validImagesToDelete.includes(url),
        );
      }
    }
    // upload new images from cloudinary
    for (const file of newImages ??[] ) {
      const newImageUrl = await uploadImageToCloudinary(file);
      if(newImageUrl.success){
        existingProduct.images.push(newImageUrl.secure_url);
      }
    }

    // Convert FormData to an updates object
    const updates: { [key: string]: any } = {};
    formData.forEach((value, key) => {
      if (key !== "newImages" && key !== "oldImageUrl") {
        updates[key] = value;
      }
    });



    updates.categories = JSON.parse(updates.categories);
    if (newImages) {
      updates.images = existingProduct.images;
    }

   
    console.log("updates", updates);
    // Update product in Supabase
    const { error: updateError } = await supabase
      .from("products")
      .update(updates)
      .eq("_id", id);
    if (updateError) {
     await deleteImagesFromCloudinary(updates.images)
     
      return NextResponse.json(
        {
          success: false,
          message: "Error updating product.",
          error: updateError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json<UpdateProductResponse>(
      {
        success: true,
        message: "Product updated successfully!",
        updatedProduct: updates,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
