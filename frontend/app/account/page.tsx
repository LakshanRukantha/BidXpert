"use client";

import ItemListCard from "@/components/item-list-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getFirstLetters } from "@/lib/utils";
import { AuctionItemProps } from "@/types/types";
import axios from "axios";
import { Crown, Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const Account = () => {
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
  const user = session.data?.user;
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <Card className="flex flex-col p-2 justify-between md:flex-1">
        <div className="w-full">
          <div className="flex flex-row items-center py-2">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarFallback className="rounded-lg text-2xl">
                {getFirstLetters(user?.name ?? "..")}
              </AvatarFallback>
            </Avatar>
            <div className="relative flex flex-col justify-center ml-4">
              {user?.role === "admin" && (
                <Crown className="absolute -right-2 text-yellow-500 -top-5" />
              )}
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="ml-auto" variant={"outline"}>
                    <Pencil />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Separator className="my-2" />
          <Label htmlFor="fullName" className="text-lg">
            Full Name
          </Label>
          <Input
            id="fullName"
            value={user?.name || ""}
            disabled
            className="mb-3"
          />
          <Label htmlFor="email" className="text-lg">
            Email
          </Label>
          <Input
            id="email"
            value={user?.email || ""}
            disabled
            className="mb-3"
          />
          <Label htmlFor="address" className="text-lg">
            Address
          </Label>
          <Input
            id="address"
            defaultValue={"2/45 First Street, Colombo, Sri Lanka"}
            disabled
            className="mb-3"
          />
          <Label htmlFor="phoneNo" className="text-lg">
            Phone Number
          </Label>
          <Input id="phoneNo" defaultValue={"07612345678"} disabled />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <Label className="text-lg">Danger Zone</Label>
          <Button variant={"destructive"} className="max-w-fit">
            <Trash />
            Delete Account
          </Button>
        </div>
      </Card>
      <div className="flex flex-col flex-1 gap-4">
        <Card className="p-2 lg:flex-1">
          <Label className="text-2xl font-semibold">My Recent Auctions</Label>
          <Separator className="mb-2" />
          {auctions.length === 0 && (
            <div className="text-lg h-full flex flex-col items-center justify-center text-center">
              <p className="-mt-16">You have no auctions to show yet 😢</p>
            </div>
          )}
          <ScrollArea className="h-80">
            {auctions.length > 0 &&
              auctions.map((auction) => {
                return (
                  <ItemListCard
                    key={auction.auction_id}
                    image_url={auction.image_url}
                    title={auction.name}
                    listed_date={auction.listed_on}
                    type="recent_auction"
                  />
                );
              })}
          </ScrollArea>
        </Card>
        <Card className="p-2 lg:flex-1">
          <Label className="text-2xl font-semibold">Won Bids</Label>
          {/* <div className="min-h-full flex items-center justify-center">
            <p className="-mt-20">No items won yet. Keep bidding!</p>
          </div> */}
          <Separator className="mb-2" />
          <ScrollArea className="h-80">
            <ItemListCard
              image_url="images/no-image.png"
              title="iPhone 15 Pro Max"
              listed_date="2022-10-10"
              type="won_bid"
              isClaimed={true}
            />
            <ItemListCard
              image_url="images/no-image.png"
              title="Laptop Keyboard"
              listed_date="2022-10-10"
              type="won_bid"
              amount={100}
            />
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Account;
