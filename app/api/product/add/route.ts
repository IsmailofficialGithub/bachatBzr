import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import {
  uploadImagesToCloudinary,
  deleteImagesFromCloudinary,
} from "@/lib/helper";


export const POST = async (request: Request): Promise<NextResponse> => {
  try {
    // Parse incoming form data
    const formData = await request.formData();

    // Extract fields from form data
    const name = formData.get("name") as string | null;
    const short_description = formData.get("short_description") as string | null;
    const long_description = formData.get("long_description") as string | null;
    const product_condition = formData.get("product_condition") as string | null;
    const categories = formData.get("categories") as string | string[] | null;
    const price = formData.get("price") as string | null;
    const discounted_price = formData.get("discounted_price") as string | null;
    const offer_name = formData.get("offer_name") as string | null;
    const problem = formData.get("problem") as string | null;
    const additional_information=formData.get("additional_information") as object | null
    const tags= formData.get("tags") as Array<string> | null;
    const imageFiles = formData.getAll("images") as File[];
    console.log(tags)
    // Validate required fields
    if (!name || !price || imageFiles.length === 0 || !short_description || !long_description ||!categories ) {
      return NextResponse.json(
        { error: "Name, price, short_description, long_description, category, and at least two image are required." },
        { status: 400 }
      );
    }

    // Upload images to Cloudinary
    const uploadResults = await uploadImagesToCloudinary(imageFiles);
    const uploadedUrls = uploadResults
      .filter((result) => result.success && result.secure_url)
      .map((result) => result.secure_url as string);

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: "Image upload failed. Please try again." },
        { status: 500 }
      );
    }

     // Prepare product object
    const product = {
      name,
      short_description,
      long_description,
      product_condition,
      categories: Array.isArray(categories) ? categories : [categories],
      price,
      problems: problem ?? null,
      discounted_price: !discounted_price || discounted_price === "" ? null : discounted_price,
      offer_name: !offer_name || offer_name === "" ? null : offer_name,
      additional_information: JSON.parse(additional_information),
      images: uploadedUrls,
      tags: JSON.parse(tags),
    };
    console.log(product)
    // Insert product into Supabase
    const { data, error } = await supabase.from("products").insert([product]);

    if (error) {
      // Rollback: Delete uploaded images in case of an error
      await deleteImagesFromCloudinary(uploadedUrls);
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    // Success response
    return NextResponse.json(
      { success: true, message: "Product added successfully!" 
        ,data
      },
      { status: 200 }
    );
  } catch (error) {

    return NextResponse.json(
      { error: "Something went wrong while adding the product." },
      { status: 500 }
    );
  }
};
