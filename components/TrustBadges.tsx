import React from 'react';
import clsx from 'clsx';

export interface Badge {
  icon: string;
  text: string;
  tooltip?: string;
}

export interface CertificationBadge {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  verified?: boolean;
  link?: string;
}

interface TrustBadgesProps {
  badges?: Badge[];
  certifications?: CertificationBadge[];
  variant?: 'horizontal' | 'vertical' | 'grid' | 'certification';
  size?: 'sm' | 'md' | 'lg';
}

// Pre-defined certification badges for easy reuse
export const CERTIFICATION_BADGES: CertificationBadge[] = [
  {
    icon: '🏛️',
    title: 'FSSAI Licensed',
    subtitle: 'Lic. No. 12345678901234',
    verified: true,
    link: 'https://foscos.fssai.gov.in/',
  },
  {
    icon: '🌿',
    title: 'Certified Organic',
    subtitle: 'India Organic / NPOP',
    verified: true,
  },
  {
    icon: '🤝',
    title: 'Fair Trade',
    subtitle: 'Direct Farmer Partnerships',
    verified: true,
  },
  {
    icon: '🧪',
    title: 'Lab Tested',
    subtitle: 'No Adulterants',
    verified: true,
  },
  {
    icon: '📦',
    title: 'Fresh Packed',
    subtitle: '< 7 Days Old',
    verified: true,
  },
];

export const TrustBadges: React.FC<TrustBadgesProps> = ({
  badges,
  certifications,
  variant = 'vertical',
  size = 'md',
}) => {
  const containerClasses = {
    horizontal: 'flex items-center gap-4 flex-wrap',
    vertical: 'flex flex-col gap-3',
    grid: 'grid grid-cols-2 md:grid-cols-5 gap-4',
    certification: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4',
  };

  const badgeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Render certification badges if provided
  if (certifications && certifications.length > 0) {
    return (
      <div className={containerClasses[variant]}>
        {certifications.map((cert, index) => (
          <div
            key={index}
            className={clsx(
              'flex flex-col items-center text-center p-4 rounded-xl',
              'bg-gradient-to-b from-amber-50 to-white',
              'border border-amber-100 hover:border-amber-300',
              'hover:shadow-md transition-all duration-200',
              'group cursor-pointer'
            )}
            onClick={() => cert.link && window.open(cert.link, '_blank')}
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
              {cert.icon}
            </div>
            <p className="font-bold text-neutral-800 text-sm leading-tight">{cert.title}</p>
            {cert.subtitle && <p className="text-xs text-neutral-500 mt-1">{cert.subtitle}</p>}
            {cert.verified && (
              <span className="mt-2 inline-flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Original badges rendering
  return (
    <div className={containerClasses[variant]}>
      {badges?.map((badge, index) => (
        <div
          key={index}
          className={clsx(
            'flex items-center gap-3 p-3 rounded-lg',
            variant === 'grid' && 'flex-col text-center',
            'hover:bg-[#F5EDD4] transition-colors'
          )}
          title={badge.tooltip}
        >
          <span className={clsx('text-2xl', badgeClasses[size])}>{badge.icon}</span>
          <span className={clsx('text-[#1F2121] font-medium', badgeClasses[size])}>
            {badge.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
