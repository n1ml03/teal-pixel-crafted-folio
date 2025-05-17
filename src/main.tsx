import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { loadFonts, preloadFonts } from './lib/font-loading'

// Ensure the DOM is fully loaded before rendering
document.addEventListener('DOMContentLoaded', () => {
  // Get the root element
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("Root element not found! Make sure there is a div with id 'root' in your HTML.");
    return;
  }

  // Preload critical fonts to prevent layout shifts
  preloadFonts([
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',  // Inter Regular
    'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2', // Inter Medium
    'https://fonts.gstatic.com/s/sourcecodepro/v23/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DMyQtMlrTA.woff2' // Source Code Pro Regular
  ]);

  // Load all fonts and add the fonts-loaded class when ready
  loadFonts();

  // Create root and render app
  const root = createRoot(rootElement);
  root.render(<App />);

  console.log("App rendered successfully");
});
