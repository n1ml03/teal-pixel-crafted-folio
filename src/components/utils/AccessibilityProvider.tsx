import React, { useEffect } from 'react';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

/**
 * AccessibilityProvider component that adds various accessibility enhancements
 * to the application
 */
export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  useEffect(() => {
    // Add js-focus-visible class to body for focus styles
    document.body.classList.add('js-focus-visible');

    // Detect keyboard navigation vs mouse navigation
    let usingKeyboard = false;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        usingKeyboard = true;
        document.body.classList.add('user-is-tabbing');
      }
    };
    
    const handleMouseDown = () => {
      usingKeyboard = false;
      document.body.classList.remove('user-is-tabbing');
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);
    
    // Add ARIA roles to common elements if missing
    const addAriaRoles = () => {
      // Add role="navigation" to nav elements without it
      document.querySelectorAll('nav:not([role])').forEach(nav => {
        nav.setAttribute('role', 'navigation');
      });
      
      // Add role="main" to main elements without it
      document.querySelectorAll('main:not([role])').forEach(main => {
        main.setAttribute('role', 'main');
      });
      
      // Add role="button" to button-like elements
      document.querySelectorAll('div[onClick]:not([role]), a[onClick]:not([role])').forEach(el => {
        if (!el.getAttribute('role')) {
          el.setAttribute('role', 'button');
        }
      });
    };
    
    // Run once on mount and set up a mutation observer to check for new elements
    addAriaRoles();
    
    const observer = new MutationObserver(addAriaRoles);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Cleanup function
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
      observer.disconnect();
    };
  }, []);
  
  return <>{children}</>;
};

export default AccessibilityProvider;
