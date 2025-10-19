
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 mb-6">
              Tattva Co. was born from a passion for authentic Indian flavors and a desire to share them with the world. We travel to the heart of India, from the saffron fields of Kashmir to the pepper vines of the Malabar Coast, to source the finest, most aromatic spices and gourmet products.
            </p>
            <p className="text-gray-600 mb-4">
              Our philosophy is simple: quality, authenticity, and sustainability. We work directly with farmers and artisans who share our commitment to traditional methods and ethical practices. Every product we offer tells a story of its origin, its people, and the rich culinary heritage of India.
            </p>
            <p className="text-gray-600">
              "Tattva" means 'principle' or 'essence' in Sanskrit, and it is the guiding principle behind everything we do. We invite you to explore our collection and discover the true essence of Indian gourmet.
            </p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/800x600/F8E3D9/333333?text=Tattva+Co.+-+Spice+Market" 
              alt="A vibrant Indian spice market"
              className="rounded-lg shadow-xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x600/F8E3D9/333333?text=Tattva+Co.+-+Spice+Market';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
