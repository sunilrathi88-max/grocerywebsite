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

export interface PaymentMethod {
  name: string;
  icon: React.ReactNode;
}

interface TrustBadgesProps {
  badges?: Badge[];
  certifications?: CertificationBadge[];
  showPaymentMethods?: boolean;
  showSecurityBadges?: boolean;
  variant?: 'horizontal' | 'vertical' | 'grid' | 'certification' | 'footer';
  size?: 'sm' | 'md' | 'lg';
}

// Payment method icons as SVG components
const VisaIcon = () => (
  <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Visa">
    <rect fill="#1A1F71" width="48" height="32" rx="4" />
    <path
      fill="#fff"
      d="M19.5 21h-2.7l1.7-10.5h2.7L19.5 21zm-5.2 0h-2.6l-2.6-8.1-.5 1.1-1.4 5.8c-.1.5-.5.9-1 1h-.1l-2.6.2v.1h4.3l1.6-10.5h2.6L14.3 21zm23.5-10.5l-1.9 7.2-.2-1-1.4-5.2c-.2-.6-.5-.8-1-.8h-3.6l-.1.3c.9.2 1.9.6 2.5.9.4.2.5.4.6.7l2 7.5h2.7l4.1-9.6h-3.7zm-11.3 0h-2.6L22.6 21h2.6l1.3-10.5z"
    />
  </svg>
);

const MastercardIcon = () => (
  <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Mastercard">
    <rect fill="#000" width="48" height="32" rx="4" />
    <circle fill="#EB001B" cx="18" cy="16" r="10" />
    <circle fill="#F79E1B" cx="30" cy="16" r="10" />
    <path
      fill="#FF5F00"
      d="M24 8.5c2.5 1.8 4 4.7 4 8s-1.5 6.2-4 8c-2.5-1.8-4-4.7-4-8s1.5-6.2 4-8z"
    />
  </svg>
);

const UpiIcon = () => (
  <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="UPI">
    <rect fill="#fff" width="48" height="32" rx="4" stroke="#ddd" />
    <text x="24" y="20" textAnchor="middle" fill="#097969" fontWeight="bold" fontSize="12">
      UPI
    </text>
  </svg>
);

const RuPayIcon = () => (
  <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="RuPay">
    <rect fill="#097969" width="48" height="32" rx="4" />
    <text x="24" y="20" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="10">
      RuPay
    </text>
  </svg>
);

const CodIcon = () => (
  <svg viewBox="0 0 48 32" className="h-8 w-12" aria-label="Cash on Delivery">
    <rect fill="#f5f5f5" width="48" height="32" rx="4" stroke="#ddd" />
    <text x="24" y="18" textAnchor="middle" fill="#333" fontWeight="bold" fontSize="8">
      COD
    </text>
    <text x="24" y="26" textAnchor="middle" fill="#666" fontSize="5">
      Cash
    </text>
  </svg>
);

// Security badges
export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'Visa', icon: <VisaIcon /> },
  { name: 'Mastercard', icon: <MastercardIcon /> },
  { name: 'UPI', icon: <UpiIcon /> },
  { name: 'RuPay', icon: <RuPayIcon /> },
  { name: 'COD', icon: <CodIcon /> },
];

export const SECURITY_BADGES = [
  { icon: '🔒', text: 'SSL Secure', tooltip: '256-bit SSL Encryption' },
  { icon: '✅', text: '100% Safe', tooltip: 'Verified Secure Checkout' },
  { icon: '💯', text: 'Money Back', tooltip: '7-Day Money Back Guarantee' },
];

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
  showPaymentMethods = false,
  showSecurityBadges = false,
  variant = 'vertical',
  size = 'md',
}) => {
  const containerClasses: Record<string, string> = {
    horizontal: 'flex items-center gap-4 flex-wrap',
    vertical: 'flex flex-col gap-3',
    grid: 'grid grid-cols-2 md:grid-cols-5 gap-4',
    certification: 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4',
    footer: 'flex flex-col items-center gap-6',
  };

  const badgeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Footer variant with payment methods and security badges
  if (variant === 'footer' || showPaymentMethods || showSecurityBadges) {
    return (
      <div className={containerClasses.footer}>
        {/* Security Badges Row */}
        {(showSecurityBadges || variant === 'footer') && (
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {SECURITY_BADGES.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                title={badge.tooltip}
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Payment Methods Row */}
        {(showPaymentMethods || variant === 'footer') && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Secure Payment Options
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {PAYMENT_METHODS.map((method, index) => (
                <div
                  key={index}
                  className="transition-transform hover:scale-110 cursor-pointer"
                  title={`Pay with ${method.name}`}
                >
                  {method.icon}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Original badges if provided */}
        {badges && badges.length > 0 && (
          <div className="flex items-center justify-center gap-4 flex-wrap mt-2">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-600"
                title={badge.tooltip}
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-medium">{badge.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

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
