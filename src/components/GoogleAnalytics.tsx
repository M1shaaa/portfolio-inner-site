import React, { useEffect } from 'react';

// Define types for window additions
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GoogleAnalytics = () => {
  const gaId = process.env.REACT_APP_GA_ID;

  useEffect(() => {
    if (!gaId) return;
    
    // Load Google Analytics
    const script1 = document.createElement('script');
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    script1.async = true;
    document.head.appendChild(script1);

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    window.gtag('js', new Date());
    window.gtag('config', gaId);

    // Clean up
    return () => {
      try {
        if (script1.parentNode) {
          document.head.removeChild(script1);
        }
      } catch (e) {
        console.error('Error removing Google Analytics script:', e);
      }
    };
  }, [gaId]);

  return null;
};

export default GoogleAnalytics;