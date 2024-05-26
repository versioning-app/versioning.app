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

export const prettyPrint = (obj: any) => {
  if (!obj) {
    return '';
  }

  return JSON.stringify(obj, null, 2);
};

export const capitalizeFirstLetter = (str: string) => {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }

  if (str.length === 1) {
    return str.toUpperCase();
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'https://localhost:3000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export const snakeToCamel = (input: string) =>
  input
    .toLowerCase()
    .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());
