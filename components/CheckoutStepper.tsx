import React from 'react';

interface CheckoutStepperProps {
  currentStep: 'auth' | 'shipping' | 'payment' | 'review';
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  const steps = [
    { id: 'auth', label: 'Login' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payment', label: 'Payment' },
    // Review step is often implicit in payment or a separate final step
  ];

  const stepIndex = { auth: 0, shipping: 1, payment: 2, review: 3 };
  const currentIndex = stepIndex[currentStep];

  return (
    <div className="w-full py-6 px-4">
      {/* Desktop/Tablet Stepper */}
      <div className="hidden sm:flex items-center justify-center space-x-0 w-full max-w-3xl mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center relative z-10 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-500 ease-out shadow-sm ${
                    isCompleted
                      ? 'bg-green-500 border-green-500 text-white scale-105'
                      : isCurrent
                        ? 'bg-brand-primary border-brand-primary text-brand-dark ring-4 ring-brand-primary/20 scale-110'
                        : 'bg-white border-gray-200 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <span className="text-white animate-fadeIn">✓</span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`absolute -bottom-7 text-xs font-bold whitespace-nowrap uppercase tracking-wider transition-colors duration-300 ${
                    isCurrent ? 'text-brand-dark' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-2 rounded-full bg-gray-100 overflow-hidden relative">
                  <div
                    className={`h-full bg-green-500 transition-all duration-700 ease-in-out ${
                      index < currentIndex ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Stepper (Simplified) */}
      <div className="sm:hidden flex flex-col gap-2">
        <div className="flex justify-between items-end mb-1">
          <span className="text-2xl font-serif font-bold text-brand-dark">
            {steps[currentIndex]?.label || 'Checkout'}
          </span>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            Step {currentIndex + 1} of {steps.length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper;
