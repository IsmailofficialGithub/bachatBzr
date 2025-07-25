"use client";

import DashboardWrapper from "@/app/components/DashboardWrapper";
import "@/public/assets/css/tailwind-cdn.css";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
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
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/util/getAccessToken";

const Page = () => {
  const router = useRouter();
  const params = useParams();

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [offerName, setOfferName] = useState("");
  const [condition, setCondition] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [problems, setProblems] = useState("");
  const [imageFiles, setImageFile] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [deletedUrls, setDeletedUrls] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    parent_id: null,
  });
  const [specifications, setSpecifications] = useState({});
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [currentSpec, setCurrentSpec] = useState({ key: "", value: "" });
  
  // Store original data for comparison
  const [originalData, setOriginalData] = useState({});

  const handleCreateCategory = async () => {
    try {
      if (!newCategory.name.trim()) {
        toast.error("Category name is required");
        return;
      }

      setCategoriesLoading(true);
      const response = await axios.post("/api/categories", newCategory);

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

  const handleCategorySelect = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((cat) => cat !== value)
        : [...prev, value]
    );
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const addSpecification = () => {
    if (currentSpec.key.trim() && currentSpec.value.trim()) {
      setSpecifications({
        ...specifications,
        [currentSpec.key]: currentSpec.value,
      });
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

  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.data.success) {
          setCategories(response.data.data || []);
        } else {
          toast.error("Failed to fetch Categories");
        }
      } catch (error) {
        toast.error("Failed to fetch Categories");
      }
    };
    fetchingCategories();
    fetchingData();
  }, []);

  const fetchingData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/product/getSingle/${params.id}`);
      if (response.data.success) {
        const productData = response.data.product;
        
        // Set form data
        setSelectedCategories(productData.categories || []);
        setName(productData.name || "");
        setCondition(productData.product_condition?.toString() || "");
        setDiscountedPrice(productData.discounted_price?.toString() || "");
        setPrice(productData.price?.toString() || "");
        setImageUrl(productData.images || []);
        setOfferName(productData.offer_name || "");
        setLongDescription(productData.long_description || "");
        setShortDescription(productData.short_description || "");
        setProblems(productData.problems || "");
        setTags(productData.tags || []);

        // Handle specifications
        if (productData.additional_information) {
          if (Array.isArray(productData.additional_information)) {
            const specsObj = {};
            productData.additional_information.forEach((item) => {
              specsObj[item.key] = item.value;
            });
            setSpecifications(specsObj);
          } else {
            setSpecifications(productData.additional_information || {});
          }
        }
        
        // Store original data for comparison - EXACT format as backend expects
        setOriginalData({
          name: productData.name || "",
          price: productData.price || 0,
          short_description: productData.short_description || "",
          long_description: productData.long_description || "",
          product_condition: productData.product_condition || 0,
          categories: productData.categories || [],
          offer_name: productData.offer_name || "",
          discounted_price: productData.discounted_price || null,
          problems: productData.problems || "",
          tags: productData.tags || [],
          additional_information: productData.additional_information || {},
          images: productData.images || []
        });
      } else {
        toast.error("Failed to retrieve Products Metadata");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error while getting product data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageDelete = (oldUrl) => {
    setImageUrl((prevImages) => prevImages.filter((url) => url !== oldUrl));
    setDeletedUrls((prevDeleted) => [...prevDeleted, oldUrl]);
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFile(files);
    }
  };

  // Enhanced function to detect changes with precise comparison
  const getChangedFields = () => {
    const changes = {};
    
    // Helper function for deep comparison
    const isEqual = (a, b) => {
      if (a === b) return true;
      if (a == null || b == null) return a === b;
      if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((val, i) => isEqual(val, b[i]));
      }
      if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        return keysA.length === keysB.length && 
               keysA.every(key => keysB.includes(key) && isEqual(a[key], b[key]));
      }
      return false;
    };
    
    // Compare each field with original data
    if (name !== originalData.name) {
      changes.name = name;
    }
    
    if (parseFloat(price) !== originalData.price) {
      changes.price = parseFloat(price);
    }
    
    if (shortDescription !== originalData.short_description) {
      changes.short_description = shortDescription;
    }
    
    if (longDescription !== originalData.long_description) {
      changes.long_description = longDescription;
    }
    
    if (parseInt(condition) !== originalData.product_condition) {
      changes.product_condition = parseInt(condition);
    }
    
    if (!isEqual(selectedCategories, originalData.categories)) {
      changes.categories = selectedCategories;
    }
    
    if (offerName !== originalData.offer_name) {
      changes.offer_name = offerName;
    }
    
    const currentDiscountedPrice = discountedPrice ? parseFloat(discountedPrice) : null;
    if (currentDiscountedPrice !== originalData.discounted_price) {
      changes.discounted_price = currentDiscountedPrice;
    }
    
    if (problems !== originalData.problems) {
      changes.problems = problems;
    }
    
    if (!isEqual(tags, originalData.tags)) {
      changes.tags = tags;
    }
    
    if (!isEqual(specifications, originalData.additional_information)) {
      changes.additional_information = specifications;
    }
    
    return changes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!name || !shortDescription || !longDescription || !selectedCategories.length || !price || !condition) {
      return toast.error("All required fields must be filled");
    }

    try {
      setLoading(true);
      
      // Get only changed fields
      const changedFields = getChangedFields();
      
      // Check if there are any changes or image operations
      const hasTextChanges = Object.keys(changedFields).length > 0;
      const hasImageChanges = imageFiles.length > 0 || deletedUrls.length > 0;
      
      if (!hasTextChanges && !hasImageChanges) {
        toast.info("No changes detected");
        setLoading(false);
        return;
      }

      // Create FormData only with changed fields
      const formDataToSend = new FormData();
      
      // Add only changed text fields
      Object.entries(changedFields).forEach(([key, value]) => {
        if (key === 'categories' || key === 'tags' || key === 'additional_information') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Handle image operations only if there are changes
      if (deletedUrls.length > 0) {
        formDataToSend.append("deleted_images", JSON.stringify(deletedUrls));
      }

      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formDataToSend.append("new_images", file);
        });
      }

      // Log what's being sent for debugging
      console.log("Sending changed fields:", Object.keys(changedFields));
      console.log("Image operations:", { 
        newImages: imageFiles.length, 
        deletedImages: deletedUrls.length 
      });

      const token = await getAccessToken();
      const response = await axios.put(
        `/api/product/update/${params.id}`,
        formDataToSend,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        
        // Update original data with new values to reset change tracking
        const updatedOriginalData = { ...originalData };
        Object.entries(changedFields).forEach(([key, value]) => {
          updatedOriginalData[key] = value;
        });
        
        // Update images in original data if changed
        if (hasImageChanges) {
          const newImageArray = [...imageUrl];
          if (imageFiles.length > 0 && response.data.product?.images) {
            updatedOriginalData.images = response.data.product.images;
            setImageUrl(response.data.product.images);
          } else {
            updatedOriginalData.images = newImageArray;
          }
        }
        
        setOriginalData(updatedOriginalData);
        
        // Clear temporary states
        setImageFile([]);
        setDeletedUrls([]);
        
        // Optional: redirect after successful update
        router.push("/admin/dashboard/products");
      } else {
        toast.error(`Failed to update product: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Update Products</h1>

        {loading && (
          <div className="flex justify-center items-center my-4 absolute top-1/2 left-1/3 sm:top-1/2 sm:left-1/2 z-50">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
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
                      onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
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
                      onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
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
                          parent_id: value === "null" ? null : Number(value)
                        })
                      }
                      value={newCategory.parent_id === null ? "null" : newCategory.parent_id?.toString()}
                      disabled={categoriesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">None</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
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
                      {selectedCategories.includes(category.name) ? "✓" : ""}
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryModalOpen(true)}
                disabled={loading}
              >
                Add New
              </Button>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedCategories.length > 0 ? (
                selectedCategories.map((category, index) => (
                  <span key={index} className="text-orange-500 font-medium">
                    | {category} |
                  </span>
                ))
              ) : (
                <span className="text-gray-500">No category selected</span>
              )}
            </div>
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
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
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
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
            />
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
              placeholder="Enter product condition (1-10)"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              min="1"
              max="10"
            />
          </div>

          {/* Offer Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Offer</label>
            <Input
              disabled={loading}
              type="text"
              name="offer_name"
              placeholder="Enter offer details"
              value={offerName}
              onChange={(e) => setOfferName(e.target.value)}
            />
          </div>

          {/* Discount */}
          <div>
            <label className="block text-sm font-medium mb-1">Discount</label>
            <Input
              disabled={loading}
              type="number"
              name="discounted_price"
              placeholder="Add discount (1 to 100) %"
              value={discountedPrice}
              onChange={(e) => setDiscountedPrice(e.target.value)}
              min="1"
              max="100"
            />
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
              value={problems}
              onChange={(e) => setProblems(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                disabled={loading}
                type="text"
                placeholder="Add tag (e.g., mens, womens)"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
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
                <h4 className="text-sm font-medium mb-2">Current Tags:</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 text-black px-2 py-1 rounded"
                    >
                      <span className="text-sm">{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag)}
                        disabled={loading}
                        className="p-1 h-auto ml-1"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
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
                  Current Specifications:
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
              Add New Images
            </label>
            <Input
              disabled={loading}
              className="cursor-pointer"
              type="file"
              accept="image/*"
              name="imageFiles"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {/* New Image Previews */}
          {imageFiles.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(file)}
                    width={100}
                    height={100}
                    alt={`Selected ${index}`}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImageFile(prev => prev.filter((_, i) => i !== index));
                    }}
                    disabled={loading}
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white rounded-full"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Existing Images */}
          {imageUrl.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Existing Images (Click to enlarge, click trash to remove)
              </label>
              <div className="grid gap-3 justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {imageUrl.map((url, index) => (
                  <div key={index} className="flex flex-col-reverse items-end">
                    <Image
                      src={url}
                      alt={`Image-${index}`}
                      width={100}
                      height={100}
                      className="w-full h-auto object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setSelectedImage(url)}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleImageDelete(url)}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
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
                  alt="Enlarged"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader className="animate-spin text-blue-500 cursor-pointer" />
            ) : (
              "Update Product"
            )}
          </Button>
        </form>
      </div>
    </DashboardWrapper>
  );
};

export default Page;