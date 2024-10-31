"use client";

import { SingleImageDropzone } from "@/components/image-dropzone";
import ItemListCard from "@/components/item-list-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { useEdgeStore } from "@/lib/edgestore";
import { getCategories, getFirstLetters } from "@/lib/utils";
import { AuctionItemProps, CategoryProps } from "@/types/types";
import axios from "axios";
import { format, formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  Crown,
  ImageUp,
  LoaderIcon,
  Pencil,
  Save,
  Trash,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("Backend URL is not defined");
}

const Account = () => {
  const session = useSession();
  const user = session.data?.user;
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
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState<string>("");
  const { edgestore } = useEdgeStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://localhost:7174/api/auction/all")
      .then((res) => {
        const { data } = res.data;

        const filteredAuctions = data.filter(
          (auction: AuctionItemProps) =>
            auction.lister_id === session.data?.user.id
        );

        setAuctions(filteredAuctions);
        setLoading(false);
        console.log("Auctions: " + filteredAuctions);
      })
      .catch((error) => {
        console.error("Error fetching auctions:", error);
        setLoading(false);
      });
  }, [session.data?.user.id]);

  useEffect(() => {
    const fetchBids = async () => {
      setLoading(true);
      try {
        if (session.data?.user.id) {
          const res = await axios.get(
            `https://localhost:7174/api/bid/${session.data.user.id}`
          );
          const { data } = res.data;
          setBids(data);
          console.table(data);
        } else {
          setBids([]);
        }
      } catch (error) {
        console.error("Error fetching bids:", error);
        setBids([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [session.data?.user.id]);

  useEffect(() => {
    getCategories().then((data) => {
      setCategories(data.data ? data.data : []);
    });
  }, [session]);

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
        <Card className="p-2 lg:flex-1 min-h-96">
          <Label className="text-2xl font-semibold">My Recent Auctions</Label>
          <Separator className="mb-2" />
          {loading ? (
            <div className="min-h-full flex items-center justify-center">
              <LoaderIcon className="animate-spin -mt-16" />
            </div>
          ) : auctions.length === 0 ? (
            <div className="min-h-full flex items-center justify-center">
              <p className="-mt-20">No auctions found ;(</p>
            </div>
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
                              Make changes to auction details here. Click save
                              when you are done.
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

                            <Label className="text-sm mb-1 mt-2">
                              Category
                            </Label>

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
                                    categories.map(
                                      (category: CategoryProps) => (
                                        <SelectItem
                                          key={category.category_id}
                                          value={category.category_id.toString()}
                                        >
                                          {category.name}
                                        </SelectItem>
                                      )
                                    )}
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

                            <Label className="text-sm mb-1 mt-2">
                              Description
                            </Label>
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

                            <Label className="text-sm mb-1 mt-2">
                              Price (USD)
                            </Label>
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

                            <Label className="text-sm mb-1 mt-2">
                              End Date
                            </Label>
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
        </Card>
        <Card className="p-2 lg:flex-1">
          <Label className="text-2xl font-semibold">Won Bids</Label>
          <Separator className="mb-2" />
          <ScrollArea className="min-h-80 h-full w-full">
            {loading ? (
              <div className="min-h-full flex items-center justify-center">
                <LoaderIcon className="animate-spin -mt-16" />
              </div>
            ) : (
              <>
                {(() => {
                  const winningBids = bids.filter(
                    (bid: {
                      bid_id: string;
                      amount: number;
                      placed_on: Date;
                      auction_id: number;
                      bidder_id: number;
                      auction_title: string;
                      end_date: Date;
                      high_bid: number;
                      status: string;
                    }) => {
                      const isAuctionEnded =
                        new Date(bid.end_date) <= new Date();
                      return isAuctionEnded && bid.amount === bid.high_bid;
                    }
                  );

                  return winningBids.length === 0 ? (
                    <div className="min-h-full flex items-center justify-center">
                      <p className="-mt-16">No items won yet. Keep bidding!</p>
                    </div>
                  ) : (
                    winningBids.map(
                      (bid: {
                        bid_id: string;
                        amount: number;
                        placed_on: Date;
                        auction_id: number;
                        bidder_id: number;
                        auction_title: string;
                        end_date: Date;
                        high_bid: number;
                        status: string;
                      }) => (
                        <ItemListCard
                          key={bid.bid_id}
                          auction_id={bid.auction_id}
                          title={bid.auction_title}
                          placed_on={formatDistanceToNow(
                            new Date(bid.placed_on),
                            {
                              addSuffix: true,
                            }
                          )}
                          status={bid.status}
                        />
                      )
                    )
                  );
                })()}
              </>
            )}
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Account;
