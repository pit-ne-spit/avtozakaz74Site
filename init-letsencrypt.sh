#!/bin/bash

# Скрипт инициализации Let's Encrypt SSL сертификата
# Использование: Запустить на VPS сервере перед первым запуском docker-compose
# chmod +x init-letsencrypt.sh && ./init-letsencrypt.sh

domains=(avtozakaz74.ru www.avtozakaz74.ru)
rsa_key_size=4096
data_path="./certbot"
email="" # Добавьте ваш email для уведомлений от Let's Encrypt
staging=0 # Установите 1 для тестирования (staging режим), 0 для продакшн

# Проверка наличия email
if [ -z "$email" ]; then
  echo "ОШИБКА: Укажите email в переменной 'email'"
  exit 1
fi

# Создание директорий
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Загрузка рекомендованных параметров TLS от Let's Encrypt ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

echo "### Создание директории для www ..."
mkdir -p "$data_path/www"

# Создание временного самоподписанного сертификата
domain_primary="${domains[0]}"
cert_path="$data_path/conf/live/$domain_primary"

if [ -d "$cert_path" ]; then
  echo "### Сертификат для $domain_primary уже существует. Пропускаем создание временного..."
else
  echo "### Создание временного самоподписанного сертификата для $domain_primary ..."
  mkdir -p "$cert_path"
  
  docker-compose run --rm --entrypoint "\
    openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 \
      -keyout '/etc/letsencrypt/live/$domain_primary/privkey.pem' \
      -out '/etc/letsencrypt/live/$domain_primary/fullchain.pem' \
      -subj '/CN=localhost'" certbot
  echo
fi

echo "### Запуск nginx ..."
docker-compose up --force-recreate -d frontend
echo

echo "### Удаление временного сертификата для $domain_primary ..."
docker-compose run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domain_primary && \
  rm -Rf /etc/letsencrypt/archive/$domain_primary && \
  rm -Rf /etc/letsencrypt/renewal/$domain_primary.conf" certbot
echo

echo "### Запрос настоящего Let's Encrypt сертификата для $domain_primary ..."

# Формирование domain_args
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Staging или production
staging_arg=""
if [ $staging != "0" ]; then staging_arg="--staging"; fi

docker-compose run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $domain_args \
    --email $email \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

echo "### Перезагрузка nginx ..."
docker-compose exec frontend nginx -s reload

echo
echo "### SSL сертификат успешно установлен!"
echo "### Автоматическое обновление настроено через certbot контейнер"
