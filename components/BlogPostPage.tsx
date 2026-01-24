import React from 'react';
import { BlogPost } from '../types';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { SEO } from './SEO';
import { pageSEO, generateBlogPostingSchema } from '../utils/seo';

interface BlogPostPageProps {
  post: BlogPost;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ post }) => {
  // SEO Configuration
  const seoConfig = React.useMemo(
    () => (post ? pageSEO.product(post.title, post.excerpt) : null),
    [post]
  );
  const blogSchema = React.useMemo(() => (post ? generateBlogPostingSchema(post) : null), [post]);

  if (!post || !seoConfig || !blogSchema) {
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
        structuredData={blogSchema}
        structuredDataId="blog-schema"
      />
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark my-6">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-gray-500 mb-6">
          <span>By {post.author}</span>
          <span>&bull;</span>
          <span>{post.date}</span>
        </div>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8"
          onError={imageErrorHandlers.blog}
        />
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-8 pt-6 border-t">
          <h4 className="font-bold text-sm text-gray-600">Tags:</h4>
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-brand-secondary text-brand-dark text-xs font-bold px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Products CTA */}
        <div className="mt-12 bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm">
          <h3 className="text-2xl font-serif font-bold text-brand-dark mb-6 text-center">
            Shop the Story
          </h3>
          <p className="text-gray-600 text-center mb-8 max-w-lg mx-auto">
            Create this dish at home with our premium, lab-tested ingredients.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Mock Related Products - In real app, filter by post.tags or post.relatedProducts */}
            <a
              href="#/product/1"
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200"
            >
              <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src="/images/products/saffron-kesar-front.webp"
                  alt="Saffron"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                  Kashmiri Mongra Saffron
                </h4>
                <p className="text-sm text-gray-500 mb-1">Premium Grade A++</p>
                <p className="font-bold text-brand-primary">₹599</p>
              </div>
            </a>

            <a
              href="#/product/2"
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200"
            >
              <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden shrink-0">
                <img
                  src="/images/products/tattv-cardamom.webp"
                  alt="Cardamom"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                  Green Cardamom (Elaichi)
                </h4>
                <p className="text-sm text-gray-500 mb-1">8mm Bold Pods</p>
                <p className="font-bold text-brand-primary">₹349</p>
              </div>
            </a>
          </div>

          <div className="text-center mt-8">
            <a
              href="#/shop"
              className="inline-flex items-center gap-2 text-brand-primary font-bold hover:underline"
            >
              View All Spices <span>→</span>
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
