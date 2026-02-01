/**
 * Customs duty (import duty) calculation utilities
 * Based on vehicle age and engine volume
 */

/**
 * Calculate vehicle age in years from registration date
 * @param {string} firstRegDate - Registration date in YYYY-MM-DD format
 * @returns {number} Age in years (with decimals)
 */
export function calculateVehicleAge(firstRegDate) {
  if (!firstRegDate) return null;
  
  const regDate = new Date(firstRegDate);
  const today = new Date();
  
  const ageMs = today - regDate;
  const ageYears = ageMs / (1000 * 60 * 60 * 24 * 365.25);
  
  return ageYears;
}

/**
 * Determine age category for customs duty calculation
 * @param {number} ageYears - Age in years
 * @returns {string} Category: 'under_3', '3_to_5', or 'over_5'
 */
export function getAgeCategory(ageYears) {
  if (ageYears === null) return null;
  
  if (ageYears < 3) return 'under_3';
  if (ageYears >= 3 && ageYears < 5) return '3_to_5';
  return 'over_5';
}

/**
 * Get customs duty rate (EUR per cm³) based on age category and engine volume
 * @param {string} ageCategory - Age category
 * @param {number} engineVolumeMl - Engine volume in milliliters
 * @returns {number} Rate in EUR per cm³
 */
export function getDutyRate(ageCategory, engineVolumeMl) {
  if (!ageCategory || !engineVolumeMl) return null;
  
  const volumeCm3 = engineVolumeMl; // Already in cm³
  
  // For vehicles 3-5 years old
  if (ageCategory === '3_to_5') {
    if (volumeCm3 < 1000) return 1.5;
    if (volumeCm3 < 1500) return 1.7;
    if (volumeCm3 < 1800) return 2.5;
    if (volumeCm3 < 2300) return 2.7;
    if (volumeCm3 < 3000) return 3.0;
    return 3.6;
  }
  
  // For vehicles over 5 years old
  if (ageCategory === 'over_5') {
    if (volumeCm3 < 1000) return 3.0;
    if (volumeCm3 < 1500) return 3.2;
    if (volumeCm3 < 1800) return 3.5;
    if (volumeCm3 < 2300) return 4.8;
    if (volumeCm3 < 3000) return 5.0;
    return 5.7;
  }
  
  // For vehicles under 3 years - cannot calculate with simple rate
  // Need price-based calculation (48% of price, but not less than X EUR/cm³)
  // Return null to indicate we should use API value or skip calculation
  return null;
}

/**
 * Calculate import duty in EUR
 * @param {string} firstRegDate - Registration date in YYYY-MM-DD format
 * @param {number} engineVolumeMl - Engine volume in milliliters
 * @param {number} priceCny - Price in CNY (needed for under_3 category)
 * @param {number} cnyToEurRate - CNY to EUR exchange rate
 * @returns {number|null} Import duty in EUR, or null if cannot calculate
 */
export function calculateImportDuty(firstRegDate, engineVolumeMl, priceCny = null, cnyToEurRate = null) {
  const ageYears = calculateVehicleAge(firstRegDate);
  if (ageYears === null) return null;
  
  const ageCategory = getAgeCategory(ageYears);
  const rate = getDutyRate(ageCategory, engineVolumeMl);
  
  // For 3-5 and over_5: simple calculation
  if (rate !== null) {
    return engineVolumeMl * rate;
  }
  
  // For under_3: need price-based calculation
  if (ageCategory === 'under_3' && priceCny && cnyToEurRate) {
    const priceEur = priceCny * cnyToEurRate;
    const volumeCm3 = engineVolumeMl; // Already in cm³ (1400ml = 1400cm³)
    
    // Combined rate: 48% of price, but not less than X EUR/cm³
    const percentRate = priceEur * 0.48;
    
    // Minimum rates per cm³ for different volumes (for under_3 category)
    let minRatePerCm3;
    if (volumeCm3 < 1000) minRatePerCm3 = 2.5;
    else if (volumeCm3 < 1500) minRatePerCm3 = 3.5;
    else if (volumeCm3 < 1800) minRatePerCm3 = 5.5;
    else if (volumeCm3 < 2300) minRatePerCm3 = 7.5;
    else if (volumeCm3 < 3000) minRatePerCm3 = 12.0;
    else minRatePerCm3 = 15.5;
    
    const minRate = volumeCm3 * minRatePerCm3;
    
    return Math.max(percentRate, minRate);
  }
  
  // Cannot calculate - return null
  return null;
}

/**
 * Validate and recalculate import duty if needed
 * @param {Object} car - Car object from API
 * @param {Object} rates - Exchange rates {CNY, EUR}
 * @returns {Object} { import_duty_eur, recalculated, reason }
 */
export function validateAndRecalculateImportDuty(car, rates) {
  if (!car || !rates || !rates.CNY || !rates.EUR) {
    return {
      import_duty_eur: car?.import_duty || 0,
      recalculated: false,
      reason: 'Missing data'
    };
  }
  
  // Calculate CNY to EUR rate
  const cnyToEurRate = rates.CNY / rates.EUR;
  
  const calculated = calculateImportDuty(
    car.firstregshortdate,
    car.engine_volume_ml,
    car.price_cny,
    cnyToEurRate
  );
  
  if (calculated === null) {
    // Cannot calculate - use API value
    return {
      import_duty_eur: car.import_duty || 0,
      recalculated: false,
      reason: 'Cannot calculate (using API value)'
    };
  }
  
  // Compare with API value (allow 5% tolerance)
  const apiValue = car.import_duty || 0;
  const difference = Math.abs(calculated - apiValue);
  const tolerance = Math.max(apiValue * 0.05, 100); // 5% or 100 EUR
  
  if (difference > tolerance) {
    console.warn(
      `⚠️ Import duty mismatch for car ${car.infoid}:`,
      `API: ${apiValue.toFixed(2)} EUR,`,
      `Calculated: ${calculated.toFixed(2)} EUR,`,
      `Difference: ${difference.toFixed(2)} EUR`
    );
    
    return {
      import_duty_eur: calculated,
      recalculated: true,
      reason: `API mismatch (was ${apiValue.toFixed(2)} EUR, now ${calculated.toFixed(2)} EUR)`,
      api_value: apiValue,
      difference: difference
    };
  }
  
  // API value is acceptable
  return {
    import_duty_eur: apiValue,
    recalculated: false,
    reason: 'API value validated'
  };
}
