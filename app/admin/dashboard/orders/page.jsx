


"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
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
import { useEffect, useState } from "react";
import { Loader, Search, Filter } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";


const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const paymentStatusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
};

const Orders = () => {
  const [loading, setLoading] = useState({
    mainLoading: true,
    filterLoading: false,
  });
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit, setLimit] = useState(30);

  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, mainLoading: true }));
      const response = await axios.get(
        `/api/orders/get?page=${page}&limit=${limit}`,
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.pagination.totalOrders);
        setTotalPages(response.data.pagination.totalPages || 1);
      } else {
        toast("Failed to fetch orders");
      }
    } catch (error) {
      toast("Failed to fetch orders");
    } finally {
      setLoading(prev => ({ ...prev, mainLoading: false }));
    }
  };

  useEffect(() => {
    // Subscribe to changes on the 'orders' table
    const subscription = supabase
      .channel('table-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public', // Use your schema name if different
          table: 'orders', // Your orders table name
        },
        (payload) => {
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // Check if the new order should be included on the current page
            if (orders.length < limit) {
              // If we have space on the current page, add the new order
              setOrders((currentOrders) => [...currentOrders, payload.new]);
              setTotalOrders((prev) => prev + 1);
            } else {
              // Update the total counts but don't add the order to the current page
              setTotalOrders((prev) => prev + 1);
              setTotalPages(Math.ceil((totalOrders + 1) / limit));
              toast("New order received. Navigate to the latest page to view it.");
            }
          } else if (payload.eventType === 'UPDATE') {
            // Update the order in the current list if it exists
            setOrders((currentOrders) =>
              currentOrders.map((order) =>
                order.id === payload.new.id ? payload.new : order
              )
            );
          } else if (payload.eventType === 'DELETE') {
            // Remove the order from the current list if it exists
            setOrders((currentOrders) =>
              currentOrders.filter((order) => order.id !== payload.old?.id)
            );
            setTotalOrders((prev) => prev - 1);
            setTotalPages(Math.ceil((totalOrders - 1) / limit));
            
            // If the current page becomes empty but it's not the first page, go back one page
            if (orders.length === 1 && page > 1) {
              setPage((prevPage) => prevPage - 1);
            }
          }
        }
      )
      .subscribe();

    // Clean up the subscription when the component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [orders, limit, page, totalOrders]);
  
  useEffect(() => {
    fetchOrders();
  }, [page, limit]);

  const handleFilterChange = async (value) => {
    try {
      setLoading(prev => ({ ...prev, filterLoading: true }));
      if (value === "all") {
        fetchOrders();
      } else {
        const response = await axios.get(
          `/api/orders/filter?status=${value}&page=${page}&limit=${limit}`,
        );
        if (response.data.success) {
          setOrders(response.data.orders);
          setTotalPages(response.data.pagination.totalPages || 1);
        } else {
          toast("Failed to fetch orders", { description: response.data.error });
        }
      }
    } catch (error) {
      console.log(error);
      toast("Failed to fetch orders", { description: error.message });
    } finally {
      setLoading(prev => ({ ...prev, filterLoading: false }));
    }
  };

  const changeOrderStatus = async (value, orderId, userId) => {
    try {
      const response = await axios.patch(
        `/api/orders/updateStatus`,
        {
          orderId: orderId,
          status: value,
          userId,
        },
      );
      if (response.data.success) {
        toast("Status updated successfully", {
          description: "Order status updated and notification sent to user",
        });
        // fetchOrders();
      } else {
        toast("Error", {
          description: "Failed to update order status. Please try again.",
        });
      }
    } catch (error) {
      console.log(error);
      toast("Failed to update order status", {
        description: "Server error while updating order status",
      });
    }
  };

  const formatAddress = (address) => {
    try {
      const parsed = JSON.parse(address);
      console.log("address",parsed)
      return `${parsed.address}, ${parsed.city.city_name}, ${parsed.country}`;
    } catch {
      return address;
    }
  };

  return (
    <DashboardWrapper>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Orders</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage and track all customer orders
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Select onValueChange={handleFilterChange}>
              <SelectTrigger className=" md:w-48">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Order Summary</CardTitle>
              <Badge variant="outline" className="px-3 py-1">
                Total: {totalOrders} orders
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading.mainLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <p className="mt-2 text-gray-500">Loading orders...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-gray-600 hover:cursor-pointer dark:hover:bg-gray-800">
                        <TableCell className="font-medium">#{order.id.slice(0, 8)}</TableCell>
                        <TableCell>
                          <div className="font-medium">{order.Receiver}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatAddress(order.delivery_address)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={order.order_status}
                            onValueChange={(value) =>
                              changeOrderStatus(value, order.id, order.user_id)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <Badge
                                className={`w-full justify-center ${
                                  statusColors[order.order_status] || "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {order.order_status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              paymentStatusColors[order.payment_status] || "bg-gray-100 text-gray-800"
                            }
                          >
                            {order.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                           PKR {order.total_amount.final_total?.toFixed(2)}
                        </TableCell>
                        <TableCell>{order.phone}</TableCell>
                        <TableCell className="text-right flex flex-col">
                          <button
                            onClick={() => window.open(`/order/${order.id}`)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline hover:decoration-red-500 decoration-2"
                          >
                            Details↗
                          </button>
                        {
                          !order.packet_tracking_id &&(
                              <button
                            onClick={() => window.open(`/admin/dashboard/blp/${order.id}`)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline hover:decoration-red-500 decoration-2"
                          >
                            BLP↗
                          </button>
                          )
                        }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {orders.length === 0 && !loading.mainLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-gray-500 pb-3">No orders found</p>
                <Button onClick={fetchOrders}>Refresh</Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={page === 1}
                        className={page === 1 ? "opacity-50 cursor-not-allowed" : ""}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            isActive={page === pageNum}
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        disabled={page >= totalPages}
                        className={page >= totalPages ? "opacity-50 cursor-not-allowed" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardWrapper>
  );
};

export default Orders;