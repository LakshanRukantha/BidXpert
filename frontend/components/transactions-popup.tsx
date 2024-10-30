import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import TransactionCard from "./transaction-card";
import axios from "axios";
import { TransactionProps } from "@/types/types";

const TransactionsPopup = ({
  user_id,
  children,
}: {
  user_id: number;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios
      .get(`https://localhost:7174/api/transactions/user/${user_id}`)
      .then((res) => {
        const { data } = res.data;
        setTransactions(data);
        console.log(data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          console.log("No transactions found for this user.");
          setTransactions([]);
        } else {
          console.error("An error occurred:", error.message);
        }
      });
  }, [user_id]);

  const handleOpen = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the dropdown from closing
    setIsOpen(true);
  };

  return (
    <>
      <div onMouseDown={handleOpen}>{children}</div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Transactions</DialogTitle>
          </DialogHeader>
          <Separator />
          {transactions.length === 0 ? (
            <div className="grid py-4 text-center">Nothing to see here</div>
          ) : (
            transactions.map((transaction: TransactionProps) => (
              <TransactionCard
                transactionId={transaction.transactionId}
                amount={transaction.amount}
                date={transaction.date}
                status={transaction.status}
                title={transaction.title || "No title"}
                auctionId={transaction.auctionId}
                key={transaction.transactionId}
              />
            ))
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionsPopup;
