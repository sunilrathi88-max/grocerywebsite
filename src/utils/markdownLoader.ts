import { BlogPost } from '../../types';

// Simple browser-safe frontmatter parser to avoid Buffer dependency
function parseFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {} as any, content };

  // Normalise line endings so CRLF files parse correctly on all platforms
  const yaml = match[1].replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const body = content.slice(match[0].length).trim();
  const data: any = {};

  yaml.split('\n').forEach((line) => {
    const firstColon = line.indexOf(':');
    if (firstColon !== -1) {
      const key = line.slice(0, firstColon).trim();
      // Trim and remove carriage returns from value
      let value = line
        .slice(firstColon + 1)
        .trim()
        .replace(/\r$/, '');

      // Strip surrounding quotes (single or double)
      value = value.replace(/^["'](.*)["']$/, '$1');

      // Basic array parsing for tags: [tag1, tag2]
      if (
        (key === 'tags' || key === 'relatedProductIds') &&
        value.startsWith('[') &&
        value.endsWith(']')
      ) {
        const items = value
          .slice(1, -1)
          .split(',')
          .map((t) => t.trim().replace(/^["'](.*)["']$/, '$1'))
          .filter(Boolean);
        data[key] = key === 'relatedProductIds' ? items.map(Number) : items;
      } else {
        data[key] = value;
      }
    }
  });

  return { data, content: body };
}

// Helper to load all markdown posts
export async function getAllPosts(): Promise<BlogPost[]> {
  console.log('MarkdownLoader: Starting getAllPosts');
  // Vite requirement: path must be relative to the current file
  const modules = import.meta.glob('../../content/blog/*.md', { as: 'raw', eager: true });
  console.log('MarkdownLoader: Found modules:', Object.keys(modules).length);

  const posts: BlogPost[] = [];
  let idCounter = 1000;

  for (const path in modules) {
    try {
      const rawContent = modules[path] as string;
      const { data, content: markdownBody } = parseFrontmatter(rawContent);

      const filename = path.split('/').pop()?.replace('.md', '') || '';
      const slug = data.slug || filename;

      posts.push({
        id: idCounter++,
        slug,
        title: data.title || 'Untitled Post',
        author: data.author || 'Rathi Naturals Research Team',
        date: data.date || new Date().toISOString(),
        image: data.image || '/images/blog/blog_premium_spice_comparison_png_1774289989410.png',
        excerpt: data.excerpt || '',
        content: markdownBody,
        tags: data.tags || [],
        relatedProductIds: data.relatedProductIds || [],
        isMarkdown: true,
      });
    } catch (err) {
      console.error(`MarkdownLoader: Error parsing ${path}:`, err);
    }
  }

  console.log('MarkdownLoader: Final post count:', posts.length);
  // Sort by date descending
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
