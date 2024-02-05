import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateRequestId() {
  return crypto.randomUUID();
}

export function revalidateUrl(url: string) {
  return `${url}?revalidate=true&ts=${Date.now()}`;
}
