"use client";

import AuctionItem from "@/components/auction-item";
import { AuctionItemProps } from "@/types/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const MyAuctions = () => {
  const session = useSession();
  console.log("ID:", session.data?.user.id);
  const [auctions, setAuctions] = useState<AuctionItemProps[]>([]);
  useEffect(() => {
    axios
      .get("https://localhost:7174/api/auction/all")
      .then((res) => {
        const { data } = res.data;

        const filteredAuctions = data.filter(
          (auction: AuctionItemProps) =>
            auction.lister_id === session.data?.user.id
        );

        setAuctions(filteredAuctions);
        console.log("Auctions: " + filteredAuctions);
      })
      .catch((error) => {
        console.error("Error fetching auctions:", error);
      });
  }, [session.data?.user.id]);
  return (
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
  );
};

export default MyAuctions;
