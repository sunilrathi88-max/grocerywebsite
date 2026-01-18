/**
 * ShipRocket API Service
 * Handles all interactions with ShipRocket's shipping platform
 *
 * API Documentation: https://apidocs.shiprocket.in/
 */

import {
  ShipRocketAuthResponse,
  ServiceabilityRequest,
  ServiceabilityResponse,
  CourierCompany,
  CreateOrderRequest,
  CreateOrderResponse,
  GenerateAWBRequest,
  GenerateAWBResponse,
  TrackingResponse,
  PickupLocation,
  ShippingOption,
  ShipmentStatus,
} from '../types/shipping';

// Configuration - In production, these should come from environment variables
const SHIPROCKET_CONFIG = {
  baseUrl: 'https://apiv2.shiprocket.in',
  email: import.meta.env.VITE_SHIPROCKET_EMAIL || 'rathinaturals@gmail.com',
  password: import.meta.env.VITE_SHIPROCKET_PASSWORD || '',
  defaultPickupLocation: 'Primary',
  defaultWeight: 0.5, // kg
  defaultDimensions: { length: 15, breadth: 10, height: 5 }, // cm
};

// Token management
let authToken: string | null = null;
let tokenExpiry: number = 0;

/**
 * Authenticate with ShipRocket and get access token
 */
