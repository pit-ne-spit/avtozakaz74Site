/**
 * API utility for fetching car listings from che168 API
 */

const API_TOKEN = 'che168-Onh9OZEJchYMZgdXy';

/**
 * Transform flat filters to che168 API format
 * @param {Object} params - Flat filter parameters
 * @returns {Object} Formatted request body
 */
function transformFiltersToApiFormat(params) {
  const { limit = 20, offset = 0, ...filters } = params;
  
  const apiFilters = {};
  
  // Transform brandname (array)
  if (filters.brandname) {
    apiFilters.brandname = Array.isArray(filters.brandname) 
      ? filters.brandname 
      : [filters.brandname];
  }
  
  // Transform seriesname (array)
  if (filters.seriesname) {
    apiFilters.seriesname = Array.isArray(filters.seriesname)
      ? filters.seriesname
      : [filters.seriesname];
  }
  
  // Transform fuel_type (array)
  if (filters.fuel_type) {
    apiFilters.fuel_type = Array.isArray(filters.fuel_type)
      ? filters.fuel_type
      : [filters.fuel_type];
  }
  
  // Transform city (array)
  if (filters.city) {
    apiFilters.city = Array.isArray(filters.city)
      ? filters.city
      : [filters.city];
  }
  
  // Transform price_cny (min/max to array)
  if (filters.price_cny_min || filters.price_cny_max) {
    const min = filters.price_cny_min ? parseFloat(filters.price_cny_min) : 0;
    const max = filters.price_cny_max ? parseFloat(filters.price_cny_max) : 999999999;
    apiFilters.price_cny = [min, max];
  }
  
  // Transform total_price_rub (min/max to array)
  if (filters.total_price_rub_min || filters.total_price_rub_max) {
    const min = filters.total_price_rub_min ? parseFloat(filters.total_price_rub_min) : 0;
    const max = filters.total_price_rub_max ? parseFloat(filters.total_price_rub_max) : 999999999;
    apiFilters.total_price_rub = [min, max];
  }
  
  // Transform firstregyear (min/max to array)
  if (filters.year_from || filters.year_to) {
    const min = filters.year_from ? parseInt(filters.year_from) : 1990;
    const max = filters.year_to ? parseInt(filters.year_to) : 2030;
    apiFilters.firstregyear = [min, max];
  }
  
  // Transform mileage (min/max to array)
  if (filters.mileage_from || filters.mileage_to) {
    const min = filters.mileage_from ? parseFloat(filters.mileage_from) : 0;
    const max = filters.mileage_to ? parseFloat(filters.mileage_to) : 999999999;
    apiFilters.mileage = [min, max];
  }
  
  // Transform engine_volume_ml (min/max to array)
  if (filters.engine_volume_from || filters.engine_volume_to) {
    const min = filters.engine_volume_from ? parseInt(filters.engine_volume_from) : 0;
    const max = filters.engine_volume_to ? parseInt(filters.engine_volume_to) : 999999;
    apiFilters.engine_volume_ml = [min, max];
  }
  
  // Transform power_kw (min/max to array)
  if (filters.power_from || filters.power_to) {
    const min = filters.power_from ? parseFloat(filters.power_from) : 0;
    const max = filters.power_to ? parseFloat(filters.power_to) : 9999;
    apiFilters.power_kw = [min, max];
  }
  
  return {
    filters: apiFilters,
    pagination: {
      limit: limit,
      offset: offset
    },
    sorting: {
      sort_by: 'infoid',
      sort_direction: 'DESC'
    }
  };
}

/**
 * Fetch cars from API with filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response with cars and metadata
 */
export async function fetchCars(params = {}) {
  const requestBody = transformFiltersToApiFormat(params);
  
  console.log('Fetching cars with body:', requestBody);
  
  const res = await fetch('/api/search_car', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': API_TOKEN
    },
    body: JSON.stringify(requestBody)
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('API Error:', res.status, errorText);
    throw new Error(`Ошибка API: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  console.log('API Response:', data);
  
  // Transform response to expected format
  if (data.status === 'success' && data.data) {
    return {
      cars: data.data.cars || [],
      total: data.data.count?.filtered || 0,
      rates: data.data.rates || { CNY: 11.34, EUR: 93.78 },
      tariff_info: data.data.tariff_info
    };
  }
  
  throw new Error(data.message || 'Неизвестная ошибка');
}

/**
 * Get detailed information about a specific car
 * @param {number} carId - Car infoid
 * @returns {Promise<Object>} Car details with all information
 */
export async function fetchCarById(carId) {
  console.log('Fetching car details for infoid:', carId);
  
  const res = await fetch('/api/get_car_info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': API_TOKEN
    },
    body: JSON.stringify({ infoid: carId })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('API Error:', res.status, errorText);
    throw new Error(`Ошибка API: ${res.status} ${res.statusText}`);
  }
  
  const data = await res.json();
  console.log('Car details:', data);
  
  if (data.status === 'success' && data.data) {
    return data.data.extracted_data || data.data;
  }
  
  throw new Error(data.message || 'Не удалось загрузить детали автомобиля');
}
