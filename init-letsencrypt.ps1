# Скрипт инициализации Let's Encrypt SSL сертификата
# Использование: Запустить на VPS сервере перед первым запуском docker-compose

$domains = @("avtozakaz74.ru", "www.avtozakaz74.ru")
$rsa_key_size = 4096
$data_path = "./certbot"
$email = "" # Добавьте ваш email для уведомлений от Let's Encrypt
$staging = 0 # Установите 1 для тестирования (staging режим), 0 для продакшн

# Проверка наличия email
if ([string]::IsNullOrEmpty($email)) {
    Write-Host "ОШИБКА: Укажите email в переменной `$email" -ForegroundColor Red
    exit 1
}

# Создание директорий
if (!(Test-Path "$data_path/conf")) {
    New-Item -ItemType Directory -Path "$data_path/conf" -Force | Out-Null
}
if (!(Test-Path "$data_path/www")) {
    New-Item -ItemType Directory -Path "$data_path/www" -Force | Out-Null
}

Write-Host "### Загрузка рекомендованных параметров TLS от Let's Encrypt ..." -ForegroundColor Green

$options_ssl_nginx = "$data_path/conf/options-ssl-nginx.conf"
$ssl_dhparams = "$data_path/conf/ssl-dhparams.pem"

if (!(Test-Path $options_ssl_nginx)) {
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf" -OutFile $options_ssl_nginx
}

if (!(Test-Path $ssl_dhparams)) {
    Invoke-WebRequest -Uri "https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem" -OutFile $ssl_dhparams
}

Write-Host ""

# Создание временного самоподписанного сертификата
$domain_primary = $domains[0]
$cert_path = "$data_path/conf/live/$domain_primary"

if (Test-Path $cert_path) {
    Write-Host "### Сертификат для $domain_primary уже существует. Пропускаем создание временного..." -ForegroundColor Yellow
} else {
    Write-Host "### Создание временного самоподписанного сертификата для $domain_primary ..." -ForegroundColor Green
    New-Item -ItemType Directory -Path $cert_path -Force | Out-Null
    
    docker-compose run --rm --entrypoint "openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1 -keyout '/etc/letsencrypt/live/$domain_primary/privkey.pem' -out '/etc/letsencrypt/live/$domain_primary/fullchain.pem' -subj '/CN=localhost'" certbot
    Write-Host ""
}

Write-Host "### Запуск nginx ..." -ForegroundColor Green
docker-compose up --force-recreate -d frontend
Write-Host ""

Write-Host "### Удаление временного сертификата для $domain_primary ..." -ForegroundColor Green
docker-compose run --rm --entrypoint "rm -Rf /etc/letsencrypt/live/$domain_primary && rm -Rf /etc/letsencrypt/archive/$domain_primary && rm -Rf /etc/letsencrypt/renewal/$domain_primary.conf" certbot
Write-Host ""

Write-Host "### Запрос настоящего Let's Encrypt сертификата для $domain_primary ..." -ForegroundColor Green

# Формирование domain_args
$domain_args = ""
foreach ($domain in $domains) {
    $domain_args += "-d $domain "
}

# Staging или production
$staging_arg = ""
if ($staging -ne 0) {
    $staging_arg = "--staging"
}

docker-compose run --rm --entrypoint "certbot certonly --webroot -w /var/www/certbot $staging_arg $domain_args --email $email --rsa-key-size $rsa_key_size --agree-tos --force-renewal" certbot
Write-Host ""

Write-Host "### Перезагрузка nginx ..." -ForegroundColor Green
docker-compose exec frontend nginx -s reload

Write-Host ""
Write-Host "### SSL сертификат успешно установлен!" -ForegroundColor Green
Write-Host "### Автоматическое обновление настроено через certbot контейнер" -ForegroundColor Green
