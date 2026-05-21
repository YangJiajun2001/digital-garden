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
};