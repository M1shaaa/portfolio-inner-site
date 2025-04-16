import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from './components/GoogleAnalytics';

ReactDOM.render(
  <React.StrictMode>
    <GoogleAnalytics />
    <Analytics />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();