# Справочник моделей автомобилей

## Описание

Локальный справочник моделей (`models-reference.json`) используется вместо динамической загрузки через API для улучшения производительности.

## Преимущества

✅ **Мгновенная загрузка** - модели отображаются сразу при выборе марки  
✅ **Нет задержек API** - не нужно ждать ответа от сервера  
✅ **Офлайн-работа** - фильтр по моделям работает даже без соединения  
✅ **Меньше нагрузки** - не тратим запросы API на загрузку фильтров  
✅ **Нормализованные названия** - единообразное отображение (A4L вместо A4l, RS вместо Rs)

## Формат файла

```json
{
  "Audi": [
    "Audi A1",
    "Audi A3",
    "Audi A3 (Импорт)",
    ...
  ],
  "Bmw": [
    "Bmw 1 Series",
    "Bmw 1 Series (Импорт)",
    ...
  ],
  ...
}
```

## Статистика

- **Марок**: 183
- **Моделей**: 1526
- **Размер файла**: ~34 КБ
- **Среднее моделей на марку**: 8.3

## Обновление справочника

Для обновления справочника (добавление новых моделей):

```bash
cd scripts
npm install
npm run generate-models
node normalize-models.js
cd ../frontend
mv models-reference-normalized.json models-reference.json
```

Подробнее см. `scripts/README.md`

## Использование в коде

```javascript
import modelsReference from '../models-reference.json';

// Получить модели для марки (API название)
const audiModels = modelsReference['Audi'] || [];

// Получить модели для нескольких марок
const brands = ['Audi', 'Bmw'];
const allModels = new Set();
brands.forEach(brand => {
  const models = modelsReference[brand] || [];
  models.forEach(m => allModels.add(m));
});
const modelList = Array.from(allModels).sort();
```

## Нормализация

Названия моделей автоматически нормализованы:

- **Регистр**: `A4l` → `A4L`, `Q5l` → `Q5L`
- **Перевод**: `(Imported)` → `(Импорт)`
- **Префиксы**: `Rs 3` → `RS 3`, `Sq5` → `SQ5`, `Tts` → `TTS`
- **E-tron**: единый формат `E-tron` (не `e-tron` или `E-TRON`)

## Отчёт об изменениях

См. `models-normalization-changes.json` для полного списка нормализованных названий.
