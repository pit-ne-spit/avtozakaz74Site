import { useEffect, useState } from 'react';
import Filters from './components/Filters';
import CarCard from './components/CarCard';
import Pagination from './components/Pagination';
import CarDetailModal from './components/CarDetailModal';
import { fetchCars, fetchAvailableFilters } from './lib/api';
import './index.css';

// Default filter values
const defaultFilters = {
  brandname: '',
  seriesname: '',
  year_from: '',
  year_to: '',
  fuel_type: '',
  total_price_rub_min: '',
  total_price_rub_max: '',
  mileage_from: '',
  mileage_to: '',
  engine_volume_from: '',
  engine_volume_to: '',
  power_from: '',
  power_to: '',
};

// Static options for dropdowns
const staticOptions = {
  fuelTypes: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'],
  
  // Year options: 2005-2026
  yearsFrom: Array.from({ length: 22 }, (_, i) => 2026 - i).reverse(), // 2005-2026
  yearsTo: Array.from({ length: 22 }, (_, i) => 2026 - i).reverse(), // 2005-2026
  
  // Price options in rubles
  pricesFrom: [1000000, 1500000, 2000000, 2500000, 3000000],
  pricesTo: [1500000, 2000000, 2500000, 3000000, 4000000],
  
  // Engine volume options in liters
  // 0.5-2.0 with 0.1 step, then 2.5-4.0 with 0.5 step
  engineVolumesFrom: [
    ...Array.from({ length: 16 }, (_, i) => +(0.5 + i * 0.1).toFixed(1)), // 0.5-2.0
    2.5, 3.0, 3.5, 4.0
  ],
  engineVolumesTo: [
    ...Array.from({ length: 16 }, (_, i) => +(0.5 + i * 0.1).toFixed(1)), // 0.5-2.0
    2.5, 3.0, 3.5, 4.0
  ],
  
  // Mileage options in km
  // 0-100k with 10k step, 100k-200k with 20k step
  mileagesFrom: [
    ...Array.from({ length: 11 }, (_, i) => i * 10000), // 0-100k
    120000, 140000, 160000, 180000, 200000
  ],
  mileagesTo: [
    ...Array.from({ length: 11 }, (_, i) => i * 10000), // 0-100k
    120000, 140000, 160000, 180000, 200000
  ],
  
  // Power options in HP
  // 70-160 with 10 step, then 190-310 with 30 step
  powersFrom: [
    ...Array.from({ length: 10 }, (_, i) => 70 + i * 10), // 70-160
    190, 220, 250, 280, 310
  ],
  powersTo: [
    ...Array.from({ length: 10 }, (_, i) => 70 + i * 10), // 70-160
    190, 220, 250, 280, 310
  ],
};

