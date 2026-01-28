/**
 * Справочник переводов цветов с английского на русский
 * Основан на color_translations.json (китайский -> английский)
 */

const colorTranslations = {
  'red': 'Красный',
  'white': 'Белый',
  'black': 'Черный',
  'silver': 'Серебристый',
  'gray': 'Серый',
  'grey': 'Серый',
  'blue': 'Синий',
  'green': 'Зеленый',
  'yellow': 'Желтый',
  'gold': 'Золотой',
  'orange': 'Оранжевый',
  'brown': 'Коричневый',
  'purple': 'Фиолетовый',
  'pink': 'Розовый',
  'beige': 'Бежевый',
  'champagne': 'Шампань',
  'dark-blue': 'Темно-синий',
  'dark-gray': 'Темно-серый',
  'light-blue': 'Светло-синий',
  'light-gray': 'Светло-серый',
  'pearl-white': 'Жемчужно-белый',
  'sapphire-blue': 'Сапфирово-синий',
  'sky-blue': 'Небесно-голубой',
  'dark-green': 'Темно-зеленый',
  'burgundy': 'Бордовый',
  'rose-red': 'Розово-красный',
  'titanium': 'Титановый',
  'titanium-silver': 'Титаново-серебристый',
  'crystal-silver': 'Кристально-серебристый',
  'coral-red': 'Коралловый',
  'ruby-red': 'Рубиновый',
  'smoky': 'Дымчатый',
  'matte': 'Матовый',
  'glossy': 'Глянцевый',
  'other': 'Другой'
};

/**
 * Переводит цвет с английского на русский
 * @param {string} colorEn - Цвет на английском (из API)
 * @returns {string} Цвет на русском или оригинальное значение
 */
export function translateColor(colorEn) {
  if (!colorEn) return '';
  
  // Приводим к lowercase для поиска
  const colorKey = colorEn.toLowerCase().trim();
  
  // Ищем в справочнике
  if (colorTranslations[colorKey]) {
    return colorTranslations[colorKey];
  }
  
  // Если не нашли - возвращаем оригинал с заглавной буквы
  return colorEn.charAt(0).toUpperCase() + colorEn.slice(1);
}
