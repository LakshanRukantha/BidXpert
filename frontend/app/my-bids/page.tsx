"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { format } from "date-fns";
import { LoaderIcon, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const MyBids = () => {
  const session = useSession();
  const router = useRouter();
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDeleteBid = async (bidId: number) => {
    try {
      await axios
        .delete(`https://localhost:7174/api/bid/delete/${bidId}`)
        .then(() => {
          toast({
            variant: "default",
            title: "Success",
            description: "Bid deleted successfully.",
          });
          setBids((prevBids) =>
            prevBids.filter(
              (bid: {
                bid_id: number;
                auction_title: string;
                placed_on: string;
                amount: number;
              }) => bid.bid_id !== bidId
            )
          );
        });
    } catch (error) {
      console.error("Error deleting bid:", error);
    }
  };

  return (
    <div className="relative flex items-center flex-col">
      {loading ? (
        <LoaderIcon className="animate-spin" />
      ) : bids.length === 0 ? (
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold">No bids found 😢</h1>
          <p className="text-gray-500">
            You have not placed any bids yet. Click the button below to start.
          </p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Place a Bid
          </Button>
        </div>
      ) : (
        <Table className="relative">
          <TableCaption>A list of all your bids.</TableCaption>
          <TableHeader className="sticky top-4 bg-secondary">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Placed On</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bids.map(
              (bid: {
                bid_id: number;
                auction_title: string;
                placed_on: string;
                amount: number;
              }) => (
                <TableRow key={bid.bid_id}>
                  <TableCell className="font-medium">{bid.bid_id}</TableCell>
                  <TableCell>{bid.auction_title}</TableCell>
                  <TableCell>{bid.amount}</TableCell>
                  <TableCell>
                    {format(new Date(bid.placed_on), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="flex items-center gap-2 justify-end">
                    <Button
                      variant={"destructive"}
                      onClick={async () => await handleDeleteBid(bid.bid_id)}
                    >
                      <Trash2 />
                      <span className="hidden lg:block">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default MyBids;
