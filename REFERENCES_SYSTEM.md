# Система управления справочниками

## Обзор

Реализована централизованная система управления справочниками марок и моделей автомобилей с автоматическим обновлением.

## Архитектура

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                         │
│  - Загрузка справочников при старте приложения      │
│  - GET /api/brands → список брендов                 │
│  - GET /api/models → справочник моделей             │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│                    Backend                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ API Endpoints                                │   │
│  │ - GET /api/brands                            │   │
│  │ - GET /api/models                            │   │
│  │ - GET /api/references/metadata               │   │
│  │ - POST /api/references/update                │   │
│  └──────────────────────────────────────────────┘   │
│                     │                                │
│  ┌──────────────────▼──────────────────────────┐   │
│  │ Cron Job (ежедневно 3:00 МСК)               │   │
│  │ - Автоматическое обновление справочников     │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                                │
│  ┌──────────────────▼──────────────────────────┐   │
│  │ updateReferences.js                         │   │
│  │ - Генерация брендов (pagination)            │   │
│  │ - Генерация моделей для каждого бренда      │   │
│  │ - Нормализация названий                     │   │
│  └──────────────────┬──────────────────────────┘   │
│                     │                                │
│  ┌──────────────────▼──────────────────────────┐   │
│  │ Data Storage (backend/data/)                │   │
│  │ - brands.json                               │   │
│  │ - models.json                               │   │
│  │ - last-update.json                          │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────┐
│            API che168 (External)                    │
│  - POST /che168/getAvailableFilters                 │
│  - Источник данных о брендах и моделях              │
└─────────────────────────────────────────────────────┘
```

## Компоненты

### Backend

#### 1. Скрипт обновления (`backend/scripts/updateReferences.js`)

**Функции:**
- `fetchBrands()` - получение всех брендов с pagination (лимит 50)
- `fetchModelsForBrand()` - получение моделей для конкретного бренда
- `normalizeModelName()` - нормализация названий моделей
- `generateReferences()` - главная функция генерации

**Нормализация:**
- `A4l` → `A4L`
- `(Imported)` → `(Импорт)`
- `Rs 3` → `RS 3`
- `e-tron` → `E-tron`

**Производительность:**
- ~183 бренда
- ~1526 моделей
- Время выполнения: 2-3 минуты

#### 2. API Endpoints (`backend/server.js`)

```javascript
GET /api/brands
// Возвращает: { values: ["Audi", "Bmw", ...] }

GET /api/models
// Возвращает: { "Audi": ["Audi A3", ...], "Bmw": [...] }

GET /api/references/metadata
// Возвращает: { lastUpdate, brandsCount, modelsCount, ... }

POST /api/references/update
// Запускает обновление в фоне
```

#### 3. Автообновление (Cron Job)

```javascript
cron.schedule('0 3 * * *', async () => {
  await generateReferences();
}, { timezone: 'Europe/Moscow' });
```

**Расписание:** Ежедневно в 3:00 по московскому времени

### Frontend

#### Загрузка справочников (`frontend/src/App.jsx`)

```javascript
useEffect(() => {
  const loadReferences = async () => {
    // Load brands
    const brandsResponse = await fetch('/api/brands');
    const brandsData = await brandsResponse.json();
    setBrands(brandsData.values);
    
    // Load models
    const modelsResponse = await fetch('/api/models');
    const modelsData = await modelsResponse.json();
    setModelsReference(modelsData);
  };
  
  loadReferences();
}, []);
```

## Данные

### Структура файлов

```
backend/data/
├── brands.json          # ~1 KB
├── models.json          # ~34 KB
└── last-update.json     # ~0.14 KB
```

### brands.json
```json
{
  "values": [
    "Acura",
    "Audi",
    "Bmw",
    ...
  ]
}
```

### models.json
```json
{
  "Audi": [
    "Audi A1",
    "Audi A3",
    "Audi A3 (Импорт)",
    "Audi A4L",
    "Audi RS 3",
    ...
  ],
  "Bmw": [...]
}
```

### last-update.json
```json
{
  "lastUpdate": "2026-02-01T19:05:00.000Z",
  "brandsCount": 183,
  "modelsCount": 1526,
  "avgModelsPerBrand": "8.3",
  "duration": "156.4s"
}
```

## Использование

### Ручное обновление

#### Через API
```bash
curl -X POST http://localhost:3000/api/references/update
```

#### Через скрипт
```bash
cd backend
node scripts/updateReferences.js
```

### Проверка данных

```bash
# Метаданные последнего обновления
curl http://localhost:3000/api/references/metadata

# Список брендов
curl http://localhost:3000/api/brands

# Справочник моделей
curl http://localhost:3000/api/models
```

## Мониторинг

### Логи обновления

Backend логирует все операции:

```
[2026-02-01T19:05:00.000Z] [INFO] === Начало обновления справочников ===
[2026-02-01T19:05:01.123Z] [INFO] Получение списка брендов...
[2026-02-01T19:05:02.456Z] [INFO] ✓ Получено брендов (offset 0): 50
[2026-02-01T19:05:03.789Z] [INFO] ✓ Получено брендов (offset 50): 50
...
[2026-02-01T19:05:10.123Z] [INFO] ✓ Всего брендов: 183
[2026-02-01T19:05:11.456Z] [INFO] Получение моделей для 183 брендов...
...
[2026-02-01T19:07:30.789Z] [INFO] === Обновление завершено ===
```

### Cron логи

Ищите строки с префиксом `[CRON]`:

```bash
docker logs avtozakaz74-backend | grep CRON
```

## Масштабирование

### Для нескольких сайтов

1. Все frontend приложения подключаются к единому backend
2. Каждый сайт получает актуальные данные автоматически
3. Обновление происходит централизованно
4. Не требуется синхронизация между сайтами

### Добавление нового сайта

```javascript
// В новом frontend приложении
const brandsResponse = await fetch('https://backend.domain.com/api/brands');
const modelsResponse = await fetch('https://backend.domain.com/api/models');
```

## Преимущества

✅ **Централизованное управление** - один источник истины  
✅ **Автоматическое обновление** - раз в день без вмешательства  
✅ **Масштабируемость** - легко добавлять новые сайты  
✅ **Производительность** - мгновенная загрузка на frontend  
✅ **Актуальность** - всегда свежие данные  
✅ **Нормализация** - единообразные названия  
✅ **Мониторинг** - логирование всех операций  

## Поддержка

### Проблемы с обновлением

1. Проверьте логи backend
2. Проверьте доступность API che168
3. Убедитесь что токен валиден
4. Запустите ручное обновление

### Пустые справочники

```bash
# Проверить файлы
ls backend/data/

# Запустить генерацию
curl -X POST http://localhost:3000/api/references/update

# Проверить результат через 3-5 минут
curl http://localhost:3000/api/references/metadata
```

## Переменные окружения

```env
# backend/.env
API_TOKEN=che168-xxx
PORT=3000
```

## Зависимости

```json
{
  "node-cron": "^3.0.0"
}
```

## Документация

- `backend/REFERENCES.md` - детальная документация backend
- `scripts/README.md` - документация скриптов (старая)
- `frontend/MODELS_REFERENCE.md` - документация frontend (устарела)
