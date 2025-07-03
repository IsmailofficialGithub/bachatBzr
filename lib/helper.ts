import cloudinary from "./cloudinary";

// Convert a File object to Buffer
const fileToBuffer = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

// Upload a single image to Cloudinary
export const uploadImageToCloudinary = async (image) => {
  try {
    if (image instanceof File) {
      const buffer = await fileToBuffer(image);
      image = `data:${image.type};base64,${buffer.toString("base64")}`;
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: "uploads",
    });

    if (!result.secure_url) {
      throw new Error("Failed to get secure URL from Cloudinary");
    }

    return { success: true, secure_url: result.secure_url };
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return { success: false, message: error.message || "Unknown error" };
  }
};

// Upload multiple images to Cloudinary
export const uploadImagesToCloudinary = async (images) => {
  try {
    const uploadPromises = images.map((image) => uploadImageToCloudinary(image));
    const uploadResults = await Promise.all(uploadPromises);
    return uploadResults;
  } catch (error) {
    console.error("Error uploading images to Cloudinary:", error);
    throw error;
  }
};

// Delete multiple images from Cloudinary
export const deleteImagesFromCloudinary = async (urls) => {
  try {
    const publicIds = urls.map((url) => {
      const parts = url.split("/");
      return `${parts.slice(-2).join("/")}`.split(".")[0];
    });
    const deletionResults = await Promise.all(
      publicIds.map(async (publicId) => {
        try {
          const result = await cloudinary.uploader.destroy(publicId);
          return { publicId, result };
        } catch (error) {
          return { publicId, error };
        }
      })
    );

    return {
      success: true,
      results: deletionResults,
    };
  } catch (error) {
    console.error("Error deleting images:", error);
    return {
      success: false,
      results: [],
    };
  }
};

// Delete a single image from Cloudinary
export const deleteImageFromCloudinary = async (url) => {
  try {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split(".")[0];
    const folder = parts[parts.length - 2];
    const fullPublicId = `${folder}/${publicId}`;

    const result = await cloudinary.uploader.destroy(fullPublicId);

    return { success: true, result };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, result: error };
  }
};


