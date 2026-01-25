/**
 * Currency utilities for che168 API
 * API provides exchange rates and calculated prices
 */

/**
 * Format price using data from API
 * API provides total_price_rub with all fees included
 * 
 * @param {object} car - Car object from API
 * @returns {object} Formatted price data
 */
export function calculateFullPrice(car) {
  if (!car || !car.total_price_rub) {
    return {
      total: null,
      totalFormatted: 'Цена не указана',
      breakdown: null
    };
  }

  const totalRub = car.total_price_rub;
  const totalFormatted = `${(totalRub / 1000000).toFixed(2)} млн ₽`;
  
  return {
    total: totalRub,
    totalFormatted,
    breakdown: {
      baseCny: car.price_cny,
      totalRub: totalRub,
      customsFee: car.customs_fee_rub || 0,
      recyclingFee: car.recycling_fee_rub || 0,
      importDuty: car.import_duty || 0
    }
  };
}

/**
 * Format price breakdown for display
 */
export function formatPriceBreakdown(breakdown) {
  if (!breakdown) return null;
  
  const fmt = (num) => new Intl.NumberFormat('ru-RU').format(Math.round(num));
  
  return {
    steps: [
      {
        label: 'Цена автомобиля',
        value: `¥${fmt(breakdown.baseCny)}`
      },
      {
        label: 'Таможенная пошлина',
        value: `${fmt(breakdown.customsFee)} ₽`
      },
      {
        label: 'Утилизационный сбор',
        value: `${fmt(breakdown.recyclingFee)} ₽`
      },
      {
        label: 'ИТОГО',
        value: `${fmt(breakdown.totalRub)} ₽`,
        isTotal: true
      }
    ],
    total: `${fmt(breakdown.totalRub)} ₽`,
    totalShort: `${(breakdown.totalRub / 1000000).toFixed(2)} млн ₽`
  };
}
