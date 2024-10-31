import { toast } from "@/hooks/use-toast";
import axios from "axios";

const sendEmailNotification = async ({
  auctionListerName,
  auctionListerEmail,
  bidderName,
  bidderEmail,
  bidderId,
  itemId,
  itemName,
  bidAmount,
  expiresOn,
}: {
  auctionListerName: string;
  auctionListerEmail: string;
  bidderName: string;
  bidderEmail: string;
  bidderId: number;
  itemId: number;
  itemName: string;
  bidAmount: number;
  expiresOn: Date;
}) => {
  try {
    await axios
      .post("/api/bid-notification", {
        auctionListerName,
        auctionListerEmail,
        bidderName,
        bidderEmail,
        bidderId,
        itemId,
        itemName,
        bidAmount,
        expiresOn,
      })
      .then((response) => {
        console.log(response.data);
        toast({
          variant: "default",
          title: "Success",
          description: "Your bid has been placed successfully.",
        });
      });
  } catch (error) {
    console.error(error);
  }
};

export default sendEmailNotification;
