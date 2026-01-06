import React from 'react';

interface CheckoutStepperProps {
  currentStep: 'shipping' | 'payment' | 'review';
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  const steps = [
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Review' },
  ];

  const stepIndex = { shipping: 0, payment: 1, review: 2 };
  const currentIndex = stepIndex[currentStep];

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-center space-x-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step indicator */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-300 ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white'
                      : isCurrent
                        ? 'bg-brand-primary border-brand-primary text-brand-dark'
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {isCompleted ? <span className="text-white">✓</span> : <span>{index + 1}</span>}
                </div>
                <span
                  className={`absolute -bottom-6 text-xs font-bold whitespace-nowrap ${
                    isCurrent ? 'text-brand-dark' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-24 h-1 mx-2 sm:mx-4 rounded-full transition-colors duration-300 ${
                    index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutStepper;
