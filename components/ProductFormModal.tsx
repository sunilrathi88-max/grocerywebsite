import { PLACEHOLDER_IMAGES } from '../constants';

import React, { useState } from 'react';
import { Product } from '../types';
import { XIcon } from './icons/XIcon';

interface ProductFormModalProps {
  product: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const BLANK_PRODUCT: Product = {
  id: 0,
  name: '',
  description: '',
  category: 'Spices',
  images: [],
  variants: [{ id: Date.now(), name: '100g', price: 0, stock: 0 }],
  reviews: []
};

// Helper function to read file as data URL
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState<Product>(product || BLANK_PRODUCT);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleVariantChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newVariants = [...formData.variants];
    const field = e.target.name as keyof typeof newVariants[0];
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    (newVariants[index] as any)[field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImageUrls = await Promise.all(files.map(fileToDataUri));
      setFormData(prev => ({ ...prev, images: [...prev.images.filter(img => img), ...newImageUrls] }));
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-serif font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200"><XIcon className="h-6 w-6" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 input-field" required />
          </div>
           <div>
            <label className="block text-sm font-medium">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="mt-1 input-field">
                <option>Spices</option>
                <option>Beverages</option>
                <option>Nuts</option>
                <option>Dry Fruits</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium">Product Images</label>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-4">
              {formData.images.map((img, index) => (
                img && <div key={index} className="relative group">
                  <img src={img} alt={`Product image ${index + 1}`} className="w-full h-24 object-cover rounded-md" onError={(e) => { const t = e.currentTarget; t.onerror = null; t.src = PLACEHOLDER_IMAGES.THUMB; }} />
                  <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
                    <XIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label htmlFor="image-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary">
                <span>Upload Images</span>
                <input id="image-upload" name="image-upload" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} />
              </label>
              <p className="text-xs text-gray-500 mt-1">Add one or more images for the product. This is a frontend simulation.</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-bold mb-2">Variants</h3>
            {formData.variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 p-2 border rounded-md">
                    <div>
                        <label className="block text-xs font-medium">Name</label>
                        <input type="text" name="name" value={variant.name} onChange={e => handleVariantChange(e, index)} className="mt-1 input-field-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium">Price</label>
                        <input type="number" step="0.01" name="price" value={variant.price} onChange={e => handleVariantChange(e, index)} className="mt-1 input-field-sm" />
                    </div>
                     <div>
                        <label className="block text-xs font-medium">Stock</label>
                        <input type="number" name="stock" value={variant.stock} onChange={e => handleVariantChange(e, index)} className="mt-1 input-field-sm" />
                    </div>
                </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full">Cancel</button>
            <button type="submit" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-full">Save Product</button>
          </div>
        </form>
      </div>
       <style>{`
          .input-field { display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; }
          .input-field:focus { outline: none; --tw-ring-color: #FFB7C1; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: #FFB7C1; }
          .input-field-sm { display: block; width: 100%; padding: 0.25rem 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; font-size: 0.875rem; }
        `}</style>
    </div>
  );
};

export default ProductFormModal;
