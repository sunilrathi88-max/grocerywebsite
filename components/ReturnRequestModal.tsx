import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, ToastMessage } from '../types';
import { XIcon } from './icons/XIcon';
import { OptimizedImage } from './OptimizedImage';
import { imageErrorHandlers } from '../utils/imageHelpers';
import { returnAPI, RETURN_REASONS, ReturnRequest } from '../utils/returnAPI';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ReturnRequestModalProps {
  isOpen: boolean;
  order: Order;
  onClose: () => void;
  onSuccess: () => void;
  addToast: (message: string, type: ToastMessage['type']) => void;
}

type Step = 'select_items' | 'reason' | 'images' | 'review' | 'success';

const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
  isOpen,
  order,
  onClose,
  onSuccess,
  addToast,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>('select_items');
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [reason, setReason] = useState<string>('');
  const [detailedReason, setDetailedReason] = useState('');
  const [refundMethod, setRefundMethod] = useState<
    'original_payment' | 'store_credit' | 'bank_transfer'
  >('original_payment');
  const [itemConditions, setItemConditions] = useState<
    Map<string, 'unopened' | 'opened' | 'damaged' | 'defective'>
  >(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refundAmount = useMemo(() => {
    return returnAPI.calculateRefundAmount(order, selectedItems);
  }, [order, selectedItems]);

  const handleItemSelect = (productId: number, variantId: number, quantity: number) => {
    const key = `${productId}-${variantId}`;
    const newSelected = new Map(selectedItems);
    if (quantity === 0) {
      newSelected.delete(key);
      const newConditions = new Map(itemConditions);
      newConditions.delete(key);
      setItemConditions(newConditions);
    } else {
      newSelected.set(key, quantity);
      // Set default condition if not set
      if (!itemConditions.has(key)) {
        const newConditions = new Map(itemConditions);
        newConditions.set(key, 'unopened');
        setItemConditions(newConditions);
      }
    }
    setSelectedItems(newSelected);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Build return request
      const returnItems = order.items
        .filter((item) => {
          const key = `${item.product.id}-${item.selectedVariant.id}`;
          return selectedItems.has(key) && selectedItems.get(key)! > 0;
        })
        .map((item) => {
          const key = `${item.product.id}-${item.selectedVariant.id}`;
          return {
            product_id: item.product.id,
            product_name: item.product.name,
            variant_id: item.selectedVariant.id,
            variant_name: item.selectedVariant.name,
            quantity: selectedItems.get(key)!,
            unit_price: item.selectedVariant.salePrice || item.selectedVariant.price,
            condition: itemConditions.get(key) || 'unopened',
          };
        });

      const request: ReturnRequest = {
        order_id: order.id,
        reason: reason as ReturnRequest['reason'],
        detailed_reason: detailedReason,
        refund_amount: refundAmount,
        refund_method: refundMethod,
        items: returnItems,
      };

      await returnAPI.initiateReturn(request);
      setCurrentStep('success');
      addToast('Return request submitted successfully!', 'success');
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Return submission failed:', error);
      addToast('Failed to submit return request. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep('select_items');
    setSelectedItems(new Map());
    setReason('');
    setDetailedReason('');
    setRefundMethod('original_payment');
    setItemConditions(new Map());
    onClose();
  };

  const canProceedToReason = selectedItems.size > 0;
  const canProceedToReview = reason !== '';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Return Request</h2>
                <p className="text-sm opacity-90">Order #{order.id}</p>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <XIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Progress Steps */}
            {currentStep !== 'success' && (
              <div className="bg-gray-50 px-6 py-4">
                <div className="flex items-center justify-between max-w-2xl mx-auto">
                  {['Select Items', 'Reason', 'Review'].map((label, index) => {
                    const stepKeys: Step[] = ['select_items', 'reason', 'review'];
                    const stepIndex = stepKeys.indexOf(currentStep);
                    const isActive = index === stepIndex;
                    const isCompleted = index < stepIndex;

                    return (
                      <React.Fragment key={label}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isActive
                                ? 'bg-brand-primary text-brand-dark'
                                : isCompleted
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-300 text-gray-600'
                              }`}
                          >
                            {isCompleted ? '✓' : index + 1}
                          </div>
                          <p
                            className={`text-xs mt-1 ${isActive ? 'text-brand-primary font-semibold' : 'text-gray-600'}`}
                          >
                            {label}
                          </p>
                        </div>
                        {index < 2 && (
                          <div
                            className={`flex-1 h-1 mx-2 rounded ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              {/* Step 1: Select Items */}
              {currentStep === 'select_items' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Select items to return</h3>
                  {order.items.map((item) => {
                    const key = `${item.product.id}-${item.selectedVariant.id}`;
                    const selectedQty = selectedItems.get(key) || 0;

                    return (
                      <div
                        key={key}
                        className="border border-gray-200 rounded-lg p-4 flex gap-4 items-start"
                      >
                        <OptimizedImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                          type="thumbnail"
                          priority="low"
                          width={80}
                          height={80}
                          onError={imageErrorHandlers.thumb}
                        />
                        <div className="flex-grow">
                          <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                          <p className="text-sm text-gray-600">{item.selectedVariant.name}</p>
                          <p className="text-sm text-gray-600">Ordered: {item.quantity}</p>
                          <p className="text-sm font-bold text-brand-primary">
                            ₹
                            {(item.selectedVariant.salePrice || item.selectedVariant.price).toFixed(
                              2
                            )}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-gray-600">Return Qty</label>
                          <select
                            value={selectedQty}
                            onChange={(e) =>
                              handleItemSelect(
                                item.product.id,
                                item.selectedVariant.id,
                                parseInt(e.target.value)
                              )
                            }
                            className="border border-gray-300 rounded-lg px-3 py-2"
                          >
                            {Array.from({ length: item.quantity + 1 }, (_, i) => (
                              <option key={i} value={i}>
                                {i}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                  {refundAmount > 0 && (
                    <div className="bg-brand-accent/20 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">Estimated Refund</p>
                      <p className="text-2xl font-bold text-brand-primary">
                        ₹{refundAmount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Reason */}
              {currentStep === 'reason' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Why are you returning?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {RETURN_REASONS.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setReason(r.value)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${reason === r.value
                              ? 'border-brand-primary bg-brand-accent/20'
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <p className="font-semibold text-gray-900">{r.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Additional Details (Optional)
                    </label>
                    <textarea
                      value={detailedReason}
                      onChange={(e) => setDetailedReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]"
                      placeholder="Tell us more about why you're returning these items..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Refund Method
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'original_payment', label: 'Original Payment Method' },
                        { value: 'store_credit', label: 'Store Credit (10% bonus)' },
                        { value: 'bank_transfer', label: 'Bank Transfer' },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="refundMethod"
                            value={method.value}
                            checked={refundMethod === method.value}
                            onChange={(e) =>
                              setRefundMethod(e.target.value as ReturnRequest['refund_method'])
                            }
                            className="w-5 h-5 text-brand-primary"
                          />
                          <span className="font-medium text-gray-900">{method.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {currentStep === 'review' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900">Review Return Request</h3>

                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Return Reason</p>
                      <p className="font-semibold text-gray-900">
                        {RETURN_REASONS.find((r) => r.value === reason)?.label}
                      </p>
                    </div>
                    {detailedReason && (
                      <div>
                        <p className="text-sm text-gray-600">Details</p>
                        <p className="text-gray-900">{detailedReason}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600">Refund Method</p>
                      <p className="font-semibold text-gray-900">
                        {refundMethod === 'original_payment' && 'Original Payment Method'}
                        {refundMethod === 'store_credit' && 'Store Credit (+10% bonus)'}
                        {refundMethod === 'bank_transfer' && 'Bank Transfer'}
                      </p>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-sm text-gray-600">Refund Amount</p>
                      <p className="text-2xl font-bold text-brand-primary">
                        ₹{refundAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Items to Return</p>
                    <div className="space-y-2">
                      {order.items
                        .filter((item) => {
                          const key = `${item.product.id}-${item.selectedVariant.id}`;
                          return selectedItems.has(key) && selectedItems.get(key)! > 0;
                        })
                        .map((item) => {
                          const key = `${item.product.id}-${item.selectedVariant.id}`;
                          return (
                            <div
                              key={key}
                              className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
                            >
                              <OptimizedImage
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                                type="thumbnail"
                                priority="low"
                                width={48}
                                height={48}
                                onError={imageErrorHandlers.thumb}
                              />
                              <div className="flex-grow">
                                <p className="font-semibold text-sm text-gray-900">
                                  {item.product.name}
                                </p>
                                <p className="text-xs text-gray-600">{item.selectedVariant.name}</p>
                              </div>
                              <p className="text-sm font-bold">Qty: {selectedItems.get(key)}</p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 'success' && (
                <div className="text-center py-12">
                  <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Return Request Submitted!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    We&apos;ve received your return request. You&apos;ll receive an email
                    confirmation shortly with pickup details.
                  </p>
                  <div className="bg-brand-accent/20 p-4 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-gray-700">Expected Refund Amount</p>
                    <p className="text-3xl font-bold text-brand-primary">
                      ₹{refundAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {currentStep !== 'success' && (
              <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t">
                <button
                  onClick={
                    currentStep === 'select_items'
                      ? handleClose
                      : () => setCurrentStep(currentStep === 'reason' ? 'select_items' : 'reason')
                  }
                  className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  {currentStep === 'select_items' ? 'Cancel' : 'Back'}
                </button>
                <button
                  onClick={() => {
                    if (currentStep === 'select_items' && canProceedToReason) {
                      setCurrentStep('reason');
                    } else if (currentStep === 'reason' && canProceedToReview) {
                      setCurrentStep('review');
                    } else if (currentStep === 'review') {
                      handleSubmit();
                    }
                  }}
                  disabled={
                    (currentStep === 'select_items' && !canProceedToReason) ||
                    (currentStep === 'reason' && !canProceedToReview) ||
                    isSubmitting
                  }
                  className="px-8 py-2 bg-brand-primary text-brand-dark rounded-lg hover:bg-opacity-90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 'review'
                    ? isSubmitting
                      ? 'Submitting...'
                      : 'Submit Return'
                    : 'Next'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReturnRequestModal;
