"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { BadgePlus, CalendarIcon } from "lucide-react";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const CreateAuction = () => {
  const [date, setDate] = useState<Date>();
  return (
    <div className="flex items-center min-h-full justify-center w-full">
      <Card className="p-2 md:p-3 lg:p-4 max-w-xl -mt-12 md:-mt-16 lg:-mt-20 w-full">
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          List Your Item for Auction
        </h1>
        <p className="text-gray-600 mb-4">
          Fill out the form below to list your item for auction.
        </p>
        <form>
          <Label className="text-sm mb-1">Title</Label>
          <Input type="text" placeholder="Enter item title" />
          <Label className="text-sm mb-1">Image</Label>
          <Input type="file" placeholder="Upload item image" />
          <Label className="text-sm mb-1 mt-2">Description</Label>
          <Textarea placeholder="Enter item description" />
          <Label className="text-sm mb-1 mt-2">Price (USD)</Label>
          <Input type="number" placeholder="Enter item price" />
          <Label className="text-sm mb-1 mt-2">End Date</Label>
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
          <Button className="mt-4 float-end" type="submit">
            <BadgePlus /> Create Auction
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateAuction;
