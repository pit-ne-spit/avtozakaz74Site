# Быстрый старт на VPS

Минимальная инструкция для быстрого развертывания проекта.

## 1. Установка Docker (если не установлен)

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo apt install docker-compose-plugin -y
```

## 2. Клонирование и настройка

```bash
# Клонирование проекта
git clone https://github.com/pit-ne-spit/avtozakaz74Site.git
cd avtozakaz74Site
git checkout new-design

# Создание .env файла для backend
cp backend/.env.example backend/.env

# ВАЖНО: Отредактируйте backend/.env и добавьте ваш токен
nano backend/.env
```

## 3. Запуск

```bash
# Сборка и запуск всех сервисов
docker compose up -d --build

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f
```

## 4. Проверка работы

```bash
# Проверка backend
curl http://localhost:3000/health

# Должен вернуть:
# {"status":"ok","timestamp":"2026-01-28T..."}
```

Приложение доступно на: `http://your-vps-ip`

## Управление

```bash
# Остановка
docker compose down

# Перезапуск
docker compose restart

# Обновление
git pull
docker compose up -d --build
```

## Структура сервисов

- **Backend** (порт 3000) - Прокси с API токеном
- **Frontend** (порт 80) - React приложение через Nginx

## Troubleshooting

### Backend не запускается
```bash
docker compose logs backend
```

### Frontend не видит backend
```bash
# Проверьте сеть Docker
docker network inspect avtozakaz74-network
```

### Нужно изменить токен
```bash
# Отредактируйте .env
nano backend/.env

# Перезапустите backend
docker compose restart backend
```

## Безопасность

⚠️ **Обязательно**:
- Файл `backend/.env` не должен попадать в git
- Используйте firewall (разрешены только порты 80, 443, 22)
- Настройте HTTPS с Let's Encrypt

Подробная документация: см. `DEPLOYMENT.md`
