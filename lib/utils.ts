import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const  AUTH_STORAGE_KEYS = {
  USER: "user",
  TOKEN: "authToken",
  USER_ID: "userId",
};