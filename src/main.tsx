import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
