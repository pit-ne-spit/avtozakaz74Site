/**
 * Скрипт для генерации справочника моделей автомобилей
 * 
 * Для каждой марки из brandname.json делает запросы к API che168
 * с учётом лимита 50 моделей на запрос (делает offset для получения всех моделей)
 * 
 * Использование:
 *   node scripts/generate-models-reference.js
 */

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'https://api-centr.ru/che168/getAvailableFilters';
const API_TOKEN = 'che168-Onh9OZEJchYMZgdXy';
const LIMIT = 50; // Максимальный лимит API
const DELAY_MS = 500; // Задержка между запросами (0.5 сек)

/**
 * Получить все модели для конкретной марки (с pagination)
 */
async function getModelsForBrand(brandName) {
  console.log(`Получение моделей для марки: ${brandName}`);
  
  let allModels = [];
  let offset = 0;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': API_TOKEN
        },
        body: JSON.stringify({
          fields_to_extract: 'seriesname',
          filters: {
            brandname: brandName
          },
          limit: LIMIT,
          offset: offset,
          search_logic: 'OR',
          search_terms: []
        })
      });
      
      if (!response.ok) {
        console.error(`  ❌ Ошибка API для ${brandName} (offset ${offset}): ${response.status}`);
        break;
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data?.data?.values) {
        const models = data.data.data.values;
        allModels.push(...models);
        
        console.log(`  ✓ Получено ${models.length} моделей (offset ${offset})`);
        
        // Проверяем, есть ли ещё модели
        if (models.length < LIMIT) {
          hasMore = false;
        } else {
          offset += LIMIT;
          // Небольшая задержка между запросами
          await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
      } else {
        console.error(`  ❌ Некорректный ответ для ${brandName}:`, data.message);
        break;
      }
    } catch (error) {
      console.error(`  ❌ Ошибка запроса для ${brandName}:`, error.message);
      break;
    }
  }
  
  console.log(`  📊 Всего моделей для ${brandName}: ${allModels.length}`);
  return allModels;
}

/**
 * Основная функция генерации справочника
 */
async function generateModelsReference() {
  console.log('🚀 Начало генерации справочника моделей\n');
  
  // Загрузить список марок
  const brandNamePath = path.join(__dirname, '../frontend/brandname.json');
  const brandData = JSON.parse(await fs.readFile(brandNamePath, 'utf-8'));
  const brands = brandData.values;
  
  console.log(`📋 Всего марок: ${brands.length}\n`);
  
  // Объект для хранения результата { "Audi": ["Audi A1", "Audi A3", ...], ... }
  const modelsReference = {};
  
  // Счётчики для статистики
  let totalModels = 0;
  let processedBrands = 0;
  
  // Обработать каждую марку
  for (const brand of brands) {
    const models = await getModelsForBrand(brand);
    modelsReference[brand] = models;
    totalModels += models.length;
    processedBrands++;
    
    console.log(`Прогресс: ${processedBrands}/${brands.length}\n`);
  }
  
  // Сохранить результат
  const outputPath = path.join(__dirname, '../frontend/models-reference.json');
  await fs.writeFile(
    outputPath, 
    JSON.stringify(modelsReference, null, 2), 
    'utf-8'
  );
  
  console.log('\n✅ Справочник успешно создан!');
  console.log(`📁 Файл: ${outputPath}`);
  console.log(`📊 Статистика:`);
  console.log(`   - Обработано марок: ${processedBrands}`);
  console.log(`   - Всего моделей: ${totalModels}`);
  console.log(`   - Среднее моделей на марку: ${(totalModels / processedBrands).toFixed(1)}`);
  
  // Вывести марки с наибольшим количеством моделей
  const topBrands = Object.entries(modelsReference)
    .map(([brand, models]) => ({ brand, count: models.length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  console.log('\n🏆 Топ-10 марок по количеству моделей:');
  topBrands.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.brand}: ${item.count} моделей`);
  });
}

// Запуск
generateModelsReference().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});
