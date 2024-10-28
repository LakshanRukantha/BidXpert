import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstLetters(input: string) {
  const words = input.split(" ");
  const firstLetters = words.map((word: string) => word.charAt(0));
  return firstLetters[0] + firstLetters[1];
}
