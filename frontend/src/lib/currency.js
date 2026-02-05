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
        value: `${fmt(customsTotal + breakdown.recyclingFee)} ₽`,
        subValues: [
          `Единая ставка налога: ${fmt(breakdown.importDutyRub)} ₽`,
          `Таможенное оформление: ${fmt(breakdown.customsFee)} ₽`,
          `Утилизационный сбор: ${fmt(breakdown.recyclingFee)} ₽`
        ]
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
        label: 'Доставка по России',
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

/**
 * Format drom.ru price breakdown for display
 * @param {object} dromDetails - Details from drom.ru API
 * @param {number} totalPrice - Total price from drom.ru API
 * @param {object} exchangeRates - Exchange rates {CNY, EUR}
 * @returns {object} Formatted breakdown for UI
 */
export function formatDromPriceBreakdown(dromDetails, totalPrice, exchangeRates = {}) {
  if (!dromDetails) return null;
  
  const fmt = (value) => {
    const num = typeof value === 'string' ? parseInt(value) : value;
    return new Intl.NumberFormat('ru-RU').format(Math.round(num));
  };
  
  const steps = [];
  
  // Цена автомобиля в Китае
  if (dromDetails.PRICE) {
    steps.push({
      label: 'Цена автомобиля в Китае',
      value: `${fmt(dromDetails.PRICE.major.value)} ₽`,
      subValue: dromDetails.PRICE.alt 
        ? `¥${fmt(dromDetails.PRICE.alt.value)}`
        : null
    });
  }
  
  // Таможенные платежи (Единая ставка налога, Таможенное оформление и Утилизационный сбор в subvalues)
  const customsSubValues = [];
  if (dromDetails.CUSTOMS_DUTY) {
    customsSubValues.push(`Единая ставка налога: ${fmt(dromDetails.CUSTOMS_DUTY.major.value)} ₽`);
  }
  if (dromDetails.CUSTOMS_FEE) {
    customsSubValues.push(`Таможенное оформление: ${fmt(dromDetails.CUSTOMS_FEE.major.value)} ₽`);
  }
  if (dromDetails.RECYCLING_FEE) {
    customsSubValues.push(`Утилизационный сбор: ${fmt(dromDetails.RECYCLING_FEE.major.value)} ₽`);
  }
  
  if (customsSubValues.length > 0) {
    // Сумма пошлины, оформления и утилизационного сбора
    const customsTotal = (parseInt(dromDetails.CUSTOMS_DUTY?.major.value || 0) + 
                         parseInt(dromDetails.CUSTOMS_FEE?.major.value || 0) +
                         parseInt(dromDetails.RECYCLING_FEE?.major.value || 0));
    
    steps.push({
      label: 'Таможенные платежи',
      value: `${fmt(customsTotal)} ₽`,
      subValues: customsSubValues
    });
  }
  
  // Импорт из Китая в Россию (фиксированное значение: 15000 CNY * курс)
  const chinaServices = 15000 * (exchangeRates.CNY || 11.05);
  steps.push({
    label: 'Импорт из Китая в Россию',
    value: `${fmt(chinaServices)} ₽`,
    subValue: '¥15 000'
  });
  
  // Оформление (фиксированное значение: 75 000 ₽)
  steps.push({
    label: 'Оформление',
    value: '75 000 ₽'
  });
  
  // Комиссия компании (фиксированное значение: 100 000 ₽)
  steps.push({
    label: 'Комиссия компании',
    value: '100 000 ₽'
  });
  
  // Доставка по России (фиксированное значение: 200 000 ₽)
  const deliveryFee = 200000;
  steps.push({
    label: 'Доставка по России',
    value: `${fmt(deliveryFee)} ₽`
  });
  
  // Рассчитываем итоговую стоимость как сумму всех компонентов
  const calculatedTotal = 
    (parseInt(dromDetails.PRICE?.major.value || 0)) +
    (parseInt(dromDetails.CUSTOMS_DUTY?.major.value || 0) + 
     parseInt(dromDetails.CUSTOMS_FEE?.major.value || 0) +
     parseInt(dromDetails.RECYCLING_FEE?.major.value || 0)) +
    chinaServices +
    75000 + // Оформление
    100000 + // Комиссия компании
    deliveryFee;
  
  // Итоговая стоимость
  steps.push({
    label: 'ОРИЕНТИРОВОЧНАЯ СТОИМОСТЬ В РОССИИ',
    value: `${fmt(calculatedTotal)} ₽`,
    isTotal: true,
    hasAsterisk: true
  });
  
  return {
    steps,
    total: calculatedTotal,
    rateCny: exchangeRates.CNY,
    rateEur: exchangeRates.EUR
  };
}
