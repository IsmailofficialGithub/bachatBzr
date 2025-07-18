"use client";
import React, { useEffect, useState } from "react";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
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
import { useRouter } from "next/navigation";
import { applyDiscount } from "@/lib/discountHandler";
import { getAccessToken } from "@/util/getAccessToken";

export const ProductList = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  const fetchingProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/product/get?page=${page}&limit=${limit}`,
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
    .on("postgres_changes", { 
      event: "*", 
      schema: "public", 
      table: "products" 
    }, (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      switch (eventType) {
        case 'INSERT':
          setProducts(prevProducts => [...prevProducts, newRecord]);
          break;
          
        case 'UPDATE':
          setProducts(prevProducts => 
            prevProducts.map(product => {
              if (product._id === newRecord._id) {
                // Only update the matching product
                return newRecord
              }
              // Return the original product unchanged
              return product;
            })
          );
          break;
          
        case 'DELETE':
          setProducts(prevProducts => 
            prevProducts.filter(product => product._id !== oldRecord._id)
          );
          break;
          
        default:
          break;
      }
    })
    .subscribe();

  return () => {
    productChannel.unsubscribe();
  };
}, [page]); // Only refetch when page changes
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

  return (
    <Card className="overflow-x-auto">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Product Inventory</CardTitle>
            <CardDescription>
              {products.length} {products.length === 1 ? "product" : "products"}{" "}
              in stock
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
                            <div className="relative h-12 w-12 rounded-md overflow-hidden">
                              <Image
                                src={product.images[0].replace(/"/g, "")}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
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
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => setPage(index + 1)}
                          isActive={page === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((prev) => Math.min(totalPages, prev + 1))
                        }
                        disabled={page >= totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
