# Руководство по внедрению SEO оптимизации

## Шаг 1: Установка зависимостей

```bash
cd frontend
npm install react-helmet-async react-router-dom
```

## Шаг 2: Настройка HelmetProvider в App.jsx

```jsx
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarDetailsPage from './pages/CarDetailsPage';
import './index.css';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/car/:id" element={<CarDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
```

## Шаг 3: Использование в HomePage.jsx

Добавить в начало компонента HomePage:

```jsx
import SEOHead, { createWebSiteStructuredData, createOrganizationStructuredData } from '../components/SEOHead';

export default function HomePage() {
  // ... существующий код ...
  
  const websiteStructuredData = createWebSiteStructuredData();
  const organizationStructuredData = createOrganizationStructuredData();

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Авто из Китая - Купить автомобиль с доставкой в Россию | avtozakaz74"
        description={`Купить автомобиль из Китая, Японии и Кореи. В базе ${total.toLocaleString()} автомобилей. Доставка, таможенное оформление, полный расчет стоимости.`}
        url="https://avtozakaz74.ru"
        structuredData={[websiteStructuredData, organizationStructuredData]}
      />
      {/* остальной код */}
    </div>
  );
}
```

## Шаг 4: Использование в CarDetailsPage.jsx

Добавить в начало компонента CarDetailsPage (после загрузки данных):

```jsx
import SEOHead, { createCarStructuredData } from '../components/SEOHead';

export default function CarDetailsPage() {
  // ... существующий код ...
  
  // После загрузки car и carDetails
  const carStructuredData = car && carDetails 
    ? createCarStructuredData(car, carDetails)
    : null;

  const brand = getDisplayBrandName(car?.brandname || carDetails?.vehicle_info?.brandname);
  const model = carDetails?.vehicle_info?.seriesname || car?.seriesname || '';
  const year = carDetails?.vehicle_info?.firstregyear || car?.firstregyear || '';
  const price = priceData?.totalFormatted || '';
  const description = `${brand} ${model} ${year} года. ${price} руб. Пробег ${mileage} км. Доставка из Китая в Россию.`;

  if (loading) {
    return (
      // ... существующий код загрузки ...
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title={`${brand} ${model} ${year} - Купить из Китая | avtozakaz74`}
        description={description}
        image={photoUrls[0] || car?.imageurl || ''}
        url={`https://avtozakaz74.ru/car/${id}`}
        type="product"
        canonical={`https://avtozakaz74.ru/car/${id}`}
        structuredData={carStructuredData}
        keywords={`${brand} ${model}, авто из китая, купить ${brand} ${model}, доставка авто из китая`}
      />
      {/* остальной код */}
    </div>
  );
}
```

## Шаг 5: Создание sitemap.xml (бэкенд)

Создать endpoint `/api/sitemap` в backend, который будет генерировать sitemap:

```javascript
// В backend/server.js добавить:
app.get('/api/sitemap', async (req, res) => {
  try {
    // Получить список всех автомобилей из API
    const cars = await fetchAllCars(); // нужно реализовать
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://avtozakaz74.ru/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${cars.map(car => `
  <url>
    <loc>https://avtozakaz74.ru/car/${car.infoid}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;
    
    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

И добавить в nginx.conf:

```nginx
location /sitemap.xml {
    proxy_pass http://backend:3000/api/sitemap;
    proxy_set_header Host $host;
}
```

## Шаг 6: Оптимизация изображений

Добавить alt атрибуты ко всем изображениям:

```jsx
<img
  src={photoUrls[currentPhotoIndex]}
  alt={`${brand} ${model} ${year} - фото ${currentPhotoIndex + 1}`}
  className="w-full h-full object-cover"
  loading="lazy"
/>
```

## Шаг 7: Проверка

1. Проверить мета-теги через: https://www.opengraph.xyz/
2. Проверить структурированные данные: https://validator.schema.org/
3. Проверить robots.txt: https://www.google.com/webmasters/tools/robots-testing-tool
4. Проверить sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html

## Шаг 8: Регистрация в поисковых системах

1. **Google Search Console**: https://search.google.com/search-console
   - Добавить сайт
   - Загрузить sitemap.xml
   - Проверить индексацию

2. **Яндекс.Вебмастер**: https://webmaster.yandex.ru
   - Добавить сайт
   - Загрузить sitemap.xml
   - Настроить индексацию

## Дополнительные улучшения

### Добавить breadcrumbs (хлебные крошки):

```jsx
import { Helmet } from 'react-helmet-async';

const breadcrumbStructuredData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://avtozakaz74.ru"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": `${brand} ${model}`,
      "item": `https://avtozakaz74.ru/car/${id}`
    }
  ]
};
```

### Добавить FAQ секцию на главной:

```jsx
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Как происходит доставка автомобиля из Китая?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Доставка осуществляется из Китая в Челябинск или Москву. Стоимость доставки составляет 200 000 рублей."
      }
    }
    // ... другие вопросы
  ]
};
```
