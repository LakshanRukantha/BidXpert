"use client";

import CheckoutForm from "@/components/checkout-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import convertToSubcurrency from "@/lib/ConvertToSubCurrency";
import { AuctionItemProps } from "@/types/types";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Checkout = () => {
  const session = useSession();
  const searchPageParams = useSearchParams();
  const auction_id = searchPageParams.get("auction_id");
  const [auction, setAuction] = useState<AuctionItemProps>();
  const [transactionInfo, setTransactionInfo] = useState({
    status: "paid",
    auctionId: Number(auction_id),
    userId: session.data?.user.id as number,
    amount: 0,
    date: new Date(),
  });

  useEffect(() => {
    try {
      const fetchAuction = async () => {
        await axios
          .get(`https://localhost:7174/api/auction/${auction_id}`)
          .then((res) => {
            const { data } = res.data;
            setAuction(data);
            setTransactionInfo({
              ...transactionInfo,
              amount: data.high_bid,
              auctionId: Number(data.auction_id),
              date: new Date(),
            });
          });
      };
      fetchAuction();
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  }, [auction_id]);

  return (
    <div className=" w-full flex lg:items-center justify-center lg:min-h-full">
      <Card className="p-4 lg:-mt-12 flex flex-col max-w-4xl w-full lg:flex-row gap-4 lg:gap-2">
        <div className="flex flex-col flex-1">
          <h2 className="text-xl font-bold mb-2">Order Details</h2>
          <Label className="text-base">Product: {auction?.name}</Label>
          <Label className="text-base">Amount: ${auction?.high_bid}</Label>
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
              amount: convertToSubcurrency(transactionInfo.amount),
              currency: "usd",
            }}
          >
            <CheckoutForm transactionInfo={transactionInfo} />
          </Elements>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
