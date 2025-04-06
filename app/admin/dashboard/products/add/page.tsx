"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { Loader } from "lucide-react";

interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categories: [] as string[],
    short_description: "",
    long_description: "",
    offer_name: "",
    discounted_price: "",
    product_condition: "",
    problems: "",
    imageFiles: [] as File[],
  });

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
  });

  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          toast("Failed to fetch Categories", {
            description: "Something went wrong",
          });
        }
      } catch (error) {
        console.error(error);
        toast("Failed to fetch Categories", {
          description: "Something went wrong",
        });
      }
    };
    fetchingCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files, type } = e.target;
    if (type === "file" && files) {
      setFormData((prev) => ({ ...prev, [name]: Array.from(files) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCategorySelect = (value: string) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      // **Create FormData and Append Fields**
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("short_description", formData.short_description);
      formDataToSend.append("long_description", formData.long_description);
      formDataToSend.append("offer_name", formData.offer_name);
      formDataToSend.append("discounted_price", formData.discounted_price);
      formDataToSend.append("product_condition", formData.product_condition);
      formDataToSend.append("problem", formData.problems);

      // **Append Categories as Array**
      formData.categories.forEach((category) => {
        formDataToSend.append("categories", category);
      });

      // **Append Images**
      formData.imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      // **Send Request**
      const response = await axios.post("/api/product/add", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast("Success", {
          description: "Product added successfully",
        });
      } else {
        toast("Failed", {
          description: `Failed to add product: ${response.data.message}`,
        });
      }
    } catch (error: any) {
        console.log(error)
      toast("Internal Server Error", {
        description: error.response.data.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Add Products</h1>

        {loading && (
          <div className="flex justify-center items-center my-4 absolute top-[50%] left-[50%]">
            <Loader className="animate-spin text-blue-500  w-24 h-24" />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Name <span className=" text-red-600">*</span>
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
              Price (PKR) <span className=" text-red-600">*</span>
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

          {/* Categories */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Categories <span className=" text-red-600">*</span>
            </label>
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
              <p></p>
            </Select>
            {formErrors.categories && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.categories}
              </label>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Short Description <span className=" text-red-600">*</span>
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
              Long Description <span className=" text-red-600">*</span>
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
              Condition (1-10) <span className=" text-red-600">*</span>
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
                {/* {formErrors.discounted_price} */}
              </label>
            )}
          </div>
          {/* Problems */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Problems <span className=" text-red-600">*</span>
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

          {/* Images */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Images <span className=" text-red-600">*</span>
            </label>
            <Input
             disabled={loading}
              className="cursor-pointer"
              type="file"
              name="imageFiles"
              multiple
              onChange={handleChange}
            />
            {formErrors.imageFiles && (
              <label className="block text-sm text-red-600 mt-1">
                {formErrors.imageFiles}
              </label>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading ? true : false}
          >
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
