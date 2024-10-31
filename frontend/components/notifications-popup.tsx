import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowBigDownDash,
  ArrowBigUpDash,
  CircleCheckBig,
  CircleX,
} from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";

const NotificationsPopup = ({
  user_id,
  children,
}: {
  user_id: string;
  children: React.ReactNode;
}) => {
  console.log("user_id", user_id);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7174/api/notifications/all/${user_id}`
        );
        const { data } = res.data;
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [user_id]);

  const handleDeleteNotification = async (notification_id: number) => {
    try {
      await axios.delete(
        `https:localhost:7174/api/notifications/delete/${notification_id}`
      );
      toast({
        variant: "default",
        title: "Success",
        description: "Notification deleted successfully",
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification: any) => notification.notificationId !== notification_id
        )
      );
    } catch (error) {
      console.log(`Something went wrong. Error: ${error}`);
    }
  };

  const handleOpen = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the dropdown from closing
    setIsOpen(true);
  };

  return (
    <>
      <div onMouseDown={handleOpen}>{children}</div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <Separator />
          <ScrollArea className="max-h-[600px] h-full w-full">
            <div className="h-full w-full flex flex-col gap-4">
              {notifications.length === 0 ? (
                <p className="text-center w-full">No Notifications</p>
              ) : (
                notifications.map(
                  (notification: {
                    notificationId: number;
                    type: string;
                    content: string;
                    sentDate: string;
                  }) => (
                    <Card
                      className="w-full p-4 flex flex-row items-center justify-between"
                      key={notification.notificationId}
                    >
                      <div className="flex flex-row items-center gap-4">
                        {notification.type === "placed" && <ArrowBigUpDash />}
                        {notification.type === "received" && (
                          <ArrowBigDownDash />
                        )}
                        {notification.type === "claimed" && <CircleCheckBig />}
                        <p>{notification.content}</p>
                      </div>
                      <p>
                        {formatDistanceToNow(new Date(notification.sentDate), {
                          addSuffix: true,
                        })}
                      </p>
                      <Button
                        variant={"destructive"}
                        size={"icon"}
                        onClick={async () => {
                          await handleDeleteNotification(
                            notification.notificationId
                          );
                        }}
                      >
                        <CircleX />
                      </Button>
                    </Card>
                  )
                )
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationsPopup;
