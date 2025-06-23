import { useNavigate } from 'react-router-dom';
import { startTransition } from 'react';

/**
 * Custom hook that wraps useNavigate with startTransition
 * to prevent "component suspended while responding to synchronous input" errors
 */
export const useNavigateWithTransition = () => {
  const navigate = useNavigate();

  const navigateWithTransition = (to: string | number, options?: { replace?: boolean; state?: unknown }) => {
    startTransition(() => {
      if (typeof to === 'string') {
        navigate(to, options);
      } else {
        navigate(to);
      }
    });
  };

  return navigateWithTransition;
};

export default useNavigateWithTransition; 