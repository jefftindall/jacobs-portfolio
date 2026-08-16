import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  conservationFrontmatterSchema,
  galleryFrontmatterSchema,
  musicFrontmatterSchema,
  newsFrontmatterSchema,
  pagesFrontmatterSchema,
} from './lib/contentSchemas';

const conservation = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conservation' }),
  schema: conservationFrontmatterSchema,
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/music' }),
  schema: musicFrontmatterSchema,
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: newsFrontmatterSchema,
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: galleryFrontmatterSchema,
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: pagesFrontmatterSchema,
});

export const collections = { conservation, music, news, gallery, pages };
