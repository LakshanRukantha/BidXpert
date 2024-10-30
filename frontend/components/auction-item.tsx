"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CalendarDays, Eye, Share } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "@radix-ui/react-separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Label } from "./ui/label";
import sendEmailNotification from "@/lib/bid-mail-sender";
import { AuctionItemProps } from "@/types/types";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { sendInSiteNotification } from "@/lib/notification-sender";

export default function AuctionItem({
  name,
  description,
  end_date,
  start_bid,
  auction_id,
  listerName,
  high_bid,
  image_url,
  lister_id,
}: AuctionItemProps) {
  const session = useSession();
  const router = useRouter();
  const user = session.data?.user;
  const [listerEmail, setListerEmail] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>(high_bid);

  // get lister email from lister id
  useEffect(() => {
    axios.get(`https://localhost:7174/api/user/${lister_id}`).then((res) => {
      const { data } = res.data;
      setListerEmail(data.email);
    });
  }, [lister_id]);

  const handlePlaceBid = async (bid: {
    amount: number;
    placed_on: string;
    auction_id: number;
    bidder_id: number;
    status: string;
  }) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You need to sign in to place a bid.",
        });
        router.push("/signin");
        return;
      } else if (bid.amount < high_bid) {
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "Bid amount should be greater than the current highest bid.",
        });
        return;
      }
      await axios
        .post("https://localhost:7174/api/bid/create", bid)
        .then(() => {
          setBidAmount(bid.amount);
          toast({
            variant: "default",
            title: "Success",
            description: "Bid placed successfully.",
          });
        });
      await sendInSiteNotification(name, bid.bidder_id, lister_id, bid.amount);
      await sendEmailNotification({
        auctionListerEmail: listerEmail,
        auctionListerName: listerName,
        bidderEmail: session.data?.user?.email as string,
        bidderName: session.data?.user?.name as string,
        bidderId: session.data?.user?.id as number,
        expiresOn: new Date(end_date),
        itemId: auction_id,
        itemName: name,
        bidAmount: bidAmount,
      });
    } catch (error) {
      console.error("Error placing bid:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error placing bid.",
      });
    }
  };

  return (
    <Card className="p-2 max-w-72 flex flex-col justify-between w-full">
      <CardHeader>
        <CardTitle className="text-ellipsis line-clamp-1">
          {name || ""}
        </CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between mb-2">
          <h3 className="to-slate-500 float-end">
            By {lister_id === session.data?.user.id ? "Me" : listerName}
          </h3>
          <Separator orientation="vertical" className="bg-secondary w-[2px]" />
          <h3 className="to-slate-500 float-end flex flex-row items-center">
            <CalendarDays className="w-4 mr-1" />
            Ends in {format(new Date(end_date), "dd/MM/yyyy")}
          </h3>
        </div>
        <Image
          src={`${image_url}`}
          width={300}
          height={200}
          className="bg-secondary p-2 aspect-video mb-2 rounded-md"
          alt="Auction Image"
        />
        <p className="line-clamp-2 mb-1 text-slate-500 text-ellipsis">
          {description || ""}
        </p>
        <div className="bg-secondary p-1 px-2 rounded-md mb-2">
          <div className="flex flex-row gap-2 items-center">
            <h3 className="flex-1 text-nowrap">Current Bid: {high_bid}</h3>
            {/* <h3 className="line-clamp-1 text-sm text-slate-500">
              By L. Rukantha
            </h3> */}
          </div>
          <hr className="bg-slate-800" />
          <h3>Starting Bid: {start_bid}</h3>
        </div>
        {session.data?.user.id !== lister_id && (
          <div className="flex flex-row gap-2">
            <Input
              placeholder="Enter Bid Amount"
              min={high_bid}
              onChange={(e) => setBidAmount(Number(e.target.value))}
              type="number"
              defaultValue={bidAmount + 500}
            />
            <div className="flex flex-row gap-2">
              <Button
                onClick={() => {
                  if (bidAmount - 500 >= high_bid) {
                    setBidAmount(bidAmount - 500);
                  }
                }}
                variant={"secondary"}
              >
                -500
              </Button>
              <Button
                onClick={() => setBidAmount(bidAmount + 500)}
                variant={"secondary"}
              >
                +500
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-row gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full flex-1 px-4"
              variant={"outline"}
              size={"icon"}
            >
              <Eye /> View
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl overflow-hidden">
            <DialogHeader>
              <DialogTitle>{name}</DialogTitle>
              <DialogDescription className="flex flex-col gap-4">
                <Image
                  src={image_url}
                  width={300}
                  height={200}
                  className="bg-secondary flex-initial p-2 aspect-video mb-2 rounded-md"
                  alt="Auction Image"
                />
                <Separator
                  orientation="horizontal"
                  className="bg-slate-800 h-[2px] w-full"
                />
                <div className="flex flex-1 flex-col w-full">
                  <div className="flex flex-col">
                    <Label className="text-lg overflow-hidden text-wrap">
                      {description}
                    </Label>
                    <Label className="text-lg">
                      End Date: {format(new Date(end_date), "dd/MM/yyyy")}
                    </Label>
                    <Label className="text-lg">
                      Starting Bid: ${start_bid}
                    </Label>
                    <Label className="text-lg">
                      Current Highest Bid: ${high_bid}
                    </Label>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit">
                <Share />
                Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {lister_id !== session.data?.user?.id && (
          <Button
            className="flex-1 w-full"
            onClick={async () => {
              try {
                await handlePlaceBid({
                  amount: bidAmount,
                  placed_on: new Date().toISOString(),
                  auction_id: auction_id,
                  bidder_id: session.data?.user?.id as number,
                  status: "active",
                });
              } catch (error) {
                console.error(error);
              }
            }}
          >
            Place Bid
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
