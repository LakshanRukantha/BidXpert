import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Eye, Gift, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { AuctionItemProps } from "@/types/types";

const BidListCard = ({
  auction_id,
  title,
  placed_on,
}: {
  auction_id: number;
  title: string;
  placed_on: string;
}) => {
  const [auction, setAuction] = useState<AuctionItemProps>();

  useEffect(() => {
    try {
      const fetchAuction = async () => {
        await axios
          .get(`https://localhost:7174/api/auction/${auction_id}`)
          .then((res) => {
            const { data } = res.data;
            setAuction(data);
          });
      };
      fetchAuction();
    } catch (error) {
      console.error("Error fetching auction:", error);
    }
  }, [auction_id]);

  return (
    <Card className="p-2 max-h-14 h-full w-full mb-2 overflow-hidden">
      <div className="flex flex-row">
        <Image
          className="ml-0 min-w-16 mr-2 aspect-video h-fit rounded-lg overflow-hidden"
          src={`${(auction && auction.image_url) || "/images.no-image.png"}`}
          width={68}
          height={56}
          alt="Auction Image"
        />
        <div className="mr-auto">
          <Label>{title}</Label>
          <p className="text-xs text-slate-500">at {placed_on}</p>
        </div>
        <div className="flex gap-2 flex-row">
          {auction?.status === "sold" ? (
            <Button variant={"default"} size={"sm"} disabled>
              Sold
            </Button>
          ) : (
            <Link
              href={{
                pathname: "/checkout",
                query: { auction_id: auction_id },
              }}
            >
              <Button
                variant={"default"}
                size={"sm"}
                className="bg-green-500 hover:bg-green-600 text-white"
                onClick={() =>
                  console.log(title + " Claim Successful at " + new Date())
                }
              >
                <Gift />
                Claim Now
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BidListCard;
