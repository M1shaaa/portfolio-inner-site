import React, { useEffect } from 'react';

const GoogleAnalytics = () => {
  // Use your specific measurement ID
  const gaId = "G-SCJDHJLBQC";
  
  useEffect(() => {
    try {
      // Load Google Analytics
      const script1 = document.createElement('script');
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      script1.async = true;
      document.head.appendChild(script1);

      // Initialize Google Analytics
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', gaId);
      
      console.log('Google Analytics initialized with ID:', gaId);
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  }, [gaId]);

  return null;
};

export default GoogleAnalytics;