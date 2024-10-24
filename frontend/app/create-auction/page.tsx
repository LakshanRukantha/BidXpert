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
import { BadgePlus, CalendarIcon, CircleAlert, ImageUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import auctionValidationSchema from "@/schemas/AuctionValidationSchema";
import { AuctionInputs } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SingleImageDropzone } from "@/components/image-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { Progress } from "@/components/ui/progress";

const CreateAuction = () => {
  const toast = useToast().toast;
  const form = useForm<AuctionInputs>({
    defaultValues: {
      title: "",
      category: "",
      image: "",
      description: "",
      price: 0,
      end_date: undefined,
    },
    mode: "onTouched",
    resolver: yupResolver(auctionValidationSchema),
  });

  const { register, handleSubmit, reset, setValue, formState } = form;
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string>("");
  const { edgestore } = useEdgeStore();

  // Reset Form
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
      setUrl("");
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmit = async (data: AuctionInputs) => {
    // Handle form submission here (e.g., sending data to the server)
    console.log(data);
    toast({ description: "Auction created successfully!" });
  };
  return (
    <div className="flex items-center min-h-full justify-center w-full">
      <Card className="p-2 md:p-3 lg:p-4 max-w-xl -mt-12 md:-mt-16 lg:-mt-20 w-full">
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          List Your Item for Auction
        </h1>
        <p className="text-gray-600 mb-4">
          Fill out the form below to list your item for auction.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Label className="text-sm mb-1">Title</Label>
          <Input
            type="text"
            placeholder="Enter item title"
            className={`${errors.title ? "border-red-500" : "border-input"}`}
            {...register("title")}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <CircleAlert className="w-4" />
              {errors.title?.message}
            </p>
          )}
          <Label className="text-sm mb-1 mt-2">Category</Label>
          <Controller
            name="category"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Select
                onValueChange={onChange}
                value={value}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  className={`${
                    errors.category ? "border-red-500" : "border-input"
                  } w-full`}
                >
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
            )}
            rules={{ required: "Category is required" }} // Add validation if needed
          />
          {errors.category && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <CircleAlert className="w-4" />
              {errors.category?.message}
            </p>
          )}
          <Label className="text-sm mb-1 mt-2">Image</Label>
          <div className="flex flex-row items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className={`flex-auto ${!url && "w-full"} ${
                    errors.description ? "border-red-500" : "border-input"
                  }`}
                  variant={"outline"}
                >
                  <ImageUp /> Upload Image
                </Button>
              </DialogTrigger>
              <DialogContent className="w-fit">
                <DialogHeader>
                  <DialogTitle>Upload Image</DialogTitle>
                  <DialogDescription>
                    Upload auction image here
                  </DialogDescription>
                </DialogHeader>
                <SingleImageDropzone
                  width={400}
                  height={200}
                  value={file}
                  dropzoneOptions={{
                    maxSize: 1024 * 1024 * 1, // 1MB
                  }}
                  onChange={(file) => {
                    setFile(file);
                  }}
                />
                {url === "" && (
                  <div className="flex flex-row items-center gap-2 justify-between">
                    <Progress value={progress} />
                    <span>{`${progress}%`}</span>
                  </div>
                )}
                <Button
                  onClick={async () => {
                    if (file) {
                      const res = await edgestore.auctionImages.upload({
                        file,
                        onProgressChange: (progress) => {
                          setProgress(progress);
                        },
                      });
                      // Server actions here
                      console.log(res);
                      setUrl(res.url);
                      setValue("image", res.url, {
                        shouldValidate: true,
                      });
                    }
                  }}
                  className="w-full"
                >
                  Upload
                </Button>
              </DialogContent>
            </Dialog>
            <Input
              type="text"
              value={url && url}
              placeholder="This will be automatically filled"
              className={`hidden ${url && "block flex-auto"}`}
              {...register("image")}
              disabled={true}
            />
          </div>
          {errors.image && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <CircleAlert className="w-4" />
              {errors.image?.message}
            </p>
          )}
          <Label className="text-sm mb-1 mt-2">Description</Label>
          <Textarea
            placeholder="Enter item description"
            className={`${
              errors.description ? "border-red-500" : "border-input"
            }`}
            {...register("description")}
            disabled={isSubmitting}
          />
          {errors.description && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <CircleAlert className="w-4" />
              {errors.description?.message}
            </p>
          )}
          <Label className="text-sm mb-1 mt-2">Price (USD)</Label>
          <Input
            type="number"
            placeholder="Enter item price"
            className={`${errors.price ? "border-red-500" : "border-input"}`}
            {...register("price")}
            disabled={isSubmitting}
          />
          {errors.price && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <CircleAlert className="w-4" />
              {errors.price?.message}
            </p>
          )}
          <Label className="text-sm mb-1 mt-2">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  `${
                    errors.end_date ? "border-red-500" : "border-input"
                  } w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground`
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date || undefined}
                onSelect={(selectedDate: Date | undefined) => {
                  setDate(selectedDate);
                  setValue("end_date", selectedDate as Date, {
                    shouldValidate: true,
                  });
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.end_date && (
            <p className="flex items-center gap-1 text-xs text-red-500">
              <CircleAlert className="w-4" />
              {errors.end_date?.message}
            </p>
          )}
          <Button className="mt-4 float-end" type="submit">
            <BadgePlus /> Create Auction
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateAuction;
