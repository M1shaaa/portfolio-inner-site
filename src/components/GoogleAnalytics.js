import React, { useEffect } from 'react';

const GoogleAnalytics = () => {
  // Hardcode the ID for testing (replace with your actual ID)
  const gaId = "G-SCJDHJLBQC"; // Replace with your actual G-ID
  
  useEffect(() => {
    console.log('GA ID:', gaId);
    
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