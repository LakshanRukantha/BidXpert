"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import React, { useEffect } from "react";
import { SignInInputs } from "@/types/types";
import { CircleAlert } from "lucide-react";
import signInValidationSchema from "@/schemas/SignInValidationSchema";
import { redirect } from "next/navigation";

const nextPublicUrl = process.env.NEXT_PUBLIC_URL as string;

const SignIn = () => {
  const toast = useToast().toast;
  const form = useForm<SignInInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: yupResolver(signInValidationSchema),
  });
  const { register, handleSubmit, reset, formState } = form;
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  // Reset Form
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const session = useSession();

  // If session is loading, show loading screen and if session is authenticated, redirect to profile page
  if (session.status === "loading") {
    return <div>Loading...</div>;
  } else if (session.status === "authenticated") {
    redirect("/");
  }

  const onSubmit: SubmitHandler<SignInInputs> = async (data) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: nextPublicUrl,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid email or password",
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center min-h-full justify-center w-full"
    >
      <Card className="p-2 md:p-3 lg:p-4 max-w-xl -mt-12 md:-mt-16 lg:-mt-20 w-full">
        {session.status}
        {nextPublicUrl}
        <h1 className="text-xl md:text-2xl lg:text-3xl">
          Let’s Get You Signed In
        </h1>
        <p className="text-sm text-slate-500 mb-2 md:mb-3 lg:mb-4">
          Welcome back! Sign in to your account to continue
        </p>
        <Label className="text-sm mb-1">Email</Label>
        <Input
          type="email"
          placeholder="Enter your email"
          className={`${errors.email ? "border-red-500" : "border-input"}`}
          {...register("email")}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <CircleAlert className="w-4" />
            {errors.email?.message}
          </p>
        )}
        <Label className="text-sm mb-1 mt-2">Password</Label>
        <Input
          type="password"
          placeholder="Enter your password"
          className={`${errors.password ? "border-red-500" : "border-input"}`}
          {...register("password")}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <CircleAlert className="w-4" />
            {errors.password?.message}
          </p>
        )}
        <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
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
