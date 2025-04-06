"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
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
import {  Loader } from "lucide-react";
import Link from "next/link";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 15;
  const [totalPages, setTotalPages] = useState(1);

  //fetching product
  const fetchingProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/product/get?page=${page}&limit=${limit}`,
      );
      if (response?.data.success) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination.totalPages || 1); // Ensure pagination is correct
      }
    } catch (error) {
      console.log(error);
      toast('Error while fetching Product',{description:error?.response.data.message ??'Request timeout'})
    } finally {
      setLoading(false);
    }
  };
  //delete product
  const deleteProduct = async (id:number,name:string) => {
    try {
      const response = await axios.delete(`/api/product/delete/${id}`);
      if (response.data.success) {
        toast("Deleted", {
          description:  `Item ${<b>name</b>} is delete`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchingProducts();
    const productChannel = supabase
      .channel("realtime:public:products")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          fetchingProducts();
        },
      )
      .subscribe();

    return () => {
      productChannel.unsubscribe();
    };
  }, [page]);

  return (
    <>
      <p>Products  : {products.length}</p>
      {loading ? (
       <div className="flex  justify-center min-h-screen ">
      L <Loader className="w-16 h-16 animate-spin text-blue-500" /> ading ....
     </div>
      ) : (
        <Table>
          <TableCaption>A list of all available products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">More</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categories}</TableCell>
                <TableCell>{product.product_condition} / 10</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell className="text-right">
                  <div>
                    <Link href={`/admin/dashboard/products/update/${product._id}`}>
                    <Button variant="secondary" onClick={() => {}}>
                      Update
                    </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteProduct(product._id,product.name);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Pagination className="text-black mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                onClick={() => setPage(index + 1)}
                isActive={page === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
