import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost, Product } from '../types';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { imageErrorHandlers, getProductImage } from '../utils/imageHelpers';
import { SEO } from './SEO';
import { pageSEO, generateBlogPostingSchema, generateFAQSchema } from '../utils/seo';

import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

interface BlogPostPageProps {
  post: BlogPost;
  allProducts: Product[];
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post, allProducts }) => {
  // SEO Configuration
  const seoConfig = React.useMemo(
    () =>
      post
        ? { title: post.metaTitle || post.title, description: post.metaDescription || post.excerpt }
        : null,
    [post]
  );

  // Suggested Products Logic
  const suggestedProducts = React.useMemo(() => {
    if (!post || !allProducts) return [];

    // 1. Get explicitly related products
    let related = post.relatedProductIds
      ? allProducts.filter((p) => post.relatedProductIds?.includes(p.id))
      : [];

    // 2. If no explicit relations, pick bestsellers or first 2 products as fallback
    if (related.length === 0) {
      related = allProducts.filter((p) => p.badge === 'Bestseller').slice(0, 2);
    }
    // Final fallback
    if (related.length === 0) {
      related = allProducts.slice(0, 2);
    }

    return related;
  }, [post, allProducts]);

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
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
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
        <div className="flex items-center justify-center gap-3 text-neutral-500 font-medium tracking-wide text-sm uppercase flex-wrap">
          <span>{post.author}</span>
          <span className="w-1 h-1 bg-neutral-300 rounded-full" />
          <span>{post.date}</span>
          {post.updateDate && (
            <>
              <span className="w-1 h-1 bg-neutral-300 rounded-full" />
              <span className="italic text-neutral-400 normal-case">
                Last updated: {post.updateDate}
              </span>
            </>
          )}
          {post.tags?.[0] && (
            <>
              <span className="w-1 h-1 bg-neutral-300 rounded-full" />
              <span className="text-brand-primary">{post.tags[0]}</span>
            </>
          )}
        </div>
      </div>

      <div
        className="w-full max-w-5xl mx-auto mb-12 rounded-sm shadow-xl overflow-hidden relative"
        style={{ minHeight: '400px' }}
      >
        {post.image.includes('fallback') ? (
          <div className="w-full h-full min-h-[400px] md:min-h-[500px] bg-gradient-to-br from-brand-primary to-brand-dark flex flex-col items-center justify-center p-8 md:p-12 text-center relative">
            {/* Animated SVG background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMODg4TTggMEwwIDgiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] animate-[slide_20s_linear_infinite]" />
            <div className="relative z-10 max-w-3xl">
              <span className="inline-block px-4 py-1.5 border border-white/40 text-white/90 uppercase tracking-widest text-xs font-bold rounded-full mb-6 backdrop-blur-sm">
                Editorial
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif italic drop-shadow-md leading-tight">
                {post.title}
              </h2>
            </div>
          </div>
        ) : (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-[650px] object-cover"
            onError={imageErrorHandlers.blog}
          />
        )}
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
            {suggestedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 flex items-center gap-5"
              >
                <div className="w-24 h-24 bg-neutral-50 rounded-lg overflow-hidden shrink-0 relative">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={imageErrorHandlers.product}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-brand-dark group-hover:text-brand-primary transition-colors font-serif line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                    {product.usp || product.category}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-brand-primary">
                      ₹{product.variants[0]?.salePrice || product.variants[0]?.price}
                    </span>
                    {product.variants[0]?.salePrice && (
                      <span className="text-xs text-neutral-400 line-through">
                        ₹{product.variants[0].price}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-brand-dark mt-2 inline-block border-b border-brand-dark group-hover:border-brand-primary transition-colors">
                    View Product
                  </span>
                </div>
              </Link>
            ))}
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
