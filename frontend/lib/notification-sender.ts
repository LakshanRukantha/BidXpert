import axios from "axios";

export const sendInSiteNotification = async (
  item_name: string,
  bidder_id: number,
  lister_id: number,
  amount: number
) => {
  try {
    const bidPlacedNotification = async () => {
      await axios.post("https://localhost:7174/api/notifications/add", {
        content: `You have placed a ${amount} bid on ${item_name}`,
        sentDate: new Date(),
        type: "placed",
        status: "bid",
        userId: bidder_id,
      });
      console.log("Bid placed notification sent");
    };

    const bidReceivedNotification = async () => {
      await axios.post("https://localhost:7174/api/notifications/add", {
        content: `You have received a ${amount} bid on ${item_name}`,
        sentDate: new Date(),
        type: "received",
        status: "bid",
        userId: lister_id,
      });
      console.log("Bid received notification sent");
    };

    await bidPlacedNotification();
    await bidReceivedNotification();
  } catch (error) {}
};
