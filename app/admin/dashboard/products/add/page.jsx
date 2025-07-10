"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import "@/public/assets/css/tailwind-cdn.css";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, Trash2 } from "lucide-react";
import Image from "next/image";
// import Cropper from "react-easy-crop";
// import { readFile, createImage } from "@/lib/imageUtils";
import { getAccessToken } from "@/util/getAccessToken";

const Page = () => {
  // State for categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parent_id: null,
  });

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categories: [],
    short_description: "",
    long_description: "",
    offer_name: "",
    discounted_price: "",
    product_condition: "",
    problems: "",
    imageFiles: [],
  });

  // State for form errors
  const [formErrors, setFormErrors] = useState({
    name: "",
    price: "",
    categories: "",
    short_description: "",
    long_description: "",
    discounted_price: "",
    product_condition: "",
    problems: "",
    imageFiles: "",
    tags: "",
  });

  // State for specifications
  const [specifications, setSpecifications] = useState({});
  const [currentSpec, setCurrentSpec] = useState({
    key: "",
    value: "",
  });

  // State for tags
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  // State for images
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Commented out cropping state
  /*
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [croppingMode, setCroppingMode] = useState(false);
  const [croppedImages, setCroppedImages] = useState([]);
  */

  // Fetch categories on mount
  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          toast.error("Failed to fetch Categories");
        }
      } catch (error) {
        toast.error("Failed to fetch Categories");
      }
    };
    fetchingCategories();
  }, []);

  // Handle category creation
  const handleCreateCategory = async () => {
    setCategoriesLoading(true);
    try {
      if (!newCategory.name.trim()) {
        toast.error("Category name is required");
        return;
      }
      const accessToken = await getAccessToken();
      const response = await axios.post(
        "/api/categories",
        {
          name: newCategory.name,
          description: newCategory.description,
          parent_id: newCategory.parent_id,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Category created successfully");
        setCategories([...categories, response.data.categories]);
        setIsCategoryModalOpen(false);
        setNewCategory({ name: "", description: "", parent_id: null });
      } else {
        toast.error(response.data.error || "Failed to create category");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create category");
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files) {
      // Clean up previous URLs before creating new ones
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));

      const fileList = Array.from(files);
      setFormData((prev) => ({ ...prev, [name]: fileList }));

      const previewUrls = fileList.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
      // setCroppedImages(new Array(fileList.length)); // Initialize with proper length
      // setCroppingMode(true);
      // setCurrentImageIndex(0);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Commented out cropping functions
  /*
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    try {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = 800;
      canvas.height = 800;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            // Convert blob to File object with proper name
            const file = new File([blob], `cropped_image_${Date.now()}.jpg`, {
              type: "image/jpeg",
            });
            resolve(file);
          },
          "image/jpeg",
          0.9,
        );
      });
    } catch (error) {
      console.error("Error in getCroppedImg:", error);
      throw error;
    }
  };

  const saveCroppedImage = useCallback(async () => {
    try {
      if (!croppedAreaPixels) {
        toast.error("Please select a crop area");
        return;
      }

      const croppedFile = await getCroppedImg(
        imagePreviews[currentImageIndex],
        croppedAreaPixels,
      );

      // Update cropped images array
      const newCroppedImages = [...croppedImages];
      newCroppedImages[currentImageIndex] = croppedFile;
      setCroppedImages(newCroppedImages);

      // Move to next image or finish
      if (currentImageIndex < imagePreviews.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
      } else {
        // All images processed - update previews and finish
        const finalPreviews = imagePreviews.map((originalPreview, index) => {
          if (newCroppedImages[index]) {
            URL.revokeObjectURL(originalPreview);
            return URL.createObjectURL(newCroppedImages[index]);
          }
          return originalPreview;
        });
        setImagePreviews(finalPreviews);
        setCroppingMode(false);
        toast.success("All images cropped successfully");
      }
    } catch (error) {
      console.error("Error saving cropped image:", error);
      toast.error(
        `Error cropping image ${currentImageIndex + 1}: ${error.message}`,
      );
    }
  }, [croppedAreaPixels, imagePreviews, currentImageIndex, croppedImages]);
  */

  // Handle category selection
  const handleCategorySelect = (value) => {
    setFormData((prev) => {
      const isSelected = prev.categories.includes(value);
      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter((cat) => cat !== value)
          : [...prev.categories, value],
      };
    });
  };

  // Handle specifications
  const addSpecification = () => {
    if (currentSpec.key.trim() && currentSpec.value.trim()) {
      setSpecifications((prev) => ({
        ...prev,
        [currentSpec.key]: currentSpec.value,
      }));
      setCurrentSpec({ key: "", value: "" });
    }
  };

  const removeSpecification = (key) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    setSpecifications(newSpecs);
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setCurrentSpec((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle tags
  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
      setFormErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {
      name: "",
      price: "",
      categories: "",
      short_description: "",
      long_description: "",
      product_condition: "",
      problems: "",
      imageFiles: "",
      tags: "",
    };

    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.short_description.trim())
      errors.short_description = "Short description is required";
    if (!formData.long_description.trim())
      errors.long_description = "Long description is required";
    if (!formData.price.trim()) errors.price = "Price is required";
    if (!formData.categories.length)
      errors.categories = "At least one category is required";
    if (!formData.problems.trim())
      errors.problems = "Problems field is required";
    if (!tags.length) errors.tags = "At least one tag is required";

    const conditionNum = parseInt(formData.product_condition);
    if (
      !formData.product_condition.trim() ||
      isNaN(conditionNum) ||
      conditionNum < 1 ||
      conditionNum > 10
    ) {
      errors.product_condition = "Condition must be a number between 1 and 10";
    }

    if (formData.imageFiles.length < 2)
      errors.imageFiles = "At least 2 images are required";

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      return;
    }

    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("short_description", formData.short_description);
      formDataToSend.append("long_description", formData.long_description);
      formDataToSend.append("offer_name", formData.offer_name);
      formDataToSend.append("discounted_price", formData.discounted_price);
      formDataToSend.append("product_condition", formData.product_condition);
      formDataToSend.append("problem", formData.problems);
      formDataToSend.append("tags", JSON.stringify(tags));

      formData.categories.forEach((category) => {
        formDataToSend.append("categories", category);
      });

      // Use original images (cropping logic commented out)
      for (let i = 0; i < formData.imageFiles.length; i++) {
        formDataToSend.append("images", formData.imageFiles[i]);
      }

      if (Object.keys(specifications).length > 0) {
        formDataToSend.append(
          "additional_information",
          JSON.stringify(specifications),
        );
      }
      const accessToken = await getAccessToken();
      const response = await axios.post("/api/product/add", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        toast.success("Success , Product added successfully");
        setFormData({
          name: "",
          price: "",
          categories: [],
          short_description: "",
          long_description: "",
          offer_name: "",
          discounted_price: "",
          product_condition: "",
          problems: "",
          imageFiles: [],
        });
        setSpecifications({});
        setTags([]);
        setImagePreviews([]);
        // setCroppedImages([]);
      } else {
        toast.error(`Failed to add product: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(error.response.data.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Clean up image previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  // Commented out cropping mode UI
  /*
  if (croppingMode && imagePreviews.length > 0) {
    return (
      <DashboardWrapper>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Crop Images</h1>

          {!imagePreviews[currentImageIndex] ? (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              Error loading image {currentImageIndex + 1}. Please try again.
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="relative bg-gray-100 rounded-lg overflow-hidden"
                style={{ height: "400px", width: "100%" }}
              >
                <Cropper
                  image={imagePreviews[currentImageIndex]}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="rect"
                  showGrid={true}
                  classes={{
                    containerClassName: "rounded-lg",
                    cropAreaClassName: "border-2 border-dashed border-blue-400",
                    mediaClassName: "max-h-full max-w-full",
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Zoom: {zoom.toFixed(1)}x
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                      className="px-3 py-1 bg-gray-200 rounded-md text-sm"
                      disabled={zoom <= 1}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                      className="px-3 py-1 bg-gray-200 rounded-md text-sm"
                      disabled={zoom >= 3}
                    >
                      +
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Horizontal Position
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={crop.x * 100}
                    onChange={(e) =>
                      setCrop((prev) => ({
                        ...prev,
                        x: Number(e.target.value) / 100,
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Vertical Position
                  </label>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={crop.y * 100}
                    onChange={(e) =>
                      setCrop((prev) => ({
                        ...prev,
                        y: Number(e.target.value) / 100,
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">
                    Image {currentImageIndex + 1} of {imagePreviews.length}
                  </span>

                  <div className="flex gap-3">
                    <Button
                      onClick={saveCroppedImage}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {currentImageIndex < imagePreviews.length - 1 ? (
                        <>
                          <span>Save & Next</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </>
                      ) : (
                        "Finish Cropping"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 relative h-16 w-16 cursor-pointer rounded-md overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setCrop({ x: 0, y: 0 });
                        setZoom(1);
                      }}
                    >
                      <Image
                        src={preview}
                        alt={`Preview ${index}`}
                        fill
                        className="object-cover"
                      />
                      {croppedImages[index] && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-30 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                Tip: Adjust the zoom and position to frame your image perfectly.
                All images will be cropped to a square aspect ratio.
              </div>
            </div>
          )}
        </div>
      </DashboardWrapper>
    );
  }
  */

  return (
    <DashboardWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add Products</h1>

        {loading && (
          <div className="flex justify-center items-center my-4 absolute top-1/2 left-1/3 sm:top-1/2 sm:left-1/2">
            <Loader className="animate-spin text-blue-500 w-24 h-24 z-[1000]" />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name <span className="text-red-600">*</span>
            </label>
            <Input
              disabled={loading}
              type="text"
              name="name"
              placeholder="Enter product name"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.name}
              </label>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Price (PKR) <span className="text-red-600">*</span>
            </label>
            <Input
              disabled={loading}
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
            />
            {formErrors.price && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.price}
              </label>
            )}
          </div>

          {/* Category Creation Modal */}
          {isCategoryModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-black">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Create New Category</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category Name <span className="text-red-600">*</span>
                    </label>
                    <Input
                      type="text"
                      placeholder="Enter category name"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      disabled={categoriesLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <Textarea
                      placeholder="Enter description"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      disabled={categoriesLoading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Parent Category
                    </label>
                    <Select
                      onValueChange={(value) =>
                        setNewCategory({
                          ...newCategory,
                          parent_id: value === "null" ? null : Number(value),
                        })
                      }
                      value={
                        newCategory.parent_id === null
                          ? "null"
                          : newCategory.parent_id?.toString()
                      }
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">None</SelectItem>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCategoryModalOpen(false)}
                      disabled={categoriesLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCategory}
                      disabled={categoriesLoading}
                    >
                      {categoriesLoading ? (
                        <Loader className="animate-spin h-4 w-4 mr-2" />
                      ) : null}
                      Create Category
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Categories <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2">
              <Select onValueChange={handleCategorySelect} disabled={loading}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {formData.categories.includes(category.name) ? "✓" : ""}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryModalOpen(true)}
              >
                Add New
              </Button>
            </div>
            {formErrors.categories && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.categories}
              </label>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Short Description <span className="text-red-600">*</span>
            </label>
            <Input
              disabled={loading}
              type="text"
              name="short_description"
              placeholder="Enter short description"
              value={formData.short_description}
              onChange={handleChange}
            />
            {formErrors.short_description && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.short_description}
              </label>
            )}
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Long Description <span className="text-red-600">*</span>
            </label>
            <Textarea
              disabled={loading}
              name="long_description"
              placeholder="Enter long description"
              value={formData.long_description}
              onChange={handleChange}
            />
            {formErrors.long_description && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.long_description}
              </label>
            )}
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Condition (1-10) <span className="text-red-600">*</span>
            </label>
            <Input
              disabled={loading}
              type="number"
              name="product_condition"
              placeholder="Enter product_condition (1-10)"
              value={formData.product_condition}
              onChange={handleChange}
            />
            {formErrors.product_condition && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.product_condition}
              </label>
            )}
          </div>

          {/* offer_name */}
          <div>
            <label className="block text-sm font-medium mb-1">Offer</label>
            <Input
              disabled={loading}
              type="text"
              name="offer_name"
              placeholder="Enter offer_name details"
              value={formData.offer_name}
              onChange={handleChange}
            />
          </div>

          {/* discount */}
          <div>
            <label className="block text-sm font-medium mb-1">Discount</label>
            <Input
              disabled={loading}
              type="number"
              name="discounted_price"
              placeholder="Add discount (1 to 100) %"
              value={formData.discounted_price}
              onChange={handleChange}
            />
            {formErrors.discounted_price && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.discounted_price}
              </label>
            )}
          </div>

          {/* Problems */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Problems <span className="text-red-600">*</span>
            </label>
            <Input
              disabled={loading}
              type="text"
              name="problems"
              placeholder="Enter problems"
              value={formData.problems}
              onChange={handleChange}
            />
            {formErrors.problems && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.problems}
              </label>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1 ">
              Tags <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-2 mb-2 ">
              <Input
                disabled={loading}
                type="text"
                placeholder="Add tag (e.g., mens, womens)"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <Button
                type="button"
                onClick={handleAddTag}
                disabled={loading || !currentTag.trim()}
              >
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="border rounded p-2">
                <h4 className="text-sm font-medium mb-2">Added Tags:</h4>
                <div className="flex flex-wrap gap-2 text-black">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded"
                    >
                      <span className="text-sm">{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={loading}
                        className="p-1 h-auto"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {formErrors.tags && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.tags}
              </label>
            )}
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Specifications
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                disabled={loading}
                type="text"
                name="key"
                placeholder="Key (e.g., Color)"
                value={currentSpec.key}
                onChange={handleSpecChange}
              />
              <Input
                disabled={loading}
                type="text"
                name="value"
                placeholder="Value (e.g., Red)"
                value={currentSpec.value}
                onChange={handleSpecChange}
              />
              <Button
                type="button"
                onClick={addSpecification}
                disabled={
                  loading ||
                  !currentSpec.key.trim() ||
                  !currentSpec.value.trim()
                }
              >
                Add
              </Button>
            </div>

            {Object.keys(specifications).length > 0 && (
              <div className="border rounded p-2">
                <h4 className="text-sm font-medium mb-2">
                  Added Specifications:
                </h4>
                <ul className="space-y-1">
                  {Object.entries(specifications).map(([key, value]) => (
                    <li key={key} className="flex justify-between items-center">
                      <span className="text-sm">
                        <strong>{key}:</strong> {value}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(key)}
                        disabled={loading}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Images <span className="text-red-600">*</span>
            </label>
            <Input
              disabled={loading}
              className="cursor-pointer"
              type="file"
              name="imageFiles"
              multiple
              onChange={handleChange}
              accept="image/*"
            />
            {formErrors.imageFiles && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.imageFiles}
              </label>
            )}
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Selected Images (Click to enlarge)
              </label>
              <div className="grid gap-3 justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      width={200}
                      height={200}
                      className="w-full h-auto object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setSelectedImage(preview)}
                    />
                    {/* Commented out cropped indicator
                    {croppedImages[index] && (
                      <span className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                        Cropped
                      </span>
                    )}
                    */}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enlarged Image Modal */}
          {selectedImage && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
              <div className="relative">
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-lg cursor-pointer"
                >
                  ✕
                </button>
                <Image
                  src={selectedImage}
                  alt="Enlarged Preview"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-lg max-h-[90vh] max-w-[90vw] object-contain"
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader className="animate-spin text-blue-500 cursor-pointer" />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </div>
    </DashboardWrapper>
  );
};

export default Page;