import { Helmet } from 'react-helmet-async';
import { getDisplayBrandName, getDisplayModelName } from '../lib/brandMapping';

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

/**
 * Хелпер для создания структурированных данных автомобиля
 */
export function createCarStructuredData(car, carDetails) {
  const apiBrandName = carDetails?.vehicle_info?.brandname || car?.brandname || '';
  const apiModelName = carDetails?.vehicle_info?.seriesname || car?.seriesname || '';
  const brand = getDisplayBrandName(apiBrandName);
  const model = getDisplayModelName(apiModelName);
  const year = carDetails?.vehicle_info?.firstregyear || car?.firstregyear || '';
  const price = car?.total_price_rub || 0;
  const image = car?.imageurl || carDetails?.media_support?.photos?.[0] || '';
  const mileage = carDetails?.vehicle_info?.mileage 
    ? carDetails.vehicle_info.mileage * 10000 
    : car?.mileage || 0;
  const fuelType = carDetails?.technical_specs?.fuelname || '';
  const engineVolume = car?.engine_volume_ml || 0;
  const url = `https://avtozakaz74.ru/car/${car?.infoid}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${brand} ${model} ${year}`,
    "description": `${brand} ${model} ${year} года, пробег ${mileage.toLocaleString('ru-RU')} км, ${fuelType}`,
    "image": image ? (image.startsWith('http') ? image : `https:${image}`) : '',
    "brand": {
      "@type": "Brand",
      "name": brand
    },
    "category": "Автомобиль",
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "RUB",
      "price": price.toString(),
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/UsedCondition"
    },
    "vehicleIdentificationNumber": car?.infoid?.toString() || '',
    "mileageFromOdometer": {
      "@type": "QuantitativeValue",
      "value": mileage,
      "unitCode": "KMT"
    },
    "fuelType": fuelType,
    "vehicleEngine": {
      "@type": "EngineSpecification",
      "engineDisplacement": {
        "@type": "QuantitativeValue",
        "value": engineVolume / 1000,
        "unitCode": "LTR"
      }
    }
  };
}

/**
 * Хелпер для создания структурированных данных организации
 */
export function createOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "АвтоЗаказ 74",
    "url": "https://avtozakaz74.ru",
    "logo": "https://avtozakaz74.ru/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+7-902-614-25-03",
      "contactType": "customer service",
      "areaServed": "RU",
      "availableLanguage": "Russian"
    },
    "sameAs": [
      "https://t.me/avtozakaz74"
    ]
  };
}

/**
 * Хелпер для создания структурированных данных сайта с поиском
 */
export function createWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "АвтоЗаказ 74",
    "url": "https://avtozakaz74.ru",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://avtozakaz74.ru/?brandname={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
}
