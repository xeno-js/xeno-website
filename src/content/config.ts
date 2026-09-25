import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

export const collections = {
    docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
    i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
    blog: defineCollection({
        loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
        schema: z.object({
            title: z.string(),
            description: z.string(),
            pubDate: z.date(),
            author: z.string().default('Xeno'),
        }),
    }),
};