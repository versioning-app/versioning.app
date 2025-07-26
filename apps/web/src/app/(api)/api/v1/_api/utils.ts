import { NextRequest } from 'next/server';

export const json = async <T extends any = any>(
  request: NextRequest,
): Promise<T | undefined> => {
  try {
    return (await request.json()) as T;
  } catch (error) {
    return undefined;
  }
};
