import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  businessAddress: string;
  gstNumber: string;
  fssaiLicense: string;
}

interface PaymentSettings {
  upiId: string;
  codEnabled: boolean;
  razorpayEnabled: boolean;
  razorpayKeyId: string;
  cashfreeEnabled: boolean;
  cashfreeAppId: string;
}

interface ShippingSettings {
  defaultShippingRate: number;
  freeShippingThreshold: number;
  expressShippingRate: number;
  metroDeliveryDays: number;
  nonMetroDeliveryDays: number;
}

const DEFAULT_STORE_SETTINGS: StoreSettings = {
  storeName: 'THE RATHI SPICE CO.',
  storeEmail: 'rathinaturals@gmail.com',
  storePhone: '+91 88900 06364',
  businessAddress: '125, Main Market, Sangaria, Rajasthan, India',
  gstNumber: '',
  fssaiLicense: '12225025000253',
};

const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  upiId: 'rathinaturals@upi',
  codEnabled: true,
  razorpayEnabled: false,
  razorpayKeyId: '',
  cashfreeEnabled: true,
  cashfreeAppId: '',
};

const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  defaultShippingRate: 50,
  freeShippingThreshold: 499,
  expressShippingRate: 100,
  metroDeliveryDays: 3,
  nonMetroDeliveryDays: 7,
};

const SettingsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'store' | 'payment' | 'shipping'>('store');
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(DEFAULT_PAYMENT_SETTINGS);
  const [shippingSettings, setShippingSettings] =
    useState<ShippingSettings>(DEFAULT_SHIPPING_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedStore = localStorage.getItem('tattva_store_settings');
    const savedPayment = localStorage.getItem('tattva_payment_settings');
    const savedShipping = localStorage.getItem('tattva_shipping_settings');

    if (savedStore) setStoreSettings(JSON.parse(savedStore));
    if (savedPayment) setPaymentSettings(JSON.parse(savedPayment));
    if (savedShipping) setShippingSettings(JSON.parse(savedShipping));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage (in production, this would be Supabase)
      localStorage.setItem('tattva_store_settings', JSON.stringify(storeSettings));
      localStorage.setItem('tattva_payment_settings', JSON.stringify(paymentSettings));
      localStorage.setItem('tattva_shipping_settings', JSON.stringify(shippingSettings));

      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-serif font-bold">Settings</h3>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-brand-primary text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-opacity-90 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6">
        {(['store', 'payment', 'shipping'] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeSection === section
                ? 'bg-brand-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {section === 'store' && '🏪 Store Info'}
            {section === 'payment' && '💳 Payment'}
            {section === 'shipping' && '📦 Shipping'}
          </button>
        ))}
      </div>

      {/* Store Settings */}
      {activeSection === 'store' && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h4 className="font-bold text-lg mb-4">Store Information</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
              <input
                type="text"
                value={storeSettings.gstNumber}
                onChange={(e) => setStoreSettings({ ...storeSettings, gstNumber: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                placeholder="e.g. 22AAAAA0000A1Z5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">FSSAI License</label>
              <input
                type="text"
                value={storeSettings.fssaiLicense}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, fssaiLicense: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                placeholder="e.g. 10019022000000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <textarea
                value={storeSettings.businessAddress}
                onChange={(e) =>
                  setStoreSettings({ ...storeSettings, businessAddress: e.target.value })
                }
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Settings */}
      {activeSection === 'payment' && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h4 className="font-bold text-lg mb-4">Payment Configuration</h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                type="text"
                value={paymentSettings.upiId}
                onChange={(e) => setPaymentSettings({ ...paymentSettings, upiId: e.target.value })}
                className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                placeholder="yourstore@upi"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.codEnabled}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, codEnabled: e.target.checked })
                  }
                  className="w-5 h-5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                />
                <span className="font-medium">Cash on Delivery (COD)</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.razorpayEnabled}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, razorpayEnabled: e.target.checked })
                  }
                  className="w-5 h-5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                />
                <span className="font-medium">Razorpay (Online Payments)</span>
              </label>
            </div>

            {paymentSettings.razorpayEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  value={paymentSettings.razorpayKeyId}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })
                  }
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="rzp_live_xxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your Razorpay API Key ID (starts with rzp_)
                </p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={paymentSettings.cashfreeEnabled}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, cashfreeEnabled: e.target.checked })
                  }
                  className="w-5 h-5 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                />
                <span className="font-medium">Cashfree (Online Payments)</span>
              </label>
            </div>

            {paymentSettings.cashfreeEnabled && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cashfree App ID
                </label>
                <input
                  type="text"
                  value={paymentSettings.cashfreeAppId}
                  onChange={(e) =>
                    setPaymentSettings({ ...paymentSettings, cashfreeAppId: e.target.value })
                  }
                  className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                  placeholder="CF_xxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">Your Cashfree App ID</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {activeSection === 'shipping' && (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h4 className="font-bold text-lg mb-4">Shipping Configuration</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Shipping Rate (₹)
              </label>
              <input
                type="number"
                value={shippingSettings.defaultShippingRate}
                onChange={(e) =>
                  setShippingSettings({
                    ...shippingSettings,
                    defaultShippingRate: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={shippingSettings.freeShippingThreshold}
                onChange={(e) =>
                  setShippingSettings({
                    ...shippingSettings,
                    freeShippingThreshold: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Orders above this amount get free shipping
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Express Shipping Rate (₹)
              </label>
              <input
                type="number"
                value={shippingSettings.expressShippingRate}
                onChange={(e) =>
                  setShippingSettings({
                    ...shippingSettings,
                    expressShippingRate: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metro Delivery Days
              </label>
              <input
                type="number"
                value={shippingSettings.metroDeliveryDays}
                onChange={(e) =>
                  setShippingSettings({
                    ...shippingSettings,
                    metroDeliveryDays: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Non-Metro Delivery Days
              </label>
              <input
                type="number"
                value={shippingSettings.nonMetroDeliveryDays}
                onChange={(e) =>
                  setShippingSettings({
                    ...shippingSettings,
                    nonMetroDeliveryDays: Number(e.target.value),
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
