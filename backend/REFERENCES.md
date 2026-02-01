# Управление справочниками на Backend

## Описание

Backend автоматически генерирует и обновляет справочники марок и моделей автомобилей из API che168.

## API Endpoints

### Получение справочников

```http
GET /api/brands
```
Возвращает список всех брендов автомобилей.

```http
GET /api/models
```
Возвращает справочник моделей (объект: brand → models[]).

```http
GET /api/references/metadata
```
Возвращает метаданные последнего обновления:
- lastUpdate - дата/время обновления
- brandsCount - количество брендов
- modelsCount - общее количество моделей
- avgModelsPerBrand - среднее моделей на бренд
- duration - время генерации

### Управление обновлением

```http
POST /api/references/update
```
Запускает ручное обновление справочников в фоновом режиме.

## Автоматическое обновление

Справочники автоматически обновляются **ежедневно в 3:00** по московскому времени через cron job.

### Настройка расписания

В `server.js`:
```javascript
cron.schedule('0 3 * * *', async () => {
  // обновление справочников
}, {
  timezone: 'Europe/Moscow'
});
```

Формат cron: `минута час день месяц день_недели`

## Ручное обновление

### Через API
```bash
curl -X POST http://localhost:3000/api/references/update
```

### Через скрипт
```bash
cd backend
node scripts/updateReferences.js
```

## Структура данных

### backend/data/
```
data/
├── brands.json          # Список брендов
├── models.json          # Модели по брендам
└── last-update.json     # Метаданные обновления
```

### brands.json
```json
{
  "values": ["Audi", "Bmw", "Mercedes-Benz", ...]
}
```

### models.json
```json
{
  "Audi": ["Audi A3", "Audi A4L", "Audi RS 3", ...],
  "Bmw": ["Bmw 1 Series", "Bmw 3 Series", ...]
}
```

### last-update.json
```json
{
  "lastUpdate": "2026-02-01T18:50:38.123Z",
  "brandsCount": 50,
  "modelsCount": 468,
  "avgModelsPerBrand": "9.4",
  "duration": "260.4s"
}
```

## Нормализация названий

Скрипт автоматически нормализует названия моделей:

| До | После |
|---|---|
| `Audi A4l` | `Audi A4L` |
| `Audi Rs 3` | `Audi RS 3` |
| `Bmw 1 Series (Imported)` | `Bmw 1 Series (Импорт)` |
| `Audi e-tron GT` | `Audi E-tron GT` |

## Логирование

Все операции логируются с timestamp:
```
[2026-02-01T18:50:38.123Z] [INFO] === Начало обновления справочников ===
[2026-02-01T18:50:39.456Z] [INFO] Получение списка брендов...
[2026-02-01T18:50:40.789Z] [INFO] ✓ Получено брендов: 50
...
[2026-02-01T18:55:00.123Z] [INFO] === Обновление завершено ===
```

## Масштабирование

### Для нескольких сайтов

1. Frontend загружает справочники с backend через API
2. Все сайты используют единый источник данных
3. Обновление происходит централизованно
4. Добавление нового сайта - просто подключение к API

### Кэширование на frontend

Frontend может кэшировать справочники в localStorage и проверять актуальность через `/api/references/metadata`.

## Мониторинг

### Проверка последнего обновления
```bash
curl http://localhost:3000/api/references/metadata
```

### Логи cron job
Ищите строки с префиксом `[CRON]` в логах backend:
```bash
docker logs avtozakaz74-backend | grep CRON
```

## Устранение проблем

### Справочники не обновились

1. Проверьте логи backend
2. Проверьте доступность API che168
3. Убедитесь что токен API валиден
4. Запустите ручное обновление через `/api/references/update`

### Пустые справочники

```bash
# Проверить файлы
ls -lh backend/data/

# Запустить генерацию вручную
node backend/scripts/updateReferences.js
```

## Переменные окружения

```env
API_TOKEN=che168-xxx  # Токен API che168
PORT=3000             # Порт backend
```

## Зависимости

```json
{
  "node-cron": "^3.0.0"  // Для cron jobs
}
```
