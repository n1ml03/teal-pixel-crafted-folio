import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadFonts, preloadFonts } from './lib/font-loading'
import { deferCSS, loadCSS } from './lib/css-optimization'
import { preloadCriticalImages } from './lib/image-optimization'

// Start loading fonts immediately before DOM is fully loaded
// This helps improve LCP by getting fonts ready earlier
loadFonts();

// Define non-critical CSS files to load later
const nonCriticalCSS = [
  // Add paths to non-critical CSS files here
  // These will be loaded after the initial render
  '/css/animations.css',
  '/css/playground-extras.css'
];

// Defer loading of non-critical CSS
deferCSS(nonCriticalCSS, {
  delay: 1000, // Wait 1 second after idle to load non-critical CSS
  onComplete: () => console.log('Non-critical CSS loaded')
});

// Preload critical images for LCP
preloadCriticalImages([
  // Add paths to critical images here
  // These are images that appear above the fold on the initial page load
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2076&h=1384&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&h=1333&auto=format&fit=crop'
]);

// Ensure the DOM is fully loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  // Get the root element
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Root element not found! Make sure there is a div with id 'root' in your HTML.");
    return;
  }

  // Create root and render app immediately
  const root = createRoot(rootElement);
  root.render(<App />);

});
