/**
 * Filter presets component - quick filter combinations
 */
export default function FilterPresets({ onApplyPreset }) {
  const currentYear = new Date().getFullYear();
  
  const presets = [
    {
      id: 'customs-year',
      label: 'Проходные по годам',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      description: '3-5 лет',
      filters: {
        year_from: currentYear - 5,
        year_to: currentYear - 3,
      }
    },
    {
      id: 'customs-power',
      label: 'Проходные по мощности',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      description: 'До 159 л.с.',
      filters: {
        power_to: 159,
      }
    },
    {
      id: 'german-cars',
      label: 'Немецкие авто',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      description: 'Audi, BMW, Mercedes, VW, Porsche',
      filters: {
        brandname: ['Audi', 'Bmw', 'Mercedes-Benz', 'Volkswagen', 'Porsche', 'Opel', 'Mini'],
      }
    },
    {
      id: 'japanese-cars',
      label: 'Японские авто',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      description: 'Toyota, Honda, Nissan, Mazda, Lexus',
      filters: {
        brandname: ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Lexus', 'Subaru', 'Mitsubishi', 'Suzuki', 'Infiniti', 'Acura'],
      }
    },
  ];

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <span className="text-sm font-semibold text-gray-700">Быстрый выбор:</span>
      </div>
      
      <div className="flex gap-2 md:gap-3 overflow-x-auto md:flex-wrap mt-0 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {presets.map(preset => (
          <button
            key={preset.id}
            onClick={() => onApplyPreset(preset.filters)}
            className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400 rounded-lg px-3 md:px-4 py-2.5 md:py-3 transition-all duration-200 shadow-sm hover:shadow-md touch-manipulation min-h-[48px] flex-shrink-0"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-blue-600 group-hover:text-blue-700 flex-shrink-0">
                {preset.icon}
              </div>
              <div className="text-left whitespace-nowrap">
                <div className="text-xs md:text-sm font-semibold text-gray-800 group-hover:text-blue-700">
                  {preset.label}
                </div>
                <div className="text-[10px] md:text-xs text-gray-600">
                  {preset.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
