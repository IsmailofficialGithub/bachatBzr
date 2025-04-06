"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, MoveUpRight } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the structure for a product within an order
interface Product {
  _id: string;
  name: string;
  price: number;
}
interface TotalAmount {
  totalPrice?: number;
  final_total?: number;
  shipping_fee?: number;
  cash_on_delivery_fee?: number;
}
// Define the structure for an order
interface Order {
  id: string;
  user_id: string;
  products: Product[];
  total_amount: TotalAmount;
  order_status: string;
  payment_status: string;
  payment_method: string;
  transaction_id: string | null;
  delivery_address: string;
  created_at: string;
  updated_at: string;
  phone: number;
  Receiver: string;
}

const Orders: React.FC = () => {
  const [loading, setLoading] = useState({
    mainLoading: true,
    filterLoading: false,
  });
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit, setLimit] = useState(5);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/get?page=${page}&limit=${limit}`,
      );
      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.pagination.totalOrders);
        setTotalPages(response.data.pagination.totalPages || 1);
      } else {
        toast("Failed to fetch orders");
      }
    } catch (error) {
      console.log(error);
      toast("Failed to fetch orders");
    } finally {
      setLoading({ mainLoading: false });
    }
  };
  useEffect(() => {
    fetchOrders();
  }, [page]);

  const handleFilterChange = async (value: string) => {
    try {
      if (value === "all") {
        fetchOrders();
      } else {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/orders/filter?status=${value}&page=${page}&limit=${limit}`,
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
    }
  };
  const changeOrderStatus = async (
    value: string,
    orderId: string,
    userId: string,
  ) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/updateStatus`,
        {
          orderId: orderId,
          status: value,
          userId,
        },
      );
      if (response.data.success) {
        toast("Process is successFully operated", {
          description:
            "SuccessFully updated order status and email send to user",
        });
      } else {
        toast("Error", {
          description: "Failed to update status of order . Please Try Again ",
        });
      }
    } catch (error) {
      console.log(error);
      toast("Falied to change status of order", {
        description: "Server Error while updating Order status ...",
      });
    }
  };

  return (
    <DashboardWrapper>
      <h1 className="text-2xl mt-3 mb-4">All Orders</h1>
      <div className="flex flex-row justify-between">
        <p>Orders : {orders.length}</p>
        <div>
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter By Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" defaultChecked={true}>
                All
              </SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      {loading?.mainLoading ? (
        <div className="flex  justify-center min-h-screen ">
          L <Loader className="w-16 h-16 animate-spin text-blue-500" /> ading
          ....
        </div>
      ) : (
        <div className="w-full overflow-x-auto ">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[10px] ">Id</TableHead>
                <TableHead className="min-w-[150px] ">Name</TableHead>
                <TableHead className="min-w-[100px] ">Order Status</TableHead>
                <TableHead className="min-w-[100px] ">Payment Status</TableHead>
                <TableHead className="min-w-[100px] ">Payment Method</TableHead>
                <TableHead className="min-w-[100px] ">Total Amount</TableHead>
                <TableHead className="min-w-[300px] ">Address</TableHead>
                <TableHead className="min-w-[100px] ">Contact</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order, index) => (
                <TableRow
                  className="cursor-pointer"
                  key={index}
                  onClick={() => {
                    router.push(`/admin/dashboard/orders/${order.id}`);
                  }}
                >
                  <TableCell className="min-w-[10px] font-medium">
                    {index + 1}
                  </TableCell>
                  <TableCell
                    className="min-w-[150px] cursor-pointer hover:text-[#1f2020] font-medium "
                    onClick={(event) => {
                      event.stopPropagation();
                      window.open(
                        `/admin/dashboard/users/${order.user_id} `,
                        "_blank",
                      );
                    }}
                  >
                    <div className="flex flex-row gap-2">
                      {" "}
                      {order.Receiver}
                      <MoveUpRight
                        width={10}
                        className="hover:text-green-200"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    {/* {order.order_status} */}
                    <Select
                      defaultValue={order.order_status}
                      onValueChange={(value: string) => {
                        changeOrderStatus(value, order.id, order.user_id);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Change Order Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  {/* Have to changed */}
                  <TableCell className="min-w-[100px]">
                    {order.payment_status}
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    {order.payment_method}
                  </TableCell>
                  <TableCell className="min-w-[100px]">
                    {order.total_amount.final_total}
                  </TableCell>
                  <TableCell className="min-w-[300px]">
                    {order.delivery_address}
                  </TableCell>
                  <TableCell className="min-w-[100px]">{order.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableCaption className="mb-28">
              {orders.length > 0
                ? "A list of all available orders"
                : "No Order is Avaliable"}
            </TableCaption>
          </Table>
        </div>
      )}

      <Pagination className="text-black mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              // disabled={page === 1}
              className={page === 1 ? "cursor-not-allowed opacity-50" : ""}
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
              className={
                page >= totalPages ? "cursor-not-allowed opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </DashboardWrapper>
  );
};

export default Orders;
