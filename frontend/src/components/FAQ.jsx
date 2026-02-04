import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * FAQ компонент со структурированными данными Schema.org
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "Как происходит доставка автомобиля из Китая?",
      answer: "Доставка осуществляется из Китая по всей России. Мы работаем напрямую с экспортными компаниями в Китае. После выбора автомобиля мы организуем его доставку, таможенное оформление и передачу вам. Стоимость доставки составляет от 180 000 рублей."
    },
    {
      question: "Сколько стоит доставка автомобиля из Китая?",
      answer: "Стоимость доставки автомобиля по России составляет 180 000 рублей. В эту стоимость входит транспортировка автомобиля и все необходимые документы для постановки автомобиля на учет в России"
    },
    {
      question: "Как рассчитывается таможенная пошлина?",
      answer: "Таможенная пошлина рассчитывается на основе возраста автомобиля и объема двигателя. Для автомобилей до 3 лет применяется ставка 48% от стоимости, но не менее минимальной ставки за см³. Для автомобилей 3-5 лет и старше 5 лет применяются фиксированные ставки за см³ объема двигателя. Мы автоматически рассчитываем все таможенные платежи при расчете стоимости."
    },
    {
      question: "Сколько времени занимает доставка?",
      answer: "Срок доставки автомобиля из Китая обычно составляет от 30 до 60 дней с момента оплаты. Точный срок зависит от выбранного автомобиля, его местоположения в Китае и загруженности таможенных служб."
    },
    {
      question: "Какие документы нужны для покупки автомобиля из Китая?",
      answer: "Для покупки автомобиля из Китая вам понадобится только паспорт. Мы помогаем с оформлением всех необходимых документов и таможенным оформлением."
    },
    {
      question: "Можно ли посмотреть автомобиль перед покупкой?",
      answer: "Мы предоставляем детальные фотографии и описание каждого автомобиля. При необходимости можем организовать видео-осмотр автомобиля в Китае."
    },
    {
      question: "Какая гарантия на автомобили из Китая?",
      answer: "Мы предоставляем полную информацию о состоянии автомобиля на момент покупки. Все автомобили проходят проверку перед отправкой. Мы работаем только с проверенными экспортными компаниями в Китае, которые предоставляют документацию о состоянии автомобиля."
    },
    {
      question: "Как происходит оплата?",
      answer: "Оплата происходит поэтапно: предоплата при заказе, оплата после подтверждения наличия автомобиля, таможенные и прочие расходные платежи осуществляются по мере движения автомобиля. Мы принимаем оплату банковским переводом. Все расчеты прозрачны и фиксируются в договоре."
    }
  ];

  // Структурированные данные для FAQPage
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>
      
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Часто задаваемые вопросы
        </h2>
        
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden transition-all hover:shadow-md"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-600 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
