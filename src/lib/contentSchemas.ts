import { z } from 'zod';

/**
 * YAML `date: 2026-07-16` becomes a Date; quoted `"2026-07-16"` stays a string.
 * Accept either so the field is not stripped before sort.
 */
export const frontmatterDate = z.any().transform((value, ctx) => {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value;
  const parsed = new Date(value as string | number);
  if (Number.isNaN(parsed.valueOf())) {
    ctx.addIssue({ code: 'custom', message: 'Invalid date' });
    return z.NEVER;
  }
  return parsed;
});

export const conservationFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  date: frontmatterDate,
  species: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  featured: z.boolean().default(false),
});

export const musicKind = z.enum(['piano', 'composition', 'performance', 'other']).default('piano');

export const musicFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  kind: musicKind,
  date: frontmatterDate,
  year: z.number().optional(),
  featured: z.boolean().default(false),
});

export const newsFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: frontmatterDate,
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  draft: z.boolean().default(false),
});

export const galleryFrontmatterSchema = z.object({
  caption: z.string().default(''),
  image: z.string().min(1),
  date: frontmatterDate,
  tags: z.array(z.string()).default([]),
  focus: z.string().default('center'),
  aspect: z.enum(['video', 'portrait', 'square']).default('portrait'),
});

export const pagesFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  updated: z.coerce.date().optional(),
});
