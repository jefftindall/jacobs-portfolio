# Brand & UI style guide

Living visual reference: [`/style-guide`](../src/pages/style-guide.astro) (local: `http://localhost:4321/style-guide`). Not linked in public nav; excluded from the sitemap.

Tokens live in [`src/styles/global.css`](../src/styles/global.css). Brand constants live in [`src/lib/site.ts`](../src/lib/site.ts).

## Brand positioning

| Element | Value |
|---------|--------|
| Name | Jacob Tindall |
| Role | Conservation & Music |
| Narrative | Marine mammal conservation (dolphins, manatees) and music (piano, composition) |
| Contact | Email from `.env` / Key Vault (`SITE_CONTACT_EMAIL`) — not stored in git. No phone on the public site. |
| Tone | Curious, kind, clear — ocean-calm, not Broadway glamour |

Do not lead with age. Never publish a date of birth, school, address, or phone.

Hobbies (Fortnite, Minecraft) may appear as a short note **without** gamertags.

## Visual direction

**Deep ocean with a music-warm accent.**

- Navy depths, seafoam links, sand CTAs
- Fraunces (display) + Source Sans 3 (body)
- Glass panels, generous spacing, one job per section

Avoid: purple gradients, neon, theatre gold-on-stage, cream newspaper layouts.

## Color tokens

| Token | Hex | Tailwind | Use |
|-------|-----|----------|-----|
| `ink` | `#06141c` | `bg-ink` | Page base |
| `stage` | `#0a2230` | `bg-stage` | Depth / hover |
| `panel` | `#0f2f40` | `bg-panel` | Solid surfaces |
| `spotlight` | `#e7f3f0` | `text-spotlight` | Primary text |
| `muted` | `#8fb0b8` | `text-muted` | Supporting copy |
| `gold` | `#d4b483` | `bg-gold` | Sand CTA |
| `gel` | `#3d9b8f` | `text-gel` | Seafoam links / eyebrows |

Contrast rule: primary CTAs use **sand (`gold`) on ink**.

## Typography

| Role | Font | Typical scale |
|------|------|----------------|
| Brand / H1 | Fraunces (`font-display`) | `text-5xl`–`text-8xl` |
| Section titles | Fraunces | `text-4xl`–`text-5xl` |
| Body | Source Sans 3 (`font-sans`) | `text-base` / `text-lg`, `text-muted` |
| Eyebrow | Source Sans 3 uppercase | `text-sm tracking-[0.25em] text-gel` or `text-gold` |

## Layout

- Content width: `max-w-6xl` + `px-6`
- Section rhythm: `.section-y`
- Radius: `rounded-sm`
- Tap targets: `min-h-11` (44px+)
