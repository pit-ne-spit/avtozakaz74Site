/**
 * Fuel type mapping utilities
 */

// Mapping from API fuel types to simplified categories
export const FUEL_TYPE_MAPPING = {
  'Бензин': [
    'Gasoline',
    'Gasoline+CNG'
  ],
  'Дизель': [
    'Diesel Fuel'
    
  ],
  'Гибрид': [
    'Gas-Electric Hybrid',
    'Gasoline Electric Drive',
    'Plug-In Hybrid',
    'Extended Range',
    'Diesel+48v Light Hybrid System',
    'Gasoline + 48v Mild Hybrid System',
    'Gasoline +90v Mild Hybrid System',
  ],
  'Электричество': [
    'Pure Electric'
  ]
};

// Simplified categories for UI
export const FUEL_CATEGORIES = ['Бензин', 'Дизель', 'Гибрид', 'Электричество'];

/**
 * Convert simplified category to API fuel types array
 * @param {string} category - Simplified category (e.g., 'Бензин')
 * @returns {Array<string>} Array of API fuel type values
 */
export function categoryToApiFuelTypes(category) {
  return FUEL_TYPE_MAPPING[category] || [];
}

/**
 * Convert API fuel type to simplified category
 * @param {string} apiFuelType - API fuel type (e.g., 'Gasoline')
 * @returns {string} Simplified category
 */
export function apiFuelTypeToCategory(apiFuelType) {
  for (const [category, apiTypes] of Object.entries(FUEL_TYPE_MAPPING)) {
    if (apiTypes.includes(apiFuelType)) {
      return category;
    }
  }
  return apiFuelType; // Return as-is if not found
}
