"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Pencil, Trash, CalendarDays, CalendarIcon, Save } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";
import sendEmailNotification from "@/lib/bid-mail-sender";
import { AuctionItemProps } from "@/types/types";
import { useSession } from "next-auth/react";
import axios from "axios";

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
  const [date, setDate] = useState<Date>();
  const [listerEmail, setListerEmail] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>(high_bid);

  // get lister email from lister id
  useEffect(() => {
    axios.get(`https://localhost:7174/api/user/${lister_id}`).then((res) => {
      const { data } = res.data;
      setListerEmail(data.email);
    });
  }, [lister_id]);

  return (
    <Card className="p-2 max-w-72 w-full">
      <CardHeader>
        <CardTitle className="text-ellipsis line-clamp-1">
          {name || ""}
        </CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between mb-2">
          <h3 className="to-slate-500 float-end">By {listerName}</h3>
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
            <h3 className="line-clamp-1 text-sm text-slate-500">
              By L. Rukantha
            </h3>
          </div>
          <hr className="bg-slate-800" />
          <h3>Starting Bid: {start_bid}</h3>
        </div>
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Enter Bid Amount"
            min={high_bid}
            onChange={(e) => setBidAmount(Number(e.target.value))}
            type="number"
            value={bidAmount}
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
      </CardContent>
      <CardFooter className="flex flex-row gap-2">
        {lister_id === session.data?.user?.id && (
          <>
            <Button variant={"destructive"} size={"icon"}>
              <Trash />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size={"icon"} variant={"outline"}>
                  <Pencil />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Auction Item</DialogTitle>
                  <DialogDescription>
                    Make changes to your auction item here. Click save when you
                    are done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid py-4">
                  <Label htmlFor="title" className="mb-1">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter Title"
                    className="mb-2"
                  />
                  <Label htmlFor="description" className="mb-1">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter description"
                    className="mb-2"
                  />
                  <Label htmlFor="startingBid" className="mb-1">
                    Starting Bid
                  </Label>
                  <Input
                    id="startingBid"
                    name="startingBid"
                    type="number"
                    placeholder="Enter starting bid amount..."
                    className="mb-2"
                  />
                  <Label htmlFor="status" className="mb-1">
                    Status
                  </Label>
                  <Select onValueChange={() => console.log("Value")}>
                    <SelectTrigger className="flex-auto w-full mb-2">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="close">Close</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Label htmlFor="end-date" className="mb-1">
                    End Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    <Save />
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        <Button
          className="w-full flex-1"
          disabled={
            bidAmount <= high_bid && lister_id === session.data?.user?.id
          }
          onClick={async () => {
            try {
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
              console.error(error);
            }
          }}
        >
          Place Bid
        </Button>
      </CardFooter>
    </Card>
  );
}
