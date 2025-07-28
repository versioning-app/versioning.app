import { RefinementCtx, z, ZodObject, ZodTypeAny } from 'zod';

type EnhanceConfig = {
  define?: string;
  superRefine?: (val: any, ctx: RefinementCtx) => void;
};

export function enhanceFields<T>(
  schema: T,
  enhancements: Partial<Record<string, EnhanceConfig>>,
): T {
  const shape = (schema as any).shape;

  const enhancedShape: any = {};

  for (const [key, original] of Object.entries(shape)) {
    const config = enhancements?.[key];
    if (!config) {
      enhancedShape[key] = original;
      continue;
    }

    let enhanced = original as ZodTypeAny;

    if (config.superRefine) {
      enhanced = enhanced.superRefine(config.superRefine);
    }

    if (config.define) {
      enhanced = enhanced.describe(config.define);
    }

    enhancedShape[key] = enhanced;
  }

  return z.object(enhancedShape) as T;
}
