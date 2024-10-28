"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import { RegistrationInputs } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { CircleAlert } from "lucide-react";
import signUpValidationSchema from "@/schemas/SignUpValidationSchema";
import axios from "axios";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("Backend URL is not defined");
}

const SignUp = () => {
  const toast = useToast().toast;
  const form = useForm<RegistrationInputs>({
    defaultValues: {
      f_name: "",
      l_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    mode: "onTouched",
    resolver: yupResolver(signUpValidationSchema), // yup resolver for validation
  });

  const { register, handleSubmit, reset, formState } = form;
  const { errors, isSubmitting } = formState;

  const onSubmit: SubmitHandler<RegistrationInputs> = async (data) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/signup`, {
        firstname: data.f_name,
        lastname: data.l_name,
        email: data.email,
        password: data.password,
        regDate: new Date(),
        isAdmin: false,
      });

      if (response.status === 200) {
        reset();
        toast({
          variant: "default",
          title: "Success",
          description: "You have successfully registered. Please sign in.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred. Please try again later.",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios error
        console.log(error.response?.data);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error.response?.data?.message ||
            "An error occurred. Please try again later.",
        });
      } else {
        // Handle other errors
        console.log(error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center min-h-full justify-center w-full"
      noValidate
    >
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
          className={`${errors.f_name ? "border-red-500" : "border-input"}`}
          placeholder="Enter your first name..."
          {...register("f_name")}
          disabled={isSubmitting}
        />
        {errors.f_name && (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <CircleAlert className="w-4" />
            {errors.f_name?.message}
          </p>
        )}
        <Label className="text-sm mb-1 mt-2">Last Name</Label>
        <Input
          type="text"
          className={`${errors.l_name ? "border-red-500" : "border-input"}`}
          placeholder="Enter your last name..."
          {...register("l_name")}
          disabled={isSubmitting}
        />
        {errors.l_name && (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <CircleAlert className="w-4" />
            {errors.l_name?.message}
          </p>
        )}
        <Label className="text-sm mb-1 mt-2">Email</Label>
        <Input
          type="email"
          className={`${errors.email ? "border-red-500" : "border-input"}`}
          placeholder="Enter your email"
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
          className={`${errors.password ? "border-red-500" : "border-input"}`}
          placeholder="Enter your password"
          {...register("password")}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <CircleAlert className="w-4" />
            {errors.password?.message}
          </p>
        )}
        <Label className="text-sm mb-1 mt-2">Confirm Password</Label>
        <Input
          type="password"
          className={`${
            errors.confirm_password ? "border-red-500" : "border-input"
          }`}
          placeholder="Confirm your password"
          {...register("confirm_password")}
          disabled={isSubmitting}
        />
        {errors.confirm_password && (
          <p className="flex items-center gap-1 text-xs text-red-500">
            <CircleAlert className="w-4" />
            {errors.confirm_password?.message}
          </p>
        )}
        <Button type="submit" className="w-full mt-2 uppercase">
          Sign Up
        </Button>
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
