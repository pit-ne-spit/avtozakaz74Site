import { useState, useEffect } from 'react';
import SearchableSelect from './SearchableSelect';
import NumericInputWithOptions from './NumericInputWithOptions';

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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Бренд</label>
          <SearchableSelect
            value={local.brandname || ''}
            onChange={val => update('brandname', val)}
            options={options.brands || []}
            placeholder="Все бренды"
            loading={options.loadingBrands}
            disabled={options.loadingBrands}
          />
        </div>
        
        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Модель</label>
          <SearchableSelect
            value={local.seriesname || ''}
            onChange={val => update('seriesname', val)}
            options={options.models || []}
            placeholder={!local.brandname ? 'Выберите бренд' : 'Все модели'}
            loading={options.loadingModels}
            disabled={!local.brandname || options.loadingModels}
          />
        </div>

        {/* Year Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Год</label>
          <div className="flex gap-2">
            <NumericInputWithOptions
              value={local.year_from}
              onChange={val => update('year_from', val)}
              options={options.yearsFrom || []}
              placeholder="От"
              min={1980}
              max={2026}
              step={1}
            />
            <NumericInputWithOptions
              value={local.year_to}
              onChange={val => update('year_to', val)}
              options={options.yearsTo || []}
              placeholder="До"
              min={1980}
              max={2026}
              step={1}
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена (₽)</label>
          <div className="flex gap-2">
            <NumericInputWithOptions
              value={local.total_price_rub_min}
              onChange={val => update('total_price_rub_min', val)}
              options={options.pricesFrom || []}
              placeholder="От"
              min={0}
              max={50000000}
              step={100000}
              formatOption={v => `${(v / 1000000).toFixed(1)} млн`}
            />
            <NumericInputWithOptions
              value={local.total_price_rub_max}
              onChange={val => update('total_price_rub_max', val)}
              options={options.pricesTo || []}
              placeholder="До"
              min={0}
              max={50000000}
              step={100000}
              formatOption={v => `${(v / 1000000).toFixed(1)} млн`}
            />
          </div>
        </div>

        {/* Mileage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Пробег (км)</label>
          <div className="flex gap-2">
            <NumericInputWithOptions
              value={local.mileage_from}
              onChange={val => update('mileage_from', val)}
              options={options.mileagesFrom || []}
              placeholder="От"
              min={0}
              max={500000}
              step={10000}
            />
            <NumericInputWithOptions
              value={local.mileage_to}
              onChange={val => update('mileage_to', val)}
              options={options.mileagesTo || []}
              placeholder="До"
              min={0}
              max={500000}
              step={10000}
            />
          </div>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Тип топлива</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Объем двигателя (л)</label>
          <div className="flex gap-2">
            <NumericInputWithOptions
              value={local.engine_volume_from}
              onChange={val => update('engine_volume_from', val)}
              options={options.engineVolumesFrom || []}
              placeholder="От"
              min={0.1}
              max={10}
              step={0.1}
              formatOption={v => `${v}L`}
            />
            <NumericInputWithOptions
              value={local.engine_volume_to}
              onChange={val => update('engine_volume_to', val)}
              options={options.engineVolumesTo || []}
              placeholder="До"
              min={0.1}
              max={10}
              step={0.1}
              formatOption={v => `${v}L`}
            />
          </div>
        </div>

        {/* Power */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Мощность (л.с.)</label>
          <div className="flex gap-2">
            <NumericInputWithOptions
              value={local.power_from}
              onChange={val => update('power_from', val)}
              options={options.powersFrom || []}
              placeholder="От"
              min={0}
              max={1000}
              step={10}
              formatOption={v => `${v} л.с.`}
            />
            <NumericInputWithOptions
              value={local.power_to}
              onChange={val => update('power_to', val)}
              options={options.powersTo || []}
              placeholder="До"
              min={0}
              max={1000}
              step={10}
              formatOption={v => `${v} л.с.`}
            />
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
