import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Pencil, Trash, CalendarDays } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "@radix-ui/react-separator";

export default function AuctionItem() {
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
          <Input placeholder="Enter Bid Amount" type="number" />
          <div className="flex flex-row gap-2">
            <Button variant={"secondary"}>-500</Button>
            <Button variant={"secondary"}>+500</Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row gap-2">
        <Button variant={"destructive"} size={"icon"}>
          <Trash />
        </Button>
        <Button size={"icon"} variant={"outline"}>
          <Pencil />
        </Button>
        <Button className="w-full flex-1">Place Bid</Button>
      </CardFooter>
    </Card>
  );
}
