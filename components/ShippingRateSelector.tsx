/**
 * ShippingRateSelector Component
 * Displays available shipping options with prices and estimated delivery times
 */

import React, { useState, useEffect } from 'react';
import { ShippingOption } from '../types/shipping';
import { getShippingRates } from '../utils/shiprocketService';

interface ShippingRateSelectorProps {
  pickupPincode?: string;
  deliveryPincode: string;
  cartTotal: number;
  isCod?: boolean;
  onSelectShipping: (option: ShippingOption) => void;
  selectedOptionId?: number;
}

const ShippingRateSelector: React.FC<ShippingRateSelectorProps> = ({
  pickupPincode = '400001', // Default warehouse pincode
  deliveryPincode,
  cartTotal,
  isCod = false,
  onSelectShipping,
  selectedOptionId,
}) => {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(selectedOptionId || null);

  useEffect(() => {
    const fetchRates = async () => {
      if (!deliveryPincode || deliveryPincode.length !== 6) {
        setShippingOptions([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const options = await getShippingRates(
          pickupPincode,
          deliveryPincode,
          0.5, // Default weight
          isCod,
          cartTotal
        );

        if (options.length > 0) {
          setShippingOptions(options);

          // Auto-select recommended option
          const recommended = options.find((opt) => opt.isRecommended);
          if (recommended && !selectedId) {
            setSelectedId(recommended.courierId);
            onSelectShipping(recommended);
          }
        } else {
          // Use mock options if API returns empty
          useMockOptions();
        }
      } catch (err) {
        console.error('Failed to fetch shipping rates, using fallback:', err);
        // Use mock shipping options as fallback
        useMockOptions();
      } finally {
        setLoading(false);
      }

      function useMockOptions() {
        const mockOptions: ShippingOption[] = [
          {
            courierId: 1,
            courierName: 'Standard Delivery',
            price: cartTotal >= 1000 ? 0 : 49,
            estimatedDays: 5,
            etd: '5-7 business days',
            rating: 4.2,
            isRecommended: true,
            isCod: true,
            realTimeTracking: true,
          },
          {
            courierId: 2,
            courierName: 'Express Delivery',
            price: 99,
            estimatedDays: 3,
            etd: '2-3 business days',
            rating: 4.5,
            isRecommended: false,
            isCod: true,
            realTimeTracking: true,
          },
          {
            courierId: 3,
            courierName: 'Premium Next Day',
            price: 149,
            estimatedDays: 1,
            etd: '1-2 business days',
            rating: 4.8,
            isRecommended: false,
            isCod: false,
            realTimeTracking: true,
          },
        ];
        setShippingOptions(mockOptions);
        setError(null);

        // Auto-select first option
        const recommended = mockOptions[0];
        if (recommended && !selectedId) {
          setSelectedId(recommended.courierId);
          onSelectShipping(recommended);
        }
      }
    };

    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryPincode, pickupPincode, isCod, cartTotal]);

  const handleSelect = (option: ShippingOption) => {
    setSelectedId(option.courierId);
    onSelectShipping(option);
  };

  if (!deliveryPincode || deliveryPincode.length !== 6) {
    return (
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Enter a valid PIN code to see shipping options
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <div className="animate-spin h-5 w-5 border-2 border-brand-primary border-t-transparent rounded-full" />
          <span className="text-gray-600">Fetching shipping rates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-center gap-2 text-red-600">
          <span>⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  if (shippingOptions.length === 0) {
    return (
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-center gap-2 text-amber-700">
          <span>📦</span>
          <span className="text-sm">No shipping options available for PIN {deliveryPincode}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-bold flex items-center gap-2">🚚 Select Shipping</h3>
        <span className="text-xs text-gray-500">{shippingOptions.length} options</span>
      </div>

      <div className="space-y-3">
        {shippingOptions.map((option) => (
          <button
            key={option.courierId}
            type="button"
            onClick={() => handleSelect(option)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedId === option.courierId
                ? 'border-brand-primary bg-brand-primary/5 shadow-md'
                : 'border-gray-200 bg-white hover:border-brand-primary/50 hover:shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">{option.courierName}</span>
                  {option.isRecommended && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ⭐ Recommended
                    </span>
                  )}
                  {option.realTimeTracking && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      📍 Live Tracking
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    ⏱️ {option.estimatedDays} {option.estimatedDays === 1 ? 'day' : 'days'}
                  </span>
                  <span className="flex items-center gap-1">📅 ETA: {option.etd}</span>
                  {option.rating > 0 && (
                    <span className="flex items-center gap-1">★ {option.rating.toFixed(1)}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-brand-primary">
                  ₹{option.price.toFixed(0)}
                </span>
                {selectedId === option.courierId && (
                  <div className="text-green-600 text-xs mt-1">✓ Selected</div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Free shipping message */}
      {cartTotal >= 1000 && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
          <span className="text-sm text-green-700 font-medium">
            🎉 You qualify for FREE shipping on orders above ₹1000!
          </span>
        </div>
      )}
    </div>
  );
};

export default ShippingRateSelector;
