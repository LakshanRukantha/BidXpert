import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { TransactionProps } from "@/types/types";
import { format } from "date-fns";

export default function TransactionCard({
  title,
  amount,
  date,
  status,
  transactionId,
}: TransactionProps) {
  return (
    <Card className="p-4 flex flex-row justify-between items-center">
      <h2>{title}</h2>
      <p>${amount}</p>
      <p>
        {format(new Date(date), "dd/MM/yyyy")}
        <span className="hidden lg:inline">
          {" "}
          {format(new Date(date), "hh:mm a")}
        </span>
      </p>
      <Badge className="bg-green-500">{status}</Badge>
      <Button
        variant={"destructive"}
        size={"icon"}
        onClick={() => {
          console.log("Delete transaction with id:", transactionId);
        }}
      >
        <Trash />
      </Button>
    </Card>
  );
}
