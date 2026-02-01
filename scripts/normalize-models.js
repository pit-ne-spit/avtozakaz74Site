/**
 * Скрипт для нормализации названий моделей автомобилей
 * 
 * Исправляет:
 * - Регистр букв (A4l → A4L, e-tron → E-tron)
 * - Переводы (Imported → Импорт, New Energy → Новая энергия)
 * - Форматирование (RS → RS, GT → GT)
 * - Специальные символы и пробелы
 * 
 * Использование:
 *   node scripts/normalize-models.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Правила нормализации
 */
const NORMALIZATION_RULES = {
  // Перевод часто встречающихся терминов
  translations: {
    '(Imported)': '(Импорт)',
    'Imported': 'Импорт',
    'Sportback': 'Sportback', // оставляем как есть

  },
  
  // Паттерны для капитализации
  // Буквы в конце модели должны быть заглавными: A4l → A4L, Q5l → Q5L
  capitalizeModelSuffixes: true,
  
  // Специальные префиксы (всегда заглавные)
  prefixes: ['RS', 'GT', 'SQ', 'TT', 'R8', 'E-TRON', 'E-tron'],
};

/**
 * Нормализовать одно название модели
 */
function normalizeModelName(modelName, brandName) {
  let normalized = modelName;
  
  // 1. Применить переводы (порядок важен! Сначала со скобками, потом без)
  normalized = normalized.replace(/\(Imported\)/gi, '(Импорт)');
  // Не переводим Imported без скобок, чтобы не было путаницы
  
  // 2. Исправить регистр суффиксов моделей (A4l → A4L, Q5l → Q5L)
  // Паттерн: буква+цифра+маленькая буква в конце или перед пробелом
  normalized = normalized.replace(/([A-Z]\d+)([a-z])(\s|$)/g, (match, prefix, letter, suffix) => {
    return prefix + letter.toUpperCase() + suffix;
  });
  
  // 3. Исправить e-tron → E-tron (только первая буква заглавная)
  normalized = normalized.replace(/\be-tron\b/gi, 'E-tron');
  normalized = normalized.replace(/\bE-TRON\b/g, 'E-tron');
  
  // 4. Исправить RS/GT/SQ префиксы (должны быть заглавными)
  normalized = normalized.replace(/\bRs\s/g, 'RS ');
  normalized = normalized.replace(/\bSq\s/g, 'SQ ');
  normalized = normalized.replace(/\bTt\s/g, 'TT ');
  normalized = normalized.replace(/\bTts\b/g, 'TTS');
  
  // 5. Убрать лишние пробелы
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  return normalized;
}

/**
 * Статистика изменений
 */
function getChangeStats(original, normalized) {
  if (original === normalized) {
    return null;
  }
  return {
    original,
    normalized,
    changes: []
  };
}

/**
 * Основная функция нормализации справочника
 */
async function normalizeModelsReference() {
  console.log('🚀 Начало нормализации названий моделей\n');
  
  // Загрузить справочник
  const inputPath = path.join(__dirname, '../frontend/models-reference.json');
  const modelsData = JSON.parse(await fs.readFile(inputPath, 'utf-8'));
  
  const normalizedData = {};
  const changes = [];
  let totalModels = 0;
  let changedModels = 0;
  
  // Обработать каждую марку
  for (const [brand, models] of Object.entries(modelsData)) {
    console.log(`Обработка: ${brand} (${models.length} моделей)`);
    
    normalizedData[brand] = models.map(model => {
      totalModels++;
      const normalized = normalizeModelName(model, brand);
      
      if (normalized !== model) {
        changedModels++;
        changes.push({
          brand,
          original: model,
          normalized
        });
        console.log(`  ✏️  ${model} → ${normalized}`);
      }
      
      return normalized;
    });
  }
  
  // Сохранить нормализованный справочник
  const outputPath = path.join(__dirname, '../frontend/models-reference-normalized.json');
  await fs.writeFile(
    outputPath,
    JSON.stringify(normalizedData, null, 2),
    'utf-8'
  );
  
  // Сохранить отчёт об изменениях
  const changesPath = path.join(__dirname, '../frontend/models-normalization-changes.json');
  await fs.writeFile(
    changesPath,
    JSON.stringify(changes, null, 2),
    'utf-8'
  );
  
  console.log('\n✅ Нормализация завершена!');
  console.log(`📁 Нормализованный файл: ${outputPath}`);
  console.log(`📁 Отчёт об изменениях: ${changesPath}`);
  console.log(`\n📊 Статистика:`);
  console.log(`   - Всего моделей: ${totalModels}`);
  console.log(`   - Изменено: ${changedModels}`);
  console.log(`   - Без изменений: ${totalModels - changedModels}`);
  console.log(`   - Процент изменений: ${((changedModels / totalModels) * 100).toFixed(1)}%`);
  
  // Показать примеры изменений
  if (changes.length > 0) {
    console.log('\n📝 Примеры изменений (первые 20):');
    changes.slice(0, 20).forEach((change, index) => {
      console.log(`   ${index + 1}. [${change.brand}] ${change.original} → ${change.normalized}`);
    });
  }
  
  // Вопрос пользователю
  console.log('\n💡 Следующий шаг:');
  console.log('   Проверьте файл models-normalization-changes.json');
  console.log('   Если всё корректно, переименуйте:');
  console.log('   models-reference-normalized.json → models-reference.json');
}

// Запуск
normalizeModelsReference().catch(error => {
  console.error('❌ Критическая ошибка:', error);
  process.exit(1);
});
