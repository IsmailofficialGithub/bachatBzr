"use client";
import DashboardWrapper from "@/app/components/DashboardWrapper";
import { applyDiscount } from "@/lib/discountHandler";
import axios from "axios";
import { Loader, MoveUpRight } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

interface ProductDetails {
  no: number;
  name: string;
  short_description: string;
  long_description: string;
  product_condition: string;
  categories: string[];
  price: number;
  discounted_price: number | null;
  offer_name: string | null;
  images: string[];
  created_at: string;
  updated_at: string;
  _id: string;
  problems: string | null;
}

interface OrderDetails {
  id: string;
  user_id: string;
  products: Product[];
  total_amount: TotalAmount;
  order_status: string;
  payment_status: string;
  payment_method: string;
  transaction_id: string;
  delivery_address: string;
  created_at: string;
  updated_at: string;
  phone: number;
  Receiver: string;
  productsDetails: ProductDetails[];
}

const OrderDetails = () => {
  const router = useRouter();
  const[ loading,setLoading]=useState(false);
  const [OrderDetails, setOrderDetails] = useState<OrderDetails>([]);
  const { id } = useParams();
  const gettingOrderDetails = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/singleOrder?orderId=${id}`,
      );
      if (response.data.success) {
        setOrderDetails(response.data.data);
      } else {
        toast("SomeThing wents wrong ", { description: response.data.message });
      }
    } catch (error) {
      toast("SomeThing wents wrong ", {
        description: "Please try again later or reload page",
      });
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    gettingOrderDetails();
  }, []);

  return (
    <DashboardWrapper>
      <div className="container mx-auto p-6 bg-[#16404d]/5">
        {/* Order Header */}
        <div className="bg-green-400 rounded-lg shadow-md p-6 mb-6 border border-[#16404d]/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">
              Order #{OrderDetails.id}
            </h1>
            <div className="flex gap-4">
              <span
                className={`px-4 py-1 ${
                  OrderDetails.payment_status === "pending"
                    ? " px-4 py-1 bg-[#fb923c]/20 text-[#fb923c] rounded-full"
                    : "px-4 py-1 bg-[#16404d] text-white rounded-full"
                } rounded-full text-sm font-medium`}
              >
                {OrderDetails.payment_status}
              </span>
            </div>
          </div>
         {
          !OrderDetails.productsDetails? <Loader className="animate-spin items-center justify-items-center w-16 h-16 text-blue-500" />:
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
          <div>
            <p className="text-sm">Order Date</p>
            <p className="font-medium">{new Date(OrderDetails?.created_at).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm">Total Amount</p>
            <p className="font-medium text-orange-500">
              {OrderDetails?.total_amount?.final_total} PKR
            </p>
          </div>
          <div>
            <p className="text-sm">Payment Method</p>
            <p className="font-medium">{OrderDetails.payment_method}</p>
          </div>
          {OrderDetails.transaction_id ? (
            <div>
              <p className="text-sm">Transaction ID</p>
              <p className="font-medium">{OrderDetails.transaction_id}</p>
            </div>
          ) : (
            ""
          )}
        </div>
         }
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-black">
          <div className="bg-green-400 rounded-lg shadow-md p-6 border border-[#16404d]/10">
            <h2 className="text-lg font-semibold mb-4 text-[#16404d]">
              Customer Details
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Receiver:</span>{" "}
                {OrderDetails.Receiver}
              </p>
              <p>
                <span className="font-medium">Phone:</span>
                {OrderDetails.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {OrderDetails.delivery_address}
              </p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-green-400 rounded-lg shadow-md p-6 border border-[#16404d]/10">
            <h2 className="text-lg font-semibold mb-4 text-[#16404d]">
              Payment Details
            </h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Payment Status:</span>
                {OrderDetails.payment_status}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span>
                {OrderDetails.payment_method}
              </p>
              {OrderDetails.payment_method !== "cash_on_delivery" && (
                <p>
                  <span className="font-medium">Transaction ID:</span>
                 {OrderDetails.transaction_id}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-green-400 rounded-lg shadow-md p-6 border border-[#16404d]/10 flex flex-col ">
          <h2 className="text-lg font-semibold mb-6 text-[#16404d]">
            Products (
            {OrderDetails.products ? OrderDetails.products.length : "0"})
          </h2>

          <div className="space-y-6">
            {!OrderDetails.productsDetails ? (
              <Loader className="animate-spin items-center justify-items-center w-16 h-16 text-blue-500" />
            ) : (
              OrderDetails.productsDetails.map((product) => (
                <div
                  key={product._id}
                  className="border-b pb-6 last:border-b-0 border-[#16404d]/10"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden text-black">
                        <Image
                          height={100}
                          quality={100}
                          loading="lazy"
                          width={100}
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        {product.images.slice(1).map((img, i) => (
                          <div
                            key={i}
                            className="w-20 h-20 bg-gray-100 rounded overflow-hidden"
                          >
                            <Image
                              height={100}
                              width={100}
                              src={img}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex-1 ">
                      <div className="text-xl font-semibold mb-2">
                        <p className="flex flex-row justify-between flex-wrap">
                          {product.name}{" "}
                          <span
                            className="text-[#2e59ff] cursor-pointer "
                            onClick={() => {
                              router.push(`/product/${product._id}`);
                            }}
                          >
                            <MoveUpRight />
                          </span>
                        </p>
                        {product.discounted_price ? (
                          <h4 className="text-2xl text-red-500 ">{`[ ${product.discounted_price}% OFF]`}</h4>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Price</p>

                          <p className="font-medium">
                            {product.discounted_price ? (
                              <>
                                {applyDiscount(
                                  product.price,
                                  product.discounted_price,
                                )}{" "}
                                PKR
                                <span className="ml-2 text-[#fb923c] line-through">
                                  {product.price} PKR
                                </span>
                              </>
                            ) : (
                              `${product.price} PKR`
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Condition</p>
                          <p className="font-medium">
                            {product.product_condition} | 10
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-medium">
                            {product.categories.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm">{product.short_description}</p>
                        <p className="text-gray-600">
                          {product.long_description}
                        </p>
                        {product.problems && (
                          <p className="text-red-500 text-sm">
                            Issues: {product.problems}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-green-400 rounded-lg shadow-md p-6 mt-6 border border-[#16404d]/10">
          <h2 className="text-lg font-semibold mb-6 text-[#16404d]">
            Order Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product Items */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                {OrderDetails.productsDetails?.map((product) => (
                  <div
                    key={product._id}
                    className="flex justify-between items-center border-b pb-4 last:border-b-0"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600">{product.name}</span>
                      {product.discounted_price && (
                        <span className="text-sm text-red-500 line-through">
                          PKR {product.price}
                        </span>
                      )}
                    </div>
                    {product.discounted_price ? (
                      <span className="font-medium">
                        PKR{" "}
                        {applyDiscount(product.price, product.discounted_price)}
                      </span>
                    ) : (
                      <span className="font-medium">PKR {product.price}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-[#16404d]/5 rounded-lg p-4 h-fit w-full">
              <h2 className="text-lg font-semibold mb-6 text-[#16404d]">
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-[#16404d]">Subtotal:</span>
                  <span className="font-medium text-[#16404d]">
                    PKR {OrderDetails?.total_amount?.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#16404d]">Shipping Fee:</span>
                  <span className="font-medium text-[#16404d]">
                    PKR {OrderDetails?.total_amount?.shipping_fee}
                  </span>
                </div>
                {OrderDetails?.total_amount?.cash_on_delivery_fee && (
                  <div className="flex justify-between">
                    <span className="text-[#16404d]">Cash_On_delivery :</span>
                    <span className="font-medium text-[#16404d]">
                      PKR {OrderDetails?.total_amount?.cash_on_delivery_fee}
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total:</span>
                    <span className="text-lg font-bold text-[#16404d]">
                      PKR {OrderDetails?.total_amount?.final_total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default OrderDetails;
