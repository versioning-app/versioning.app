import { clsx, type ClassValue } from 'clsx';
import { revalidatePath } from 'next/cache';
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

export function revalidatePaths(...paths: string[]) {
  'use server';

  if (paths.length === 0) {
    return '';
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return `${paths[0]}?revalidate=true&ts=${Date.now()}`;
}

export const capitalizeFirstLetter = (str: string) => {
  if (typeof str !== 'string' || str.length === 0) {
    return '';
  }

  if (str.length === 1) {
    return str.toUpperCase();
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};
