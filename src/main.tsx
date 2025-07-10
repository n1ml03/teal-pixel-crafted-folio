import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initResourceManager, resourceManager } from './lib'

// Register service worker for caching
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js')
//       .then((registration) => {
//         console.log('Resource cleanup disabled: ', registration);
//       })
//       .catch((registrationError) => {
//         console.log('SW registration failed: ', registrationError);
//       });
//   });
// }

// Initialize centralized resource manager
initResourceManager();



// Defer loading of non-critical CSS using ResourceManager
const nonCriticalResources = [
  // {
  //   href: '/css/animations.css',
  //   as: 'style' as const,
  //   rel: 'prefetch' as const
  // },
  {   
    href: '/css/playground-extras.css',
    as: 'style' as const,
    rel: 'prefetch' as const
  }
];

// Use ResourceManager for non-critical CSS with delay
setTimeout(() => {
  resourceManager.preloadMany(nonCriticalResources);
  console.log('Non-critical resources preloaded');
}, 3000);

// Critical resources are now handled automatically by initResourceManager()
// No need to manually preload individual resources here

// Ensure the DOM is fully loaded before rendering
const initializeApp = () => {
  // Get the root element
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Root element not found! Make sure there is a div with id 'root' in your HTML.");
    return;
  }

  // Create root and render app immediately
  const root = createRoot(rootElement);
  root.render(<App />);
};

// Check if DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp, { once: true });
} else {
  // DOM is already loaded
  initializeApp();
}
