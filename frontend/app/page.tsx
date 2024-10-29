"use client";

import AuctionItem from "@/components/auction-item";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuctionItemProps } from "@/types/types";

export default function Home() {
  const [auctions, setAuctions] = useState<AuctionItemProps[]>([]);
  useEffect(() => {
    axios.get("https://localhost:7174/api/auction/all").then((res) => {
      const { data } = res.data;
      setAuctions(data);
      console.log(data);
    });
  }, []);

  return (
    <div className="flex items-center flex-col">
      <div className="flex flex-col lg:flex-row gap-2 w-full mb-4">
        <Select>
          <SelectTrigger className="flex-auto lg:max-w-48 w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="vehicles">Vehicles</SelectItem>
              <SelectItem value="home">Home & Property</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="fashion">Fashion</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input className="flex-grow" placeholder="Search for items..." />
        <Button className="lg:max-w-40 w-full">
          <Search />
          Search
        </Button>
      </div>
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
    </div>
  );
}
