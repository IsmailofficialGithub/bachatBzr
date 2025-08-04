"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabaseSetup";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import PaginationComponent from "@/app/components/pagination";

import { Loader, PlusCircle, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { applyDiscount } from "@/lib/discountHandler";
import { getAccessToken } from "@/util/getAccessToken";

// Optimized Product Image Component
const ProductImage = ({ src, alt, productId }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading 50px before image is visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Image optimization function
  const getOptimizedImageUrl = (originalUrl) => {
    if (!originalUrl) return null;
    
    // Clean the URL from quotes
    const cleanUrl = originalUrl.replace(/"/g, "");
    
    // If using Cloudinary, optimize the image for thumbnails
    if (cleanUrl.includes('cloudinary.com')) {
      return cleanUrl.replace('/upload/', '/upload/w_48,h_48,c_fill,q_80,f_auto,dpr_auto/');
    }
    
    return cleanUrl;
  };

  const optimizedImageUrl = getOptimizedImageUrl(src);

  return (
    <div 
      ref={imgRef}
      className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100"
    >
      {/* Show placeholder before intersection or while loading */}
      {(!isVisible || (isVisible && !imageLoaded && !imageError)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Show fallback when image fails */}
      {isVisible && imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <i className="fas fa-image text-lg"></i>
        </div>
      )}

      {/* Load actual image when visible */}
      {isVisible && optimizedImageUrl && (
        <Image
          src={optimizedImageUrl}
          alt={alt}
          fill
          sizes="48px"
          className={`object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          unoptimized={false} // Let Next.js optimize further
          priority={false} // Not critical for above-fold content
        />
      )}
    </div>
  );
};

export const ProductList = () => {
  const searchParams = useSearchParams();
  const pageParms = searchParams.get("page") || "1";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);
  const page = useRef(pageParms);
  
  const handlePageChange = (newPage) => {
    page.current = newPage;
    fetchingProducts();
  }

  const fetchingProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/product/get?page=${page.current}&limit=${limit}`,
      );
      if (response?.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.log(error);
      toast("Error while fetching products", {
        description: error?.response?.data?.message ?? "Request timeout",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id, name) => {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${name}"?`,
    );
    if (!shouldDelete) return;

    const originalProducts = [...products];
    const accessToken = await getAccessToken();

    try {
      setProducts(products.filter((p) => p._id !== id));
      const response = await axios.delete(`/api/product/delete/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data.success) {
        toast.success("Product deleted", {
          description: `"${name}" has been removed`,
        });
      } else {
        toast.error("Deletion failed", {
          description: response.data.message || "Failed to delete Products",
        });
      }
    } catch (error) {
      setProducts(originalProducts);
      console.log(error);
      toast.error("Deletion failed", {
        description:
          error?.response?.data?.message ?? "Could not delete product",
      });
    }
  };

  useEffect(() => {
    fetchingProducts(); // Initial fetch

    const productChannel = supabase
      .channel("realtime:public:products")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          switch (eventType) {
            case "INSERT":
              setProducts((prevProducts) => [...prevProducts, newRecord]);
              break;

            case "UPDATE":
              setProducts((prevProducts) =>
                prevProducts.map((product) => {
                  if (product._id === newRecord._id) {
                    return newRecord;
                  }
                  return product;
                }),
              );
              break;

            case "DELETE":
              setProducts((prevProducts) =>
                prevProducts.filter((product) => product._id !== oldRecord._id),
              );
              break;

            default:
              break;
          }
        },
      )
      .subscribe();

    return () => {
      productChannel.unsubscribe();
    };
  }, [page]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(price);
  };

  const getConditionColor = (condition) => {
    if (condition >= 8) return "bg-green-100 text-green-800";
    if (condition >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const handleRowClick = (productId, e) => {
    const target = e.target;
    if (target.closest("button, a")) {
      return;
    }
    window.open(`/shop/${productId}`);
  };

  const copyUrl = (id) => {
    const URL = `${process.env.NEXT_PUBLIC_API_URL}/shop/${id}`;
    navigator.clipboard.writeText(URL);
    toast.success("URL Copy to ClipBoard");
  };

  const downloadImage = async (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    toast.info("Starting download...", {
      description: `Downloading ${product.images?.length || 0} images + product info`
    });

    try {
      // Import JSZip dynamically to reduce bundle size
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Create folder name with product name (sanitize for file system)
      const folderName = `${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${productId}`;
      const folder = zip.folder(folderName);

      // Function to get max quality image URL
      const getMaxQualityUrl = (originalUrl) => {
        const cleanUrl = originalUrl.replace(/"/g, "");
        
        // If Cloudinary, get original quality
        if (cleanUrl.includes('cloudinary.com')) {
          // Remove any existing transformations and add max quality
          return cleanUrl.replace(/\/upload\/[^/]*\//, '/upload/q_100,f_auto/');
        }
        
        return cleanUrl;
      };

      // Create product information file content
      const createProductInfo = () => {
        const productInfo = `
PRODUCT INFORMATION
==================

Product ID: ${product._id}
Product Name: ${product.name}
Short Description: ${product.short_description || 'N/A'}
Full Description: ${product.description || 'N/A'}

PRICING INFORMATION
==================
Original Price: PKR ${product.price}
${product.discounted_price ? `Discounted Price: PKR ${applyDiscount(product.price, product.discounted_price)}` : 'No Discount Applied'}
${product.discounted_price ? `Discount Percentage: ${product.discounted_price}%` : ''}

PRODUCT DETAILS
===============
Categories: ${product.categories?.join(', ') || 'N/A'}
Brand: ${product.brand || 'N/A'}
Product Condition: ${product.product_condition}/10
Size: ${product.size || 'N/A'}
Color: ${product.color || 'N/A'}
Material: ${product.material || 'N/A'}
Gender: ${product.gender || 'N/A'}

STATUS INFORMATION
==================
Status: ${product.sold ? 'SOLD' : 'AVAILABLE'}
Created Date: ${product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}
Updated Date: ${product.updated_at ? new Date(product.updated_at).toLocaleDateString() : 'N/A'}

SELLER INFORMATION
==================
Seller ID: ${product.seller_id || 'N/A'}

ADDITIONAL DETAILS
==================
Tags: ${product.tags?.join(', ') || 'N/A'}
Stock Quantity: ${product.stock_quantity || 'N/A'}
SKU: ${product.sku || 'N/A'}
Weight: ${product.weight || 'N/A'}
Dimensions: ${product.dimensions || 'N/A'}

IMAGES INCLUDED
===============
Total Images: ${product.images?.length || 0}
${product.images?.map((img, index) => `Image ${index + 1}: ${img.replace(/"/g, "")}`).join('\n') || 'No images available'}

PRODUCT URL
===========
View Online: ${process.env.NEXT_PUBLIC_API_URL}/shop/${product._id}

==================
Downloaded on: ${new Date().toLocaleString()}
Downloaded by: BachatBzr Admin Panel
==================
        `.trim();

        return productInfo;
      };

      // Add product information file to zip
      const productInfoContent = createProductInfo();
      folder.file(`${product.name.replace(/[^a-z0-9]/gi, '_')}_INFO.txt`, productInfoContent);

      // Create HTML version for better formatting
      const createProductInfoHTML = () => {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.name} - Product Information</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; background: #f9f9f9; }
        .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; border-left: 4px solid #007bff; padding-left: 15px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .info-item { background: #f8f9fa; padding: 15px; border-radius: 5px; }
        .info-item strong { color: #333; }
        .price-section { background: linear-gradient(135deg, #28a745, #20c997); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .status { padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
        .available { background: #28a745; color: white; }
        .sold { background: #dc3545; color: white; }
        .images-list { background: #e9ecef; padding: 15px; border-radius: 5px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${product.name}</h1>
        
        <div class="price-section">
            <h2 style="color: white; border: none; margin: 0;">Pricing Information</h2>
            <p><strong>Original Price:</strong> PKR ${product.price}</p>
            ${product.discounted_price ? `
                <p><strong>Discounted Price:</strong> PKR ${applyDiscount(product.price, product.discounted_price)}</p>
                <p><strong>Discount:</strong> ${product.discounted_price}% OFF</p>
            ` : '<p>No Discount Applied</p>'}
        </div>

        <h2>Product Details</h2>
        <div class="info-grid">
            <div class="info-item"><strong>Product ID:</strong> ${product._id}</div>
            <div class="info-item"><strong>Brand:</strong> ${product.brand || 'N/A'}</div>
            <div class="info-item"><strong>Condition:</strong> ${product.product_condition}/10</div>
            <div class="info-item"><strong>Size:</strong> ${product.size || 'N/A'}</div>
            <div class="info-item"><strong>Color:</strong> ${product.color || 'N/A'}</div>
            <div class="info-item"><strong>Material:</strong> ${product.material || 'N/A'}</div>
            <div class="info-item"><strong>Gender:</strong> ${product.gender || 'N/A'}</div>
            <div class="info-item"><strong>Categories:</strong> ${product.categories?.join(', ') || 'N/A'}</div>
        </div>

        <h2>Description</h2>
        <div class="info-item">
            <strong>Short Description:</strong><br>
            ${product.short_description || 'N/A'}
        </div>
        <div class="info-item">
            <strong>Full Description:</strong><br>
            ${product.description || 'N/A'}
        </div>

        <h2>Status Information</h2>
        <p>Status: <span class="status ${product.sold ? 'sold' : 'available'}">${product.sold ? 'SOLD' : 'AVAILABLE'}</span></p>
        <p><strong>Created:</strong> ${product.created_at ? new Date(product.created_at).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Updated:</strong> ${product.updated_at ? new Date(product.updated_at).toLocaleDateString() : 'N/A'}</p>

        <h2>Images Information</h2>
        <div class="images-list">
            <p><strong>Total Images:</strong> ${product.images?.length || 0}</p>
            ${product.images?.map((img, index) => `<p>Image ${index + 1}: ${img.replace(/"/g, "")}</p>`).join('') || '<p>No images available</p>'}
        </div>

        <h2>Product URL</h2>
        <p><a href="${process.env.NEXT_PUBLIC_API_URL}/shop/${product._id}" target="_blank">${process.env.NEXT_PUBLIC_API_URL}/shop/${product._id}</a></p>

        <div class="footer">
            <p><strong>Downloaded on:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Downloaded by:</strong> BachatBzr Admin Panel</p>
        </div>
    </div>
</body>
</html>
        `.trim();
      };

      // Add HTML version
      folder.file(`${product.name.replace(/[^a-z0-9]/gi, '_')}_INFO.html`, createProductInfoHTML());

      // Download images if available
      if (product.images && product.images.length > 0) {
        const downloadPromises = product.images.map(async (imageUrl, index) => {
          try {
            const maxQualityUrl = getMaxQualityUrl(imageUrl);
            const response = await fetch(maxQualityUrl);
            
            if (!response.ok) {
              throw new Error(`Failed to fetch image ${index + 1}`);
            }
            
            const blob = await response.blob();
            
            // Get file extension from URL or use jpg as default
            const urlParts = maxQualityUrl.split('.');
            const extension = urlParts[urlParts.length - 1].split('?')[0] || 'jpg';
            
            // Add image to zip with proper naming
            const fileName = `${product.name.replace(/[^a-z0-9]/gi, '_')}_image_${index + 1}.${extension}`;
            folder.file(fileName, blob);
            
            return { success: true, index };
          } catch (error) {
            console.error(`Error downloading image ${index + 1}:`, error);
            return { success: false, index, error: error.message };
          }
        });

        // Wait for all downloads to complete
        const results = await Promise.all(downloadPromises);
        
        // Check results
        const successCount = results.filter(r => r.success).length;
        const failedCount = results.length - successCount;

        if (successCount === 0 && product.images.length > 0) {
          toast.warning("Product info downloaded, but failed to download images");
        }
      }

      // Generate zip file
      const zipBlob = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      });

      // Create download link
      const url = window.URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      toast.success("Download completed", {
        description: `Product info + ${product.images?.length || 0} images downloaded`
      });

    } catch (error) {
      console.error('Error creating zip file:', error);
      toast.error("Download failed", {
        description: error.message || "Failed to create zip file"
      });
    }
  };

  return (
    <>
      <Card className="overflow-x-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} in stock
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin/dashboard/products/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="w-full min-w-[800px] md:min-w-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
              <Loader className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
              <p className="text-muted-foreground">No products found</p>
              <Button variant="outline" onClick={fetchingProducts}>
                Refresh
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border w-full">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[100px]">Product</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow
                        key={product._id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={(e) => handleRowClick(product._id, e)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {product.images?.[0] && (
                              <ProductImage
                                src={product.images[0]}
                                alt={product.name}
                                productId={product._id}
                              />
                            )}
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="line-clamp-2 text-sm text-muted-foreground">
                            {product.short_description
                              ?.split(" ")
                              .slice(0, 4)
                              .join(" ") + "..."}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {product.categories?.slice(0, 2).map((cat) => (
                              <Badge
                                key={cat}
                                variant="outline"
                                className="truncate"
                              >
                                {cat}
                              </Badge>
                            ))}
                            {product.categories?.length > 2 && (
                              <Badge variant="secondary">
                                +{product.categories.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getConditionColor(
                              product.product_condition,
                            )} px-2 py-1 rounded-full`}
                          >
                            {product.product_condition}/10
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {product.discounted_price ? (
                            <>
                              {formatPrice(
                                applyDiscount(
                                  product.price,
                                  product.discounted_price,
                                ),
                              )}
                              <div className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </div>
                            </>
                          ) : (
                            formatPrice(product.price)
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {product.sold ? (
                            <Badge variant="destructive" className="gap-1">
                              <ShoppingBag className="h-3 w-3" />
                              Sold
                            </Badge>
                          ) : (
                            <Badge variant="outline">Available</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className="flex gap-2 justify-end"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button variant="outline" size="sm" asChild>
                              <Link
                                href={`/admin/dashboard/products/update/${product._id}`}
                              >
                                Edit
                              </Link>
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                deleteProduct(product._id, product.name)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <i
                                className="fas fa-copy mr-1"
                                onClick={() => copyUrl(product._id)}
                                style={{ cursor: 'pointer' }}
                              />
                              <i 
                                className="fas fa-download"
                                onClick={() => downloadImage(product._id)}
                                style={{ cursor: 'pointer' }}
                              />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <PaginationComponent
                currentPage={page.current}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="mt-8 "
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};