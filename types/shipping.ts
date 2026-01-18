// ShipRocket & Shipping Types

// ============ Authentication ============
export interface ShipRocketAuthRequest {
  email: string;
  password: string;
}

export interface ShipRocketAuthResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company_id: number;
  token: string;
}

// ============ Serviceability & Rates ============
export interface ServiceabilityRequest {
  pickup_postcode: string;
  delivery_postcode: string;
  cod: 0 | 1;
  weight: number; // in kg
  length?: number;
  breadth?: number;
  height?: number;
  declared_value?: number;
}

export interface CourierCompany {
  id: number;
  name: string;
  freight_charge: number;
  cod_charge: number;
  total_charge: number;
  estimated_delivery_days: number;
  etd: string; // Estimated time of delivery
  rating: number;
  min_weight: number;
  is_surface: boolean;
  is_rto_address_available: boolean;
  pickup_availability: string;
  cod_multiplier: number;
  blocked: boolean;
  call_before_delivery: string;
  is_prepaid: boolean;
  is_cod: boolean;
  is_international: boolean;
  realtime_tracking: string;
  pod_available: string;
  suppress_date: string | null;
  rto_charges: number;
  air_max_weight: number;
  surface_max_weight: number;
  logo?: string;
}

export interface ServiceabilityResponse {
  status: number;
  data: {
    available_courier_companies: CourierCompany[];
    recommended_courier_company_id: number;
    recommended_by: {
      id: number;
      title: string;
    };
  };
}

// ============ Order Creation ============
export interface OrderItem {
  name: string;
  sku: string;
  units: number;
  selling_price: number;
  discount?: number;
  tax?: number;
  hsn?: string; // HSN code for tax
}

export interface CreateOrderRequest {
  order_id: string;
  order_date: string; // Format: YYYY-MM-DD HH:MM
  pickup_location: string;
  channel_id?: string;
  comment?: string;
  billing_customer_name: string;
  billing_last_name?: string;
  billing_address: string;
  billing_address_2?: string;
  billing_city: string;
  billing_pincode: string;
  billing_state: string;
  billing_country: string;
  billing_email: string;
  billing_phone: string;
  billing_alternate_phone?: string;
  shipping_is_billing: boolean;
  shipping_customer_name?: string;
  shipping_last_name?: string;
  shipping_address?: string;
  shipping_address_2?: string;
  shipping_city?: string;
  shipping_pincode?: string;
  shipping_country?: string;
  shipping_state?: string;
  shipping_email?: string;
  shipping_phone?: string;
  order_items: OrderItem[];
  payment_method: 'Prepaid' | 'COD';
  shipping_charges?: number;
  giftwrap_charges?: number;
  transaction_charges?: number;
  total_discount?: number;
  sub_total: number;
  length: number;
  breadth: number;
  height: number;
  weight: number; // in kg
}

export interface CreateOrderResponse {
  order_id: number;
  shipment_id: number;
  status: string;
  status_code: number;
  onboarding_completed_now: number;
  awb_code: string | null;
  courier_company_id: number | null;
  courier_name: string | null;
}

// ============ AWB Generation ============
export interface GenerateAWBRequest {
  shipment_id: number;
  courier_id: number;
}

export interface GenerateAWBResponse {
  awb_assign_status: number;
  response: {
    data: {
      awb_code: string;
      courier_company_id: number;
      courier_name: string;
      assigned_date_time: {
        date: string;
        timezone_type: number;
        timezone: string;
      };
      applied_weight: number;
      routing_code: string;
      pickup_scheduled_date: string;
      child_courier_name: string | null;
    };
  };
}

// ============ Shipment Tracking ============
export interface TrackingActivity {
  date: string;
  status: string;
  activity: string;
  location: string;
  sr_status: string;
  sr_status_label: string;
}

export interface TrackingResponse {
  tracking_data: {
    track_status: number;
    shipment_status: number;
    shipment_status_label: string;
    track_activities: TrackingActivity[];
    shipment_track: Array<{
      id: number;
      awb_code: string;
      courier_company_id: number;
      courier_name: string;
      current_status: string;
      current_status_id: number;
      shipment_status: string;
      delivered_date: string | null;
      promised_delivery_date: string | null;
      pod: string | null;
      pod_status: string | null;
      edd: string | null;
    }>;
  };
}

// ============ Webhook ============
export interface ShipRocketWebhookPayload {
  awb: string;
  courier_name: string;
  current_status: string;
  current_status_code: number;
  shipment_status: string;
  shipment_status_id: number;
  order_id: string;
  scans: Array<{
    location: string;
    date: string;
    activity: string;
    status: string;
  }>;
  etd: string;
  current_timestamp: string;
}

// ============ Pickup Locations ============
export interface PickupLocation {
  id: number;
  pickup_location: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  address_2?: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  lat?: string;
  long?: string;
  phone_verified: number;
  rto_address_id?: number;
  new: number;
  status?: number;
}

// ============ Local Types ============
export interface ShippingOption {
  courierId: number;
  courierName: string;
  price: number;
  estimatedDays: number;
  etd: string;
  rating: number;
  logo?: string;
  isRecommended: boolean;
  isCod: boolean;
  realTimeTracking: boolean;
}

export interface ShipmentStatus {
  orderId: string;
  awbCode: string;
  courierName: string;
  currentStatus: string;
  statusCode: number;
  deliveredDate: string | null;
  edd: string | null;
  activities: TrackingActivity[];
}

export interface OrderShipmentData {
  orderId: string;
  shipmentId: number;
  awbCode: string | null;
  courierId: number | null;
  courierName: string | null;
  status:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'rto'
    | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
