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
import { LoaderIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuctionItemProps, CategoryProps } from "@/types/types";
import { useSession } from "next-auth/react";
import { getCategories } from "@/lib/utils";

export default function Home() {
  const session = useSession();
  const [auctions, setAuctions] = useState<AuctionItemProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://localhost:7174/api/auction/all");
        if (res.data && res.data.data) {
          setAuctions(res.data.data);
        } else {
          setAuctions([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        setAuctions([]);
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data.data ? data.data : []);
    });
  }, [session]);

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
              {categories?.length > 0 &&
                categories.map((category: CategoryProps) => (
                  <SelectItem
                    key={category.category_id}
                    value={category.category_id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input className="flex-grow" placeholder="Search for items..." />
        <Button className="lg:max-w-40 w-full">
          <Search />
          Search
        </Button>
      </div>
      {loading ? (
        <div className="min-h-full flex items-center justify-center">
          <LoaderIcon className="animate-spin" />
        </div>
      ) : auctions.length === 0 ? (
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold">No auctions found</h1>
          <p className="text-gray-500">
            There are no auctions available at the moment.
          </p>
        </div>
      ) : (
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
      )}
    </div>
  );
}
