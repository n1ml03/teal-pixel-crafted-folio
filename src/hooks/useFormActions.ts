import { useCallback, useTransition, useState, useRef, useMemo } from 'react';
import { toast } from 'sonner';

export interface FormActionState<T = any> {
  data?: T;
  error?: string;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export interface FormActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  onSubmit?: (formData: FormData) => void;
  successMessage?: string;
  errorMessage?: string;
  resetOnSuccess?: boolean;
  optimisticUpdate?: (formData: FormData) => T;
}

/**
 * Modern React 19 form action hook with optimistic updates and transitions
 */
export function useFormAction<T = any>(
  action: (formData: FormData) => Promise<T>,
  options: FormActionOptions<T> = {}
) {
  const [state, setState] = useState<FormActionState<T>>({
    isLoading: false,
    isSuccess: false,
    isError: false,
  });

  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    onSuccess,
    onError,
    onSubmit,
    successMessage = 'Operation completed successfully!',
    errorMessage = 'Something went wrong. Please try again.',
    resetOnSuccess = true,
    optimisticUpdate,
  } = options;

  // Form action handler compatible with React 19 action prop
  const formAction = useCallback(async (formData: FormData) => {
    // Call onSubmit callback
    onSubmit?.(formData);

    // Apply optimistic update if provided
    if (optimisticUpdate) {
      const optimisticData = optimisticUpdate(formData);
      setState(prev => ({
        ...prev,
        data: optimisticData,
        isLoading: true,
        isSuccess: false,
        isError: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        isLoading: true,
        isSuccess: false,
        isError: false,
      }));
    }

    try {
      const result = await action(formData);

      startTransition(() => {
        setState({
          data: result,
          isLoading: false,
          isSuccess: true,
          isError: false,
        });
      });

      // Show success toast
      if (successMessage) {
        toast.success(successMessage);
      }

      // Call success callback
      onSuccess?.(result);

      // Reset form if requested
      if (resetOnSuccess && formRef.current) {
        formRef.current.reset();
      }

      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : errorMessage;

      startTransition(() => {
        setState(prev => ({
          ...prev,
          error: errorMsg,
          isLoading: false,
          isSuccess: false,
          isError: true,
        }));
      });

      // Show error toast
      toast.error(errorMsg);

      // Call error callback
      onError?.(errorMsg);

      throw error;
    }
  }, [action, onSubmit, onSuccess, onError, successMessage, errorMessage, resetOnSuccess, optimisticUpdate]);

  // Manual trigger function
  const trigger = useCallback(async (data?: Record<string, any>) => {
    const formData = new FormData();
    
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    return formAction(formData);
  }, [formAction]);

  // Reset state function
  const reset = useCallback(() => {
    startTransition(() => {
      setState({
        isLoading: false,
        isSuccess: false,
        isError: false,
      });
    });
  }, []);

  return {
    ...state,
    isPending,
    formAction,
    trigger,
    reset,
    formRef,
  };
}

/**
 * Hook for handling form validation with React 19 patterns
 */
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, (value: any) => string | undefined>>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isPending, startTransition] = useTransition();

  // Validate single field
  const validateField = useCallback((name: keyof T, value: any) => {
    const rule = validationRules[name];
    if (rule) {
      return rule(value);
    }
    return undefined;
  }, [validationRules]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    startTransition(() => {
      setErrors(newErrors);
    });

    return isValid;
  }, [values, validateField]);

  // Update field value
  const setValue = useCallback((name: keyof T, value: any) => {
    startTransition(() => {
      setValues(prev => ({ ...prev, [name]: value }));
      
      // Validate field if it's been touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    });
  }, [validateField, touched]);

  // Mark field as touched
  const setTouched = useCallback((name: keyof T, isTouched = true) => {
    startTransition(() => {
      setTouchedState(prev => ({ ...prev, [name]: isTouched }));
      
      // Validate field when touched
      if (isTouched) {
        const error = validateField(name, values[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    });
  }, [validateField, values]);

  // Reset form
  const resetForm = useCallback(() => {
    startTransition(() => {
      setValues(initialValues);
      setErrors({});
      setTouchedState({});
    });
  }, [initialValues]);

  // Check if form is valid
  const isValid = useMemo(() => {
    return Object.values(errors).every(error => !error);
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isPending,
    isValid,
    setValue,
    setTouched,
    validateField,
    validateAll,
    resetForm,
  };
}

/**
 * Hook for optimistic form updates
 */
export function useOptimisticForm<T>(
  initialData: T,
  submitAction: (data: T) => Promise<T>
) {
  const [data, setData] = useState<T>(initialData);
  const [optimisticData, setOptimisticData] = useState<T>(initialData);
  const [isPending, startTransition] = useTransition();

  const updateOptimistic = useCallback((updates: Partial<T>) => {
    const newData = { ...optimisticData, ...updates };
    setOptimisticData(newData);
    
    // Apply real update with transition
    startTransition(async () => {
      try {
        const result = await submitAction(newData);
        setData(result);
        setOptimisticData(result);
      } catch (error) {
        // Rollback optimistic update on error
        setOptimisticData(data);
        throw error;
      }
    });
  }, [optimisticData, data, submitAction]);

  const rollback = useCallback(() => {
    setOptimisticData(data);
  }, [data]);

  return {
    data: isPending ? optimisticData : data,
    updateOptimistic,
    rollback,
    isPending,
  };
}

/**
 * Hook for managing multiple form steps with React 19 patterns
 */
export function useMultiStepForm<T extends Record<string, any>>(
  steps: Array<{
    name: string;
    validate?: (data: Partial<T>) => boolean;
  }>,
  initialData: Partial<T> = {}
) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<Partial<T>>(initialData);
  const [isPending, startTransition] = useTransition();

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const goToNext = useCallback(() => {
    if (!isLastStep) {
      const canProceed = currentStepData.validate ? currentStepData.validate(data) : true;
      
      if (canProceed) {
        startTransition(() => {
          setCurrentStep(prev => prev + 1);
        });
      }
    }
  }, [isLastStep, currentStepData, data]);

  const goToPrevious = useCallback(() => {
    if (!isFirstStep) {
      startTransition(() => {
        setCurrentStep(prev => prev - 1);
      });
    }
  }, [isFirstStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < steps.length) {
      startTransition(() => {
        setCurrentStep(step);
      });
    }
  }, [steps.length]);

  const updateData = useCallback((updates: Partial<T>) => {
    startTransition(() => {
      setData(prev => ({ ...prev, ...updates }));
    });
  }, []);

  const resetForm = useCallback(() => {
    startTransition(() => {
      setCurrentStep(0);
      setData(initialData);
    });
  }, [initialData]);

  return {
    currentStep,
    currentStepData,
    data,
    isFirstStep,
    isLastStep,
    isPending,
    goToNext,
    goToPrevious,
    goToStep,
    updateData,
    resetForm,
    progress: ((currentStep + 1) / steps.length) * 100,
  };
} 