import { Link } from 'react-router-dom';
import { apiFuelTypeToCategory } from '../lib/fuelTypes';
import { getDisplayBrandName } from '../lib/brandMapping';
import OptimizedImage from './OptimizedImage';
import { formatDromPriceBreakdown } from '../lib/currency';

/**
 * Car card component - displays single car listing
 */
export default function CarCard({ car, exchangeRates }) {
  // Get image URL (single image from API)
  let imageUrl = car.imageurl || '/placeholder-car.jpg';
  if (imageUrl && imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }
  
  // Get display brand name
  const displayBrandName = getDisplayBrandName(car.brandname);

  // Get new price from drom.ru API calculation (if available)
  const dromDetails = car.drom_price_calculation?.details;
  const dromBreakdown = dromDetails ? formatDromPriceBreakdown(dromDetails, null, exchangeRates) : null;
  const dromPriceValue = dromBreakdown?.total || null;
  const dromPriceFormatted = dromPriceValue 
    ? `${(dromPriceValue / 1000000).toFixed(2)} млн ₽`
    : null;
  
  // Debug: логирование для проверки данных
  if (car.infoid && (dromPriceFormatted || car.drom_price_calculation)) {
    console.log(`[CarCard] Car ${car.infoid}:`, {
      hasDromCalculation: !!car.drom_price_calculation,
      dromPriceFormatted,
      dromPriceValue
    });
  }

  return (
    <Link
      to={`/car/${car.infoid}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1"
    >
      {/* Image with overlay badge */}
      <div className="relative overflow-hidden">
        <OptimizedImage
          src={imageUrl}
          alt={car.carname || `${displayBrandName} ${car.seriesname}`}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          lazy={true}
        />
        {/* Year badge */}
        {car.firstregyear && (
          <div className="absolute top-3 right-3 bg-blue-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {car.firstregyear}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Car name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-blue-700 transition-colors">
          {car.carname || `${displayBrandName} ${car.seriesname}`}
        </h3>
        
        {/* Price - prominent */}
        {dromPriceFormatted && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-3 mb-3">
            <div className="text-xs text-gray-600 mb-1">Расчетная стоимость в России</div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-extrabold text-blue-600">
                {dromPriceFormatted}
              </div>
            </div>
          </div>
        )}
        
        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {car.mileage && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="truncate">{car.mileage.toLocaleString('ru-RU')} км</span>
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="truncate">{apiFuelTypeToCategory(car.fuel_type)}</span>
            </div>
          )}
          {car.engine_volume_ml && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="truncate">{(car.engine_volume_ml / 1000).toFixed(1)}L</span>
            </div>
          )}
          {car.power_kw && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="truncate">{Math.round(car.power_kw * 1.3596)} л.с.</span>
            </div>
          )}
        </div>

        {/* View button */}
        <div className="w-full mt-4 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-center">
          Подробнее →
        </div>
      </div>
    </Link>
  );
}
