import matter from 'gray-matter';
import { BlogPost } from '../../types';

// Helper to load all markdown posts
export async function getAllPosts(): Promise<BlogPost[]> {
  const modules = import.meta.glob('/content/blog/*.md', { as: 'raw', eager: true });

  const posts: BlogPost[] = [];
  let idCounter = 1000; // Start IDs higher to avoid conflict with mocks

  for (const path in modules) {
    const content = modules[path] as string;
    const { data, content: markdownBody } = matter(content);

    // Extract slug from filename if not in frontmatter
    const filename = path.split('/').pop()?.replace('.md', '') || '';
    const slug = data.slug || filename;

    posts.push({
      id: idCounter++,
      slug,
      title: data.title || 'Untitled Post',
      author: data.author || 'Tattva Co.',
      date: data.date || new Date().toISOString(),
      image: data.image || '',
      excerpt: data.excerpt || '',
      content: markdownBody, // Passing raw markdown to be rendered by component
      tags: data.tags || [],
      isMarkdown: true, // Flag to tell component this is markdown
    });
  }

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
