import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import React from "react";

const SignIn = () => {
  return (
    <form className="flex items-center min-h-full justify-center w-full">
      <Card className="p-2 md:p-3 lg:p-4 max-w-xl -mt-12 md:-mt-16 lg:-mt-20 w-full">
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          Let’s Get You Signed In
        </h1>
        <p className="text-sm text-slate-500 mb-2 md:mb-3 lg:mb-4">
          Welcome back! Sign in to your account to continue
        </p>
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
        <Button className="w-full mt-2">Sign In</Button>
        <p className="text-sm text-slate-500 mt-2 float-end">
          Don’t have an account?{" "}
          <Link className="flex-1 text-blue-500" href="/signup">
            Sign Up
          </Link>
        </p>
      </Card>
    </form>
  );
};

export default SignIn;
