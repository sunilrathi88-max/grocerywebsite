/**
 * Email Templates for Tattva.co
 * These templates can be used with email services like SendGrid, Mailgun, etc.
 */

export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    weight: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  deliveryDate?: string;
  deliveryTime?: string;
}

export interface WelcomeEmailData {
  customerName: string;
  customerEmail: string;
}

/**
 * Order Confirmation Email Template
 */
export function generateOrderConfirmationEmail(data: OrderEmailData): string {
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <span style="color: #666; font-size: 14px;">${item.weight}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation - Tattva.co</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #D4A017 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Tattva.co</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0;">Premium Indian Spices & Gourmet Products</p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <!-- Success Message -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="width: 60px; height: 60px; background: #10B981; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
          <span style="color: white; font-size: 30px;">✓</span>
        </div>
        <h2 style="color: #1a1a1a; margin: 0;">Thank You for Your Order!</h2>
        <p style="color: #666; margin: 10px 0 0 0;">Hi ${data.customerName}, your order has been confirmed.</p>
      </div>
      
      <!-- Order Details -->
      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <p style="margin: 0 0 10px 0;"><strong>Order ID:</strong> <span style="font-family: monospace; color: #8B5CF6;">${data.orderId}</span></p>
        ${data.deliveryDate ? `<p style="margin: 0;"><strong>Estimated Delivery:</strong> ${data.deliveryDate}${data.deliveryTime ? `, ${data.deliveryTime}` : ''}</p>` : ''}
      </div>
      
      <!-- Items Table -->
      <h3 style="color: #1a1a1a; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">Order Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <thead>
          <tr style="background: #f8f8f8;">
            <th style="padding: 12px; text-align: left;">Product</th>
            <th style="padding: 12px; text-align: center;">Qty</th>
            <th style="padding: 12px; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <!-- Totals -->
      <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Subtotal</span>
          <span>₹${data.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Shipping</span>
          <span>${data.shipping === 0 ? '<span style="color: #10B981;">Free</span>' : `₹${data.shipping.toFixed(2)}`}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Tax</span>
          <span>₹${data.tax.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold; border-top: 1px solid #ddd; padding-top: 12px; margin-top: 12px;">
          <span>Total</span>
          <span style="color: #8B5CF6;">₹${data.total.toFixed(2)}</span>
        </div>
      </div>
      
      <!-- Shipping Address -->
      <h3 style="color: #1a1a1a; border-bottom: 2px solid #8B5CF6; padding-bottom: 10px;">Shipping To</h3>
      <p style="color: #666; line-height: 1.6;">
        ${data.customerName}<br>
        ${data.shippingAddress.street}<br>
        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
      </p>
      
      <!-- CTA -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://tattva.co/orders" style="background: #8B5CF6; color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Track Your Order</a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>Questions? Reply to this email or contact us at <a href="mailto:hello@tattva.co" style="color: #8B5CF6;">hello@tattva.co</a></p>
      <p>© 2024 Tattva.co. All rights reserved.</p>
      <p style="margin-top: 15px;">
        <a href="https://tattva.co" style="color: #666; margin: 0 10px;">Website</a>
        <a href="https://instagram.com/tattvaco" style="color: #666; margin: 0 10px;">Instagram</a>
        <a href="https://tattva.co/unsubscribe" style="color: #666; margin: 0 10px;">Unsubscribe</a>
      </p>
    </div>
    
  </div>
</body>
</html>
  `.trim();
}

/**
 * Welcome Email Template
 */
export function generateWelcomeEmail(data: WelcomeEmailData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Tattva.co</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8B5CF6 0%, #D4A017 100%); padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 32px;">Welcome to Tattva.co</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">Where purity meets flavor</p>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 35px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <h2 style="color: #1a1a1a; margin: 0 0 20px 0;">Hello ${data.customerName}! 🌿</h2>
      
      <p style="color: #555; line-height: 1.8; font-size: 16px;">
        Thank you for joining the Tattva family. We're thrilled to have you on this journey toward authentic, pure, and incredibly flavorful spices.
      </p>
      
      <p style="color: #555; line-height: 1.8; font-size: 16px;">
        Here's what makes us different:
      </p>
      
      <!-- Features -->
      <div style="margin: 25px 0;">
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <span style="background: #8B5CF6; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">❄️</span>
          <div>
            <strong style="color: #1a1a1a;">Cold Ground Daily</strong>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Preserving volatile oils for maximum aroma</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start; margin-bottom: 15px;">
          <span style="background: #10B981; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">🔬</span>
          <div>
            <strong style="color: #1a1a1a;">Lab Tested Every Batch</strong>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Tested for pesticides, heavy metals, and purity</p>
          </div>
        </div>
        <div style="display: flex; align-items: flex-start;">
          <span style="background: #D4A017; color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0;">🌾</span>
          <div>
            <strong style="color: #1a1a1a;">Direct from Farmers</strong>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">No middlemen, fair prices, traceable origin</p>
          </div>
        </div>
      </div>
      
      <!-- Special Offer -->
      <div style="background: linear-gradient(135deg, #8B5CF6 0%, #D4A017 100%); padding: 25px; border-radius: 8px; text-align: center; margin: 30px 0;">
        <p style="color: rgba(255,255,255,0.9); margin: 0 0 10px 0; font-size: 14px;">YOUR WELCOME GIFT</p>
        <p style="color: white; font-size: 28px; font-weight: bold; margin: 0 0 5px 0;">15% OFF</p>
        <p style="color: white; margin: 0 0 15px 0;">on your first order</p>
        <div style="background: white; display: inline-block; padding: 10px 25px; border-radius: 4px;">
          <span style="font-family: monospace; font-size: 20px; font-weight: bold; color: #8B5CF6;">WELCOME15</span>
        </div>
      </div>
      
      <!-- CTA -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://tattva.co/shop" style="background: #8B5CF6; color: white; padding: 16px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">Start Shopping →</a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 25px; color: #999; font-size: 12px;">
      <p>Follow us for recipes, tips, and behind-the-scenes</p>
      <p style="margin: 10px 0;">
        <a href="https://instagram.com/tattvaco" style="color: #8B5CF6; margin: 0 15px;">Instagram</a>
        <a href="https://facebook.com/tattvaco" style="color: #8B5CF6; margin: 0 15px;">Facebook</a>
        <a href="https://youtube.com/tattvaco" style="color: #8B5CF6; margin: 0 15px;">YouTube</a>
      </p>
      <p style="margin-top: 20px;">© 2024 Tattva.co. All rights reserved.</p>
      <p><a href="https://tattva.co/unsubscribe" style="color: #666;">Unsubscribe</a></p>
    </div>
    
  </div>
</body>
</html>
  `.trim();
}

/**
 * Shipping Confirmation Email Template
 */
export function generateShippingConfirmationEmail(data: {
  orderId: string;
  customerName: string;
  trackingNumber: string;
  carrier: string;
  trackingUrl: string;
  estimatedDelivery: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Order is On Its Way!</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 24px;">🚚 Your Order is On Its Way!</h1>
    </div>
    
    <!-- Content -->
    <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      
      <p style="color: #555; line-height: 1.8; font-size: 16px;">
        Hi ${data.customerName}, great news! Your order <strong>${data.orderId}</strong> has been shipped and is on its way to you.
      </p>
      
      <!-- Tracking Info -->
      <div style="background: #f8f8f8; padding: 25px; border-radius: 8px; margin: 25px 0;">
        <h3 style="margin: 0 0 15px 0; color: #1a1a1a;">Tracking Information</h3>
        <p style="margin: 8px 0;"><strong>Carrier:</strong> ${data.carrier}</p>
        <p style="margin: 8px 0;"><strong>Tracking Number:</strong> <span style="font-family: monospace; color: #8B5CF6;">${data.trackingNumber}</span></p>
        <p style="margin: 8px 0;"><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
      </div>
      
      <!-- CTA -->
      <div style="text-align: center; margin-top: 30px;">
        <a href="${data.trackingUrl}" style="background: #10B981; color: white; padding: 14px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Track Your Package</a>
      </div>
      
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>Questions? Reply to this email or contact us at <a href="mailto:hello@tattva.co" style="color: #8B5CF6;">hello@tattva.co</a></p>
      <p>© 2024 Tattva.co. All rights reserved.</p>
    </div>
    
  </div>
</body>
</html>
  `.trim();
}
