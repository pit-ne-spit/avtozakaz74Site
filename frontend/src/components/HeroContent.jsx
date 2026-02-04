/**
 * Hero контент для главной страницы с SEO-оптимизированным текстом
 */
export default function HeroContent({ totalCars = 0 }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Автомобили из Китая с доставкой в Россию
      </h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Большой выбор автомобилей из Китая с полным расчетом стоимости и доставкой в любой город России.
        </p>
        
        <p className="text-gray-700 leading-relaxed mb-6">
          Мы работаем напрямую с экспортными компаниями в Китае, что позволяет предлагать выгодные цены на автомобили. 
          Все расходы, включая таможенные платежи, оформление и доставку, включены в расчет стоимости.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
          Почему выбирают нас
        </h2>
        
        <ul className="space-y-3 text-gray-700 mb-6">
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Работаем напрямую</strong> с экспортными компаниями в Китае</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Полный расчет стоимости</strong> с учетом всех расходов: таможня, оформление, доставка</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Доставка в любой город России</strong> от 180 000 рублей</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Прозрачные условия</strong> - все расходы указаны в детальном расчете</span>
          </li>
          <li className="flex items-start gap-3">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Ежедневное обновление</strong> базы данных автомобилей</span>
          </li>
        </ul>

        <div className="bg-blue-50 border-l-4 border-blue-700 p-4 rounded-r-lg mt-6">
          <p className="text-gray-800">
            <strong>Как это работает:</strong> Выберите автомобиль из каталога, ознакомьтесь с детальным расчетом стоимости, 
            свяжитесь с нами для уточнения деталей. Мы организуем доставку, таможенное оформление и передачу автомобиля вам.
          </p>
        </div>
      </div>
    </div>
  );
}
