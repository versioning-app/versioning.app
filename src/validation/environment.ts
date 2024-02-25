import { z } from 'zod';
import { EnvironmentTypeStyles } from './../database/schema';

export const createEnvironmentTypeSchema = z.object({
  label: z.string().max(32),
  description: z.string().max(255).optional(),
  style: z.enum(EnvironmentTypeStyles),
});

export const deleteEnvironmentTypeSchema = z.object({
  id: z.string(),
});

export const createEnvironmentSchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255).optional(),
  typeId: z.string().describe('Environment Type'),
});

export const deleteEnvironmentSchema = z.object({
  id: z.string(),
});
