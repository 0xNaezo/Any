import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Case studies. Each Markdown file in src/content/work becomes a card on the home page
 * (when `featured: true`) and a page at /work/<file-name>.
 */
const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    client: z.string(),
    headline: z.string(),
    summary: z.string(),
    sector: z.string(),
    year: z.number().int(),
    duration: z.string(),
    role: z.array(z.string()),
    stack: z.array(z.string()),
    results: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .min(1)
      .max(4),
    /** Built-in illustration used until real screenshots are added. */
    cover: z.enum(['ledger', 'health', 'notes', 'orbit']),
    /** Optional real screenshot in /public (e.g. "/work/ledgerline.jpg"). Replaces the illustration. */
    image: z.string().optional(),
    quote: z
      .object({
        text: z.string(),
        name: z.string(),
        role: z.string(),
      })
      .optional(),
    order: z.number().default(99),
    featured: z.boolean().default(true),
  }),
});

export const collections = { work };
