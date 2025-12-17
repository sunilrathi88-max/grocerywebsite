import { useQuery } from '@tanstack/react-query';
import { orderAPI } from '../utils/apiService';

export const useUserOrders = () => {
  // We need the user ID or auth status to enable the query
  // Since useAuth might not expose the ID directly in a handy way, we can check localStorage or relying on apiService to handle auth internally (which it does via supabase.auth.getUser())
  // ideally, we pass the user ID as part of the query key for caching separation.

  // Let's assume we want to just fetch current user's orders.
  // The API service gets the user from Supabase session.

  // However, to invalidate correctly on logout/login, we might want a key that changes.
  // For now, let's use a generic 'orders' key and rely on queryClient.invalidateQueries('orders') on auth changes if needed.

  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orderAPI.getAll();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
    retry: 1,
  });

  return {
    orders,
    isLoading,
    error,
  };
};