export const authenticate = async (): Promise<string> => {
  // Return cached token if still valid (tokens valid for 10 days)
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  try {
    const response = await fetch(`${SHIPROCKET_CONFIG.baseUrl}/v1/external/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: SHIPROCKET_CONFIG.email,
        password: SHIPROCKET_CONFIG.password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }

    const data: ShipRocketAuthResponse = await response.json();
    authToken = data.token;
    tokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // 9 days

    return authToken;
  } catch (error) {
    console.error('ShipRocket authentication error:', error);
    throw error;
  }
};

/**
 * Make authenticated API request
 */
const apiRequest = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<T> => {
  const token = await authenticate();

  const response = await fetch(`${SHIPROCKET_CONFIG.baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
};

// ============ SERVICEABILITY & RATES ============

/**
 * Check if delivery is available for a pincode and get shipping rates
 */
export const getShippingRates = async (
  pickupPincode: string,
  deliveryPincode: string,
  weight: number = SHIPROCKET_CONFIG.defaultWeight,
  isCod: boolean = false,
  declaredValue?: number
): Promise<ShippingOption[]> => {
  try {
    const params: ServiceabilityRequest = {
      pickup_postcode: pickupPincode,
      delivery_postcode: deliveryPincode,
      cod: isCod ? 1 : 0,
      weight,
      ...SHIPROCKET_CONFIG.defaultDimensions,
      declared_value: declaredValue,
    };

    const queryString = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString();

    const response = await apiRequest<ServiceabilityResponse>(
      `/v1/external/courier/serviceability/?${queryString}`
    );

    const recommendedId = response.data.recommended_courier_company_id;

    return response.data.available_courier_companies
      .filter((courier) => !courier.blocked)
      .map(
        (courier: CourierCompany): ShippingOption => ({
          courierId: courier.id,
          courierName: courier.name,
          price: courier.total_charge,
          estimatedDays: courier.estimated_delivery_days,
          etd: courier.etd,
          rating: courier.rating,
          logo: courier.logo,
          isRecommended: courier.id === recommendedId,
          isCod: courier.is_cod,
          realTimeTracking: courier.realtime_tracking === 'Yes',
        })
      )
      .sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0) || a.price - b.price);
  } catch (error) {
    console.error('Error fetching shipping rates:', error);
    throw error;
  }
};

/**
 * Check if COD is available for a pincode
 */
export const checkCodAvailability = async (pincode: string): Promise<boolean> => {
  try {
    const response = await apiRequest<{ status: number; is_available: boolean }>(
      `/v1/external/courier/serviceability/?delivery_postcode=${pincode}&cod=1`
    );
    return response.is_available ?? false;
  } catch {
    return false;
  }
};

// ============ ORDER CREATION ============

/**
 * Create a new order in ShipRocket
 */
export const createOrder = async (orderData: CreateOrderRequest): Promise<CreateOrderResponse> => {
  try {
    const response = await apiRequest<CreateOrderResponse>(
      '/v1/external/orders/create/adhoc',
      'POST',
      orderData as unknown as Record<string, unknown>
    );

    return response;
  } catch (error) {
    console.error('Error creating ShipRocket order:', error);
    throw error;
  }
};

/**
 * Helper to create order from our Order type
 */
export const createShipRocketOrder = async (
  order: {
    id: string;
    createdAt: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
    items: Array<{
      name: string;
      sku?: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    paymentMethod: string;
    shippingCost?: number;
  },
  pickupLocation: string = SHIPROCKET_CONFIG.defaultPickupLocation
): Promise<CreateOrderResponse> => {
  const orderRequest: CreateOrderRequest = {
    order_id: order.id,
    order_date: new Date(order.createdAt).toISOString().slice(0, 16).replace('T', ' '),
    pickup_location: pickupLocation,
    billing_customer_name: order.customer.name.split(' ')[0],
    billing_last_name: order.customer.name.split(' ').slice(1).join(' ') || '',
    billing_address: order.shippingAddress.street,
    billing_city: order.shippingAddress.city,
    billing_pincode: order.shippingAddress.zip,
    billing_state: order.shippingAddress.state,
    billing_country: order.shippingAddress.country || 'India',
    billing_email: order.customer.email,
    billing_phone: order.customer.phone,
    shipping_is_billing: true,
    order_items: order.items.map((item) => ({
      name: item.name,
      sku: item.sku || `SKU-${item.name.replace(/\s+/g, '-').toUpperCase()}`,
      units: item.quantity,
      selling_price: item.price,
    })),
    payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
    sub_total: order.subtotal,
    shipping_charges: order.shippingCost || 0,
    ...SHIPROCKET_CONFIG.defaultDimensions,
    weight: SHIPROCKET_CONFIG.defaultWeight,
  };

  return createOrder(orderRequest);
};

// ============ AWB GENERATION ============

/**
 * Generate AWB (Air Waybill) for a shipment
 */
export const generateAWB = async (
  shipmentId: number,
  courierId: number
): Promise<GenerateAWBResponse> => {
  try {
    const request: GenerateAWBRequest = {
      shipment_id: shipmentId,
      courier_id: courierId,
    };

    const response = await apiRequest<GenerateAWBResponse>(
      '/v1/external/courier/assign/awb',
      'POST',
      request as unknown as Record<string, unknown>
    );

    return response;
  } catch (error) {
    console.error('Error generating AWB:', error);
    throw error;
  }
};

/**
 * Request pickup for a shipment
 */
export const requestPickup = async (shipmentId: number): Promise<{ pickup_status: number }> => {
  try {
    return await apiRequest<{ pickup_status: number }>(
      '/v1/external/courier/generate/pickup',
      'POST',
      { shipment_id: [shipmentId] }
    );
  } catch (error) {
    console.error('Error requesting pickup:', error);
    throw error;
  }
};

// ============ TRACKING ============

/**
 * Track a shipment by AWB code
 */
export const trackShipment = async (awbCode: string): Promise<ShipmentStatus> => {
  try {
    const response = await apiRequest<TrackingResponse>(
      `/v1/external/courier/track/awb/${awbCode}`
    );

    const track = response.tracking_data.shipment_track[0];

    return {
      orderId: '',
      awbCode: track.awb_code,
      courierName: track.courier_name,
      currentStatus: track.current_status,
      statusCode: track.current_status_id,
      deliveredDate: track.delivered_date,
      edd: track.edd,
      activities: response.tracking_data.track_activities,
    };
  } catch (error) {
    console.error('Error tracking shipment:', error);
    throw error;
  }
};

/**
 * Track a shipment by order ID
 */
export const trackByOrderId = async (orderId: string): Promise<ShipmentStatus> => {
  try {
    const response = await apiRequest<TrackingResponse>(
      `/v1/external/courier/track?order_id=${orderId}`
    );

    const track = response.tracking_data.shipment_track[0];

    return {
      orderId,
      awbCode: track.awb_code,
      courierName: track.courier_name,
      currentStatus: track.current_status,
      statusCode: track.current_status_id,
      deliveredDate: track.delivered_date,
      edd: track.edd,
      activities: response.tracking_data.track_activities,
    };
  } catch (error) {
    console.error('Error tracking by order ID:', error);
    throw error;
  }
};

// ============ PICKUP LOCATIONS ============

/**
 * Get all pickup locations
 */
export const getPickupLocations = async (): Promise<PickupLocation[]> => {
  try {
    const response = await apiRequest<{ data: { shipping_address: PickupLocation[] } }>(
      '/v1/external/settings/company/pickup'
    );

    return response.data.shipping_address;
  } catch (error) {
    console.error('Error fetching pickup locations:', error);
    throw error;
  }
};

// ============ LABELS & INVOICES ============

/**
 * Generate shipping label URL
 */
export const generateLabel = async (shipmentId: number): Promise<string> => {
  try {
    const response = await apiRequest<{ label_url: string }>(
      '/v1/external/courier/generate/label',
      'POST',
      { shipment_id: [shipmentId] }
    );

    return response.label_url;
  } catch (error) {
    console.error('Error generating label:', error);
    throw error;
  }
};

/**
 * Generate invoice URL
 */
export const generateInvoice = async (orderIds: string[]): Promise<string> => {
  try {
    const response = await apiRequest<{ invoice_url: string }>(
      '/v1/external/orders/print/invoice',
      'POST',
      { ids: orderIds }
    );

    return response.invoice_url;
  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
};

// ============ CANCELLATION ============

/**
 * Cancel a shipment
 */
export const cancelShipment = async (awbCodes: string[]): Promise<boolean> => {
  try {
    await apiRequest('/v1/external/orders/cancel/shipment/awbs', 'POST', { awbs: awbCodes });
    return true;
  } catch (error) {
    console.error('Error cancelling shipment:', error);
    return false;
  }
};

// ============ WEBHOOK VERIFICATION ============

/**
 * Verify webhook signature
 */
export const verifyWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  // ShipRocket uses a simple token-based verification
  // In production, implement proper HMAC verification if available
  return signature === secret;
};

// Export the service as default
export const shiprocketService = {
  authenticate,
  getShippingRates,
  checkCodAvailability,
  createOrder,
  createShipRocketOrder,
  generateAWB,
  requestPickup,
  trackShipment,
  trackByOrderId,
  getPickupLocations,
  generateLabel,
  generateInvoice,
  cancelShipment,
  verifyWebhookSignature,
};

export default shiprocketService;
