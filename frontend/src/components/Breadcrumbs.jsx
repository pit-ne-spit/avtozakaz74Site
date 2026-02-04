import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Breadcrumbs компонент со структурированными данными Schema.org
 * @param {Array} items - Массив объектов {label, url}
 */
export default function Breadcrumbs({ items = [] }) {
  // Структурированные данные для BreadcrumbList
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.url
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbStructuredData)}
        </script>
      </Helmet>
      
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <svg className="w-4 h-4 text-gray-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link
                to={item.url}
                className="hover:text-blue-700 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
