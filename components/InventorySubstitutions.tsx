import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product, ProductSubstitution, SubstitutionPreference } from '../types';
import { mockProductSubstitutions } from '../data/mockData';

interface InventorySubstitutionsProps {
  products: Product[];
  onAddToCart: (productId: number, quantity: number) => void;
}

export function InventorySubstitutions({ products, onAddToCart }: InventorySubstitutionsProps) {
  const [substitutions] = useState<ProductSubstitution[]>(mockProductSubstitutions);
  const [preferences, setPreferences] = useState<SubstitutionPreference[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [restockNotifications, setRestockNotifications] = useState<Set<number>>(new Set());

  useEffect(() => {
    const lowStockProducts = products.filter(p =>
      p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)
    );

    if (lowStockProducts.length > 0) {
      console.log('Low stock alert:', lowStockProducts.map(p => p.name));
    }
  }, [products]);

  const getProductById = (id: number): Product | undefined => {
    return products.find(p => p.id === id);
  };

  const getSubstitutesForProduct = (productId: number): Product[] => {
    const substitutionRules = substitutions
      .filter(sub => sub.productId === productId)
      .sort((a, b) => a.priority - b.priority);

    return substitutionRules
      .map(sub => getProductById(sub.substituteProductId))
      .filter((p): p is Product => p !== undefined && p.stock > 0);
  };

  const handleSetPreference = (productId: number, preferredSubstituteId: number | null, allowSubstitution: boolean) => {
    setPreferences(prev => {
      const existing = prev.find(p => p.productId === productId);
      if (existing) {
        return prev.map(p =>
          p.productId === productId
            ? { ...p, preferredSubstituteId: preferredSubstituteId || undefined, allowSubstitution }
            : p
        );
      } else {
        return [...prev, {
          id: `pref-${Date.now()}`,
          userId: 'user-1',
          productId,
          preferredSubstituteId: preferredSubstituteId || undefined,
          allowSubstitution
        }];
      }
    });
  };

  const handleRequestRestock = (productId: number) => {
    setRestockNotifications(prev => new Set([...prev, productId]));
    alert('You will be notified when this product is back in stock!');
  };

  const getStockStatus = (product: Product) => {
    if (!product.isAvailable || product.stock === 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    } else if (product.stock <= (product.lowStockThreshold || 10)) {
      return { label: `Low Stock (${product.stock} left)`, color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    }
  };

  const outOfStockProducts = products.filter(p => !p.isAvailable || p.stock === 0);
  const lowStockProducts = products.filter(p =>
    p.isAvailable && p.stock > 0 && p.stock <= (p.lowStockThreshold || 10)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Real-Time Inventory & Substitutions</h1>
      <p className="text-gray-600 mb-8">Track stock levels and get smart substitution suggestions</p>

      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Low Stock Alert</h3>
          <p className="text-sm text-yellow-800 mb-2">
            The following products are running low. Order soon or consider alternatives:
          </p>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map(product => (
              <span key={product.id} className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded text-sm">
                {product.name} ({product.stock} left)
              </span>
            ))}
          </div>
        </div>
      )}

      {outOfStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-900 mb-2">Out of Stock</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {outOfStockProducts.slice(0, 4).map(product => {
              const substitutes = getSubstitutesForProduct(product.id);
              return (
                <div key={product.id} className="bg-white rounded p-3 border border-red-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{product.name}</span>
                    {!restockNotifications.has(product.id) && (
                      <button
                        onClick={() => handleRequestRestock(product.id)}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Notify me
                      </button>
                    )}
                  </div>
                  {substitutes.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Available alternatives:</p>
                      {substitutes.slice(0, 2).map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedProduct(sub)}
                          className="block w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded px-2 py-1"
                        >
                          → {sub.name} (₹{sub.price})
                        </button>
                      ))}
                    </div>
                  )}
                  {restockNotifications.has(product.id) && (
                    <span className="inline-block mt-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      ✓ Notification set
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">All Products - Stock Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => {
            const stockStatus = getStockStatus(product);
            const substitutes = getSubstitutesForProduct(product.id);
            const preference = preferences.find(p => p.productId === product.id);

            return (
              <motion.div
                key={product.id}
                className="bg-white rounded-lg shadow-md p-4"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />

                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${stockStatus.color}`}>
                    {stockStatus.label}
                  </span>
                </div>

                <p className="text-lg font-bold text-amber-600 mb-2">₹{product.price}</p>

                {product.stock > 0 ? (
                  <button
                    onClick={() => onAddToCart(product.id, 1)}
                    className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium mb-2"
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    onClick={() => handleRequestRestock(product.id)}
                    disabled={restockNotifications.has(product.id)}
                    className={`w-full px-4 py-2 rounded-lg font-medium mb-2 ${
                      restockNotifications.has(product.id)
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {restockNotifications.has(product.id) ? '✓ Notification Set' : 'Notify When Available'}
                  </button>
                )}

                {substitutes.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-medium text-gray-600 mb-2">Alternative options:</p>
                    <div className="space-y-1">
                      {substitutes.slice(0, 2).map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setSelectedProduct(sub)}
                          className="block w-full text-left text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded px-2 py-1"
                        >
                          {sub.name} - ₹{sub.price}
                        </button>
                      ))}
                    </div>

                    <div className="mt-2">
                      <label className="flex items-center text-xs text-gray-600">
                        <input
                          type="checkbox"
                          checked={preference?.allowSubstitution ?? true}
                          onChange={(e) => handleSetPreference(
                            product.id,
                            preference?.preferredSubstituteId || null,
                            e.target.checked
                          )}
                          className="mr-2"
                        />
                        Allow auto-substitution
                      </label>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <motion.div
            className="bg-white rounded-lg max-w-2xl w-full p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-full h-64 object-cover rounded mb-4"
            />

            <p className="text-gray-700 mb-4">{selectedProduct.description}</p>

            <div className="flex justify-between items-center mb-4">
              <p className="text-2xl font-bold text-amber-600">₹{selectedProduct.price}</p>
              <span className={`px-3 py-1 rounded ${getStockStatus(selectedProduct).color}`}>
                {getStockStatus(selectedProduct).label}
              </span>
            </div>

            <button
              onClick={() => {
                onAddToCart(selectedProduct.id, 1);
                setSelectedProduct(null);
              }}
              disabled={selectedProduct.stock === 0}
              className="w-full px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {selectedProduct.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
