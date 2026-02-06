import { Helmet } from 'react-helmet-async';

/**
 * SEO компонент для динамических мета-тегов
 * Использование:
 * <SEOHead 
 *   title="Заголовок страницы"
 *   description="Описание страницы"
 *   image="URL изображения"
 *   url="URL страницы"
 *   type="website" // или "product" для карточек авто
 *   structuredData={jsonLdObject}
 * />
 */
export default function SEOHead({
  title = 'Авто из Китая | avtozakaz74',
  description = 'Покупка и доставка автомобилей из Китая, Японии и Кореи. Большой выбор авто с пробегом. Работаем напрямую с экспортными компаниями.',
  image = 'https://avtozakaz74.ru/logo.png',
  url = 'https://avtozakaz74.ru',
  type = 'website',
  structuredData = null,
  keywords = 'авто из китая, купить авто из китая, доставка авто из китая, автомобили из китая, японии, кореи',
  canonical = null,
  preloadImages = []
}) {
  const fullTitle = title.includes('avtozakaz74') ? title : `${title} | avtozakaz74`;
  const canonicalUrl = canonical || url;

  return (
    <Helmet>
      {/* Предзагрузка критических изображений */}
      {preloadImages.map((img, idx) => (
        <link key={idx} rel="preload" as="image" href={img.src} type={img.type || 'image/jpeg'} />
      ))}
      
      {/* Основные мета-теги */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph для социальных сетей */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="АвтоЗаказ 74" />
      <meta property="og:locale" content="ru_RU" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Структурированные данные (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

