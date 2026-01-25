import { useEffect, useState } from 'react';
import Filters from './components/Filters';
import CarCard from './components/CarCard';
import Pagination from './components/Pagination';
import CarDetailModal from './components/CarDetailModal';
import { fetchCars } from './lib/api';
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

// Options for dropdowns
const options = {
  brands: ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Toyota', 'Honda', 'Nissan', 'Mazda', 'Lexus', 'Porsche'],
  models: [],
  fuelTypes: ['Gasoline', 'Diesel', 'Electric', 'Hybrid'],
  years: Array.from({ length: 40 }, (_, i) => 2025 - i),
  mileages: [0, 10000, 30000, 50000, 80000, 100000, 150000, 200000, 250000, 300000],
  prices: [1000000, 2000000, 3000000, 4000000, 5000000, 7000000, 10000000],
  engineVolumes: [1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000],
  powers: [50, 75, 100, 150, 200, 250, 300, 400],
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
      
      // Add filters
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value !== '' && value != null) {
          params[key] = value;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.jpg" 
                alt="Logo" 
                className="h-14 w-auto object-contain rounded-lg bg-white p-2 shadow-md"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Заказ автомобилей из Китая
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  🚗 Найдите свой идеальный автомобиль
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-white text-right">
                <div className="text-2xl font-bold">{total.toLocaleString()}</div>
                <div className="text-blue-100 text-sm">авто в базе</div>
              </div>
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
          options={options}
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
          <div className="bg-white rounded-lg shadow-sm px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700">
                Найдено <span className="font-bold text-blue-600 text-lg">{total.toLocaleString()}</span> автомобилей
              </span>
            </div>
            <div className="text-sm text-gray-500">
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
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">О компании</h3>
              <p className="text-gray-400 text-sm">
                Профессиональный подбор и заказ автомобилей из Китая
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">Контакты</h3>
              <p className="text-gray-400 text-sm">
                📧 info@example.com<br/>
                📞 +7 (XXX) XXX-XX-XX
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-2">База данных</h3>
              <p className="text-gray-400 text-sm">
                🚗 {total.toLocaleString()} автомобилей<br/>
                🔄 Ежедневное обновление
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-6 pt-6 text-center">
            <p className="text-gray-400 text-sm">&copy; 2025 Заказ автомобилей из Китая. Все права защищены.</p>
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
