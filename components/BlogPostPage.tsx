import React from 'react';
import { BlogPost } from '../types';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { SEO } from './SEO';
import { pageSEO, generateBlogPostingSchema, generateFAQSchema } from '../utils/seo';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  // SEO Configuration
  const seoConfig = React.useMemo(
    () => (post ? pageSEO.product(post.title, post.excerpt) : null),
    [post]
  );

  // Generate combined Article + FAQ schema for rich results
  const structuredDataSchemas = React.useMemo(() => {
    if (!post) return null;

    const schemas: Record<string, unknown>[] = [generateBlogPostingSchema(post)];

    // Add FAQ schema if post has FAQs
    if (post.faqs && post.faqs.length > 0) {
      schemas.push(generateFAQSchema(post.faqs));
    }

    return schemas;
  }, [post]);

  if (!post || !seoConfig || !structuredDataSchemas) {
    return (
      <div className="text-center py-20">
        <h2>Post not found</h2>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '#/' },
    { label: 'Blog', href: '#/blog' },
    { label: post.title },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO
        {...seoConfig}
        ogType="article"
        ogImage={post.image}
        structuredData={structuredDataSchemas}
        structuredDataId="blog-schema"
      />
      <div className="max-w-4xl mx-auto text-center mb-8">
        <Breadcrumbs items={breadcrumbItems} className="justify-center mb-6" />
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-3 text-neutral-500 font-medium tracking-wide text-sm uppercase">
          <span>{post.author}</span>
          <span className="w-1 h-1 bg-neutral-300 rounded-full" />
          <span>{post.date}</span>
          {post.tags?.[0] && (
            <>
              <span className="w-1 h-1 bg-neutral-300 rounded-full" />
              <span className="text-brand-primary">{post.tags[0]}</span>
            </>
          )}
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-12">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto max-h-[650px] object-cover rounded-sm shadow-xl"
          onError={imageErrorHandlers.blog}
        />
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Article Content */}
        <div className="prose prose-lg prose-neutral max-w-none prose-headings:font-serif prose-headings:text-brand-dark prose-a:text-brand-primary hover:prose-a:text-brand-dark prose-img:rounded-xl">
          {post.isMarkdown ? (
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              components={{
                img: ({ node, ...props }) => (
                  <img {...props} className="rounded-xl shadow-lg my-8 w-full" />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          )}
        </div>

        {/* Tags Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex flex-wrap justify-center gap-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-1.5 bg-neutral-100 text-neutral-600 text-sm font-medium rounded-full tracking-wide hover:bg-neutral-200 transition-colors cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Shop The Story - Editorial Style */}
        <div className="mt-16 bg-neutral-50 px-8 py-10 rounded-2xl border border-neutral-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary/20 via-brand-primary to-brand-primary/20" />

          <div className="text-center mb-8">
            <h3 className="text-3xl font-serif font-bold text-brand-dark mb-2">Shop the Story</h3>
            <p className="text-neutral-600 italic font-serif">
              Essential ingredients mentioned in this article
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Product 1 */}
            <a
              href="#/product/1"
              className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 flex items-center gap-5"
            >
              <div className="w-24 h-24 bg-neutral-50 rounded-lg overflow-hidden shrink-0 relative">
                <img
                  src="/images/products/saffron-kesar-front.webp"
                  alt="Saffron"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-dark group-hover:text-brand-primary transition-colors font-serif">
                  Kashmiri Saffron
                </h4>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  Premium Grade A++
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-primary">₹599</span>
                  <span className="text-xs text-neutral-400 line-through">₹799</span>
                </div>
                <span className="text-xs font-bold text-brand-dark mt-2 inline-block border-b border-brand-dark group-hover:border-brand-primary transition-colors">
                  View Product
                </span>
              </div>
            </a>

            {/* Product 2 */}
            <a
              href="#/product/2"
              className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 flex items-center gap-5"
            >
              <div className="w-24 h-24 bg-neutral-50 rounded-lg overflow-hidden shrink-0 relative">
                <img
                  src="/images/products/tattv-cardamom.webp"
                  alt="Cardamom"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h4 className="font-bold text-lg text-brand-dark group-hover:text-brand-primary transition-colors font-serif">
                  Green Cardamom
                </h4>
                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  8mm Bold Pods
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-brand-primary">₹349</span>
                </div>
                <span className="text-xs font-bold text-brand-dark mt-2 inline-block border-b border-brand-dark group-hover:border-brand-primary transition-colors">
                  View Product
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
      <style>{`
        .prose h3 { font-family: 'Playfair Display', serif; }
        .prose p, .prose li { font-family: 'Lato', sans-serif; }
        .prose ul { list-style-type: disc; padding-left: 1.5rem; }
      `}</style>
    </div>
  );
};

export default BlogPostPage;
