import Header from '../components/Header';
import Breadcrumbs from '../components/Breadcrumbs';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  // Структурированные данные для страницы
  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "mainEntity": {
      "@type": "Organization",
      "name": "Автозаказ74",
      "url": "https://avtozakaz74.ru",
      "logo": "https://avtozakaz74.ru/logo.png",
      "description": "Профессиональная доставка автомобилей из Китая в Россию. Полный расчет стоимости, таможенное оформление, доставка в любой город России.",
      "foundingDate": "2015",
      "numberOfEmployees": {
        "@type": "QuantitativeValue",
        "value": "10+"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Россия"
      },
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
    }
  };

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Автозаказ74",
    "description": "Доставка автомобилей из Китая в Россию",
    "url": "https://avtozakaz74.ru",
    "telephone": "+7-902-614-25-03",
    "priceRange": "$$",
    "areaServed": {
      "@type": "Country",
      "name": "Россия"
    }
  };

  const serviceData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Подбор автомобиля в Китае",
      "description": "Профессиональный подбор автомобиля в Китае по вашим требованиям",
      "provider": {
        "@type": "Organization",
        "name": "Автозаказ74"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Китай"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Таможенное оформление",
      "description": "Полное таможенное оформление автомобилей из Китая",
      "provider": {
        "@type": "Organization",
        "name": "Автозаказ74"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Россия"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "Доставка автомобилей",
      "description": "Доставка автомобилей из Китая в любой город России",
      "provider": {
        "@type": "Organization",
        "name": "Автозаказ74"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Россия"
      }
    }
  ];

  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Как купить автомобиль из Китая",
    "description": "Пошаговая инструкция по покупке и доставке автомобиля из Китая в Россию",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Выбор автомобиля",
        "text": "Выберите автомобиль из нашего каталога или укажите требования к автомобилю",
        "url": "https://avtozakaz74.ru"
      },
      {
        "@type": "HowToStep",
        "name": "Расчет стоимости",
        "text": "Получите детальный расчет стоимости с учетом всех расходов: цена автомобиля, таможенные платежи, оформление, доставка",
        "url": "https://avtozakaz74.ru"
      },
      {
        "@type": "HowToStep",
        "name": "Заключение договора",
        "text": "После согласования всех деталей заключаем договор и вносите предоплату",
        "url": "https://avtozakaz74.ru"
      },
      {
        "@type": "HowToStep",
        "name": "Доставка и оформление",
        "text": "Мы организуем доставку автомобиля из Китая, таможенное оформление и доставку в ваш город",
        "url": "https://avtozakaz74.ru"
      },
      {
        "@type": "HowToStep",
        "name": "Передача автомобиля",
        "text": "Получаете автомобиль с полным пакетом документов",
        "url": "https://avtozakaz74.ru"
      }
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Сколько лет работает компания Автозаказ74?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Компания Автозаказ74 работает с 2015 года, имея многолетний опыт в сфере доставки автомобилей из Китая в Россию."
        }
      },
      {
        "@type": "Question",
        "name": "В какие города России вы доставляете автомобили?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Мы доставляем автомобили из Китая в любой город России. Стоимость доставки рассчитывается индивидуально в зависимости от расстояния."
        }
      },
      {
        "@type": "Question",
        "name": "Какие услуги включает полный расчет стоимости?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Полный расчет стоимости включает цену автомобиля в Китае, таможенные платежи (единая ставка налога, таможенное оформление), утилизационный сбор, услуги импорта из Китая в Россию, оформление, комиссию компании и доставку в ваш город."
        }
      },
      {
        "@type": "Question",
        "name": "Работаете ли вы напрямую с экспортными компаниями в Китае?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Да, мы работаем напрямую с экспортными компаниями в Китае, что позволяет предлагать выгодные цены на автомобили и гарантировать качество услуг."
        }
      },
      {
        "@type": "Question",
        "name": "Как быстро обновляется база данных автомобилей?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "База данных автомобилей обновляется ежедневно, что позволяет нам предлагать актуальные предложения с актуальными ценами."
        }
      }
    ]
  };

  const breadcrumbItems = [
    { label: 'Главная', url: '/' },
    { label: 'О нас', url: '/about' }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead
        title="О компании Автозаказ74 - Доставка авто из Китая в Россию | avtozakaz74"
        description="Автозаказ74 - профессиональная доставка автомобилей из Китая в Россию с 2015 года. Полный расчет стоимости, таможенное оформление, доставка в любой город России. Работаем напрямую с экспортными компаниями."
        url="https://avtozakaz74.ru/about"
        keywords="о компании автозаказ74, доставка авто из китая, импорт автомобилей из китая, таможенное оформление авто, купить авто из китая, доставка авто в россию, расчет стоимости автомобиля из китая"
        canonical="https://avtozakaz74.ru/about"
        structuredData={[aboutStructuredData, localBusinessData, howToData, faqData, ...serviceData]}
      />
      <Header />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 pt-24 pb-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <main className="container mx-auto px-4 pb-12">
        <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* H1 заголовок */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            О компании Автозаказ74
          </h1>

          {/* Вводный текст */}
          <div className="prose prose-lg max-w-none text-gray-700 mb-8">
            <p className="text-xl leading-relaxed mb-4">
              <strong>Автозаказ74</strong> — это профессиональная компания, специализирующаяся на 
              <strong> доставке автомобилей из Китая в Россию</strong>. Мы работаем с 2015 года и за это время 
              помогли сотням клиентов приобрести качественные автомобили с выгодной стоимостью.
            </p>
            <p className="leading-relaxed mb-4">
              Наша основная специализация — <strong>импорт автомобилей из Китая</strong> с полным расчетом стоимости, 
              включающим все необходимые расходы: таможенные платежи, оформление документов и доставку в любой город России. 
              Мы работаем напрямую с экспортными компаниями в Китае, что позволяет предлагать выгодные цены и гарантировать 
              качество услуг.
            </p>
            <p className="leading-relaxed">
              В нашей базе данных <strong>более 200 000 автомобилей</strong> различных марок и моделей, которые обновляются ежедневно. 
              Мы предоставляем полную прозрачность в расчетах и детальную информацию о каждом автомобиле, чтобы вы могли 
              принять обоснованное решение.
            </p>
          </div>

          {/* Наша история */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Наша история</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Компания <strong>Автозаказ74</strong> была основана в 2015 году с целью сделать процесс 
                <strong> покупки автомобилей из Китая</strong> максимально простым, прозрачным и выгодным для российских клиентов.
              </p>
              <p className="mb-4">
                За годы работы мы наладили прочные партнерские отношения с ведущими экспортными компаниями в Китае, 
                что позволяет нам предлагать широкий выбор автомобилей по конкурентным ценам. Мы постоянно расширяем 
                нашу базу данных и улучшаем сервис, чтобы предоставлять клиентам только актуальную информацию.
              </p>
              <p className="mb-4">
                На сегодняшний день мы успешно доставили автомобили в десятки городов России, от Москвы и Санкт-Петербурга 
                до региональных центров. Наш опыт и знания в области <strong>таможенного оформления</strong> и логистики 
                позволяют нам эффективно решать любые задачи, связанные с импортом автомобилей.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-700 p-6 rounded-r-lg mt-6">
                <p className="text-gray-800 mb-2">
                  <strong>Наши достижения:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Более 8 лет успешной работы на рынке</li>
                  <li>Сотни довольных клиентов по всей России</li>
                  <li>База данных из более чем 200 000 автомобилей</li>
                  <li>Ежедневное обновление предложений</li>
                  <li>Прямые контакты с экспортными компаниями в Китае</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Почему выбирают нас */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Почему выбирают нас</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
                <svg className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Работаем напрямую с Китаем</h3>
                  <p className="text-gray-700">
                    Прямые контакты с экспортными компаниями в Китае позволяют нам предлагать выгодные цены 
                    без посредников и гарантировать качество услуг.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
                <svg className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Полный расчет стоимости</h3>
                  <p className="text-gray-700">
                    Предоставляем детальный расчет стоимости с учетом всех расходов: цена автомобиля, таможенные платежи, 
                    оформление, доставка. Никаких скрытых платежей.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
                <svg className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Доставка в любой город России</h3>
                  <p className="text-gray-700">
                    Организуем доставку автомобилей из Китая в любой город России. Стоимость доставки рассчитывается 
                    индивидуально и указывается в детальном расчете.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
                <svg className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Прозрачные условия</h3>
                  <p className="text-gray-700">
                    Все расходы указаны в детальном расчете стоимости. Вы всегда знаете, за что платите, 
                    и можете сравнить предложения перед принятием решения.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
                <svg className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Многолетний опыт</h3>
                  <p className="text-gray-700">
                    Работаем с 2015 года и имеем глубокие знания в области импорта автомобилей, таможенного 
                    оформления и логистики. Наш опыт — ваша гарантия качества.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-gray-50 p-6 rounded-lg">
                <svg className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ежедневное обновление базы</h3>
                  <p className="text-gray-700">
                    База данных автомобилей обновляется ежедневно, что позволяет нам предлагать только актуальные 
                    предложения с актуальными ценами и характеристиками.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Наши услуги */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Наши услуги</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-blue-700 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Подбор автомобиля в Китае</h3>
                <p className="text-gray-700">
                  Помогаем выбрать автомобиль из нашей обширной базы данных или подбираем автомобиль по вашим 
                  индивидуальным требованиям. Мы работаем только с проверенными продавцами и тщательно проверяем 
                  каждый автомобиль перед покупкой.
                </p>
              </div>

              <div className="border-l-4 border-blue-700 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Расчет стоимости</h3>
                <p className="text-gray-700">
                  Предоставляем детальный расчет стоимости автомобиля с учетом всех расходов: цена автомобиля в Китае, 
                  таможенные платежи (единая ставка налога, таможенное оформление), утилизационный сбор, услуги импорта 
                  из Китая в Россию, оформление документов, комиссия компании и доставка в ваш город. Все расчеты прозрачны 
                  и понятны.
                </p>
              </div>

              <div className="border-l-4 border-blue-700 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Таможенное оформление</h3>
                <p className="text-gray-700">
                  Полное таможенное оформление автомобилей из Китая. Мы берем на себя все процедуры, связанные с 
                  таможенным оформлением, включая подготовку документов, расчет таможенных платежей и взаимодействие 
                  с таможенными органами.
                </p>
              </div>

              <div className="border-l-4 border-blue-700 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Доставка в Россию</h3>
                <p className="text-gray-700">
                  Организуем доставку автомобилей из Китая в любой город России. Мы работаем с надежными транспортными 
                  компаниями и обеспечиваем безопасную транспортировку вашего автомобиля. Стоимость доставки рассчитывается 
                  индивидуально в зависимости от расстояния и составляет от 180 000 рублей.
                </p>
              </div>

              <div className="border-l-4 border-blue-700 pl-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Консультации и поддержка</h3>
                <p className="text-gray-700">
                  Наши специалисты всегда готовы ответить на ваши вопросы и помочь с выбором автомобиля. Мы предоставляем 
                  консультации по всем аспектам импорта автомобилей из Китая, таможенному оформлению и доставке.
                </p>
              </div>
            </div>
          </section>

          {/* Как мы работаем */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Как мы работаем</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Выбор автомобиля</h3>
                  <p className="text-gray-700">
                    Выберите автомобиль из нашего каталога, который содержит более 200 000 предложений различных марок и моделей. 
                    Используйте фильтры для поиска автомобиля по марке, модели, году выпуска, цене и другим параметрам. 
                    Если вы не нашли подходящий вариант, свяжитесь с нами — мы подберем автомобиль по вашим требованиям.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Расчет стоимости</h3>
                  <p className="text-gray-700">
                    На странице каждого автомобиля вы можете увидеть детальный расчет стоимости, который включает цену автомобиля 
                    в Китае, таможенные платежи, утилизационный сбор, услуги импорта, оформление, комиссию компании и доставку. 
                    Все расчеты основаны на актуальных курсах валют и тарифах. Вы можете развернуть детальный расчет, чтобы увидеть 
                    разбивку по каждому пункту.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Заключение договора</h3>
                  <p className="text-gray-700">
                    После того как вы выбрали автомобиль и ознакомились с расчетом стоимости, свяжитесь с нами для уточнения 
                    деталей. Мы ответим на все ваши вопросы и подготовим договор. После согласования всех условий вы вносите 
                    предоплату, и мы начинаем работу по доставке вашего автомобиля.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Доставка и оформление</h3>
                  <p className="text-gray-700">
                    Мы организуем доставку автомобиля из Китая, таможенное оформление и транспортировку в ваш город. На каждом 
                    этапе мы информируем вас о статусе доставки. Все документы готовятся нашими специалистами, вам не нужно 
                    беспокоиться о бюрократических процедурах.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Передача автомобиля</h3>
                  <p className="text-gray-700">
                    После доставки автомобиля в ваш город мы передаем его вам вместе с полным пакетом документов. Вы получаете 
                    автомобиль, готовый к эксплуатации, со всеми необходимыми документами для регистрации в ГИБДД.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* География работы */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">География работы</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Мы доставляем автомобили из Китая <strong>в любой город России</strong>. Наши клиенты находятся в Москве, 
                Санкт-Петербурге, Челябинске, Екатеринбурге, Новосибирске, Казани, Краснодаре и многих других городах по всей стране.
              </p>
              <p className="mb-4">
                Стоимость доставки рассчитывается индивидуально в зависимости от расстояния и составляет от 180 000 рублей. 
                Мы работаем с надежными транспортными компаниями и обеспечиваем безопасную транспортировку вашего автомобиля.
              </p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mt-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Популярные направления доставки:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">Москва</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">Санкт-Петербург</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">Челябинск</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">Екатеринбург</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">Новосибирск</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">Казань</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">Краснодар</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-700">И другие города России</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
            <div className="space-y-4">
              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold text-gray-900 cursor-pointer text-lg">
                  Сколько лет работает компания Автозаказ74?
                </summary>
                <p className="mt-3 text-gray-700">
                  Компания Автозаказ74 работает с 2015 года, имея многолетний опыт в сфере доставки автомобилей 
                  из Китая в Россию. За это время мы накопили значительный опыт и знания в области импорта автомобилей, 
                  таможенного оформления и логистики.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold text-gray-900 cursor-pointer text-lg">
                  В какие города России вы доставляете автомобили?
                </summary>
                <p className="mt-3 text-gray-700">
                  Мы доставляем автомобили из Китая в любой город России. Стоимость доставки рассчитывается индивидуально 
                  в зависимости от расстояния и составляет от 180 000 рублей. Мы работаем с надежными транспортными компаниями 
                  и обеспечиваем безопасную транспортировку вашего автомобиля.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold text-gray-900 cursor-pointer text-lg">
                  Какие услуги включает полный расчет стоимости?
                </summary>
                <p className="mt-3 text-gray-700">
                  Полный расчет стоимости включает цену автомобиля в Китае, таможенные платежи (единая ставка налога, 
                  таможенное оформление), утилизационный сбор, услуги импорта из Китая в Россию, оформление документов, 
                  комиссию компании и доставку в ваш город. Все расходы указаны в детальном расчете, который вы можете 
                  увидеть на странице каждого автомобиля.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold text-gray-900 cursor-pointer text-lg">
                  Работаете ли вы напрямую с экспортными компаниями в Китае?
                </summary>
                <p className="mt-3 text-gray-700">
                  Да, мы работаем напрямую с экспортными компаниями в Китае, что позволяет предлагать выгодные цены на 
                  автомобили и гарантировать качество услуг. Прямые контакты с поставщиками исключают посредников и 
                  обеспечивают прозрачность сделок.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold text-gray-900 cursor-pointer text-lg">
                  Как быстро обновляется база данных автомобилей?
                </summary>
                <p className="mt-3 text-gray-700">
                  База данных автомобилей обновляется ежедневно, что позволяет нам предлагать актуальные предложения 
                  с актуальными ценами. В нашей базе более 200 000 автомобилей различных марок и моделей, которые вы 
                  можете просмотреть и отфильтровать по различным параметрам.
                </p>
              </details>

              <details className="bg-gray-50 p-6 rounded-lg">
                <summary className="font-semibold text-gray-900 cursor-pointer text-lg">
                  Какие документы нужны для покупки автомобиля из Китая?
                </summary>
                <p className="mt-3 text-gray-700">
                  Для покупки автомобиля из Китая вам понадобится паспорт гражданина РФ. Все остальные документы, 
                  включая документы для таможенного оформления и регистрации в ГИБДД, мы подготовим самостоятельно. 
                  Вы получите автомобиль с полным пакетом документов, готовым к регистрации.
                </p>
              </details>
            </div>
          </section>

          {/* Контакты */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Контакты</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
              <p className="text-gray-700 mb-6">
                Свяжитесь с нами любым удобным способом. Наши специалисты ответят на все ваши вопросы и помогут 
                выбрать подходящий автомобиль.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Телефоны:</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="tel:+79026142503" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        +7 902 614-25-03 (Дмитрий)
                      </a>
                    </li>
                    <li>
                      <a href="tel:+79193028913" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        +7 919 302-89-13 (Максим)
                      </a>
                    </li>
                    <li>
                      <a href="tel:+79514502225" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        +7 951 450-22-25 (Максим)
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Мессенджеры:</h3>
                  <ul className="space-y-2">
                    <li>
                      <a 
                        href="https://t.me/avtozakaz74" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.183-.612-.6.125-.89l10.782-4.156c.5-.18.943.11.78.89z"/>
                        </svg>
                        Telegram: @avtozakaz74
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* CTA блоки */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Link
              to="/#filters"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Посмотреть каталог автомобилей
            </Link>
            <a
              href="tel:+79026142503"
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-center flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Связаться с нами
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}
