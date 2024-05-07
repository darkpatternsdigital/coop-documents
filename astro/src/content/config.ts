// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

// Define a `type` and `schema` for each collection
const documentsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
	})
});

const storiesCollection = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
	})
});

// Export a single `collections` object to register your collection(s)
export const collections = {
	documents: documentsCollection,
	stories: storiesCollection,
};
