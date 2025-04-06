"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
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
import { toast } from "sonner";
import { Loader, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  description: string;
  parent_id: number | null;
  created_at: string;
  updated_at: string;
}

const Page = () => {
  const router = useRouter()
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [name, SetName] = useState("");
  const [price, setPrice] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, SetLongDescription] = useState("");
  const [offerName, setOfferName] = useState("");
  const [condition, setCondition] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [problems, setProblems] = useState("");
  const [imageFiles, setImageFile] = useState<string[]>([]);
  const [imagetoSend, setImagetoSend] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);

  // categories change
  const handleCategorySelect = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((cat) => cat !== value)
        : [...prev, value],
    );
  };
  //categories
  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (response.data.success) {
          if (response.data.data) {
            setCategories(response.data.data);
          } else {
            setCategories([]);
          }
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
    fetchingData();
  }, []);

  // fetching old data
  const fetchingData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/product/getSingle/${params.id}`);
      if (response.data.success) {
        const productData = response.data.product;
        setSelectedCategories(productData.categories ?? null);
        SetName(productData.name);
        setCondition(productData.product_condition);
        setDiscountedPrice(productData.discounted_price);
        setPrice(productData.price);
        setImageUrl(productData.images);
        setOfferName(productData.offer_name);
        SetLongDescription(productData.long_description);
        setShortDescription(productData.short_description);
        setProblems(productData.problems);
      }else{
        toast('Failed to retrieve Products Metadata',{description:response.data?.message ?? 'Error while getting data'})
      }
    } catch (error) {
      console.log(error);
      toast('Failed to retrieve Products Metadata',{description:error.response.data.message ?? 'Error while getting data'})
    }finally{
      setLoading(false)
    }
  };

  // handleImageDelete
  const handleImageDelete = (oldUrl: string) => {
    setImageUrl((prevImages) => prevImages.filter((url) => url !== oldUrl));
    setDeletedUrls((prevDeleted) => [...prevDeleted, oldUrl]);
  };
 
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImageFile(imageUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // **Create FormData and Append Fields**
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("price", price);
      formDataToSend.append("short_description", shortDescription);
      formDataToSend.append("long_description", longDescription);
      formDataToSend.append("offer_name", offerName);
      formDataToSend.append("discounted_price", discountedPrice);
      formDataToSend.append("product_condition", condition);
      formDataToSend.append("problems", problems);
      formDataToSend.append("oldImageUrl", deletedUrls);

      // **Append Categories as Array**
      formDataToSend.append("categories", JSON.stringify(selectedCategories));

      // **Append Images**
      if (imageFiles && imageFiles.length >= 0) {
        const blobUrlToFile = async (
          blobUrl: string,
          fileName: string,
        ): Promise<File> => {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          const file = new File([blob], fileName, { type: blob.type });
          return file;
        };
        const convertedFiles = await Promise.all(
          imageFiles.map(async (blobUrl, index) => {
            return blobUrlToFile(blobUrl, `image_${index + 1}.jpg`);
          }),
        );

        // Append converted File objects to FormData
        convertedFiles.forEach((file) => {
          formDataToSend.append("newImages", file);
        });
      }
      // **Send Request**
      const response = await axios.put(
        `/api/product/update/${params.id}`,
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (response.data.success) {
        router.push('/admin/dashboard/products/')
        toast("Success", {
          description: "Product updated successfully",
        });

      } else {
        toast("Failed", {
          description: `Failed to update product: ${response.data.message}`,
        });
      }
    } catch (error: any) {
      console.error(error);
      toast("Internal Server Error", {
        description: error.response?.data?.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Update Products</h1>

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
              value={name ?? ""}
              onChange={(e) => {
                SetName(e.target.value);
              }}
            />

            {/* <label className="block text-sm text-red-600 mt-1">
                wellcome
              </label> */}
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
              value={price ?? ""}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </div>

          {/* Categories */}

          <div>
            <Select onValueChange={handleCategorySelect} disabled={loading}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category, index) => (
                  <SelectItem key={index} value={category.name ?? ""}>
                    {selectedCategories.includes(category.name) ? "✓" : ""}{" "}
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
              <div className="flex flex-row gap-1 ">
                {selectedCategories
                  ? selectedCategories.map((category, index) => (
                      <b key={index} className="text-orange-500">
                        | {category} |
                      </b>
                    ))
                  : "No category selected"}
              </div>
            </Select>
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
              value={shortDescription ?? ""}
              onChange={(e) => {
                setShortDescription(e.target.value);
              }}
            />
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
              value={longDescription ?? ""}
              onChange={(e) => {
                SetLongDescription(e.target.value);
              }}
            />
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
              value={condition ?? ""}
              onChange={(e) => {
                setCondition(e.target.value);
              }}
            />
          </div>

          {/* offer_name */}
          <div>
            <label className="block text-sm font-medium mb-1">Offer</label>
            <Input
              disabled={loading}
              type="text"
              name="offer_name"
              placeholder="Enter offer_name details"
              value={offerName ?? ""}
              onChange={(e) => {
                setOfferName(e.target.value);
              }}
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
              value={discountedPrice ?? ""}
              onChange={(e) => {
                setDiscountedPrice(e.target.value);
              }}
            />
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
              value={problems ?? ""}
              onChange={(e) => {
                setProblems(e.target.value);
              }}
            />
          </div>

          {/* Images */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Add New Images <span className=" text-red-600">*</span>
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
          <div className="mt-4 flex flex-wrap gap-2">
            {imageFiles.map((image, index) => (
              <Image
                key={index}
                src={image}
                width={100}
                height={100}
                alt={`Selected ${index}`}
                className="w-24 h-24 object-cover rounded"
              />
            ))}
          </div>

          <div>
            <div className="grid gap-3 justify-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {imageUrl.map((url, index) => (
                <div key={index} className="flex flex-col-reverse items-end">
                  <Image
                    src={url}
                    alt={`Image-${index}`}
                    width={100}
                    height={100}
                    className="w-full h-auto object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                    onClick={() => setSelectedImage(url)} // Set clicked image
                  />
                  <Trash2
                    onClick={() => {
                      handleImageDelete(url);
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Enlarged Image Modal */}
            {selectedImage && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-full text-lg cursor-pointer"
                  >
                    ✕
                  </button>

                  {/* Enlarged Image */}
                  <Image
                    src={selectedImage}
                    alt="Enlarged"
                    width={500} // Set large width
                    height={500} // Set large height
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
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
