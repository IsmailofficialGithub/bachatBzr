"use client"

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckOutPage from '../components/CheckOutPage'
import convertToSubCurrency from "@/lib/convertToSubCurrency";
import { toast } from "react-toastify";

if(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY===undefined){
    toast.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined")
}
const stripePromise=loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const StripePayment = ({amount,orderDetails}) => {

  return (
    <div>
      
        <Elements stripe={stripePromise}
            options={{
                mode:"payment",
                amount:convertToSubCurrency(amount),
                currency:"pkr"
            }}
        >
            <CheckOutPage amount={amount} orderDetails={orderDetails} />
        </Elements>
    </div>
  )
}

export default StripePayment