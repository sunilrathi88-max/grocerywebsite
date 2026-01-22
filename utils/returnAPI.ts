import { supabase } from '../supabaseClient';
import { Order } from '../types';

// Return request types
export interface ReturnReason {
  value: 'damaged' | 'wrong_item' | 'not_as_described' | 'changed_mind' | 'late_delivery' | 'other';
  label: string;
}

export interface ReturnItem {
  product_id: number;
  product_name: string;
  variant_id: number;
  variant_name: string;
  quantity: number;
  unit_price: number;
  condition: 'unopened' | 'opened' | 'damaged' | 'defective';
  images?: string[];
}

export interface ReturnRequest {
  order_id: string;
  reason: ReturnReason['value'];
  detailed_reason?: string;
  refund_amount: number;
  refund_method: 'original_payment' | 'store_credit' | 'bank_transfer';
  items: ReturnItem[];
}

export interface Return {
  id: string;
  order_id: string;
  user_id: string;
  status: 'requested' | 'approved' | 'rejected' | 'picked_up' | 'refunded' | 'cancelled';
  reason: ReturnReason['value'];
  detailed_reason?: string;
  refund_amount: number;
  refund_method: string;
  refund_id?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  items: ReturnItem[];
}

export const RETURN_REASONS: ReturnReason[] = [
  { value: 'damaged', label: 'Product Damaged/Broken' },
  { value: 'wrong_item', label: 'Wrong Item Delivered' },
  { value: 'not_as_described', label: 'Not as Described' },
  { value: 'changed_mind', label: 'Changed Mind' },
  { value: 'late_delivery', label: 'Delivery Too Late' },
  { value: 'other', label: 'Other' },
];

export const returnAPI = {
  /**
   * Initiate a return request
   */
  async initiateReturn(request: ReturnRequest): Promise<Return> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // 1. Create return record
      const { data: returnData, error: returnError } = await supabase
        .from('returns')
        .insert({
          order_id: request.order_id,
          user_id: user.id,
          status: 'requested',
          reason: request.reason,
          detailed_reason: request.detailed_reason,
          refund_amount: request.refund_amount,
          refund_method: request.refund_method,
        })
        .select()
        .single();

      if (returnError) throw returnError;

      // 2. Create return items
      const returnItems = request.items.map((item) => ({
        return_id: returnData.id,
        product_id: item.product_id,
        product_name: item.product_name,
        variant_id: item.variant_id,
        variant_name: item.variant_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        condition: item.condition,
        images: item.images || [],
      }));

      const { error: itemsError } = await supabase.from('return_items').insert(returnItems);

      if (itemsError) throw itemsError;

      // 3. Fetch complete return with items
      return await this.getReturnDetails(returnData.id);
    } catch (error) {
      console.error('Return initiation failed:', error);
      throw error;
    }
  },

  /**
   * Upload images for return items
   */
  async uploadReturnImages(returnId: string, files: File[]): Promise<string[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const uploadedUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${returnId}/${Date.now()}_${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('return-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) throw error;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from('return-images').getPublicUrl(data.path);

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  },

  /**
   * Get return details with items
   */
  async getReturnDetails(returnId: string): Promise<Return> {
    try {
      const { data: returnData, error: returnError } = await supabase
        .from('returns')
        .select('*')
        .eq('id', returnId)
        .single();

      if (returnError) throw returnError;

      const { data: items, error: itemsError } = await supabase
        .from('return_items')
        .select('*')
        .eq('return_id', returnId);

      if (itemsError) throw itemsError;

      return {
        ...returnData,
        items: items || [],
      };
    } catch (error) {
      console.error('Failed to fetch return details:', error);
      throw error;
    }
  },

  /**
   * Get all returns for current user
   */
  async getUserReturns(): Promise<Return[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: returns, error: returnsError } = await supabase
        .from('returns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (returnsError) throw returnsError;

      // Fetch items for each return
      const returnsWithItems = await Promise.all(
        (returns || []).map(async (returnData) => {
          const { data: items } = await supabase
            .from('return_items')
            .select('*')
            .eq('return_id', returnData.id);

          return {
            ...returnData,
            items: items || [],
          };
        })
      );

      return returnsWithItems;
    } catch (error) {
      console.error('Failed to fetch user returns:', error);
      throw error;
    }
  },

  /**
   * Cancel a return request (only if status is 'requested')
   */
  async cancelReturn(returnId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('returns')
        .update({ status: 'cancelled' })
        .eq('id', returnId)
        .eq('status', 'requested'); // Can only cancel if still in requested status

      if (error) throw error;
    } catch (error) {
      console.error('Failed to cancel return:', error);
      throw error;
    }
  },

  /**
   * Calculate refund amount for selected items
   */
  calculateRefundAmount(order: Order, selectedItems: Map<string, number>): number {
    let refundAmount = 0;

    order.items.forEach((item) => {
      const itemKey = `${item.productId}-${item.variantId}`;
      const returnQuantity = selectedItems.get(itemKey);

      if (returnQuantity && returnQuantity > 0) {
        const price = item.price;
        refundAmount += price * returnQuantity;
      }
    });

    return refundAmount;
  },
};
