import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressAPI } from '../utils/apiService';
import { Address } from '../types';

export const useAddresses = () => {
  const queryClient = useQueryClient();

  const {
    data: addresses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['user', 'addresses'],
    queryFn: async () => {
      const response = await addressAPI.getAll();
      return response.data;
    },
    retry: 1,
  });

  const addMutation = useMutation({
    mutationFn: (address: Omit<Address, 'id'>) => addressAPI.add(address),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, address }: { id: string; address: Partial<Address> }) =>
      addressAPI.update(id, address),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => addressAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user', 'addresses'] }),
  });

  return {
    addresses,
    isLoading,
    error,
    addAddress: (address: Omit<Address, 'id'>) => addMutation.mutateAsync(address),
    updateAddress: (address: Address) => updateMutation.mutateAsync({ id: address.id, address }),
    deleteAddress: (id: string) => deleteMutation.mutateAsync(id),
    isUpdating: addMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
};
