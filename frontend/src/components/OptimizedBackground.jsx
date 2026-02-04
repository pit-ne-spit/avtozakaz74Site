import { useState, useEffect } from 'react';

/**
 * Оптимизированный компонент для фонового изображения с:
 * - Предзагрузкой
 * - Поддержкой WebP с fallback
 * - Blur-up placeholder
 * - Оптимизацией рендеринга
 */
export default function OptimizedBackground({ 
  src, 
  webpSrc = null,
  alt = '',
  className = '',
  children,
  overlay = true 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Создаем WebP URL если не передан
  const getWebpUrl = () => {
    if (webpSrc) return webpSrc;
    // Если исходный файл .jpg, создаем путь к .webp версии
    if (src && src.endsWith('.jpg')) {
      return src.replace('.jpg', '.webp');
    }
    return null;
  };

  const webpUrl = getWebpUrl();

  useEffect(() => {
    // Предзагружаем изображение
    const img = new Image();
    
    // Пробуем загрузить WebP сначала
    const imageToLoad = webpUrl || src;
    
    img.onload = () => {
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      // Если WebP не загрузился, пробуем оригинал
      if (webpUrl && imageToLoad === webpUrl) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => setImageLoaded(true);
        fallbackImg.onerror = () => setImageError(true);
        fallbackImg.src = src;
      } else {
        setImageError(true);
      }
    };
    
    img.src = imageToLoad;
  }, [src, webpUrl]);

  // Blur placeholder (легкий градиент)
  const placeholderStyle = {
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
  };

  return (
    <div 
      className={`relative ${className}`}
      style={{
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {/* Placeholder/Blur-up */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          ...placeholderStyle,
          opacity: imageLoaded ? 0 : 1,
          zIndex: 1,
        }}
      />
      
      {/* Фоновое изображение */}
      {!imageError && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
          style={{
            backgroundImage: imageLoaded 
              ? (webpUrl ? `url(${webpUrl}), url(${src})` : `url(${src})`)
              : 'none',
            opacity: imageLoaded ? 1 : 0,
            zIndex: 2,
            willChange: 'opacity',
          }}
        />
      )}
      
      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-black/30" style={{ zIndex: 3 }} />
      )}
      
      {/* Контент - absolute inset-0 чтобы занимать всю область родителя */}
      <div className="absolute inset-0" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
