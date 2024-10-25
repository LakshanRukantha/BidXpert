import axios from "axios";

const sendEmailNotification = async ({
  auctionListerName,
  auctionListerEmail,
  bidderName,
  bidderEmail,
  itemId,
  itemName,
  bidAmount,
  expiresOn,
}: {
  auctionListerName: string;
  auctionListerEmail: string;
  bidderName: string;
  bidderEmail: string;
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
        itemId,
        itemName,
        bidAmount,
        expiresOn,
      })
      .then((response) => {
        console.log(response.data);
      });
  } catch (error) {
    console.error(error);
  }
};

export default sendEmailNotification;
