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

const Page = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const [specifications, setSpecifications] = useState({});
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [currentSpec, setCurrentSpec] = useState({
    key: "",
    value: "",
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parent_id: null,
  });

  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

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

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleCreateCategory = async () => {
    setCategoriesLoading(true);
    try {
      if (!newCategory.name.trim()) {
        toast.error("Category name is required");
        return;
      }

      const response = await axios.post("/api/categories", {
        name: newCategory.name,
        description: newCategory.description,
        parent_id: newCategory.parent_id,
      });

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

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files) {
      const fileList = Array.from(files);
      setFormData((prev) => ({ ...prev, [name]: fileList }));

      const previewUrls = fileList.map((file) => URL.createObjectURL(file));
      setImagePreviews(previewUrls);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

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

      formData.imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      if (Object.keys(specifications).length > 0) {
        formDataToSend.append(
          "additional_information",
          JSON.stringify(specifications)
        );
      }

      const response = await axios.post("/api/product/add", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
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
      } else {
        toast.error(`Failed to add product: ${response.data.message}`);
      }
    } catch (error) {
      toast.error(error.response.data.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
   <DashboardWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add Products</h1>

        {loading && (
          <div className="flex justify-center items-center my-4 absolute top-1/2 left-1/3 sm:top-1/2 sm:left-1/2">
            <Loader className="animate-spin text-blue-500 w-24 h-24" />
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
