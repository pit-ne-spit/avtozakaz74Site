import { useState, useEffect } from 'react';
import { fetchCarById } from '../lib/api';
import { calculateFullPrice, formatPriceBreakdown } from '../lib/currency';
import { translateColor } from '../lib/colorTranslations';
import { apiFuelTypeToDetailedCategory } from '../lib/fuelTypes';

/**
 * Modal component for displaying car details
 * @param {Object} car - Car object from search_car API (contains pricing info)
 * @param {Object} exchangeRates - Exchange rates (CNY and EUR)
 * @param {Function} onClose - Close modal callback
 */
export default function CarDetailModal({ car, exchangeRates, onClose }) {
  const [carDetails, setCarDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  useEffect(() => {
    const loadCarDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCarById(car.infoid);
        setCarDetails(data);
      } catch (err) {
        console.error('Error loading car details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (car && car.infoid) {
      loadCarDetails();
    }
  }, [car]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Parse photos from get_car_info API
  const photos = carDetails?.media_support?.photos || [];

  // Photos already have full URLs
  const photoUrls = photos;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photoUrls.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photoUrls.length) % photoUrls.length);
  };

  // Calculate full price using financial data from search_car
  // car object contains: price_cny, import_duty, customs_fee_rub, recycling_fee_rub
  const priceData = car ? calculateFullPrice(
    car.price_cny, 
    exchangeRates.CNY,
    {
      import_duty: car.import_duty,
      customs_fee_rub: car.customs_fee_rub,
      recycling_fee_rub: car.recycling_fee_rub
    },
    exchangeRates.EUR
  ) : { totalFormatted: 'Загрузка...', breakdown: null };
  const breakdown = priceData.breakdown ? formatPriceBreakdown(priceData.breakdown) : null;
  
  // Translate color from get_car_info API
  const colorRu = carDetails?.vehicle_info?.colorname ? translateColor(carDetails.vehicle_info.colorname) : '';
  
  // Format first registration date from YYYY-MM-DD to DD.MM.YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  };
  
  // Format publication date: "today"/"Today" -> "Сегодня", "YYYY-MM-DD" -> "DD.MM.YYYY"
  const formatPublicDate = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'today') {
      return 'Сегодня';
    }
    return formatDate(dateStr);
  };
  
  // Translate fuel type to Russian with detailed hybrid categories
  const fuelTypeRu = carDetails?.technical_specs?.fuelname ? apiFuelTypeToDetailedCategory(carDetails.technical_specs.fuelname) : '';

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

        {carDetails && !loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {/* Photo Gallery */}
            <div className="space-y-4">
              <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[4/3]">
                {photoUrls.length > 0 ? (
                  <>
                    <img
                      src={photoUrls[currentPhotoIndex]}
                      alt={carDetails.vehicle_info?.carname || `${carDetails.vehicle_info?.brandname} ${carDetails.vehicle_info?.seriesname}`}
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

              {/* Seller's remarks */}
              {carDetails.history_condition?.remark && (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-sm text-amber-700 font-semibold">Примечания продавца</div>
                        <div className="group relative">
                          <svg className="w-4 h-4 text-amber-600 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                          </svg>
                          <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 shadow-lg">
                            Для перевода выделите текст и нажмите правую кнопку мыши
                            <div className="absolute -top-1 left-2 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-line select-text">{carDetails.history_condition.remark}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Car Details */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {carDetails.vehicle_info?.carname || car.carname || `${car.brandname} ${car.seriesname}`}
                </h2>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                      {carDetails.vehicle_info?.firstregyear || car.firstregyear}
                    </span>
                    {colorRu && (
                      <span className="text-gray-600">• {colorRu}</span>
                    )}
                  </div>
                  {carDetails.vehicle_info?.publicdate && (
                    <div className="text-sm text-gray-500">
                      Опубликовано: <span className="font-medium text-gray-700">{formatPublicDate(carDetails.vehicle_info.publicdate)}</span>
                    </div>
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
                          {step.subValue && (
                            <div className="text-xs text-gray-500 mt-0.5">{step.subValue}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="text-xs text-gray-500 mt-3 pt-3 border-t border-green-200 space-y-1">
                      <div>* Курс CNY: 1 ¥ = {breakdown.rateCny.toFixed(2)} ₽</div>
                      <div>* Курс EUR: 1 € = {breakdown.rateEur.toFixed(2)} ₽</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-gray-800">Характеристики</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {(carDetails.vehicle_info?.mileage || car.mileage) && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Пробег</div>
                        <div className="font-semibold text-gray-900">
                          {new Intl.NumberFormat('ru-RU').format((carDetails.vehicle_info?.mileage || car.mileage) * (carDetails.vehicle_info?.mileage ? 10000 : 1))} км
                        </div>
                      </div>
                    </div>
                  )}

                  {carDetails.technical_specs?.gearbox && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">КПП</div>
                        <div className="font-semibold text-gray-900">{carDetails.technical_specs.gearbox}</div>
                      </div>
                    </div>
                  )}

                  {carDetails.vehicle_info?.firstregshortdate && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Дата первой регистрации</div>
                        <div className="font-semibold text-gray-900">{formatDate(carDetails.vehicle_info.firstregshortdate)}</div>
                      </div>
                    </div>
                  )}

                  {fuelTypeRu && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Тип топлива</div>
                        <div className="font-semibold text-gray-900">{fuelTypeRu}</div>
                      </div>
                    </div>
                  )}

                  {carDetails.technical_specs?.engine && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Двигатель</div>
                        <div className="font-semibold text-gray-900">{carDetails.technical_specs.engine}</div>
                      </div>
                    </div>
                  )}

                  {carDetails.vehicle_info?.cname && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Город</div>
                        <div className="font-semibold text-gray-900">{carDetails.vehicle_info.cname}</div>
                      </div>
                    </div>
                  )}

                  {carDetails.technical_specs?.drivingmode && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Привод</div>
                        <div className="font-semibold text-gray-900">{carDetails.technical_specs.drivingmode}</div>
                      </div>
                    </div>
                  )}

                  {carDetails.technical_specs?.wltc_fuelconsumption && (
                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <div>
                        <div className="text-xs text-gray-500">Расход топлива по WLTC</div>
                        <div className="font-semibold text-gray-900">{carDetails.technical_specs.wltc_fuelconsumption} л/100км</div>
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
