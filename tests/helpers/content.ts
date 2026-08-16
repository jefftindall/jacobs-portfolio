import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nav } from '../../src/lib/nav';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.join(HERE, '../../src/content');

type Frontmatter = Record<string, string>;

function parseFrontmatter(filePath: string): { fm: Frontmatter; raw: string } {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { fm: {}, raw };

  const fm: Frontmatter = {};
  for (const line of match[1].split('\n')) {
    const simple = line.match(/^([\w-]+):\s*(.+)$/);
    if (simple) {
      fm[simple[1]] = simple[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  return { fm, raw };
}

function listMarkdown(collection: string): { id: string; fm: Frontmatter; raw: string }[] {
  const dir = path.join(CONTENT_ROOT, collection);
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const parsed = parseFrontmatter(path.join(dir, name));
      return {
        id: name.replace(/\.md$/, ''),
        fm: parsed.fm,
        raw: parsed.raw,
      };
    });
}

function orderedNotes(collection: string): { id: string; title: string }[] {
  return listMarkdown(collection)
    .map((item) => ({
      id: item.id,
      title: item.fm.title ?? item.id,
      order: item.fm.order ? Number(item.fm.order) : 99,
    }))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function conservationNotes(): { id: string; title: string }[] {
  const notes = orderedNotes('conservation');
  if (!notes.length) throw new Error('No conservation notes in src/content/conservation');
  return notes;
}

export function musicNotes(): { id: string; title: string }[] {
  const notes = orderedNotes('music');
  if (!notes.length) throw new Error('No music notes in src/content/music');
  return notes;
}

export function newestNewsPost(): { slug: string; title: string } {
  const posts = listMarkdown('news')
    .map((item) => {
      const parsedDate = item.fm.date ? Date.parse(item.fm.date) : 0;
      return {
        slug: item.id,
        title: item.fm.title ?? item.id,
        date: Number.isNaN(parsedDate) ? 0 : parsedDate,
        draft: /(^|\n)draft:\s*true\b/.test(item.raw),
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => b.date - a.date || a.slug.localeCompare(b.slug));

  if (!posts.length) throw new Error('No published news posts in src/content/news');
  const top = posts[0]!;
  return { slug: top.slug, title: top.title };
}

export function galleryHasItems(): boolean {
  return listMarkdown('gallery').length > 0;
}

export const primaryNav = nav;

export const BRAND = 'Jacob Tindall';
