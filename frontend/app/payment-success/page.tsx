import { CircleCheckBig } from "lucide-react";
import React from "react";

const PaymentSuccess = () => {
  return (
    <div className="min-h-full gap-6 flex flex-col items-center justify-center">
      <CircleCheckBig className="h-16 -mt-16 text-green-500 w-16" />
      <h1 className="text-4xl">Payment Successful!</h1>
      <h2 className="text-center max-w-md text-lg text-slate-500">
        Thank you for your payment. We’ve successfully processed your
        transaction. If you have any questions or need further assistance, feel
        free to contact us. We appreciate your trust and look forward to serving
        you!
      </h2>
    </div>
  );
};

export default PaymentSuccess;
