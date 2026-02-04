import Header from '../components/Header';
import SEOHead from '../components/SEOHead';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="Политика использования файлов cookie | avtozakaz74"
        description="Политика использования файлов cookie на сайте Автозаказ74"
        url="https://avtozakaz74.ru/cookie-policy"
        canonical="https://avtozakaz74.ru/cookie-policy"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-12 mt-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Политика использования файлов cookie
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                1. Что такое файлы cookie
              </h2>
              <p>
                Файлы cookie (куки) — это небольшие текстовые файлы, которые сохраняются на вашем устройстве 
                (компьютере, планшете или мобильном телефоне) при посещении веб-сайта. Они позволяют сайту 
                запоминать ваши действия и предпочтения на определенный период времени, чтобы вам не нужно 
                было вводить эту информацию заново при каждом посещении сайта или переходе с одной страницы на другую.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                2. Какие типы cookie мы используем
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.1. Обязательные cookie
              </h3>
              <p>
                Эти файлы cookie необходимы для работы сайта и не могут быть отключены в наших системах. 
                Они обычно устанавливаются только в ответ на ваши действия, такие как настройка параметров 
                конфиденциальности, вход в систему или заполнение форм.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.2. Функциональные cookie
              </h3>
              <p>
                Эти файлы cookie позволяют сайту предоставлять расширенную функциональность и персонализацию. 
                Они могут устанавливаться нами или сторонними поставщиками услуг, чьи сервисы мы добавили на наши страницы.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                2.3. Аналитические cookie
              </h3>
              <p>
                Эти файлы cookie позволяют нам подсчитывать посещения и источники трафика, чтобы мы могли 
                измерять и улучшать производительность нашего сайта. Они помогают нам узнать, какие страницы 
                наиболее и наименее популярны, и увидеть, как посетители перемещаются по сайту.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                3. Используемые нами сервисы
              </h2>
              <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                3.1. Яндекс.Метрика
              </h3>
              <p>
                Мы используем Яндекс.Метрику для анализа поведения посетителей на сайте. Яндекс.Метрика использует 
                файлы cookie для сбора информации о том, как посетители используют наш сайт. Эта информация используется 
                для составления отчетов и помогает нам улучшить сайт.
              </p>
              <p>
                Подробнее о политике конфиденциальности Яндекс.Метрики можно узнать на странице:{' '}
                <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  https://yandex.ru/legal/confidential/
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                4. Управление cookie
              </h2>
              <p>
                Вы можете контролировать и/или удалять файлы cookie по своему усмотрению. Вы можете удалить все 
                файлы cookie, которые уже находятся на вашем компьютере, и можете установить настройки большинства 
                браузеров так, чтобы предотвратить их размещение.
              </p>
              <p>
                Однако если вы это сделаете, вам, возможно, придется вручную настраивать некоторые параметры при 
                каждом посещении сайта, и некоторые сервисы и функции могут не работать.
              </p>
              <p className="mt-4">
                Инструкции по управлению cookie в популярных браузерах:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/ru/kb/kuki-informaciya-kotoruyu-veb-sajty-sohranyayut-na-vashem" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/ru-ru/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/ru-ru/microsoft-edge/удаление-файлов-cookie-в-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                5. Изменения в Политике использования cookie
              </h2>
              <p>
                Мы можем время от времени обновлять настоящую Политику использования cookie. Мы рекомендуем 
                периодически просматривать эту страницу, чтобы быть в курсе любых изменений в том, как мы используем cookie.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                6. Контактная информация
              </h2>
              <p>
                Если у вас есть вопросы относительно использования файлов cookie на нашем сайте, пожалуйста, 
                свяжитесь с нами:
              </p>
              <ul className="list-none pl-0 space-y-2 mt-4">
                <li>Телефон: <a href="tel:+79026142503" className="text-blue-600 hover:text-blue-800">+7 902 614-25-03</a></li>
                <li>Telegram: <a href="https://t.me/avtozakaz74" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">@avtozakaz74</a></li>
              </ul>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Дата последнего обновления: {new Date().toLocaleDateString('ru-RU', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
