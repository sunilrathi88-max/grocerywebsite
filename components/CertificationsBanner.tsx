import React from 'react';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { LeafIcon } from './icons/LeafIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { UsersIcon } from './icons/UsersIcon';

interface CertificationsBannerProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
}

const CertificationsBanner: React.FC<CertificationsBannerProps> = ({
  variant = 'full',
  className = '',
}) => {
  const certifications = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8 md:w-10 md:h-10 text-[#4CAF50]" />,
      title: 'FSSAI Certified',
      desc: 'Licensed & Regulated',
      color: 'bg-green-50 border-green-100',
    },
    {
      icon: <LeafIcon className="w-8 h-8 md:w-10 md:h-10 text-[#8BC34A]" />,
      title: '100% Organic',
      desc: 'Certified Natural',
      color: 'bg-[#F1F8E9] border-[#DCEDC8]',
    },
    {
      icon: <UsersIcon className="w-8 h-8 md:w-10 md:h-10 text-[#FF9800]" />, // Using UsersIcon for Fair Trade/Farmer connection
      title: 'Fair Trade',
      desc: 'Direct Farm Support',
      color: 'bg-orange-50 border-orange-100',
    },
    {
      icon: <BeakerIcon className="w-8 h-8 md:w-10 md:h-10 text-[#2196F3]" />,
      title: 'Lab Tested',
      desc: 'Purity Guaranteed',
      color: 'bg-blue-50 border-blue-100',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {certifications.map((cert, idx) => (
          <div
            key={idx}
            className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs text-gray-700"
          >
            <span className="w-4 h-4 text-brand-primary">{cert.icon}</span>
            <span className="font-medium">{cert.title}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`flex flex-wrap justify-center gap-4 ${className}`}>
        {certifications.map((cert, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 text-center" title={cert.desc}>
            <div className="p-1.5 rounded-full bg-gray-50 text-brand-primary border border-gray-100">
              {React.cloneElement(cert.icon as React.ReactElement<{ className?: string }>, {
                className: 'w-5 h-5',
              })}
            </div>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
              {cert.title.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className={`py-8 bg-white border-y border-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certifications.map((cert, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center text-center p-4 rounded-xl border ${cert.color} transition-transform hover:-translate-y-1 duration-300`}
            >
              <div className="mb-3 p-3 bg-white rounded-full shadow-sm">{cert.icon}</div>
              <h3 className="font-bold text-gray-900 text-sm md:text-base mb-1">{cert.title}</h3>
              <p className="text-xs text-gray-500">{cert.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsBanner;
