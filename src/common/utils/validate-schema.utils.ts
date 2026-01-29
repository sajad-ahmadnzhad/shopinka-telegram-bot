import { Context } from 'grammy';
import z from 'zod';

export function validateStep<T>(schema: z.ZodSchema<T>, value: unknown, ctx: Context): T | null {
  const result = schema.safeParse(value);

  if (!result.success) {
    ctx.reply(`❌ ${result.error.issues[0].message}`);
    return null;
  }

  return result.data;
}
