import React from 'react';
import { FARMERS } from '../data/farmers';
import { UserIcon } from '../components/icons/UserIcon';
import { OptimizedImage } from '../components/OptimizedImage';

const FarmersPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-primary/5 py-20 px-4 md:px-6 text-center">
        <div className="container mx-auto max-w-4xl">
          <span className="text-brand-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            KNOW YOUR GROWER
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Hand-Harvested. Heart-Felt.
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            We don&apos;t buy from middlemen. We partner directly with farmers who treat their land
            like gold. Meet the hands that feed you.
          </p>
        </div>
      </section>

      {/* Farmers Grid */}
      <section className="py-20 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FARMERS.map((farmer) => (
              <div
                key={farmer.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-neutral-100 group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <OptimizedImage
                    src={farmer.image}
                    alt={farmer.name}
                    type="card"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                    <h3 className="text-white text-2xl font-serif font-bold">{farmer.name}</h3>
                    <p className="text-white/90 text-sm font-medium flex items-center gap-1">
                      <UserIcon className="w-4 h-4" /> {farmer.location}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <span className="bg-brand-primary/10 text-brand-dark text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                      Since {farmer.farmingSince}
                    </span>
                    <span className="ml-2 text-xs text-neutral-500 font-medium uppercase tracking-wide">
                      Specialty: {farmer.specialty}
                    </span>
                  </div>

                  <blockquote className="italic text-neutral-700 mb-4 border-l-2 border-brand-primary pl-4">
                    &quot;{farmer.quote}&quot;
                  </blockquote>

                  <p className="text-neutral-600 text-sm leading-relaxed mb-6">{farmer.bio}</p>

                  <div className="border-t border-neutral-100 pt-4">
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2">
                      Grower of:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {farmer.crops.map((crop) => (
                        <span
                          key={crop}
                          className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-dark text-white py-20 px-4 md:px-6 text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-serif font-bold mb-6">
            Taste the Difference of Direct Trade
          </h2>
          <p className="text-neutral-300 max-w-xl mx-auto mb-8">
            When you buy from Tattva, 100% of the fair-trade premium goes directly to these
            families.
          </p>
          <button className="bg-brand-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-brand-dark transition-colors">
            Shop Our Spices
          </button>
        </div>
      </section>
    </div>
  );
};

export default FarmersPage;
