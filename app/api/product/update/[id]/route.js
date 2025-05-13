import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  deleteImagesFromCloudinary,
  uploadImageToCloudinary,
} from "@/lib/helper";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();

    const name = formData.get("name");
    const short_description = formData.get("short_description");
    const long_description = formData.get("long_description");
    const categories = formData.get("categories");
    const price = formData.get("price");
    const condition = formData.get("product_condition");

    if (
      !name ||
      !short_description ||
      !long_description ||
      !categories ||
      !price ||
      !condition
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "All required fields (name, short_description, long_description, categories, price, condition) must be provided.",
        },
        { status: 400 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required in the URL." },
        { status: 400 }
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
        { status: 500 }
      );
    }

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "No product found with the given ID." },
        { status: 404 }
      );
    }

    const newImages = formData.getAll("newImages");
    const oldImageUrl = formData.get("oldImageUrl");

    // Manage images || delete old images from cloudinary
    if (oldImageUrl) {
      const deletingImages = oldImageUrl.includes(",")
        ? oldImageUrl.split(",").map((url) => url.trim())
        : [oldImageUrl];

      const validImagesToDelete = deletingImages.filter((url) =>
        existingProduct.images.includes(url)
      );

      if (validImagesToDelete.length > 0) {
        const { success } = await deleteImagesFromCloudinary(
          validImagesToDelete
        );
        if (!success) {
          return NextResponse.json({
            success: false,
            message: "Failed to delete old image(s) from Cloudinary",
          });
        }
        existingProduct.images = existingProduct.images.filter(
          (url) => !validImagesToDelete.includes(url)
        );
      }
    }

    // upload new images from cloudinary
    for (const file of newImages ?? []) {
      const newImageUrl = await uploadImageToCloudinary(file);
      if (newImageUrl.success) {
        existingProduct.images.push(newImageUrl.secure_url);
      }
    }

    // Convert FormData to an updates object
    const updates = {};
    formData.forEach((value, key) => {
      if (key !== "newImages" && key !== "oldImageUrl") {
        updates[key] = value;
      }
    });

    if (updates.tags) {
      updates.tags = JSON.parse(updates.tags);
    }

    // Check for unavailable fields and set them to null in updates
    const fieldsToCheck = [
      "price",
      "short_description",
      "long_description",
      "offer_name",
      "categories",
      "discounted_price",
      "product_condition",
      "problems",
      "additional_information",
      "tags",
    ];
    fieldsToCheck.forEach((field) => {
      const value = formData.get(field);
      if (!formData.has(field) || value === "") {
        updates[field] = null;
      }
    });

    if (updates.additional_information) {
      updates.additional_information = JSON.parse(
        updates.additional_information
      );
    }
    updates.categories = JSON.parse(updates.categories);

    if (newImages) {
      updates.images = existingProduct.images;
    }

    // Update product in Supabase
    const { error: updateError } = await supabase
      .from("products")
      .update(updates)
      .eq("_id", id);

    console.log(updateError);

    if (updateError) {
      await deleteImagesFromCloudinary(updates.images);

      return NextResponse.json(
        {
          success: false,
          message: "Error updating product.",
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully!",
        updatedProduct: updates,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
