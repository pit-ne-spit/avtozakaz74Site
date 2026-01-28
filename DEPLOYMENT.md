# Развёртывание на VPS

Инструкция по установке и запуску проекта Avtozakaz74 на VPS сервере.

## Требования

- VPS с Ubuntu 20.04+ / Debian 11+
- Docker 20.10+
- Docker Compose 2.0+
- Минимум 1GB RAM, 1 CPU core
- Открытый порт 80 (HTTP) и 443 (HTTPS, опционально)

## Установка Docker на VPS

Если Docker еще не установлен:

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo apt install docker-compose-plugin -y

# Добавление пользователя в группу docker (опционально)
sudo usermod -aG docker $USER
```

После установки перелогиньтесь или выполните:
```bash
newgrp docker
```

## Развёртывание приложения

### 1. Клонирование репозитория

```bash
# Клонирование из GitHub
git clone https://github.com/pit-ne-spit/avtozakaz74Site.git
cd avtozakaz74Site

# Или переключение на нужную ветку
git checkout presets-feature
```

### 2. Сборка и запуск

```bash
# Сборка и запуск контейнеров
docker compose up -d --build
```

### 3. Проверка статуса

```bash
# Просмотр запущенных контейнеров
docker compose ps

# Просмотр логов
docker compose logs -f frontend
```

Приложение будет доступно по адресу: `http://your-vps-ip`

## Управление приложением

### Остановка
```bash
docker compose down
```

### Перезапуск
```bash
docker compose restart
```

### Обновление кода
```bash
# Получение последних изменений
git pull

# Пересборка и перезапуск
docker compose up -d --build
```

### Просмотр логов
```bash
# Все логи
docker compose logs -f

# Только frontend
docker compose logs -f frontend
```

## Настройка HTTPS (опционально)

Для использования HTTPS рекомендуется использовать Nginx Proxy Manager или Traefik с Let's Encrypt.

### Вариант 1: Nginx Proxy Manager

```bash
# Измените порт в docker-compose.yml на 8080:80
# Затем добавьте Nginx Proxy Manager
```

### Вариант 2: Certbot

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx -y

# Получение сертификата
sudo certbot --nginx -d yourdomain.com
```

## Мониторинг

### Проверка использования ресурсов
```bash
docker stats avtozakaz74-frontend
```

### Проверка здоровья контейнера
```bash
docker inspect --format='{{json .State.Health}}' avtozakaz74-frontend
```

## Резервное копирование

Важные файлы для бэкапа:
- `backend/.env` - **КРИТИЧНО ВАЖНО!** Содержит API токен
- `docker-compose.yml` - конфигурация сервисов
- `frontend/brandname.json` - справочник марок
- `frontend/public/` - статические файлы (логотипы, изображения)

## Безопасность

⚠️ **ВАЖНО**: API токен хранится в коде! Для production:

1. **Создайте переменные окружения**:
```bash
# Создайте .env файл в корне проекта
echo "VITE_API_TOKEN=che168-Onh9OZEJchYMZgdXy" > .env
```

2. **Обновите api.js** для использования переменных окружения:
```javascript
const API_TOKEN = import.meta.env.VITE_API_TOKEN || 'che168-Onh9OZEJchYMZgdXy';
```

3. **Добавьте .env в .gitignore**

## Troubleshooting

### Контейнер не запускается
```bash
docker compose logs frontend
```

### Проблемы с сетью
```bash
docker network ls
docker network inspect avtozakaz74-network
```

### Очистка неиспользуемых ресурсов
```bash
docker system prune -a
```

## Производительность

### Оптимизация nginx
Текущая конфигурация уже включает:
- Gzip сжатие
- Кэширование статических файлов (7 дней)
- Настроенные таймауты

### Оптимизация Docker образа
- Multi-stage build минимизирует размер образа
- Alpine Linux как базовый образ (~50MB вместо ~1GB)

## Обновление

```bash
# Получить последние изменения
cd /path/to/avtozakaz74Site
git pull origin main

# Пересобрать и перезапустить
docker compose up -d --build

# Удалить старые образы
docker image prune -f
```

## Контакты поддержки

- Telegram: https://t.me/avtozakaz74
- Телефоны: +7 902 614-25-03, +7 919 302-89-13, +7 951 450-22-25
