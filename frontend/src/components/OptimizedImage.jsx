import { useState, useEffect } from 'react';

/**
 * Оптимизированный компонент изображения с поддержкой:
 * - srcset для адаптивных размеров
 * - sizes для правильного выбора размера
 * - lazy loading
 * - async decoding
 * - fallback на placeholder при ошибке
 * - опциональная поддержка WebP через picture элемент
 * 
 * @param {string} src - URL изображения
 * @param {string} alt - Альтернативный текст
 * @param {string} className - CSS классы
 * @param {string} sizes - Атрибут sizes для srcset (по умолчанию: "100vw")
 * @param {boolean} lazy - Использовать lazy loading (по умолчанию: true)
 * @param {string} fallback - URL fallback изображения при ошибке
 * @param {string|Function} webpSrc - URL WebP версии изображения или функция для генерации WebP URL (опционально)
 * @param {Object} rest - Остальные пропсы для img элемента
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  sizes = '100vw',
  lazy = true,
  fallback = '/placeholder-car.jpg',
  webpSrc = null,
  ...rest
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Обновляем imageSrc при изменении src пропса
  useEffect(() => {
    setImageSrc(src);
    setHasError(false); // Сбрасываем ошибку при смене изображения
  }, [src]);

  // Нормализуем URL (добавляем https: если начинается с //)
  const normalizeUrl = (url) => {
    if (!url) return fallback;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('http')) return url;
    return url;
  };

  const normalizedSrc = normalizeUrl(imageSrc);

  // Генерируем WebP URL, если предоставлена функция или строка
  const getWebpUrl = () => {
    if (!webpSrc) return null;
    if (typeof webpSrc === 'function') {
      return webpSrc(normalizedSrc);
    }
    return normalizeUrl(webpSrc);
  };

  const webpUrl = getWebpUrl();

  const handleError = (e) => {
    if (!hasError) {
      setHasError(true);
      // Если fallback пустой, скрываем изображение (для логотипов)
      if (!fallback || fallback === '') {
        e.target.style.display = 'none';
      } else if (e.target.src !== fallback) {
        setImageSrc(fallback);
      }
    }
  };

  // Если есть WebP версия, используем picture элемент
  if (webpUrl) {
    return (
      <picture>
        <source srcSet={webpUrl} type="image/webp" sizes={sizes} />
        <img
          src={normalizedSrc}
          sizes={sizes}
          alt={alt}
          className={className}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={handleError}
          {...rest}
        />
      </picture>
    );
  }

  // Обычный img элемент без WebP
  return (
    <img
      src={normalizedSrc}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
      {...rest}
    />
  );
}
