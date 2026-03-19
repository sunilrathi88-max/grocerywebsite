import React from 'react';
import SEO from '../SEO';

export interface Section {
  id: string;
  title: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

interface PillarPageLayoutProps {
  title: string;
  description: string;
  author: string;
  lastUpdated: string;
  sections: Section[];
  faqs?: FAQ[];
  children: React.ReactNode;
}

const PillarPageLayout: React.FC<PillarPageLayoutProps> = ({
  title,
  description,
  author,
  lastUpdated,
  sections,
  faqs,
  children,
}) => {
  // Generate FAQ Schema specifically for AI LLM parsing
  const faqSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : undefined;

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <SEO
        title={title}
        description={description}
        structuredData={faqSchema}
        structuredDataId="faq-schema"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Block */}
        <header className="mb-12 max-w-4xl">
          <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            Comprehensive Spices Guide
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-neutral-600 mb-8 leading-relaxed">{description}</p>

          {/* E-E-A-T Signals: Author & Recency */}
          <div className="flex items-center gap-4 text-sm font-medium text-neutral-500 border-t border-neutral-100 pt-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-primary">person</span>
              Written by <strong>{author}</strong>
            </div>
            <div className="w-1 h-1 bg-neutral-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-primary">update</span>
              Last updated: <strong>{lastUpdated}</strong>
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* Sticky Sidebar Navigation (Table of Contents) */}
          <AsideNav sections={sections} />

          {/* Main Content Area */}
          <main className="lg:w-3/4 prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-brand-dark prose-a:text-brand-primary hover:prose-a:text-brand-dark">
            {children}

            {/* FAQ Section */}
            {faqs && faqs.length > 0 && (
              <section id="faq" className="mt-16 pt-16 border-t border-neutral-100 scroll-mt-24">
                <h2 className="text-3xl font-serif font-bold mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-stone-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                      <p className="text-neutral-700 m-0">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

const AsideNav: React.FC<{ sections: Section[] }> = ({ sections }) => {
  return (
    <aside className="lg:w-1/4 hidden lg:block">
      <div className="sticky top-28 bg-stone-50 rounded-2xl p-6 border border-neutral-100">
        <h3 className="font-bold text-lg text-brand-dark mb-4 tracking-wide uppercase text-sm">
          Table of Contents
        </h3>
        <nav className="flex flex-col gap-3">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-neutral-600 hover:text-brand-primary hover:translate-x-1 transition-all text-sm font-medium"
            >
              {section.title}
            </a>
          ))}
          <a
            href="#faq"
            className="text-neutral-600 hover:text-brand-primary hover:translate-x-1 transition-all text-sm font-medium mt-2 pt-2 border-t border-neutral-200"
          >
            Frequently Asked Questions
          </a>
        </nav>
      </div>
    </aside>
  );
};

export default PillarPageLayout;
