# Установка SSL сертификата для avtozakaz74.ru

## Что было настроено

✅ **docker-compose.yml** - добавлен сервис Certbot и volumes для сертификатов  
✅ **nginx.conf** - настроен HTTPS и автоматический редирект с HTTP  
✅ **init-letsencrypt.sh** - скрипт для первоначального получения сертификата  
✅ Автоматическое обновление сертификата каждые 12 часов

## Инструкция по установке на VPS

### Шаг 1: Проверка DNS
Убедитесь, что DNS записи указывают на IP вашего VPS:
```bash
# Проверка A-записи
nslookup avtozakaz74.ru
nslookup www.avtozakaz74.ru
```

### Шаг 2: Загрузка файлов на VPS
Загрузите обновленные файлы на сервер:
```bash
# С локальной машины (Windows)
scp docker-compose.yml user@your-vps-ip:/path/to/avtozakaz74Site/
scp frontend/nginx.conf user@your-vps-ip:/path/to/avtozakaz74Site/frontend/
scp init-letsencrypt.sh user@your-vps-ip:/path/to/avtozakaz74Site/
```

### Шаг 3: Настройка скрипта
На VPS откройте файл `init-letsencrypt.sh` и укажите свой email:
```bash
nano init-letsencrypt.sh
# Измените строку 10:
email="your-email@example.com"  # Ваш реальный email
```

### Шаг 4: Запуск установки SSL
```bash
# Дать права на выполнение
chmod +x init-letsencrypt.sh

# Запустить скрипт
./init-letsencrypt.sh
```

### Шаг 5: Проверка работы
После успешной установки:
```bash
# Проверить статус контейнеров
docker-compose ps

# Проверить логи nginx
docker-compose logs frontend

# Проверить логи certbot
docker-compose logs certbot
```

Откройте в браузере:
- https://avtozakaz74.ru
- https://www.avtozakaz74.ru

## Автоматическое обновление

Certbot контейнер автоматически проверяет и обновляет сертификаты каждые 12 часов.  
Сертификаты Let's Encrypt действительны 90 дней и обновляются автоматически за 30 дней до истечения.

## Устранение проблем

### Ошибка при получении сертификата
Если получили ошибку, проверьте:
1. DNS правильно настроен и указывает на VPS
2. Порты 80 и 443 открыты в фаерволе
3. Email указан в скрипте

### Тестовый режим (staging)
Для тестирования без ограничений Let's Encrypt:
```bash
# В init-letsencrypt.sh измените:
staging=1  # вместо staging=0
```

### Переустановка сертификата
```bash
# Остановить контейнеры
docker-compose down

# Удалить старые сертификаты
rm -rf ./certbot/conf/live/avtozakaz74.ru
rm -rf ./certbot/conf/archive/avtozakaz74.ru
rm -rf ./certbot/conf/renewal/avtozakaz74.ru.conf

# Запустить установку заново
./init-letsencrypt.sh
```

### Проверка срока действия сертификата
```bash
docker-compose exec frontend openssl x509 -noout -dates -in /etc/letsencrypt/live/avtozakaz74.ru/cert.pem
```

## Важные файлы

- `docker-compose.yml` - конфигурация Docker контейнеров
- `frontend/nginx.conf` - конфигурация Nginx с SSL
- `init-letsencrypt.sh` - скрипт первоначальной установки
- `certbot/conf/` - хранилище сертификатов (создается автоматически)
- `certbot/www/` - директория для ACME challenge (создается автоматически)

## Контакты Let's Encrypt

- Лимиты: 50 сертификатов на домен в неделю
- Документация: https://letsencrypt.org/docs/
- Staging API: для тестирования без лимитов
