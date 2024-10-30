"use client";

import { SingleImageDropzone } from "@/components/image-dropzone";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
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
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { getCategories } from "@/lib/utils";
import { AuctionItemProps, CategoryProps } from "@/types/types";
import axios from "axios";
import { format } from "date-fns";
import {
  CalendarIcon,
  ImageUp,
  LoaderIcon,
  Pencil,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("Backend URL is not defined");
}

const ManageAuctions = () => {
  const session = useSession();
  const [auctions, setAuctions] = useState<AuctionItemProps[]>([]);

  const [editAuction, setEditAuction] = useState({
    auction_id: 0,
    name: "",
    description: "",
    start_bid: 0,
    high_bid: 0,
    image_url: "",
    listed_on: "",
    end_date: "",
    status: "",
    lister_id: 0,
    category_id: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    axios.get("https://localhost:7174/api/auction/all").then((res) => {
      const { data } = res.data;
      setAuctions(data);
      setLoading(false);
      console.log(data);
    });
  }, []);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data.data ? data.data : []);
    });
  }, [session]);

  const toast = useToast().toast;

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string>("");
  const { edgestore } = useEdgeStore();

  const handleAuctionUpdate = async (auction_id: number) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/auction/${auction_id}`,
        editAuction
      );

      if (response.status === 200) {
        toast({
          variant: "default",
          title: "Success 🎉",
          description: "Auction updated successfully",
        });
      }

      // Update the auction locally without refetching all auctions
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) =>
          auction.auction_id === auction_id
            ? { ...auction, ...editAuction }
            : auction
        )
      );
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again later",
      });
    }
  };

  const handleAuctionDelete = async (auction_id: number) => {
    try {
      axios
        .delete(`${backendUrl}/api/auction/delete/${auction_id}`)
        .then((res) => {
          if (res.status === 200) {
            toast({
              variant: "default",
              title: "Success 🎉",
              description: "Auction deleted successfully",
            });
          }
          setAuctions((prevAuctions) =>
            prevAuctions.filter((auction) => auction.auction_id !== auction_id)
          );
        });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again later",
      });
    }
  };

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
              {categories.length > 0 &&
                categories.map((category: CategoryProps) => (
                  <SelectItem
                    key={category.category_id}
                    value={category.category_id.toString()}
                  >
                    {category.name}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input className="flex-grow" placeholder="Search for items..." />
        <Button className="lg:max-w-40 w-full">
          <Search />
          Search
        </Button>
      </div>
      {loading ? (
        <LoaderIcon className="animate-spin" />
      ) : (
        <Table className="relative">
          <TableCaption>A list of all auctions.</TableCaption>
          <TableHeader className="sticky top-4 bg-secondary">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {auctions.map((auction: AuctionItemProps) => (
              <TableRow key={auction.auction_id}>
                <TableCell className="font-medium">
                  {auction.auction_id}
                </TableCell>
                <TableCell>{auction.name}</TableCell>
                <TableCell>{auction.start_bid}</TableCell>
                <TableCell>
                  {format(new Date(auction.end_date), "dd/MM/yyyy")}
                </TableCell>
                <TableCell className="flex items-center gap-2 justify-end">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"secondary"}
                        onClick={() => {
                          setEditAuction({
                            auction_id: auction.auction_id,
                            name: auction.name,
                            description: auction.description,
                            start_bid: auction.start_bid,
                            high_bid: auction.high_bid,
                            image_url: auction.image_url,
                            listed_on: auction.listed_on,
                            end_date: auction.end_date,
                            status: auction.status,
                            lister_id: auction.lister_id,
                            category_id: auction.category_id,
                          });
                        }}
                      >
                        <Pencil />
                        <span className="hidden lg:block"> Edit</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Auction Details</DialogTitle>
                        <DialogDescription>
                          Make changes to auction details here. Click save when
                          you are done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid py-4">
                        <Label className="text-sm mb-1">Title</Label>
                        <Input
                          type="text"
                          defaultValue={auction?.name}
                          onChange={(e) =>
                            setEditAuction((prevAuction) => ({
                              ...prevAuction,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter item title"
                        />

                        <Label className="text-sm mb-1 mt-2">Category</Label>

                        <Select
                          onValueChange={(value) => {
                            setEditAuction((prevAuction) => {
                              return {
                                ...prevAuction,
                                category_id: parseInt(value),
                              };
                            });
                          }}
                          defaultValue={auction?.category_id.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Categories</SelectLabel>
                              {categories.length > 0 &&
                                categories.map((category: CategoryProps) => (
                                  <SelectItem
                                    key={category.category_id}
                                    value={category.category_id.toString()}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        <Label className="text-sm mb-1 mt-2">Image</Label>
                        <div className="flex flex-row items-center gap-2">
                          <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                              <Button
                                className={`flex-auto ${
                                  !auction.image_url && "w-full"
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
                                    const res =
                                      await edgestore.auctionImages.upload({
                                        file,
                                        onProgressChange: (progress) => {
                                          setProgress(progress);
                                        },
                                      });
                                    // Server actions here
                                    console.log(res);
                                    setUrl(res.url);
                                    setEditAuction((prevAuction) => {
                                      return {
                                        ...prevAuction,
                                        image_url: res.url,
                                      };
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
                            disabled={true}
                            type="text"
                            defaultValue={auction?.image_url}
                            placeholder="This will be automatically filled"
                            className={`hidden ${
                              auction.image_url && "block flex-auto"
                            }`}
                          />
                        </div>

                        <Label className="text-sm mb-1 mt-2">Description</Label>
                        <Textarea
                          placeholder="Enter item description"
                          defaultValue={auction.description}
                          onChange={(e) => {
                            setEditAuction((prevAuction) => ({
                              ...prevAuction,
                              description: e.target.value,
                            }));
                          }}
                        />

                        <Label className="text-sm mb-1 mt-2">Price (USD)</Label>
                        <Input
                          type="number"
                          placeholder="Enter item price"
                          defaultValue={auction.start_bid}
                          onChange={(e) => {
                            setEditAuction((prevAuction) => ({
                              ...prevAuction,
                              start_bid: parseInt(e.target.value),
                            }));
                          }}
                        />

                        <Label className="text-sm mb-1 mt-2">End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={`w-full justify-start text-left font-normal`}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={new Date()}
                              onSelect={(date) => {
                                setDate(date);
                                setEditAuction((prevAuction) => ({
                                  ...prevAuction,
                                  end_date: date ? date.toISOString() : "",
                                }));
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <DialogFooter>
                        <DialogTrigger asChild>
                          <Button
                            type="submit"
                            onClick={() => {
                              console.log(editAuction);
                              handleAuctionUpdate(auction.auction_id);
                            }}
                          >
                            <Save />
                            Save changes
                          </Button>
                        </DialogTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant={"destructive"}
                    onClick={async () =>
                      await handleAuctionDelete(auction.auction_id)
                    }
                  >
                    <Trash2 />
                    <span className="hidden lg:block">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ManageAuctions;
