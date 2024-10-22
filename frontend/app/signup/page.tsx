import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";

const SignUp = () => {
  return (
    <form className="flex items-center min-h-full justify-center w-full">
      <Card className="p-2 md:p-3 lg:p-4 max-w-xl -mt-12 md:-mt-16 lg:-mt-20 w-full">
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          Welcome! Create Your Account
        </h1>
        <p className="text-sm text-slate-500 mb-2 md:mb-3 lg:mb-4">
          Create an account to unlock exclusive access to live auctions
        </p>
        <Label className="text-sm mb-1">First Name</Label>
        <Input
          type="text"
          name="fName"
          placeholder="Enter your first name..."
          className="mb-2"
        />
        <Label className="text-sm mb-1">Last Name</Label>
        <Input
          type="text"
          name="lName"
          placeholder="Enter your last name..."
          className="mb-2"
        />
        <Label className="text-sm mb-1">Email</Label>
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          className="mb-2"
        />
        <Label className="text-sm mb-1">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Enter your password"
          className="mb-2"
        />
        <Label className="text-sm mb-1">Confirm Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          className="mb-2"
        />
        <Button className="w-full mt-2 uppercase">Sign Up</Button>
        <p className="text-sm text-slate-500 mt-2 float-end">
          Already have an account?{" "}
          <Link className="flex-1 text-blue-500" href="/signin">
            Sign In
          </Link>
        </p>
      </Card>
    </form>
  );
};

export default SignUp;
