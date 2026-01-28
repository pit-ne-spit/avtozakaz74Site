import { calculateFullPrice } from '../lib/currency';
import { apiFuelTypeToCategory } from '../lib/fuelTypes';

/**
 * Car card component - displays single car listing
 */
export default function CarCard({ car, exchangeRates, onClick }) {
  // Get image URL (single image from API)
  let imageUrl = car.imageurl || '/placeholder-car.jpg';
  if (imageUrl && imageUrl.startsWith('//')) {
    imageUrl = 'https:' + imageUrl;
  }

  // Calculate full price with all fees
  const priceData = calculateFullPrice(
    car.price_cny, 
    exchangeRates.CNY, 
    {
      import_duty: car.import_duty,
      customs_fee_rub: car.customs_fee_rub,
      recycling_fee_rub: car.recycling_fee_rub
    },
    exchangeRates.EUR
  );

  return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Image with overlay badge */}
      <div className="relative overflow-hidden">
        <img 
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" 
          src={imageUrl} 
          alt={car.carname || `${car.brandname} ${car.seriesname}`}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
        />
        {/* Year badge */}
        {car.firstregyear && (
          <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {car.firstregyear}
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Car name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate group-hover:text-blue-600 transition-colors">
          {car.carname || `${car.brandname} ${car.seriesname}`}
        </h3>
        
        {/* Price - prominent */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-4 py-3 mb-3">
          <div className="text-xs text-gray-600 mb-1">Полная стоимость в России</div>
          <div className="text-2xl font-bold text-green-600">
            {priceData.totalFormatted}
          </div>
        </div>
        
        {/* Specs grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {car.mileage && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="truncate">{car.mileage.toLocaleString('ru-RU')} км</span>
            </div>
          )}
          {car.fuel_type && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="truncate">{apiFuelTypeToCategory(car.fuel_type)}</span>
            </div>
          )}
          {car.engine_volume_ml && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <span className="truncate">{(car.engine_volume_ml / 1000).toFixed(1)}L</span>
            </div>
          )}
          {car.power_kw && (
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="truncate">{Math.round(car.power_kw * 1.3596)} л.с.</span>
            </div>
          )}
        </div>

        {/* View button */}
        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
          Подробнее →
        </button>
      </div>
    </div>
  );
}
