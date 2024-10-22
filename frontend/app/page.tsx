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
import * as React from "react";

export default function Home() {
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
        <AuctionItem />
        <AuctionItem />
        <AuctionItem />
        <AuctionItem />
        <AuctionItem />
        <AuctionItem />
      </div>
    </div>
  );
}
