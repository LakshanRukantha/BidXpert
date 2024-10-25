"use client";

import CheckoutForm from "@/components/checkout-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import convertToSubcurrency from "@/lib/ConvertToSubCurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Checkout = () => {
    
  const amount = 49.99;

  return (
    <div className=" w-full flex lg:items-center justify-center lg:min-h-full">
      <Card className="p-4 lg:-mt-12 flex flex-col max-w-4xl w-full lg:flex-row gap-4 lg:gap-2">
        <div className="flex flex-col flex-1">
          <h2 className="text-xl font-bold mb-2">Order Details</h2>
          <Label className="text-base">Product: iPhone 15 Pro Max</Label>
          <Label className="text-base">Amount: ${amount}</Label>
          <Separator className="my-2" />
          <div>
            <Label>Address</Label>
            <Input
              disabled={true}
              placeholder="Address"
              value={"2/45 First Street, Colombo, Sri Lanka"}
            />
            <Label className="mt-2">Mobile Number</Label>
            <Input
              disabled={true}
              className="disabled:opacity-50"
              placeholder="Address"
              value={"0761234567"}
            />
          </div>
        </div>
        <Separator className="mb-1 lg:hidden" />
        <div className="flex-1 bg-white rounded px-3">
          <h2 className="text-xl text-primary dark:text-secondary dark:mt-2 font-bold mb-2">
            Complete Your Payment Securely
          </h2>
          <Elements
            stripe={stripePromise}
            options={{
              mode: "payment",
              amount: convertToSubcurrency(amount),
              currency: "usd",
            }}
          >
            <CheckoutForm amount={amount} />
          </Elements>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
