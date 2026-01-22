import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'transactional' | 'marketing';
  lastUpdated: string;
}

const DEFAULT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'order-confirmation',
    name: 'Order Confirmation',
    subject: 'Your Tattva Co. Order #{{order_id}} is Confirmed! 🎉',
    body: `Dear {{customer_name}},

Thank you for your order! We're thrilled to have you as a customer.

**Order Details:**
Order ID: #{{order_id}}
Order Date: {{order_date}}
Total Amount: ₹{{order_total}}

**Items Ordered:**
{{order_items}}

**Shipping Address:**
{{shipping_address}}

Your order is being prepared with care and will be shipped soon. You'll receive a tracking number once it's on its way!

With love,
The Tattva Co. Team 🌿`,
    type: 'transactional',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'shipping-notification',
    name: 'Shipping Notification',
    subject: 'Your Order #{{order_id}} is on its way! 📦',
    body: `Dear {{customer_name}},

Great news! Your order has been shipped and is on its way to you.

**Tracking Details:**
Tracking Number: {{tracking_number}}
Carrier: {{carrier_name}}
Expected Delivery: {{expected_delivery}}

Track your package: {{tracking_url}}

**Order Summary:**
Order ID: #{{order_id}}
Items: {{order_items}}

If you have any questions, just reply to this email.

Happy anticipating!
The Tattva Co. Team`,
    type: 'transactional',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'delivery-complete',
    name: 'Delivery Complete',
    subject: 'Your Tattva Co. order has been delivered! ✅',
    body: `Dear {{customer_name}},

Your order #{{order_id}} has been successfully delivered!

We hope you love your products. If you have a moment, we'd really appreciate a review - it helps other customers discover our premium spices.

**Leave a Review:** {{review_url}}

**Need Help?**
If anything isn't perfect, please let us know. We're here to make it right.

Enjoy your spices!
The Tattva Co. Team 🌶️`,
    type: 'transactional',
    lastUpdated: '2024-01-15',
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart Reminder',
    subject: 'Forgot something? Your cart misses you! 🛒',
    body: `Hi {{customer_name}},

You left some amazing spices in your cart! Don't let them get away.

**Your Cart Items:**
{{cart_items}}

**Cart Total:** ₹{{cart_total}}

Complete your order now and continue your flavor journey!

[Complete Purchase] {{checkout_url}}

Use code COMEBACK10 for 10% off your order!

Cheers,
The Tattva Co. Team`,
    type: 'marketing',
    lastUpdated: '2024-01-20',
  },
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    subject: 'Welcome to Tattva Co.! 🌿 Your flavor journey begins',
    body: `Dear {{customer_name}},

Welcome to the Tattva Co. family! We're so excited to have you with us.

**What makes us special:**
✨ Farm-to-table premium spices
✨ Sustainably sourced ingredients  
✨ Lab-tested for purity
✨ From the best regions of India

**Your first order discount:**
Use code WELCOME10 for 10% off your first purchase!

Explore our collection: {{shop_url}}

Follow us for recipes and tips:
Instagram: @tattvaco
Facebook: /tattvaco

Here's to flavorful cooking!
The Tattva Co. Team`,
    type: 'marketing',
    lastUpdated: '2024-01-10',
  },
];

