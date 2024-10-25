"use client";

import Image from "next/image";
import { useState } from "react";
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

export default function AuctionItem() {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [bidAmount, setBidAmount] = useState<number>(0);

  return (
    <Card className="p-2 max-w-72 w-full">
      <CardHeader>
        <CardTitle className="text-ellipsis line-clamp-1">
          Auction Item shdf iugfi iusegf uief
        </CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-between mb-2">
          <h3 className="to-slate-500 float-end">By Janith</h3>
          <Separator orientation="vertical" className="bg-secondary w-[2px]" />
          <h3 className="to-slate-500 float-end flex flex-row items-center">
            <CalendarDays className="w-4 mr-1" />
            Ends in 2h:05m:40s
          </h3>
        </div>
        <Image
          src="/favicon.ico"
          width={300}
          height={200}
          className="bg-secondary p-2 aspect-video mb-2 rounded-md"
          alt="Auction Image"
        />
        <p className="line-clamp-2 mb-1 text-slate-500 text-ellipsis">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore,
          vero. Aspernatur at ipsam voluptas vitae aliquam animi repellendus,
          maxime a, reiciendis, unde optio!
        </p>
        <div className="bg-secondary p-1 px-2 rounded-md mb-2">
          <div className="flex flex-row gap-2 items-center">
            <h3 className="flex-1 text-nowrap">Current Bid: 1500</h3>
            <h3 className="line-clamp-1 text-sm text-slate-500">
              By L. Rukantha
            </h3>
          </div>
          <hr className="bg-slate-800" />
          <h3>Starting Bid: 1500</h3>
        </div>
        <div className="flex flex-row gap-2">
          <Input
            placeholder="Enter Bid Amount"
            onChange={(e) => setBidAmount(Number(e.target.value))}
            type="number"
            value={bidAmount}
          />
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => bidAmount > 0 && setBidAmount(bidAmount - 500)}
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
                Make changes to your auction item here. Click save when you are
                done.
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

        <Button
          className="w-full flex-1"
          onClick={async () => {
            toast({
              variant: "default",
              title: "This is a title",
              description: "This is a description",
            });
            await sendEmailNotification({
              auctionListerEmail: "rukanthalakshan@gmail.com",
              auctionListerName: "Lakshan Rukantha",
              bidderEmail: "test@gmail.com",
              bidderName: "Test User",
              expiresOn: new Date(),
              itemId: 5,
              itemName: "iPhone 16 Pro Max",
              bidAmount: bidAmount,
            });
          }}
        >
          Place Bid
        </Button>
      </CardFooter>
    </Card>
  );
}
