import { defineCollection, z } from 'astro:content';

export const collections = {
  blog: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      status: z.enum(['seed', 'growing', 'evergreen']).default('growing'),
      tags: z.array(z.string()).optional(),
    }),
  }),
  now: defineCollection({
    type: 'content',
    schema: z.object({
      lastUpdated: z.coerce.date(),
    }),
  }),
  notes: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string().optional(),
      content: z.string(),
      pubDate: z.coerce.date(),
      tags: z.array(z.string()).optional(),
    }),
  }),
};