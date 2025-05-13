import React from 'react';
import { Outlet } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';

/**
 * RouterWrapper component that wraps the router outlet with page transitions
 * This ensures that PageTransition is used within the Router context
 */
export const RouterWrapper = () => {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
};

export default RouterWrapper;
