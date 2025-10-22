/**
 * Custom hooks for API data fetching
 * Provides loading states, error handling, and data management
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { APIException } from '../utils/api';

export interface UseAPIOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: APIException) => void;
  immediate?: boolean;
}

export interface UseAPIState<T> {
  data: T | null;
  loading: boolean;
  error: APIException | null;
  isSuccess: boolean;
  isError: boolean;
}

/**
 * Generic hook for API requests with loading and error states
 */
export function useAPI<T>(
  apiFunction: () => Promise<T>,
  options: UseAPIOptions<T> = {}
): UseAPIState<T> & { refetch: () => Promise<void>; reset: () => void } {
  const { onSuccess, onError, immediate = false } = options;

  const [state, setState] = useState<UseAPIState<T>>({
    data: null,
    loading: immediate,
    error: null,
    isSuccess: false,
    isError: false,
  });

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
      isError: false,
    }));

    try {
      const data = await apiFunction();

      if (isMountedRef.current) {
        setState({
          data,
          loading: false,
          error: null,
          isSuccess: true,
          isError: false,
        });

        if (onSuccess) {
          onSuccess(data);
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        const apiError =
          error instanceof APIException
            ? error
            : new APIException(error instanceof Error ? error.message : 'Unknown error occurred');

        setState({
          data: null,
          loading: false,
          error: apiError,
          isSuccess: false,
          isError: true,
        });

        if (onError) {
          onError(apiError);
        }
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [apiFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      refetch();
    }

    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [immediate, refetch]);

  return {
    ...state,
    refetch,
    reset,
  };
}

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 */
export function useAPIMutation<TData, TVariables = void>(
  apiFunction: (variables: TVariables) => Promise<TData>,
  options: UseAPIOptions<TData> = {}
) {
  const { onSuccess, onError } = options;

  const [state, setState] = useState<UseAPIState<TData> & { isIdle: boolean }>({
    data: null,
    loading: false,
    error: null,
    isSuccess: false,
    isError: false,
    isIdle: true,
  });

  const mutate = useCallback(
    async (variables: TVariables) => {
      setState({
        data: null,
        loading: true,
        error: null,
        isSuccess: false,
        isError: false,
        isIdle: false,
      });

      try {
        const data = await apiFunction(variables);

        setState({
          data,
          loading: false,
          error: null,
          isSuccess: true,
          isError: false,
          isIdle: false,
        });

        if (onSuccess) {
          onSuccess(data);
        }

        return data;
      } catch (error) {
        const apiError =
          error instanceof APIException
            ? error
            : new APIException(error instanceof Error ? error.message : 'Unknown error occurred');

        setState({
          data: null,
          loading: false,
          error: apiError,
          isSuccess: false,
          isError: true,
          isIdle: false,
        });

        if (onError) {
          onError(apiError);
        }

        throw apiError;
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
      isSuccess: false,
      isError: false,
      isIdle: true,
    });
  }, []);

  return {
    ...state,
    mutate,
    mutateAsync: mutate,
    reset,
  };
}

/**
 * Hook for paginated data
 */
export function usePaginatedAPI<T>(
  apiFunction: (page: number, limit: number) => Promise<{ data: T[]; total: number }>,
  initialPage = 1,
  pageSize = 20
) {
  const [page, setPage] = useState(initialPage);
  const [allData, setAllData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { loading, error, refetch } = useAPI(() => apiFunction(page, pageSize), {
    immediate: true,
    onSuccess: (response) => {
      if (page === 1) {
        setAllData(response.data);
      } else {
        setAllData((prev) => [...prev, ...response.data]);
      }
      setHasMore(response.data.length === pageSize);
    },
  });

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  const reset = useCallback(() => {
    setPage(1);
    setAllData([]);
    setHasMore(true);
  }, []);

  return {
    data: allData,
    loading,
    error,
    hasMore,
    loadMore,
    refetch,
    reset,
  };
}
