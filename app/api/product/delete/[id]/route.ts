import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { deleteImagesFromCloudinary } from "@/lib/helper";

interface Params {
  id: string;
}

export const DELETE = async (
  request: Request,
  { params }: { params: Params },
) => {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required to delete the product.",
        },
        { status: 400 },
      );
    }

    // Check if the product exists in the database
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("_id", id)
      .single();
    if (fetchError) {
      return NextResponse.json(
        {
          success: false,
          message: "Error fetching product from the database.",
          error: fetchError.message,
          detail: fetchError.details,
        },
        { status: 500 },
      );
    }

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "No product found with the given ID.",
        },
        { status: 404 },
      );
    }

    // Deleting images from Cloudinary storage
    const deletingAssets = await deleteImagesFromCloudinary(
      existingProduct.images,
    );

    if (!deletingAssets.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete images from Cloudinary.",
          imgUrl: existingProduct?.images,
        },
        { status: 500 },
      );
    }

    // Deleting the product from the database
    const deletingProduct = await supabase
      .from("products")
      .delete()
      .eq("_id", id);

    if (deletingProduct.error) {
      return NextResponse.json(
        {
          success: false,
          message: "Error deleting product from the database.",
          error: deletingProduct.error,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product successfully deleted.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while deleting the product.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
