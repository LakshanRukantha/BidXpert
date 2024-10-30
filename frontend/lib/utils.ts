import axios, { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!backendUrl) {
  throw new Error("Backend URL is not defined");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstLetters(input: string) {
  const words = input.split(" ");
  const firstLetters = words.map((word: string) => word.charAt(0));
  return firstLetters[0] + firstLetters[1];
}

// catch all function for handling errors
export async function getCategories() {
  try {
    const res = await axios.get(`${backendUrl}/api/categories/all`);
    return res.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error.message);
    return [];
  }
}
