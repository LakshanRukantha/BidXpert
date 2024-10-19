import * as React from "react";
import ModeToggle from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="flex items-center flex-col">
      <h1 className="text-5xl text-center my-5">Welcome To BidXpert</h1>
      <ModeToggle />
    </div>
  );
}
