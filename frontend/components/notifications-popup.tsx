import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";

const NotificationsPopup = ({
  user_id,
  children,
}: {
  user_id: string;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="grid py-4 text-center">Nothing to see here</div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationsPopup;
