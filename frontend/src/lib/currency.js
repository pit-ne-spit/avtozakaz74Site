/**
 * Currency utilities for che168 API
 * Calculates full price with all fees according to business logic
 */

import { validateAndRecalculateImportDuty } from './customsDuty';

/**
 * Calculate full price with all fees
 * 
 * Formula:
 * - Цена автомобиля в Китае = price_cny * rate_CNY
 * - Единая ставка налога = import_duty_eur * rate_EUR (конвертация из EUR в RUB)
 * - Таможенное оформление = customs_fee_rub
 * - Утилизационный сбор = recycling_fee_rub
 * - Импорт из Китая в Россию = 15000 * rate_CNY
 * - Оформление = 75 000 руб
 * - Комиссия компании = 100 000 руб
 * - Доставка Челябинск/Москва = 200 000 руб
 * 
 * @param {number} priceCny - Price in CNY from API
 * @param {number} exchangeRateCny - CNY to RUB exchange rate
 * @param {object} fees - Object with import_duty (EUR), customs_fee_rub, recycling_fee_rub
 * @param {number} exchangeRateEur - EUR to RUB exchange rate
 * @param {object} car - Full car object for validation (optional)
 * @returns {object} Formatted price data with breakdown
 */
export function calculateFullPrice(priceCny, exchangeRateCny, fees = {}, exchangeRateEur = 0, car = null) {
  if (!priceCny || !exchangeRateCny) {
    return {
      total: null,
      totalFormatted: 'Цена не указана',
      breakdown: null
    };
  }

  // Валидация и пересчёт таможенной пошлины
  let importDutyEur = fees.import_duty || 0;
  let dutyRecalculated = false;
  
  if (car && car.firstregshortdate && car.engine_volume_ml) {
    const validation = validateAndRecalculateImportDuty(car, {
      CNY: exchangeRateCny,
      EUR: exchangeRateEur
    });
    
    importDutyEur = validation.import_duty_eur;
    dutyRecalculated = validation.recalculated;
  }
  
  // Расчёт составляющих
  const priceInRub = priceCny * exchangeRateCny;
  const importDutyRub = importDutyEur * exchangeRateEur; // Конвертация EUR → RUB
  const customsFee = fees.customs_fee_rub || 0;
  const recyclingFee = fees.recycling_fee_rub || 0;
  const chinaServices = 15000 * exchangeRateCny;
  const brokerServices = 75000;
  const commission = 100000;
  const deliveryFee = 200000;
  
  // Итоговая стоимость
  const totalRub = priceInRub + importDutyRub + customsFee + recyclingFee + chinaServices + brokerServices + commission + deliveryFee;
  const totalFormatted = `${(totalRub / 1000000).toFixed(2)} млн ₽`;
  
  return {
    total: totalRub,
    totalFormatted,
    breakdown: {
      priceCny: priceCny,
      priceInRub: priceInRub,
      importDutyEur: importDutyEur,
      importDutyRub: importDutyRub,
      customsFee: customsFee,
      recyclingFee: recyclingFee,
      chinaServices: chinaServices,
      brokerServices: brokerServices,
      commission: commission,
      deliveryFee: deliveryFee,
      totalRub: totalRub,
      rateCny: exchangeRateCny,
      rateEur: exchangeRateEur
    }
  };
}

/**
 * Format price breakdown for display
 * @param {object} breakdown - Breakdown from calculateFullPrice
 * @returns {object} Formatted breakdown for UI
 */
export function formatPriceBreakdown(breakdown) {
  if (!breakdown) return null;
  
  const fmt = (num) => new Intl.NumberFormat('ru-RU').format(Math.round(num));
  const fmtCny = (num) => new Intl.NumberFormat('ru-RU').format(Math.round(num));
  
  // Сумма таможенных платежей
  const customsTotal = breakdown.importDutyRub + breakdown.customsFee;
  
  return {
    steps: [
      {
        label: 'Цена автомобиля в Китае',
        value: `${fmt(breakdown.priceInRub)} ₽`,
        subValue: `¥${fmtCny(breakdown.priceCny)}`
      },
      {
        label: 'Таможенные платежи',
        value: `${fmt(customsTotal)} ₽`,
        subValues: [
          `Единая ставка налога: ${fmt(breakdown.importDutyRub)} ₽`,
          `Таможенное оформление: ${fmt(breakdown.customsFee)} ₽`
        ]
      },
      {
        label: 'Утилизационный сбор',
        value: `${fmt(breakdown.recyclingFee)} ₽`
      },
      {
        label: 'Импорт из Китая в Россию',
        value: `${fmt(breakdown.chinaServices)} ₽`,
        subValue: `¥15 000`
      },
      {
        label: 'Оформление',
        value: `${fmt(breakdown.brokerServices)} ₽`
      },
      {
        label: 'Комиссия компании',
        value: `${fmt(breakdown.commission)} ₽`
      },
      {
        label: 'Доставка Челябинск/Москва',
        value: `${fmt(breakdown.deliveryFee)} ₽`
      },
      {
        label: 'ОРИЕНТИРОВОЧНАЯ СТОИМОСТЬ В РОССИИ',
        value: `${fmt(breakdown.totalRub)} ₽`,
        isTotal: true,
        hasAsterisk: true
      }
    ],
    rateCny: breakdown.rateCny,
    rateEur: breakdown.rateEur
  };
}