const EmailTemplatesTab: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>(() => {
    const saved = localStorage.getItem('tattva_email_templates');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('tattva_email_templates', JSON.stringify(DEFAULT_TEMPLATES));
    return DEFAULT_TEMPLATES;
  });
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editedTemplate, setEditedTemplate] = useState<EmailTemplate | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const saveTemplates = (updated: EmailTemplate[]) => {
    setTemplates(updated);
    localStorage.setItem('tattva_email_templates', JSON.stringify(updated));
  };

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditedTemplate({ ...template });
    setIsPreview(false);
  };

  const handleSave = () => {
    if (!editedTemplate) return;

    const updated = templates.map((t) =>
      t.id === editedTemplate.id
        ? { ...editedTemplate, lastUpdated: new Date().toISOString().split('T')[0] }
        : t
    );

    saveTemplates(updated);
    setSelectedTemplate(editedTemplate);
    toast.success('Template saved successfully!');
  };

  const getPreviewContent = (body: string) => {
    // Replace placeholders with sample data
    return body
      .replace(/\{\{customer_name\}\}/g, 'Priya Sharma')
      .replace(/\{\{order_id\}\}/g, 'ORD-12345')
      .replace(/\{\{order_date\}\}/g, 'Jan 20, 2025')
      .replace(/\{\{order_total\}\}/g, '1,299')
      .replace(
        /\{\{order_items\}\}/g,
        '• Organic Turmeric (200g) ×2\n• Malabar Black Pepper (250g) ×1'
      )
      .replace(/\{\{shipping_address\}\}/g, '123 Main Street, Mumbai, Maharashtra 400001')
      .replace(/\{\{tracking_number\}\}/g, 'TRACK123456')
      .replace(/\{\{carrier_name\}\}/g, 'Delhivery')
      .replace(/\{\{expected_delivery\}\}/g, 'Jan 25, 2025')
      .replace(/\{\{tracking_url\}\}/g, 'https://tracking.tattvaco.in/TRACK123456')
      .replace(/\{\{review_url\}\}/g, 'https://tattvaco.in/review/ORD-12345')
      .replace(/\{\{cart_items\}\}/g, '• Saffron (1g) - ₹300\n• Cardamom (100g) - ₹450')
      .replace(/\{\{cart_total\}\}/g, '750')
      .replace(/\{\{checkout_url\}\}/g, 'https://tattvaco.in/checkout')
      .replace(/\{\{shop_url\}\}/g, 'https://tattvaco.in/shop');
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-serif font-bold">Email Templates</h3>
        <p className="text-sm text-gray-500">Customize transactional and marketing emails</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <h4 className="font-bold text-gray-800">Templates</h4>
            </div>
            <div className="divide-y">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'bg-brand-secondary/20 border-l-4 border-brand-primary'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{template.name}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        template.type === 'transactional'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {template.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Updated: {template.lastUpdated}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-2">
          {editedTemplate ? (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b flex justify-between items-center">
                <h4 className="font-bold text-gray-800">{editedTemplate.name}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      isPreview
                        ? 'bg-brand-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isPreview ? '✏️ Edit' : '👁️ Preview'}
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-opacity-90"
                  >
                    💾 Save
                  </button>
                </div>
              </div>

              {isPreview ? (
                <div className="p-6">
                  <div className="bg-gray-100 rounded-lg p-6">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-xl mx-auto">
                      {/* Email Header */}
                      <div className="bg-brand-primary p-4">
                        <h2 className="text-white text-xl font-bold text-center">Tattva Co.</h2>
                      </div>
                      {/* Email Subject */}
                      <div className="p-4 border-b">
                        <p className="text-sm text-gray-500">Subject:</p>
                        <p className="font-bold">{getPreviewContent(editedTemplate.subject)}</p>
                      </div>
                      {/* Email Body */}
                      <div className="p-6 whitespace-pre-line text-gray-700">
                        {getPreviewContent(editedTemplate.body)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={editedTemplate.subject}
                      onChange={(e) =>
                        setEditedTemplate({ ...editedTemplate, subject: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Body
                    </label>
                    <textarea
                      value={editedTemplate.body}
                      onChange={(e) =>
                        setEditedTemplate({ ...editedTemplate, body: e.target.value })
                      }
                      rows={15}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary font-mono text-sm"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Available Placeholders:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        '{{customer_name}}',
                        '{{order_id}}',
                        '{{order_date}}',
                        '{{order_total}}',
                        '{{order_items}}',
                        '{{shipping_address}}',
                        '{{tracking_number}}',
                      ].map((placeholder) => (
                        <code
                          key={placeholder}
                          className="bg-gray-200 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-300"
                          onClick={() => {
                            navigator.clipboard.writeText(placeholder);
                            toast.success('Copied!');
                          }}
                        >
                          {placeholder}
                        </code>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center text-gray-500">
              <p className="text-4xl mb-4">📧</p>
              <p>Select a template to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplatesTab;
