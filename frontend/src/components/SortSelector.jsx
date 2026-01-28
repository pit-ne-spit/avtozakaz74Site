/**
 * Sort selector component - displays sorting options
 */
export default function SortSelector({ sortBy, sortDirection, onChange }) {
  const sortOptions = [
    { value: 'infoid', label: 'По актуальности', apiField: 'infoid' },
    { value: 'total_price_rub', label: 'По цене', apiField: 'total_price_rub' },
    { value: 'firstregyear', label: 'По году', apiField: 'firstregyear' },
    { value: 'mileage', label: 'По пробегу', apiField: 'mileage' },
  ];

  const currentOption = sortOptions.find(opt => opt.apiField === sortBy);
  const isAscending = sortDirection === 'ASC';

  return (
    <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-md">
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      <span className="text-sm font-medium text-gray-700">Сортировка:</span>
      
      <div className="flex gap-2 flex-wrap">
        {sortOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.apiField)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              sortBy === option.apiField
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
            {sortBy === option.apiField && (
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isAscending ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
