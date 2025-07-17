import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseSetup";
import {
  deleteImagesFromCloudinary,
  uploadImageToCloudinary,
} from "@/lib/helper";
import { CheckRouteRole } from "@/lib/auth-token";

// Helper function to safely parse JSON fields
const safeJsonParse = (str, defaultValue = null) => {
  try {
    return str ? JSON.parse(str) : defaultValue;
  } catch (e) {
    console.error("JSON parse error:", e);
    return defaultValue;
  }
};

export async function PUT(request, { params }) {
  try {
    // 1. Authentication and Authorization
    // const { success, error } = await CheckRouteRole(request, ["admin"]);
    // if (error || !success) {
    //   return NextResponse.json({ error }, { status: 401 });
    // }

    // 2. Validate product ID
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required." },
        { status: 400 }
      );
    }

    // 3. Parse form data
    const formData = await request.formData();
    
    // 4. Fetch existing product
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("_id", id)
      .single();

    if (fetchError || !existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: fetchError?.message || "Product not found",
          error: fetchError?.details || "Not found",
        },
        { status: fetchError ? 500 : 404 }
      );
    }

    // 5. Initialize update object with only changed fields
    const updates = {
      updated_at: new Date().toISOString(),
    };

    // 6. Process standard fields
    const standardFields = [
      { name: "name" },
      { name: "short_description" },
      { name: "long_description" },
      { name: "price", transform: parseFloat },
      { name: "product_condition", transform: parseInt },
      { name: "offer_name" },
      { name: "discounted_price", transform: parseFloat },
      { name: "problems" },
    ];

    standardFields.forEach(({ name, transform }) => {
      const value = formData.get(name);
      if (value !== null && value !== undefined) {
        const transformedValue = transform ? transform(value) : value;
        if (transformedValue !== existingProduct[name]) {
          updates[name] = transformedValue;
        }
      }
    });

    // 7. Process special fields (JSON data)
    const specialFields = [
      { name: "categories", defaultValue: [] },
      { name: "tags", defaultValue: [] },
      { name: "additional_information", defaultValue: {} },
    ];

    specialFields.forEach(({ name, defaultValue }) => {
      const value = formData.get(name);
      const parsedValue = safeJsonParse(value, defaultValue);
      if (parsedValue !== null && JSON.stringify(parsedValue) !== JSON.stringify(existingProduct[name])) {
        updates[name] = parsedValue;
      }
    });

    // 8. Handle image operations
    let updatedImages = [...(existingProduct.images || [])];
    let imagesChanged = false;
    
    // Process image deletions
    const oldImageUrls = safeJsonParse(formData.get("oldImageUrl"), []);
    if (oldImageUrls.length > 0) {
      const validImagesToDelete = oldImageUrls.filter(url => 
        updatedImages.includes(url)
      );

      if (validImagesToDelete.length > 0) {
        // Async delete from Cloudinary (don't await)
        deleteImagesFromCloudinary(validImagesToDelete)
          .catch(e => console.error("Image deletion error:", e));
        
        // Remove from images array
        updatedImages = updatedImages.filter(url => !validImagesToDelete.includes(url));
        imagesChanged = true;
      }
    }

    // Process new image uploads
    const newImages = formData.getAll("newImages");
    if (newImages.length > 0) {
      const uploadResults = await Promise.all(
        Array.from(newImages)
          .filter(file => file?.size > 0)
          .map(file => 
            uploadImageToCloudinary(file)
              .then(res => res?.success ? res.secure_url : null)
              .catch(e => {
                console.error("Upload failed for file:", file.name, e);
                return null;
              })
          )
      );

      const successfulUploads = uploadResults.filter(url => url !== null);
      if (successfulUploads.length > 0) {
        updatedImages.push(...successfulUploads);
        imagesChanged = true;
      }
    }

    // Only update images if they've changed
    if (imagesChanged) {
      updates.images = updatedImages;
    }

    // 9. Validate we have something to update
    if (Object.keys(updates).length <= 1) { // only updated_at was set
      return NextResponse.json(
        {
          success: true,
          message: "No changes detected.",
          product: existingProduct,
        },
        { status: 200 }
      );
    }

    // 10. Update product in database
    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(updates)
      .eq("_id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Database update error:", updateError);
      
      // Cleanup: Delete any newly uploaded images if DB update failed
      if (imagesChanged) {
        const newlyUploadedImages = updatedImages.filter(url => 
          !existingProduct.images?.includes(url)
        );
        if (newlyUploadedImages.length > 0) {
          await deleteImagesFromCloudinary(newlyUploadedImages)
            .catch(e => console.error("Cleanup error:", e));
        }
      }

      return NextResponse.json(
        {
          success: false,
          message: "Database update failed",
          error: updateError.message,
          details: updateError.details,
        },
        { status: 500 }
      );
    }

    // 11. Success response
    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error", 
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}