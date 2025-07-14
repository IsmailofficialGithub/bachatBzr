import { supabase } from "@/lib/supabaseSetup";
import { NextResponse } from "next/server";
import {
  uploadImagesToCloudinary,
  deleteImagesFromCloudinary,
} from "@/lib/helper";
import { CheckRouteRole } from "@/lib/auth-token";
export const POST = async (request) => {
  const { success, error } = await CheckRouteRole(request, ["admin"]);
  if (error || !success) {
    return NextResponse.json({ error }, { status: 401 });
  }
  try {
    const formData = await request.formData();

    const name = formData.get("name");
    const short_description = formData.get("short_description");
    const long_description = formData.get("long_description");
    const product_condition = formData.get("product_condition");
    const categories = formData.get("categories");
    const price = formData.get("price");
    const discounted_price = formData.get("discounted_price");
    const offer_name = formData.get("offer_name");
    const problem = formData.get("problem");
    const additional_information = formData.get("additional_information");
    const tags = formData.get("tags");
    const imageFiles = formData.getAll("images");

    // Validate required fields
    if (
      !name ||
      !price ||
      !short_description ||
      !long_description ||
      !categories ||
      !imageFiles.length ||
      !tags
    ) {
      return NextResponse.json(
        {
          error:
            "Name, price, short_description, long_description, tags , category, and at least one image are required.",
        },
        { status: 400 },
      );
    }

    // Upload images to Cloudinary
    const uploadResults = await uploadImagesToCloudinary(imageFiles);
    const uploadedUrls = uploadResults
      .filter((result) => result.success && result.secure_url)
      .map((result) => result.secure_url);

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: "Image upload failed. Please try again." },
        { status: 500 },
      );
    }

    // Prepare product object
    const product = {
      name,
      short_description,
      long_description,
      product_condition,
      categories: Array.isArray(categories) ? categories : [categories], // Ensure categories is an array
      price,
      problems: problem ?? null,
      discounted_price:
        !discounted_price || discounted_price === "" ? null : discounted_price,
      offer_name: !offer_name || offer_name === "" ? null : offer_name,
      additional_information: additional_information
        ? JSON.parse(additional_information)
        : null,
      images: uploadedUrls,
      tags: tags ? JSON.parse(tags) : [],
    };

    // Insert into Supabase
    const { data, error } = await supabase.from("products").insert([product]);

    if (error) {
      await deleteImagesFromCloudinary(uploadedUrls);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product added successfully!",
        data,
        product,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong while adding the product." },
      { status: 500 },
    );
  }
};
