import json

# Загружаем данные одного автомобиля для проверки
with open('response_0.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    
car = data['data']['cars'][0]  # Берём первый автомобиль
rates = data['data']['rates']

print("="*100)
print("ДЕТАЛЬНАЯ ПРОВЕРКА РАСЧЁТА ПО СТАТЬЕ AUTO.RU")
print("="*100)
print(f"\nАвтомобиль: {car['carname']}")
print(f"ID: {car['infoid']}")
print(f"Год: {car['firstregyear']} ({car['firstregshortdate']})")
print(f"Объём двигателя: {car['engine_volume_ml']} мл")
print(f"Мощность: {car['power_kw']} кВт ({round(car['power_kw'] * 1.36, 1)} л.с.)")
print(f"\nКурсы валют:")
print(f"  EUR: {rates['EUR']} RUB")
print(f"  CNY: {rates['CNY']} RUB")

print("\n" + "="*100)
print("ДАННЫЕ ИЗ API")
print("="*100)
print(f"Цена в CNY: {car['price_cny']:,} → {car['price_cny'] * rates['CNY']:,.2f} RUB")
print(f"Утильсбор (recycling_fee_rub): {car['recycling_fee_rub']:,} RUB")
print(f"Таможенный сбор (customs_fee_rub): {car['customs_fee_rub']:,} RUB")
print(f"Пошлина (import_duty): {car['import_duty']:,} EUR → {car['import_duty'] * rates['EUR']:,.2f} RUB")
print(f"Акциз (excise_tax_rub): {car['excise_tax_rub']:,} RUB")
print(f"\nИТОГО (total_price_rub): {car['total_price_rub']:,} RUB")

# Расчёт возраста
from datetime import datetime
reg_date = datetime.strptime(car['firstregshortdate'], '%Y-%m-%d')
age_days = (datetime.now() - reg_date).days
age_years = age_days / 365.25

print("\n" + "="*100)
print("ПРОВЕРКА РАСЧЁТОВ ПО ДАННЫМ ИЗ СТАТЬИ")
print("="*100)

# Определяем категорию по возрасту (от даты выпуска)
year_now = datetime.now().year
year_reg = car['firstregyear']
car_age = year_now - year_reg

print(f"\nВозраст автомобиля:")
print(f"  Год выпуска: {year_reg}")
print(f"  Текущий год: {year_now}")
print(f"  Возраст: {car_age} лет ({age_days} дней)")
print(f"  Категория: ", end="")

if car_age < 3:
    print("до 3 лет (НОВЫЙ)")
    age_category = "new"
elif 3 <= car_age < 5:
    print("от 3 до 5 лет")
    age_category = "3-5"
else:
    print("старше 5 лет")
    age_category = "5+"

# ПРОВЕРЯЕМ ТАМОЖЕННУЮ ПОШЛИНУ
print(f"\n--- 1. ТАМОЖЕННАЯ ПОШЛИНА ---")
volume_ml = car['engine_volume_ml']
price_eur = car['price_cny'] / rates['CNY'] * rates['EUR'] / rates['EUR']  # Для простоты
price_rub = car['price_cny'] * rates['CNY']

# Конвертируем цену в евро для проверки границ
price_in_eur = price_rub / rates['EUR']

print(f"Цена авто в EUR: {price_in_eur:,.2f} EUR")
print(f"Объём двигателя: {volume_ml} см³")

# Для авто старше 3 лет используем евро за см³
if age_category in ["3-5", "5+"]:
    # Таблица из статьи для авто 3-5 лет
    if age_category == "3-5":
        if volume_ml < 1000:
            rate = 1.5
        elif 1000 <= volume_ml < 1500:
            rate = 1.7
        elif 1500 <= volume_ml < 1800:
            rate = 2.5
        elif 1800 <= volume_ml < 2300:
            rate = 2.7
        elif 2300 <= volume_ml < 3000:
            rate = 3.0
        else:
            rate = 3.6
    else:  # 5+
        if volume_ml < 1000:
            rate = 3.0
        elif 1000 <= volume_ml < 1500:
            rate = 3.2
        elif 1500 <= volume_ml < 1800:
            rate = 3.5
        elif 1800 <= volume_ml < 2300:
            rate = 4.8
        elif 2300 <= volume_ml < 3000:
            rate = 5.0
        else:
            rate = 5.7
    
    calculated_duty_eur = volume_ml * rate
    print(f"Ставка: {rate} EUR/см³")
    print(f"Рассчитанная пошлина: {volume_ml} × {rate} = {calculated_duty_eur:,.2f} EUR")
    print(f"API возвращает: {car['import_duty']:,.2f} EUR")
    print(f"РАЗНИЦА: {abs(calculated_duty_eur - car['import_duty']):,.2f} EUR")

# ПРОВЕРЯЕМ УТИЛИЗАЦИОННЫЙ СБОР
print(f"\n--- 2. УТИЛИЗАЦИОННЫЙ СБОР ---")
power_hp = car['power_kw'] * 1.36
base_rate = 20000  # Базовая ставка для легковых

print(f"Мощность: {car['power_kw']} кВт = {power_hp:.1f} л.с.")
print(f"Базовая ставка: {base_rate:,} RUB")

# Определяем коэффициент из таблицы статьи
# Для 2.0-3.0л и возраста до 3 лет / более 3 лет
volume_liters = volume_ml / 1000

if volume_liters < 1.0:
    vol_category = "до 1.0л"
elif 1.0 <= volume_liters < 2.0:
    vol_category = "1.0-2.0л"
elif 2.0 <= volume_liters < 3.0:
    vol_category = "2.0-3.0л"
elif 3.0 <= volume_liters < 3.5:
    vol_category = "3.0-3.5л"
else:
    vol_category = "более 3.5л"

print(f"Категория по объёму: {vol_category} ({volume_liters:.1f}л)")
print(f"Категория по возрасту: {'более 3 лет' if car_age >= 3 else 'до 3 лет'}")

# Упрощённая проверка - для точного нужна полная таблица из статьи
print(f"API возвращает утильсбор: {car['recycling_fee_rub']:,} RUB")
print(f"Коэффициент (по API): {car['recycling_fee_rub'] / base_rate:.2f}")

# Особый случай: если двигатель до 3л и мощность до 160 л.с., то льготный сбор 5200 руб
if volume_liters <= 3.0 and power_hp <= 160:
    print(f"⚠️ ЛЬГОТНЫЙ ТАРИФ: двигатель до 3л и мощность до 160 л.с.")
    print(f"   Ожидаемый утильсбор для физлица: 5,200 RUB")
    if car['recycling_fee_rub'] == 5200:
        print(f"   ✓ СОВПАДАЕТ!")
    elif car['recycling_fee_rub'] == 3400:
        print(f"   ⚠️ API вернул 3,400 RUB (возможно новый автомобиль до 3 лет)")

# ПРОВЕРЯЕМ ТАМОЖЕННЫЙ СБОР
print(f"\n--- 3. ТАМОЖЕННЫЙ СБОР ---")
# Таблица из статьи
if price_rub <= 200000:
    expected_customs = 1231
elif price_rub <= 450000:
    expected_customs = 2462
elif price_rub <= 1200000:
    expected_customs = 4924
elif price_rub <= 2700000:
    expected_customs = 13541
elif price_rub <= 4200000:
    expected_customs = 18465
elif price_rub <= 5500000:
    expected_customs = 21344
elif price_rub <= 10000000:
    expected_customs = 49240
else:
    expected_customs = 73860

print(f"Цена автомобиля: {price_rub:,.2f} RUB")
print(f"Ожидаемый таможенный сбор: {expected_customs:,} RUB")
print(f"API возвращает: {car['customs_fee_rub']:,} RUB")
if expected_customs == car['customs_fee_rub']:
    print(f"✓ СОВПАДАЕТ!")
else:
    print(f"✗ НЕ СОВПАДАЕТ! Разница: {abs(expected_customs - car['customs_fee_rub']):,} RUB")

# ИТОГОВЫЙ РАСЧЁТ
print(f"\n" + "="*100)
print("ИТОГОВЫЙ РАСЧЁТ")
print("="*100)

calculated_total = (
    price_rub +
    car['recycling_fee_rub'] +
    car['customs_fee_rub'] +
    car['import_duty'] * rates['EUR'] +
    car['excise_tax_rub']
)

print(f"Цена в CNY: {car['price_cny']:,} → {price_rub:,.2f} RUB")
print(f"+ Утильсбор: {car['recycling_fee_rub']:,} RUB")
print(f"+ Таможенный сбор: {car['customs_fee_rub']:,} RUB")
print(f"+ Пошлина: {car['import_duty']:,} EUR → {car['import_duty'] * rates['EUR']:,.2f} RUB")
print(f"+ Акциз: {car['excise_tax_rub']:,} RUB")
print(f"{'='*50}")
print(f"РАССЧИТАНО: {calculated_total:,.2f} RUB")
print(f"API ВЕРНУЛ:  {car['total_price_rub']:,.2f} RUB")
print(f"РАЗНИЦА:     {abs(calculated_total - car['total_price_rub']):,.2f} RUB")

if abs(calculated_total - car['total_price_rub']) <= 50:
    print(f"\n✓ Расчёт КОРРЕКТЕН (расхождение в пределах погрешности округления)")
else:
    print(f"\n✗ Расчёт содержит ОШИБКУ!")
