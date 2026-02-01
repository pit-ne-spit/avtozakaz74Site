# Скрипты генерации справочников

Утилиты для создания и нормализации справочников моделей автомобилей.

## Установка

```bash
cd scripts
npm install
```

## Скрипты

### 1. Генерация справочника моделей

Получает все модели для каждой марки из API che168 с учётом пагинации (лимит 50 моделей на запрос).

```bash
npm run generate-models
# или
node generate-models-reference.js
```

**Результат**: `frontend/models-reference.json`

**Особенности**:
- Обрабатывает все марки из `frontend/brandname.json`
- Автоматически делает offset для марок с >50 моделями
- Задержка 500мс между запросами для защиты API
- Показывает прогресс и статистику

### 2. Нормализация названий моделей

Исправляет названия моделей:
- Регистр букв: `A4l` → `A4L`, `e-tron` → `E-tron`
- Переводы: `(Imported)` → `(Импорт)`
- Префиксы: `Rs` → `RS`, `Sq` → `SQ`, `Tt` → `TT`

```bash
node normalize-models.js
```

**Результат**:
- `frontend/models-reference-normalized.json` - нормализованный справочник
- `frontend/models-normalization-changes.json` - отчёт об изменениях

## Примеры изменений

```
Audi A4l → Audi A4L
Audi A3 (Imported) → Audi A3 (Импорт)
Audi Rs 3 → Audi RS 3
Audi e-tron GT → Audi E-tron GT
Bmw 1 Series (Imported) → Bmw 1 Series (Импорт)
```

## Применение изменений

После проверки результатов нормализации:

```bash
cd ../frontend
mv models-reference-normalized.json models-reference.json
```

## Статистика (последний запуск)

- **Марок**: 183
- **Моделей**: 1526
- **Среднее**: 8.3 модели на марку
- **Нормализовано**: 98 моделей (6.4%)

**Топ марки по количеству моделей**:
1. Mercedes-Benz: 72
2. BMW: 61
3. Volkswagen: 57
4. Audi: 45
5. BYD: 45
