import { SafeActionResult } from 'next-safe-action';
import z from 'zod';

export type ActionTypeFn<Schema extends z.AnyZodObject> = (
  ...args: any[]
) => Promise<SafeActionResult<any, Schema>>;
