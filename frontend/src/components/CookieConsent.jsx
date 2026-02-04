import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * Компонент баннера согласия с использованием cookies
 */
export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Проверяем, было ли уже дано согласие
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Показываем баннер с небольшой задержкой для лучшего UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Сохраняем согласие в localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-[9999] px-4 py-4 md:px-6 md:py-5"
      style={{
        backgroundColor: '#2E2E2E',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Текст с ссылками */}
        <div className="flex-1 text-sm md:text-base" style={{ color: '#CCCCCC' }}>
          <p className="mb-2">
            Продолжая использовать сайт, вы соглашаетесь с{' '}
            <Link 
              to="/cookie-policy" 
              className="underline hover:text-white transition-colors font-medium"
              style={{ color: '#E0E0E0' }}
            >
              Политикой использования файлов cookie
            </Link>
            .
          </p>
          <p>
            Чтобы узнать больше о том, как мы обрабатываем ваши персональные данные, ознакомьтесь с{' '}
            <Link 
              to="/privacy" 
              className="underline hover:text-white transition-colors font-medium"
              style={{ color: '#E0E0E0' }}
            >
              Политикой конфиденциальности сайта
            </Link>
            .
          </p>
        </div>

        {/* Кнопка "Согласен" */}
        <button
          onClick={handleAccept}
          className="px-6 py-3 rounded-lg font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg flex-shrink-0"
          style={{
            backgroundColor: '#6A6AD3',
            minWidth: '140px'
          }}
        >
          Согласен
        </button>
      </div>
    </div>
  );
}
