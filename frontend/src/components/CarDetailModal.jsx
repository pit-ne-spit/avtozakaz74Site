import { useState, useEffect } from 'react';
import { fetchCarById } from '../lib/api';
import { calculateFullPrice, formatPriceBreakdown } from '../lib/currency';

/**
 * Modal component for displaying car details
 */
export default function CarDetailModal({ carId, exchangeRate, onClose }) {
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    const loadCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCarById(carId);
        setCar(data);
      } catch (err) {
        console.error('Error loading car details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      loadCarDetails();
    }
  }, [carId]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Parse photos
  const photos = car?.photos ? (
    typeof car.photos === 'string' ? JSON.parse(car.photos) : car.photos
  ) : [];

  // Add https:// to photos
  const photoUrls = photos.map(url => 
    url && url.startsWith('//') ? `https:${url}` : url
  );

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photoUrls.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photoUrls.length) % photoUrls.length);
  };

  // Calculate full price
  const priceData = car ? calculateFullPrice(car.price, exchangeRate) : { totalFormatted: 'Загрузка...', breakdown: null };
  const breakdown = priceData.breakdown ? formatPriceBreakdown(priceData.breakdown) : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="p-8 text-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button onClick={onClose} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">
              Закрыть
            </button>
          </div>
        )}

        {car && !loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Photo Gallery */}
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/3]">
                {photoUrls.length > 0 ? (
                  <>
                    <img
                      src={photoUrls[currentPhotoIndex]}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
                    />
                    
                    {photoUrls.length > 1 && (
                      <>
                        {/* Previous button */}
                        <button
                          onClick={prevPhoto}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next button */}
                        <button
                          onClick={nextPhoto}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* Photo counter */}
                        <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                          {currentPhotoIndex + 1} / {photoUrls.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Нет фотографий
                  </div>
                )}
              </div>

              {/* Thumbnail gallery */}
              {photoUrls.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {photoUrls.slice(0, 10).map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhotoIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        idx === currentPhotoIndex ? 'border-blue-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {car.brand} {car.model}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    {car.year}
                  </span>
                  {car.color_en && (
                    <span className="text-gray-600">• {car.color_en}</span>
                  )}
                </div>
              </div>

              {/* Price with breakdown */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-600">Полная стоимость в России</div>
                  {breakdown && (
                    <button
                      onClick={() => setShowBreakdown(!showBreakdown)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium"
                    >
                      <svg className={`w-4 h-4 transition-transform ${showBreakdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      {showBreakdown ? 'Скрыть расчёт' : 'Подробный расчёт'}
                    </button>
                  )}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {priceData.totalFormatted}
                </div>
                
                {/* Detailed breakdown */}
                {showBreakdown && breakdown && (
                  <div className="mt-4 pt-4 border-t border-green-200 space-y-2.5">
                    {breakdown.steps.map((step, idx) => (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-start ${
                          step.isTotal ? 'pt-3 border-t-2 border-green-300' : 
                          step.isSubtotal ? 'pt-2 border-t border-green-200' : ''
                        }`}
                      >
                        <span className={`text-sm ${
                          step.isTotal ? 'font-bold text-gray-900 text-base' : 
                          step.isSubtotal ? 'font-semibold text-gray-800' : 
                          'text-gray-600'
                        }`}>
                          {step.label}
                        </span>
                        <div className="text-right">
                          <div className={`${
                            step.isTotal ? 'font-bold text-green-700 text-base' : 
                            step.isSubtotal ? 'font-semibold text-green-700' : 
                            'text-gray-700'
                          }`}>
                            {step.value}
                          </div>
                          {step.rubValue && (
                            <div className="text-xs text-gray-500 mt-0.5">{step.rubValue}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-green-200">
                      * Курс: 1 CNY = {priceData.breakdown.rate.toFixed(2)} ₽
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800">Характеристики</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {car.mileage && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Пробег</div>
                        <div className="font-semibold text-gray-900">
                          {new Intl.NumberFormat('ru-RU').format(car.mileage)} км
                        </div>
                      </div>
                    </div>
                  )}

                  {car.transmission && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">КПП</div>
                        <div className="font-semibold text-gray-900">{car.transmission}</div>
                      </div>
                    </div>
                  )}

                  {car.body_type && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Тип кузова</div>
                        <div className="font-semibold text-gray-900">{car.body_type}</div>
                      </div>
                    </div>
                  )}

                  {car.engine_displacement && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Объем двигателя</div>
                        <div className="font-semibold text-gray-900">{car.engine_displacement}L</div>
                      </div>
                    </div>
                  )}

                  {car.horsepower && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Мощность</div>
                        <div className="font-semibold text-gray-900">{car.horsepower} л.с.</div>
                      </div>
                    </div>
                  )}

                  {car.city_en && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Город</div>
                        <div className="font-semibold text-gray-900">{car.city_en}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Связаться с нами
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
