import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fff7ed] border-y border-[#ffedd5] py-16">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#f3dcb1] flex flex-col md:flex-row items-center gap-10 max-w-5xl mx-auto relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffedd5] rounded-full filter blur-[80px] opacity-50 -z-0"></div>

          <div className="flex-1 relative z-10">
            <span className="bg-[#c2410c] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">
              Members Only
            </span>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-[#431407] mb-4">
              Tattva Fresh Monthly
            </h3>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Experience the freshest harvest delivered to your door. Get a curated box of 4-5
              premium seasonal spices every month.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                'Save 20% vs buying individually',
                'Free priority shipping included',
                'First access to new harvests',
                'Cancel or pause anytime',
              ].map((item, index) => (
                <li key={index} className="flex items-center text-[#7c2d12] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#ffedd5] text-[#c2410c] flex items-center justify-center mr-3 text-sm">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/subscribe')}
                className="bg-[#c2410c] hover:bg-[#9a3412] text-white px-8 py-3 rounded-full font-bold shadow-md transform transition-all hover:-translate-y-1"
              >
                Start for ₹999/mo
              </button>
              <button
                onClick={() => navigate('/subscribe')}
                className="text-[#c2410c] font-bold hover:underline"
              >
                Learn More
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/3 relative z-10 flex justify-center">
            {/* Abstract visual representation of a spice box */}
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-to-br from-[#fdba74] to-[#c2410c] rounded-2xl rotate-3 opacity-90 shadow-xl"></div>
              <div className="absolute inset-0 bg-white rounded-2xl -rotate-3 flex items-center justify-center shadow-inner border border-gray-100 p-6">
                <div className="grid grid-cols-2 gap-2 w-full h-full">
                  <div className="bg-[#fef3c7] rounded-lg"></div>
                  <div className="bg-[#fee2e2] rounded-lg"></div>
                  <div className="bg-[#dcfce7] rounded-lg"></div>
                  <div className="bg-[#e0f2fe] rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;
