import { useState, useEffect } from 'react';

/**
 * Filters component - displays all search filters
 */
export default function Filters({ value, onChange, onSearch, options, loading }) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  const update = (field, val) => {
    const next = { ...local, [field]: val };
    
    // Reset model when brand changes
    if (field === 'brandname') {
      next.seriesname = '';
    }
    
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <h2 className="text-xl font-bold text-gray-800">Фильтры поиска</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Бренд</label>
          <select 
            className="select" 
            value={local.brandname || ''} 
            onChange={e => update('brandname', e.target.value)}
            disabled={options.loadingBrands}
          >
            <option value="">{options.loadingBrands ? 'Загрузка...' : 'Все бренды'}</option>
            {options.brands && options.brands.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        
        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Модель</label>
          <select 
            className="select" 
            value={local.seriesname || ''} 
            onChange={e => update('seriesname', e.target.value)}
            disabled={!local.brandname || options.loadingModels}
          >
            <option value="">
              {!local.brandname ? 'Выберите бренд' : (options.loadingModels ? 'Загрузка...' : 'Все модели')}
            </option>
            {options.models && options.models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Год</label>
          <div className="flex gap-2">
            <select 
              className="select flex-1" 
              value={local.year_from || ''} 
              onChange={e => update('year_from', e.target.value)}
            >
              <option value="">От</option>
              {options.years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select 
              className="select flex-1" 
              value={local.year_to || ''} 
              onChange={e => update('year_to', e.target.value)}
            >
              <option value="">До</option>
              {options.years.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Цена (₽)</label>
          <div className="flex gap-2">
            <select 
              className="select flex-1" 
              value={local.total_price_rub_min || ''} 
              onChange={e => update('total_price_rub_min', e.target.value)}
            >
              <option value="">От</option>
              {options.prices.map(v => (
                <option key={v} value={v}>{(v / 1000000).toFixed(1)} млн</option>
              ))}
            </select>
            <select 
              className="select flex-1" 
              value={local.total_price_rub_max || ''} 
              onChange={e => update('total_price_rub_max', e.target.value)}
            >
              <option value="">До</option>
              {options.prices.map(v => (
                <option key={v} value={v}>{(v / 1000000).toFixed(1)} млн</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пробег (км)</label>
          <div className="flex gap-2">
            <select 
              className="select flex-1" 
              value={local.mileage_from || ''} 
              onChange={e => update('mileage_from', e.target.value)}
            >
              <option value="">От</option>
              {options.mileages.map(v => (
                <option key={v} value={v}>{v.toLocaleString('ru-RU')}</option>
              ))}
            </select>
            <select 
              className="select flex-1" 
              value={local.mileage_to || ''} 
              onChange={e => update('mileage_to', e.target.value)}
            >
              <option value="">До</option>
              {options.mileages.map(v => (
                <option key={v} value={v}>{v.toLocaleString('ru-RU')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Тип топлива</label>
          <select 
            className="select" 
            value={local.fuel_type || ''} 
            onChange={e => update('fuel_type', e.target.value)}
          >
            <option value="">Все типы</option>
            {options.fuelTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Engine Volume */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Объем двигателя (мл)</label>
          <div className="flex gap-2">
            <select 
              className="select flex-1" 
              value={local.engine_volume_from || ''} 
              onChange={e => update('engine_volume_from', e.target.value)}
            >
              <option value="">От</option>
              {options.engineVolumes.map(v => (
                <option key={v} value={v}>{(v/1000).toFixed(1)}L</option>
              ))}
            </select>
            <select 
              className="select flex-1" 
              value={local.engine_volume_to || ''} 
              onChange={e => update('engine_volume_to', e.target.value)}
            >
              <option value="">До</option>
              {options.engineVolumes.map(v => (
                <option key={v} value={v}>{(v/1000).toFixed(1)}L</option>
              ))}
            </select>
          </div>
        </div>

        {/* Power */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Мощность (кВт)</label>
          <div className="flex gap-2">
            <select 
              className="select flex-1" 
              value={local.power_from || ''} 
              onChange={e => update('power_from', e.target.value)}
            >
              <option value="">От</option>
              {options.powers.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <select 
              className="select flex-1" 
              value={local.power_to || ''} 
              onChange={e => update('power_to', e.target.value)}
            >
              <option value="">До</option>
              {options.powers.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4 border-t border-gray-200">
        <button
          className="px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={() => {
            const empty = Object.keys(value).reduce((acc, key) => ({ ...acc, [key]: '' }), {});
            setLocal(empty);
            onChange(empty);
          }}
          disabled={loading}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Сбросить
        </button>
        <button 
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onSearch}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Поиск...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Найти автомобили
            </>
          )}
        </button>
      </div>
    </div>
  );
}
