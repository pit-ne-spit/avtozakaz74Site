# Backend Proxy Server

Прокси-сервер для безопасного хранения API токена che168.

## Технологии

- **Node.js** 20 (Alpine)
- **Express** 4 - веб-фреймворк
- **Helmet** - заголовки безопасности
- **CORS** - кросс-доменные запросы
- **dotenv** - переменные окружения

## Архитектура

```
Браузер → Frontend (nginx:80) → Backend (node:3000) → API che168
```

Backend добавляет API токен к каждому запросу перед отправкой на che168.

## Разработка

### Установка зависимостей

```bash
cd backend
npm install
```

### Запуск в dev режиме

```bash
npm run dev
```

Сервер запустится на http://localhost:3000

### Запуск в production

```bash
npm start
```

## API Endpoints

### Health Check
```
GET /health
```
Проверка состояния сервера.

### Search Cars
```
POST /api/search_car
```
Поиск автомобилей с фильтрами.

### Get Car Info
```
POST /api/get_car_info
```
Детальная информация об автомобиле.

### Get Available Filters
```
POST /api/getAvailableFilters
```
Получение доступных значений фильтров.

## Переменные окружения

Создайте файл `.env`:

```env
PORT=3000
API_TOKEN=ваш-токен-che168
```

⚠️ **ВАЖНО**: Никогда не коммитьте `.env` файл в git!

## Docker

### Локальная сборка

```bash
docker build -t avtozakaz74-backend .
docker run -p 3000:3000 --env-file .env avtozakaz74-backend
```

### Через Docker Compose

```bash
cd ..
docker compose up -d --build
```

## Безопасность

- ✅ API токен хранится только на сервере
- ✅ Helmet добавляет заголовки безопасности
- ✅ CORS настроен для защиты
- ✅ Валидация входящих данных через Express
- ✅ Логирование всех запросов

## Мониторинг

### Проверка здоровья

```bash
curl http://localhost:3000/health
```

Ответ:
```json
{
  "status": "ok",
  "timestamp": "2026-01-28T21:30:00.000Z"
}
```

### Просмотр логов в Docker

```bash
docker logs -f avtozakaz74-backend
```

## Troubleshooting

### Сервер не запускается

Проверьте логи:
```bash
docker logs avtozakaz74-backend
```

### Ошибки подключения к API

Убедитесь что токен валиден:
```bash
curl -X POST https://api-centr.ru/che168/search_car \
  -H "Authorization: ваш-токен" \
  -H "Content-Type: application/json" \
  -d '{"filters":{},"pagination":{"limit":1,"offset":0}}'
```

### Порт занят

Измените PORT в `.env` файле или используйте другой порт в docker-compose.yml
