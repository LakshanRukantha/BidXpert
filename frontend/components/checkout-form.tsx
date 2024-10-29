"use client";

import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/lib/ConvertToSubCurrency";
import { Button } from "@/components/ui/button";
import { CheckoutFormProps } from "@/types/types";

const CheckoutForm = ({ transactionProps }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transactionProps.amount > 0) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: convertToSubcurrency(transactionProps.amount),
        }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) =>
          setErrorMessage(`Failed to create payment intent. Error: ${error}`)
        );
    }
  }, [transactionProps.amount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      return;
    }

    const { error: submitError } = await elements.submit();

    if (submitError) {
      setErrorMessage(submitError.message);
      setLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `http://localhost:3000/payment-success?amount=${transactionProps.amount}`,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the payment. Show the error to your customer (for example, payment details incomplete)
      setErrorMessage(error.message);
    } else {
      // The payment UI automatically closes with a success animation.
      // Your customer is redirected to your `return_url`.
    }

    setLoading(false);
  };

  if (!clientSecret || !stripe || !elements) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md">
      {clientSecret && transactionProps.amount > 0 && <PaymentElement />}

      {errorMessage && <div>{errorMessage}</div>}

      <Button
        variant={"default"}
        disabled={!stripe || loading}
        className="w-full bg-black hover:bg-black/90 text-white font-bold p-5 mt-4 disabled:opacity-50 disabled:animate-pulse"
      >
        {!loading ? `Pay $${transactionProps.amount}` : "Processing..."}
      </Button>
      <p className="text-xs mt-1 mb-3 text-slate-500">
        This is the final amount you’ll be charged. If everything looks good,
        click <span className="font-bold">&apos;Pay&apos;</span> to complete
        your order!
      </p>
    </form>
  );
};

export default CheckoutForm;
