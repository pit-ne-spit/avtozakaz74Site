import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // Используем bg-white/40 и backdrop-blur-md, как в фильтрах. Fixed чтобы накладывался на фон.
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md shadow-lg border-b border-white/50 transition-all duration-300">
      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex items-center justify-between">
          {/* Логотип и название */}
          <Link 
            to="/" 
            className="flex items-center gap-2 md:gap-4 shrink-0 hover:opacity-80 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <OptimizedImage
              src="/logo_pic.png"
              alt="Автозаказ74 Logo"
              className="h-[40px] md:h-[60px] w-auto object-contain drop-shadow-sm"
              sizes="(max-width: 768px) 40px, 60px"
              lazy={false}
              fallback=""
            />
            <OptimizedImage
              src="/logo_text.png"
              alt="Автозаказ74"
              className="h-[28px] md:h-[45px] w-auto object-contain drop-shadow-sm"
              sizes="(max-width: 768px) 28px, 45px"
              lazy={false}
              fallback=""
            />
          </Link>
          
          {/* Мобильное меню - кнопка (только на мобильных) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-12 h-12 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors touch-manipulation"
            aria-label="Открыть меню"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          
          {/* Контакты (скрыты на маленьких экранах, видны на больших) */}
          <div className="hidden lg:flex flex-col items-end gap-1 text-sm text-gray-800">
            <a href="tel:+79026142503" className="hover:text-blue-700 transition-colors flex items-center gap-2 font-semibold">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +7 902 614-25-03
            </a>
            <div className="flex gap-4 text-xs text-gray-600">
               <a href="tel:+79193028913" className="hover:text-blue-600 transition-colors">+7 919 302-89-13</a>
               <a href="https://t.me/avtozakaz74" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.183-.612-.6.125-.89l10.782-4.156c.5-.18.943.11.78.89z"/>
                 </svg>
                 Telegram
               </a>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильное меню - выдвижная панель */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay для закрытия меню */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Панель меню */}
          <div className="lg:hidden fixed top-[60px] left-0 right-0 bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200 z-40 animate-in slide-in-from-top duration-200">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <a 
                href="tel:+79026142503" 
                className="flex items-center gap-3 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold text-base hover:bg-blue-700 transition-colors touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +7 902 614-25-03
              </a>
              
              <a 
                href="tel:+79193028913" 
                className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-base hover:bg-gray-200 transition-colors touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +7 919 302-89-13
              </a>
              
              <a 
                href="https://t.me/avtozakaz74" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full px-4 py-3 bg-gray-100 text-gray-800 rounded-lg font-medium text-base hover:bg-gray-200 transition-colors touch-manipulation"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.183-.612-.6.125-.89l10.782-4.156c.5-.18.943.11.78.89z"/>
                </svg>
                Telegram: avtozakaz74
              </a>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
