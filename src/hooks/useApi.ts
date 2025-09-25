import { useState, useCallback } from 'react';
import { ApiResponse } from '../services/api';

// Custom hook for API calls with loading and error states
export function useApi<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async <R = T>(
    apiCall: () => Promise<ApiResponse<R>>
  ): Promise<R | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      
      if (response.success && response.data) {
        setData(response.data as any);
        return response.data;
      } else {
        const errorMessage = response.message || 'An error occurred';
        setError(errorMessage);
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setData(null);
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    reset
  };
}

// Hook for form submissions with validation
export function useFormSubmission<T = any>(
  submitFn: (data: T) => Promise<ApiResponse<any>>,
  onSuccess?: (data: any) => void,
  onError?: (error: string) => void
) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = useCallback(async (formData: T) => {
    setLoading(true);
    setErrors({});

    try {
      const response = await submitFn(formData);

      if (response.success) {
        onSuccess?.(response.data);
        return true;
      } else {
        // Handle validation errors
        if (response.errors) {
          const formattedErrors: Record<string, string> = {};
          Object.entries(response.errors).forEach(([field, messages]) => {
            formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages;
          });
          setErrors(formattedErrors);
        } else {
          const errorMessage = response.message || 'An error occurred';
          setErrors({ general: errorMessage });
          onError?.(errorMessage);
        }
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
      setErrors({ general: errorMessage });
      onError?.(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [submitFn, onSuccess, onError]);

  return {
    loading,
    errors,
    submit,
    setErrors
  };
}
