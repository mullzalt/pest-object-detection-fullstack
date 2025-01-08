import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dateStringToLocale = (str: string) => {
  const date = new Date(str);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  return formatter.format(date);
};

export const dateStringToLocaleShort = (str: string) => {
  const date = new Date(str);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });
  return formatter.format(date);
};
