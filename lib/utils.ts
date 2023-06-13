import axios from "axios";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (...args: any[]) =>
  fetch(...args).then((res) => res.json());

export const amountFormatter = (amount: number) => {
  return formatter.format(amount / 100);
};
