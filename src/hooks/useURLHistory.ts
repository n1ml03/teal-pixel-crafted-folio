import { useState, useEffect } from 'react';
import { ShortenedURL } from '@/types/shorten.ts';
import { URLShortenerService } from '@/services/URLShortenerService.ts';

export const useURLHistory = () => {
  const [urlHistory, setUrlHistory] = useState<ShortenedURL[]>([]);

  // Load URL history from localStorage on component mount
  useEffect(() => {
    const loadHistory = () => {
      const urls = URLShortenerService.getURLs();
      // Sort by creation date (newest first)
      urls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setUrlHistory(urls);
    };

    loadHistory();
  }, []);

  // Add a URL to history
  const addToHistory = (url: ShortenedURL) => {
    setUrlHistory(prevHistory => {
      // Check if URL already exists in history
      const existingIndex = prevHistory.findIndex(item => item.id === url.id);
      
      if (existingIndex !== -1) {
        // Replace existing URL
        const newHistory = [...prevHistory];
        newHistory[existingIndex] = url;
        return newHistory;
      } else {
        // Add new URL at the beginning
        return [url, ...prevHistory];
      }
    });
  };

  // Remove a URL from history
  const removeFromHistory = (id: string) => {
    // Delete from service
    const deleted = URLShortenerService.deleteURL(id);
    
    if (deleted) {
      // Update state
      setUrlHistory(prevHistory => prevHistory.filter(url => url.id !== id));
    }
  };

  // Update a URL in history
  const updateInHistory = (id: string, updates: Partial<ShortenedURL>) => {
    const updatedURL = URLShortenerService.updateURL(id, updates);
    
    if (updatedURL) {
      setUrlHistory(prevHistory => {
        const newHistory = [...prevHistory];
        const index = newHistory.findIndex(url => url.id === id);
        
        if (index !== -1) {
          newHistory[index] = updatedURL;
        }
        
        return newHistory;
      });
      
      return updatedURL;
    }
    
    return null;
  };

  return {
    urlHistory,
    addToHistory,
    removeFromHistory,
    updateInHistory
  };
};
