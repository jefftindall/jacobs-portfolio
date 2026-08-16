import { z } from 'zod';

export const conservationFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  species: z.string().optional(),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().optional(),
});

export const musicKind = z.enum(['piano', 'composition', 'performance', 'other']).default('piano');

export const musicFrontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  kind: musicKind,
  year: z.number().optional(),
  featured: z.boolean().default(false),
  order: z.number().optional(),
});

export const newsFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.coerce.date(),
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  image: z.string().optional(),
  draft: z.boolean().default(false),
});

export const galleryFrontmatterSchema = z.object({
  caption: z.string().default(''),
  image: z.string().min(1),
  tags: z.array(z.string()).default([]),
  order: z.number().optional(),
  focus: z.string().default('center'),
});

export const pagesFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  updated: z.coerce.date().optional(),
});