export default function App() {
  const [filters, setFilters] = useState(defaultFilters);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  
  // Dynamic filter options
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const pageSize = 10;

  const load = async (pageNum = 1, filterValues = filters) => {
    setLoading(true);
    setError('');
    
    try {
      // Calculate offset from page number
      const offset = (pageNum - 1) * pageSize;
      
      // Build params - only include non-empty values
      const params = {
        limit: pageSize,
        offset: offset,
      };
      
      // Add filters with conversions
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== '' && value != null) {
          // Convert engine volume from liters to milliliters
          if (key === 'engine_volume_from' || key === 'engine_volume_to') {
            params[key] = Math.round(parseFloat(value) * 1000);
          }
          // Convert power from HP to kW (HP / 1.36)
          else if (key === 'power_from' || key === 'power_to') {
            params[key] = Math.round(parseFloat(value) / 1.36);
          }
          else {
            params[key] = value;
          }
        }
      });

      const data = await fetchCars(params);
      
      // Handle response format from API
      const carsArray = data.cars || [];
      const totalCount = data.total || 0;
      
      // Update exchange rate from API response
      if (data.rates && data.rates.CNY) {
        setExchangeRate(data.rates.CNY);
      }
      
      setItems(carsArray);
      setTotal(totalCount);
      setPage(pageNum);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Error fetching cars:', e);
      setError(e.message || 'Ошибка при загрузке данных. Попробуйте еще раз.');
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };


  // Load brands on mount
  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoadingBrands(true);
        const brandList = await fetchAvailableFilters('brandname', {}, 200);
        setBrands(brandList);
      } catch (err) {
        console.error('Error loading brands:', err);
      } finally {
        setLoadingBrands(false);
      }
    };
    
    loadBrands();
  }, []);
  
  // Load models when brand changes
  useEffect(() => {
    const loadModels = async () => {
      if (!filters.brandname) {
        setModels([]);
        return;
      }
      
      try {
        setLoadingModels(true);
        const modelList = await fetchAvailableFilters('seriesname', {
          brandname: [filters.brandname]
        }, 200);
        setModels(modelList);
      } catch (err) {
        console.error('Error loading models:', err);
      } finally {
        setLoadingModels(false);
      }
    };
    
    loadModels();
  }, [filters.brandname]);
  
  // Load initial data
  useEffect(() => {
    load(1, defaultFilters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    load(1, filters);
  };

  const handlePageChange = (newPage) => {
    load(newPage, filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <img 
                src="/logo.png" 
                alt="АвтоЗаказ3 74 Logo" 
                className="h-20 w-auto object-contain drop-shadow-2xl"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  АвтоЗаказ3 74
                </h1>
                <p className="text-blue-100 text-sm mt-1.5 font-medium">
                  🚗 Покупаем и доставляем авто из Китая, Японии и Кореи
                </p>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-2 text-white text-sm">
              <a href="tel:+79026142503" className="hover:text-blue-200 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +7 902 614-25-03 (Дмитрий)
              </a>
              <a href="tel:+79193028913" className="hover:text-blue-200 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +7 919 302-89-13 (Максим)
              </a>
              <a href="tel:+79514502225" className="hover:text-blue-200 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +7 951 450-22-25 (Максим)
              </a>
              <a href="https://t.me/avtozakaz74" target="_blank" rel="noopener noreferrer" className="hover:text-blue-200 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.183-.612-.6.125-.89l10.782-4.156c.5-.18.943.11.78.89z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Filters */}
        <Filters
          value={filters}
          onChange={setFilters}
          onSearch={handleSearch}
          options={{
            ...staticOptions,
            brands,
            models,
            loadingBrands,
            loadingModels
          }}
          loading={loading}
        />

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium">Произошла ошибка</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                  onClick={() => load(page, filters)}
                  className="text-sm underline mt-2 hover:text-red-800"
                >
                  Повторить попытку
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Загрузка объявлений...</p>
          </div>
        )}

        {/* Results count */}
        {!loading && !error && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-white/50 px-5 py-4 flex items-center justify-between hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">
                Найдено <span className="font-bold text-blue-600 text-xl">{total.toLocaleString()}</span> автомобилей
              </span>
            </div>
            <div className="text-sm text-gray-500 font-medium">
              Страница {page} из {Math.ceil(total / pageSize)}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Объявления не найдены
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Попробуйте изменить параметры фильтра
            </p>
          </div>
        )}

        {/* Cars grid */}
        {!loading && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {items.map((car) => (
                <CarCard 
                  key={car.infoid} 
                  car={car}
                  exchangeRate={exchangeRate}
                  onClick={() => setSelectedCarId(car.infoid)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              page={page}
              total={total}
              pageSize={pageSize}
              onChange={handlePageChange}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 mt-16 shadow-2xl">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                О компании
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Покупаем и доставляем авто из Китая, Японии и Кореи. Работаем напрямую с экспортными компаниями.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Контакты
              </h3>
              <div className="space-y-2 text-sm">
                <a href="tel:+79026142503" className="text-gray-300 hover:text-blue-400 transition-colors block">
                  +7 902 614-25-03 (Дмитрий)
                </a>
                <a href="tel:+79193028913" className="text-gray-300 hover:text-blue-400 transition-colors block">
                  +7 919 302-89-13 (Максим)
                </a>
                <a href="tel:+79514502225" className="text-gray-300 hover:text-blue-400 transition-colors block">
                  +7 951 450-22-25 (Максим)
                </a>
                <a href="https://t.me/avtozakaz74" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-400 transition-colors block flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.68c.223-.198-.054-.308-.346-.11l-6.4 4.03-2.76-.918c-.6-.183-.612-.6.125-.89l10.782-4.156c.5-.18.943.11.78.89z"/>
                  </svg>
                  Telegram-группа
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
                База данных
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {total.toLocaleString()} автомобилей
                </p>
                <p className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                  Ежедневное обновление
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">&copy; 2025 АвтоЗаказ3 74. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Car Detail Modal */}
      {selectedCarId && (
        <CarDetailModal 
          carId={selectedCarId}
          exchangeRate={exchangeRate}
          onClose={() => setSelectedCarId(null)}
        />
      )}
    </div>
  );
}
