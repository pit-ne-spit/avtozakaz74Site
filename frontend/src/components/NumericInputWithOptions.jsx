import { useState, useRef, useEffect } from 'react';

/**
 * NumericInputWithOptions - Numeric input with dropdown suggestions
 */
export default function NumericInputWithOptions({ 
  value, 
  onChange, 
  options = [], 
  placeholder = '', 
  min = 0,
  max,
  step = 1,
  formatOption = (v) => v.toLocaleString('ru-RU')
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <input
        ref={inputRef}
        type="number"
        className="select w-full h-12 md:h-[42px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
      
      {/* Dropdown */}
      {isOpen && options.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[210px] overflow-y-auto">
          {options.map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`w-full px-4 py-3 md:py-2.5 text-left hover:bg-blue-50 transition-colors text-sm min-h-[48px] md:min-h-0 flex items-center ${
                value == opt ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
              }`}
            >
              {formatOption(opt)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
