import Image from "next/image";
import React from "react";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Eye, Gift, Pencil, Trash } from "lucide-react";
import Link from "next/link";

const BidListCard = ({
  image_url,
  title,
  listed_date,
  amount,
  type,
  isClaimed,
}: {
  image_url: string;
  title: string;
  listed_date: string;
  amount?: number;
  type: string;
  isClaimed?: boolean;
}) => {
  return (
    <Card className="p-2 max-h-14 h-full w-full mb-2 overflow-hidden">
      <div className="flex flex-row">
        <Image
          className="ml-0 min-w-16 mr-2 aspect-video h-fit rounded-lg overflow-hidden"
          src={`/${image_url}`}
          width={68}
          height={56}
          alt="Auction Image"
        />
        <div className="mr-auto">
          <Label>{title}</Label>
          <p className="text-xs text-slate-500">at {listed_date}</p>
        </div>
        <div className="flex gap-2 flex-row">
          {type === "recent_auction" ? (
            <>
              <Button variant={"secondary"} size={"sm"}>
                <Eye />
              </Button>
              <Button variant={"outline"} size={"sm"}>
                <Pencil />
              </Button>
              <Button variant={"destructive"} size={"sm"}>
                <Trash />
              </Button>
            </>
          ) : (
            <Button
              variant={"default"}
              size={"sm"}
              disabled={isClaimed}
              onClick={() =>
                console.log(title + " Claim Sucessful at " + new Date())
              }
            >
              {isClaimed ? "" : <Gift />}
              {isClaimed ? "Claimed" : "Claim Now"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default BidListCard;
