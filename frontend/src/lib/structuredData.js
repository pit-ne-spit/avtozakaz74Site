import { getDisplayBrandName, getDisplayModelName } from './brandMapping';

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
