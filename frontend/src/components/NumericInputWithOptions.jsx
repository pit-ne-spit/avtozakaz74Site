/**
 * NumericInputWithOptions - Numeric input with dropdown suggestions using datalist
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
  const id = `numeric-input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative">
      <input
        type="number"
        list={id}
        className="select flex-1"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
      <datalist id={id}>
        {options.map((opt, idx) => (
          <option key={idx} value={opt} label={formatOption(opt)} />
        ))}
      </datalist>
    </div>
  );
}
