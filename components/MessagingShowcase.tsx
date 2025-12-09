import React from 'react';
import Hero from './Hero';
import PEACECards from './PEACECards';
import BrandStory from './BrandStory';
import { PEACE_SOUNDBITES } from '../data/soundbites';

const MessagingShowcase: React.FC = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-gray-100 py-8 mb-10 border-b">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800">Messaging Framework Showcase</h1>
          <p className="text-gray-600">Internal preview of PEACE components and soundbites</p>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-20">
        {/* Section 1: Hero */}
        <section className="border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
            <h2 className="font-bold text-gray-700">1. Hero Component (PEACE Set 1: Quality)</h2>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Live</span>
          </div>
          <Hero onShopNow={() => {}} />
        </section>

        {/* Section 2: Why Cards */}
        <section className="border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
            <h2 className="font-bold text-gray-700">2. PEACE Problem Cards</h2>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Live</span>
          </div>
          <PEACECards />
        </section>

        {/* Section 3: Brand Story */}
        <section className="border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
            <h2 className="font-bold text-gray-700">3. Brand Story Narrative</h2>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Live</span>
          </div>
          <BrandStory />
        </section>

        {/* Section 4: Raw Messaging Data */}
        <section className="border rounded-2xl overflow-hidden shadow-sm bg-gray-50 p-6">
          <h2 className="font-bold text-gray-700 mb-4">4. Raw Messaging Data (JSON)</h2>
          <pre className="bg-white p-4 rounded-lg border text-sm overflow-auto max-h-96">
            {JSON.stringify(PEACE_SOUNDBITES, null, 2)}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default MessagingShowcase;
