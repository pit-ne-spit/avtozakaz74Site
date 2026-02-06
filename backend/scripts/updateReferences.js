/**
 * Скрипт обновления справочников марок и моделей
 * 
 * Запуск:
 *   node scripts/updateReferences.js
 * 
 * Результат:
 *   - data/brands.json
 *   - data/models.json
 *   - data/last-update.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://api-centr.ru/che168';
const API_TOKEN = process.env.API_TOKEN || 'che168-Onh9OZEJchYMZgdXy';
const DATA_DIR = path.join(__dirname, '../data');
const DELAY_MS = 500;
const LIMIT = 50;

/**
 * Логирование с timestamp
 */
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level}] ${message}`);
}

/**
 * Получить все бренды из API с pagination
 */
async function fetchBrands() {
  log('Получение списка брендов...');
  
  let allBrands = [];
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const response = await fetch(`${API_URL}/getAvailableFilters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_TOKEN
        },
        body: JSON.stringify({
          fields_to_extract: 'brandname',
          limit: LIMIT,
          offset: offset
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const brands = data.data?.data?.values || [];
      allBrands.push(...brands);
      
      log(`✓ Получено брендов (offset ${offset}): ${brands.length}`);
      
      if (brands.length < LIMIT) {
        hasMore = false;
      } else {
        offset += LIMIT;
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    } catch (error) {
      log(`Ошибка получения брендов: ${error.message}`, 'ERROR');
      throw error;
    }
  }
  
  log(`✓ Всего брендов: ${allBrands.length}`);
  return allBrands;
}

/**
 * Получить модели для бренда с pagination
 */
async function fetchModelsForBrand(brandName) {
  let allModels = [];
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const response = await fetch(`${API_URL}/getAvailableFilters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': API_TOKEN
        },
        body: JSON.stringify({
          fields_to_extract: 'seriesname',
          filters: { brandname: brandName },
          limit: LIMIT,
          offset: offset
        })
      });
      
      if (!response.ok) {
        log(`API ошибка для ${brandName}: ${response.status}`, 'WARN');
        break;
      }
      
      const data = await response.json();
      const models = data.data?.data?.values || [];
      allModels.push(...models);
      
      if (models.length < LIMIT) {
        hasMore = false;
      } else {
        offset += LIMIT;
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    } catch (error) {
      log(`Ошибка для ${brandName}: ${error.message}`, 'WARN');
      break;
    }
  }
  
  return allModels;
}

/**
 * Маппинг названий моделей для отображения пользователю
 * Ключ - название из API, значение - отображаемое название
 */
const MODEL_NAME_MAPPING = {
  // Volkswagen models
  'Tuyue': 'Tharu',
  'Tanyue': 'Tayron',
};

/**
 * Нормализовать название модели
 */
function normalizeModelName(modelName) {
  let normalized = modelName;
  
  // 1. Применить маппинг названий моделей (например, Tuyue -> Tharu)
  // Проверяем, начинается ли название модели с маппированного API названия
  for (const [apiName, displayName] of Object.entries(MODEL_NAME_MAPPING)) {
    // Сопоставляем точное название или название с дополнительными словами (например, "Tuyue New Energy")
    const regex = new RegExp(`^${apiName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i');
    if (regex.test(normalized)) {
      normalized = normalized.replace(regex, (match, space) => {
        return displayName + space;
      });
      break; // Применяем только первое совпадение
    }
  }
  
  // 2. Перевод (Imported) → (Импорт)
  normalized = normalized.replace(/\(Imported\)/gi, '(Импорт)');
  
  // 3. Исправить регистр суффиксов (A4l → A4L, Q5l → Q5L)
  normalized = normalized.replace(/([A-Z]\d+)([a-z])(\s|$)/g, (match, prefix, letter, suffix) => {
    return prefix + letter.toUpperCase() + suffix;
  });
  
  // 4. E-tron
  normalized = normalized.replace(/\be-tron\b/gi, 'E-tron');
  normalized = normalized.replace(/\bE-TRON\b/g, 'E-tron');
  
  // 5. RS/SQ/TT
  normalized = normalized.replace(/\bRs\s/g, 'RS ');
  normalized = normalized.replace(/\bSq\s/g, 'SQ ');
  normalized = normalized.replace(/\bTt\s/g, 'TT ');
  normalized = normalized.replace(/\bTts\b/g, 'TTS');
  
  // 6. Убрать лишние пробелы
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * Генерация справочников
 */
async function generateReferences() {
  const startTime = Date.now();
  log('=== Начало обновления справочников ===');
  
  try {
    // Получить бренды
    const brands = await fetchBrands();
    
    // Получить модели для каждого бренда
    log(`Получение моделей для ${brands.length} брендов...`);
    const modelsReference = {};
    let totalModels = 0;
    let processedBrands = 0;
    
    for (const brand of brands) {
      const models = await fetchModelsForBrand(brand);
      
      // Нормализация
      const normalizedModels = models.map(m => normalizeModelName(m));
      
      modelsReference[brand] = normalizedModels;
      totalModels += normalizedModels.length;
      processedBrands++;
      
      if (processedBrands % 10 === 0) {
        log(`Прогресс: ${processedBrands}/${brands.length}`);
      }
    }
    
    // Убедиться что директория существует
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Сохранить бренды
    await fs.writeFile(
      path.join(DATA_DIR, 'brands.json'),
      JSON.stringify({ values: brands }, null, 2),
      'utf-8'
    );
    log('✓ Сохранён brands.json');
    
    // Сохранить модели
    await fs.writeFile(
      path.join(DATA_DIR, 'models.json'),
      JSON.stringify(modelsReference, null, 2),
      'utf-8'
    );
    log('✓ Сохранён models.json');
    
    // Сохранить метаданные обновления
    const metadata = {
      lastUpdate: new Date().toISOString(),
      brandsCount: brands.length,
      modelsCount: totalModels,
      avgModelsPerBrand: (totalModels / brands.length).toFixed(1),
      duration: ((Date.now() - startTime) / 1000).toFixed(1) + 's'
    };
    
    await fs.writeFile(
      path.join(DATA_DIR, 'last-update.json'),
      JSON.stringify(metadata, null, 2),
      'utf-8'
    );
    log('✓ Сохранён last-update.json');
    
    // Итоговая статистика
    log('=== Обновление завершено ===');
    log(`Бренды: ${metadata.brandsCount}`);
    log(`Модели: ${metadata.modelsCount}`);
    log(`Среднее: ${metadata.avgModelsPerBrand} моделей/бренд`);
    log(`Время: ${metadata.duration}`);
    
    return metadata;
  } catch (error) {
    log(`Критическая ошибка: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Запуск только если запущен напрямую (не через import)
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  generateReferences()
    .then(() => {
      log('Скрипт завершён успешно');
      process.exit(0);
    })
    .catch(error => {
      log(`Скрипт завершён с ошибкой: ${error.message}`, 'ERROR');
      console.error(error);
      process.exit(1);
    });
}

export { generateReferences };
