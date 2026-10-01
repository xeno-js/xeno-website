import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	blog: defineCollection({
		loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.date(),
			author: z.string().default('Xeno.JS'),
			keywords: z.string(),
			canonical: z.string().url(),
			category: z.string().optional(),
			tags: z.array(z.string()).optional(),
			featured: z.boolean().optional(),
			faqs: z.array(z.object({
				question: z.string(),
				answer: z.string()
			})).default([]),
			image: z.union([
				z.string(),
				z.object({ src: z.string(), alt: z.string() })
			]).optional(),
		}),
	}),
};
