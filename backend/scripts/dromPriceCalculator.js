/**
 * Drom.ru Price Calculator
 * Интеграция с API drom.ru для расчета таможенной стоимости автомобилей
 */

const DROM_API_URL = 'https://www.drom.ru/api/world/calculate/china/';

/**
 * Calculate vehicle age category for drom.ru API
 * @param {string} firstRegShortDate - Registration date in YYYY-MM-DD format
 * @param {number} firstRegYear - Registration year (fallback)
 * @returns {string} Age category: 'UNDER_3', 'FROM_3_TO_5', 'OVER_5'
 */
export function calculateVehicleAgeCategory(firstRegShortDate, firstRegYear) {
  let regDate;
  
  if (firstRegShortDate) {
    // Parse date from "2021-09-01" format
    regDate = new Date(firstRegShortDate);
    if (isNaN(regDate.getTime())) {
      // Invalid date, try fallback to year
      if (firstRegYear) {
        regDate = new Date(String(firstRegYear), 0, 1);
      } else {
        return null;
      }
    }
  } else if (firstRegYear) {
    // Use year only (can be number "2022" or string "2022"), assume January 1st
    regDate = new Date(String(firstRegYear), 0, 1);
  } else {
    return null;
  }
  
  if (isNaN(regDate.getTime())) {
    return null;
  }
  
  const today = new Date();
  const ageMs = today - regDate;
  const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  
  if (ageYears < 3) return 'UNDER_3';
  if (ageYears >= 3 && ageYears < 5) return 'FROM_3_TO_5';
  return 'OVER_5';
}

/**
 * Map fuel type from che168 API to drom.ru API format
 * @param {string} fuelType - Fuel type from che168 API
 * @returns {string} Engine type for drom.ru API
 */
export function mapEngineType(fuelType) {
  if (!fuelType) return 'DIESEL_OR_GASOLINE';
  
  const fuelTypeLower = fuelType.toLowerCase();
  
  // Электрические автомобили -> ELECTRIC_MOTOR
  // Проверяем точное совпадение сначала
  if (fuelType === 'Pure Electric' || 
      fuelTypeLower === 'pure electric' ||
      fuelTypeLower === 'electric' ||
      fuelTypeLower === 'ev' ||
      fuelTypeLower === 'battery electric') {
    return 'ELECTRIC_MOTOR';
  }
  
  // Последовательный гибрид (Extended Range) -> ELECTRIC_MOTOR
  if (fuelType === 'Extended Range' || fuelTypeLower.includes('extended range')) {
    return 'ELECTRIC_MOTOR';
  }
  
  // Дизель -> DIESEL_OR_GASOLINE
  if (fuelType === 'Diesel Fuel' || fuelTypeLower.includes('diesel')) {
    return 'DIESEL_OR_GASOLINE';
  }
  
  // Бензин -> DIESEL_OR_GASOLINE
  if (fuelType === 'Gasoline' || fuelType === 'Gasoline+CNG' || fuelTypeLower.includes('gasoline')) {
    return 'DIESEL_OR_GASOLINE';
  }
  
  // Гибриды (не последовательные) -> DIESEL_OR_GASOLINE
  if (fuelTypeLower.includes('hybrid')) {
    return 'DIESEL_OR_GASOLINE';
  }
  
  // Для остальных типов используем DIESEL_OR_GASOLINE по умолчанию
  return 'DIESEL_OR_GASOLINE';
}

/**
 * Convert power from kW to horsepower
 * @param {number} powerKw - Power in kilowatts
 * @returns {number} Power in horsepower
 */
export function convertKwToHorsepower(powerKw) {
  if (!powerKw) return null;
  return Math.round(powerKw * 1.36);
}

/**
 * Build request parameters for drom.ru API
 * @param {Object} car - Car object from che168 API
 * @param {Object} rates - Exchange rates {CNY, EUR}
 * @returns {Object} Request parameters for drom.ru API
 */
export function buildDromRequestParams(car, rates) {
  const vehicleAge = calculateVehicleAgeCategory(
    car.firstregshortdate,
    car.firstregyear
  );
  
  const engineHorsePower = convertKwToHorsepower(car.power_kw);
  
  // Проверка обязательных параметров
  if (!car.price_cny || car.price_cny <= 0) {
    return null;
  }
  
  const engineType = mapEngineType(car.fuel_type);
  const isElectric = engineType === 'ELECTRIC_MOTOR';
  
  // Для электрических автомобилей engine_volume_ml может отсутствовать или быть 0
  if (!isElectric && (!car.engine_volume_ml || car.engine_volume_ml <= 0)) {
    return null;
  }
  
  if (!engineHorsePower || engineHorsePower <= 0) {
    return null;
  }
  
  if (!vehicleAge) {
    return null;
  }
  
  // Округляем валюты до сотых (2 знака после запятой)
  const formatCurrency = (value) => {
    if (!value) return null;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return num.toFixed(2);
  };
  
  // Для электрических автомобилей engineVolumeInCubicCentimeters не передается
  // Для остальных - обязательно
  const params = {
    price: car.price_cny.toString(),
    currency: 'CNY',
    vehicleAge: vehicleAge,
    engineType: engineType,
    engineHorsePower: engineHorsePower.toString(),
    importPurpose: 'USAGE',
    EUR: formatCurrency(rates?.EUR) || '91.11',
    USD: formatCurrency(rates?.USD) || '76.91',
    CNY: formatCurrency(rates?.CNY) || '11.05'
  };
  
  // Для неэлектрических автомобилей добавляем объем двигателя
  if (!isElectric) {
    params.engineVolumeInCubicCentimeters = car.engine_volume_ml.toString();
  }
  
  return params;
}

/**
 * Calculate price using drom.ru API
 * @param {Object} car - Car object from che168 API
 * @param {Object} rates - Exchange rates {CNY, EUR}
 * @param {number} timeout - Request timeout in milliseconds (default: 5000)
 * @returns {Promise<Object>} Calculated price data from drom.ru API
 */
export async function calculatePriceWithDrom(car, rates, timeout = 5000) {
  try {
    const params = buildDromRequestParams(car, rates);
    
    // Если buildDromRequestParams вернул null, значит параметры невалидны
    if (!params) {
      return null;
    }
    
    // Build query string
    const queryString = new URLSearchParams(params).toString();
    const url = `${DROM_API_URL}?${queryString}`;
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      
      if (data.result) {
        return data.result;
      }
      
      return null;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return null;
      } else {
        throw fetchError;
      }
    }
  } catch (error) {
    return null;
  }
}
