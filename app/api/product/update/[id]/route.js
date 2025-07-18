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

    // 5. Initialize update object
    const updates = {
      updated_at: new Date().toISOString(),
    };

    // 6. Process only fields that are present in formData
    const fieldMapping = {
      name: { transform: (value) => value },
      short_description: { transform: (value) => value },
      long_description: { transform: (value) => value },
      price: { transform: (value) => parseFloat(value) },
      product_condition: { transform: (value) => parseInt(value) },
      offer_name: { transform: (value) => value },
      discounted_price: { transform: (value) => value ? parseFloat(value) : null },
      problems: { transform: (value) => value },
      categories: { transform: (value) => safeJsonParse(value, []) },
      tags: { transform: (value) => safeJsonParse(value, []) },
      additional_information: { transform: (value) => safeJsonParse(value, {}) },
    };

    // Process each field only if it exists in formData
    Object.entries(fieldMapping).forEach(([fieldName, { transform }]) => {
      if (formData.has(fieldName)) {
        const value = formData.get(fieldName);
        const transformedValue = transform(value);
        
        // Only add to updates if value has actually changed
        const currentValue = existingProduct[fieldName];
        const isChanged = JSON.stringify(transformedValue) !== JSON.stringify(currentValue);
        
        if (isChanged) {
          updates[fieldName] = transformedValue;
          console.log(`Field '${fieldName}' changed from:`, currentValue, 'to:', transformedValue);
        }
      }
    });

    // 7. Handle image operations
    let updatedImages = [...(existingProduct.images || [])];
    let imagesChanged = false;
    
    // Process image deletions
    if (formData.has("deleted_images")) {
      const deletedImageUrls = safeJsonParse(formData.get("deleted_images"), []);
      if (deletedImageUrls.length > 0) {
        const validImagesToDelete = deletedImageUrls.filter(url => 
          updatedImages.includes(url)
        );

        if (validImagesToDelete.length > 0) {
          console.log('Deleting images:', validImagesToDelete);
          
          // Async delete from Cloudinary (don't await)
          deleteImagesFromCloudinary(validImagesToDelete)
            .catch(e => console.error("Image deletion error:", e));
          
          // Remove from images array
          updatedImages = updatedImages.filter(url => !validImagesToDelete.includes(url));
          imagesChanged = true;
        }
      }
    }

    // Process new image uploads
    const newImages = formData.getAll("new_images");
    if (newImages.length > 0) {
      console.log('Uploading new images:', newImages.length);
      
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
        console.log('Successfully uploaded images:', successfulUploads);
      }
    }

    // Only update images if they've changed
    if (imagesChanged) {
      updates.images = updatedImages;
    }

    // 8. Check if we have any changes to make
    const hasChanges = Object.keys(updates).length > 1; // More than just updated_at
    
    if (!hasChanges) {
      console.log('No changes detected, skipping database update');
      return NextResponse.json(
        {
          success: true,
          message: "No changes detected.",
          product: existingProduct,
        },
        { status: 200 }
      );
    }

    // 9. Log what's being updated
    console.log('Updating product with changes:', Object.keys(updates).filter(key => key !== 'updated_at'));

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
    console.log('Product updated successfully with fields:', Object.keys(updates).filter(key => key !== 'updated_at'));
    
    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
        updatedFields: Object.keys(updates).filter(key => key !== 'updated_at'),
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