import { useState, useRef, useEffect } from 'react';

/**
 * MultiSearchableSelect - Dropdown component with multiple selection and text search filtering
 */
export default function MultiSearchableSelect({ 
  value = [], 
  onChange, 
  options = [], 
  placeholder = 'Выберите...', 
  disabled = false,
  loading = false 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Ensure value is always an array
  const selectedValues = Array.isArray(value) ? value : (value ? [value] : []);

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get display text
  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;
    if (selectedValues.length === 1) return selectedValues[0];
    return `Выбрано: ${selectedValues.length}`;
  };

  const handleToggle = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange([]);
    setSearchTerm('');
  };

  const handleRemoveTag = (e, optionToRemove) => {
    e.stopPropagation();
    const newValues = selectedValues.filter(v => v !== optionToRemove);
    onChange(newValues);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled && !loading) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 100);
            }
          }
        }}
        disabled={disabled || loading}
        className={`select w-full flex items-start justify-between gap-2 min-h-[42px] ${
          disabled || loading ? 'opacity-60 cursor-not-allowed' : ''
        } ${selectedValues.length > 1 ? 'py-1.5' : ''}`}
      >
        <div className="flex-1 flex flex-wrap gap-1.5 items-center">
          {selectedValues.length === 0 ? (
            <span className="text-gray-500">
              {loading ? 'Загрузка...' : placeholder}
            </span>
          ) : selectedValues.length === 1 ? (
            <span className="text-gray-900">{selectedValues[0]}</span>
          ) : (
            selectedValues.map(val => (
              <span
                key={val}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded"
              >
                {val}
                <svg
                  onClick={(e) => handleRemoveTag(e, val)}
                  className="w-3 h-3 hover:text-blue-900 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            ))
          )}
        </div>
        {selectedValues.length > 0 && !disabled && !loading && (
          <svg
            onClick={handleClear}
            className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Поиск..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-64 overflow-y-auto">
            {/* Clear all option */}
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full px-4 py-2.5 text-left bg-red-50 hover:bg-red-100 text-red-700 font-medium transition-colors text-sm border-b border-gray-100"
              >
                ✕ Очистить все
              </button>
            )}

            {/* Filtered options */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleToggle(option)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors text-sm flex items-center gap-2 ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {/* Checkbox */}
                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span>{option}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                Ничего не найдено
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
