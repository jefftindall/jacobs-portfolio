/**
 * Public lists are newest-first.
 * Astro may give a Date, an ISO string, or (if a note is mid-sync) nothing — never crash the page.
 */
function toTime(value: Date | string | number | undefined | null): number {
  if (value == null || value === '') return 0;
  const time = value instanceof Date ? value.valueOf() : new Date(value).valueOf();
  return Number.isNaN(time) ? 0 : time;
}

export function compareByDateDesc(
  a: { id: string; data: { date?: Date | string | number } },
  b: { id: string; data: { date?: Date | string | number } },
): number {
  const diff = toTime(b.data?.date) - toTime(a.data?.date);
  return diff !== 0 ? diff : a.id.localeCompare(b.id);
}

export function newestFirst<T extends { id: string; data: { date?: Date | string | number } }>(
  items: T[],
): T[] {
  return [...items].sort(compareByDateDesc);
}
