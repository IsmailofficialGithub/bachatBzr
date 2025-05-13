"use client";
import { Button } from "@/components/ui/button";
import convertToSubCurrency from "@/lib/convertToSubCurrency";
import { createOrder } from "@/lib/createorderApiCall";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const CheckOutPage = ({ amount, orderDetails }) => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }
    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message);
        setLoading(false);
        return;
      }
      if (
        orderDetails === undefined ||
        !orderDetails.Receiver ||
        !orderDetails.delivery_address ||
        !orderDetails.phone ||
        !orderDetails.product_ids ||
        !orderDetails.user_id 
      ) {
        toast.error(
          "Please fill all required field . We need all important information.Your information is secure",
        );
        setLoading(false);
        return;
      }
      const { error,paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_API_URL}/payment-success?amount=${amount}`,
        },
        redirect:"if_required"
      });
      if (error) {
        toast.error(`Payment Failed,[${error.message}]`);
        setError(error.message);
      } else {
        const updatedOrderDetails = { ...orderDetails, transaction_id: paymentIntent.id };
       await createOrder(updatedOrderDetails);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubCurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  if (!clientSecret || !stripe || !elements) {
    return <Loader className="animate-spin" />;
  }
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      {clientSecret && <PaymentElement />}
      <Button
        variant="destructive"
        style={{
          background: "black",
          color: "#fff",
          border: "none",
          padding: "1rem 2rem",
          cursor: "pointer",
          borderRadius: "5px",
        }}
        onClick={handleSubmit}
        disabled={!clientSecret || !stripe || !elements ? true : false}
      >
        {!loading ? ` Pay ${amount}` : <Loader className="animate-spin" />}
      </Button>
    </div>
  );
};

export default CheckOutPage;
