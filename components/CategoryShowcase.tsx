import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryShowcase: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-24 bg-background-light border-t border-primary/5">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-24 items-center">
          <div
            className="relative h-[500px] md:h-[600px] w-full bg-[#EAEAEA] overflow-hidden group cursor-pointer"
            onClick={() => handleCategoryClick('Spices')}
          >
            <img
              alt="Spices"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 filter brightness-95"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUiko4PeG0SntdKOmXzLeIGYiNhPHtJCJrXpkg6Dda41UoJ_J9-6XXjMk4M-9MDyAkSyHxW8tQgakLt_MjErv5nUUIlFHI9bJaoHvcgDCClxoDbLxztg-Tzvp7PTxIwHb6PZQpRgMdJEAY77p7AY_ysoAfzClZR1F5_CixauImNoBGMBrWGil3Dz8wbJqSXUl60Hx9ITsRyATOUO-XWIoLdFzKp-prC-GpZoffK_3nGIAfgdw6jhThOPoe2vkydi1OVhN8q8VPAw"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="text-center p-8 border border-white/30 backdrop-blur-sm bg-white/10">
                <h3 className="font-serif text-4xl text-white mb-2">Spices</h3>
                <p className="text-white/90 font-sans text-xs uppercase tracking-widest">
                  Pure & Fresh
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div
              className="relative h-[250px] w-full bg-[#EAEAEA] overflow-hidden group cursor-pointer"
              onClick={() => handleCategoryClick('Nuts')}
            >
              <img
                alt="Nuts"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 filter brightness-95"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm_domXhY5rxtzMHSCkaJQLSViPrzYizogFs-OBY3NpcK1rs9-7R3SLLCIJrLn_E3GzBJrCS2U_HOpCYbxyQa2xnitarOiamq31NwkvKYWJBl8XWNPzeG2Y0gbssIGJNeFvXZMgJrMvISEUMKak5HEn_mjTjLfMjD4NBD0kawfUnbpjnXLvFWKo_5sjl4ob9V9vJ_VpLAx6M1fGFXH4kER4B0xMH5AdHI6_lgyp9828hJCD4jmF-tMqDqltceLiIxyZ05Xrmt6IA"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                <div className="text-center">
                  <h3 className="font-serif text-3xl text-white mb-2">Nuts</h3>
                  <p className="text-white/90 font-sans text-xs uppercase tracking-widest">
                    Premium Quality
                  </p>
                </div>
              </div>
            </div>

            <div
              className="relative h-[250px] w-full bg-[#EAEAEA] overflow-hidden group cursor-pointer"
              onClick={() => handleCategoryClick('Beverages')}
            >
              <img
                alt="Beverages"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105 filter brightness-95"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuASLBj6id0jZWIPqlG24rpmD3Ti3Re5if-88CM6whCMYqiHnB_Syau36HSG1GPeGGFaWDVdR9nvm0nUtmwJdfPydzjgtq23cM251lJDp4Q3EmRkQtECC16gp5qduZSAEGgJkq66aB8JwHOmNpTC4fAWtcIPc1pss9d2Sb4V4j6_3Bx6124gVz2Z7vM3MysvXrrNP9QLbA8Z8Zy0KY3q1XmowzJ9BitNIXlKejmaWlxJ3h0_yQsS1PY-AGyAPNNX0nikF-6LMxyJkg"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                <div className="text-center">
                  <h3 className="font-serif text-3xl text-white mb-2">Beverages</h3>
                  <p className="text-white/90 font-sans text-xs uppercase tracking-widest">
                    Herbal & Pure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
