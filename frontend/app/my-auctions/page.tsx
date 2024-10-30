"use client";

import AuctionItem from "@/components/auction-item";
import { Button } from "@/components/ui/button";
import { AuctionItemProps } from "@/types/types";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyAuctions = () => {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [auctions, setAuctions] = useState<AuctionItemProps[]>([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://localhost:7174/api/auction/all")
      .then((res) => {
        const { data } = res.data;

        const filteredAuctions = data.filter(
          (auction: AuctionItemProps) =>
            auction.lister_id === session.data?.user.id
        );

        setAuctions(filteredAuctions);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching auctions:", error);
        setAuctions([]);
        setLoading(false);
      });
  }, [session.data?.user.id]);
  return (
    <>
      {loading ? (
        <div className="min-h-full flex items-center justify-center">
          <LoaderIcon className="animate-spin" />
        </div>
      ) : (
        auctions.length === 0 && (
          <div className="text-center w-full">
            <h1 className="text-2xl font-bold">No auctions found</h1>
            <p className="text-gray-500">
              You have not listed any auctions yet. Click the button below to
              start listing.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/create-auction")}
            >
              List an Auction
            </Button>
          </div>
        )
      )}
      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {auctions.map((auction) => {
          return (
            <AuctionItem
              key={auction.auction_id}
              name={auction.name}
              description={auction.description}
              end_date={auction.end_date}
              start_bid={auction.start_bid}
              auction_id={auction.auction_id}
              categoryName={auction.categoryName}
              category_id={auction.category_id}
              high_bid={auction.high_bid}
              image_url={auction.image_url}
              listed_on={auction.listed_on}
              status={auction.status}
              listerName={auction.listerName}
              lister_id={auction.lister_id}
            />
          );
        })}
      </div>
    </>
  );
};

export default MyAuctions;
