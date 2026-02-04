import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarDetailsPage from './pages/CarDetailsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import CookieConsent from './components/CookieConsent';
import './index.css';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car/:id" element={<CarDetailsPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        </Routes>
        <CookieConsent />
      </BrowserRouter>
    </HelmetProvider>
  );
}
