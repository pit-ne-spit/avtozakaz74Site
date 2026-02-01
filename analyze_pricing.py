import json
import os
from datetime import datetime

# Загружаем все данные
all_cars = []
response_files = ['response_0.json', 'response_100.json', 'response_200.json', 'response_300.json', 'response_400.json']

for filename in response_files:
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if data.get('status') == 'success':
                all_cars.extend(data['data']['cars'])
                # Сохраняем курсы из первого файла
                if filename == 'response_0.json':
                    rates = data['data']['rates']

print(f"Всего загружено автомобилей: {len(all_cars)}\n")
print(f"Курсы валют: EUR = {rates['EUR']} RUB, CNY = {rates['CNY']} RUB\n")

# Анализируем расчёты
print("="*100)
print("АНАЛИЗ РАСЧЁТОВ СТОИМОСТИ")
print("="*100)

# Проверка формулы расчёта
errors = []
correct = 0

for i, car in enumerate(all_cars):
    infoid = car['infoid']
    price_cny = car['price_cny']
    recycling_fee = car['recycling_fee_rub']
    customs_fee = car['customs_fee_rub']
    import_duty = car['import_duty']
    excise_tax = car['excise_tax_rub']
    total_price_api = car['total_price_rub']
    
    # Рассчитываем цену в рублях
    price_rub = price_cny * rates['CNY']
    
    # Рассчитываем import_duty в рублях
    import_duty_rub = import_duty * rates['EUR']
    
    # Формула: total = price_rub + recycling_fee + customs_fee + import_duty_rub + excise_tax
    calculated_total = price_rub + recycling_fee + customs_fee + import_duty_rub + excise_tax
    
    # Проверяем разницу (допускаем погрешность округления до 1 рубля)
    difference = abs(calculated_total - total_price_api)
    
    if difference > 1:
        errors.append({
            'infoid': infoid,
            'carname': car['carname'],
            'price_cny': price_cny,
            'price_rub': round(price_rub, 2),
            'recycling_fee_rub': recycling_fee,
            'customs_fee_rub': customs_fee,
            'import_duty_eur': import_duty,
            'import_duty_rub': round(import_duty_rub, 2),
            'excise_tax_rub': excise_tax,
            'calculated_total': round(calculated_total, 2),
            'api_total': total_price_api,
            'difference': round(difference, 2),
            'engine_volume': car['engine_volume_ml'],
            'power_kw': car['power_kw'],
            'year': car['firstregyear'],
            'age_days': (datetime.now() - datetime.strptime(car['firstregshortdate'], '%Y-%m-%d')).days
        })
    else:
        correct += 1

print(f"Корректных расчётов: {correct} из {len(all_cars)}")
print(f"Расчётов с ошибками: {len(errors)}\n")

if errors:
    print("="*100)
    print("АВТОМОБИЛИ С РАСХОЖДЕНИЯМИ В РАСЧЁТАХ (первые 20)")
    print("="*100)
    
    for i, err in enumerate(errors[:20]):
        print(f"\n{i+1}. ID: {err['infoid']} | {err['carname']}")
        print(f"   Год: {err['year']} | Объём: {err['engine_volume']} мл | Мощность: {err['power_kw']} кВт | Возраст: {err['age_days']} дней")
        print(f"   Цена в CNY: {err['price_cny']:,} → {err['price_rub']:,.2f} RUB")
        print(f"   Утильсбор: {err['recycling_fee_rub']:,} RUB")
        print(f"   Таможенный сбор: {err['customs_fee_rub']:,} RUB")
        print(f"   Пошлина: {err['import_duty_eur']:,} EUR → {err['import_duty_rub']:,.2f} RUB")
        print(f"   Акциз: {err['excise_tax_rub']:,} RUB")
        print(f"   ---")
        print(f"   Рассчитанная сумма: {err['calculated_total']:,.2f} RUB")
        print(f"   API вернул:         {err['api_total']:,.2f} RUB")
        print(f"   РАЗНИЦА:            {err['difference']:,.2f} RUB")

    # Сохраняем все ошибки в файл
    with open('pricing_errors.json', 'w', encoding='utf-8') as f:
        json.dump(errors, f, ensure_ascii=False, indent=2)
    
    print(f"\n\nВсе {len(errors)} автомобилей с ошибками сохранены в файл: pricing_errors.json")

# Статистика по параметрам
print("\n" + "="*100)
print("СТАТИСТИКА ПО КЛЮЧЕВЫМ ПАРАМЕТРАМ")
print("="*100)

# Группируем по годам
years = {}
for car in all_cars:
    year = car['firstregyear']
    if year not in years:
        years[year] = []
    years[year].append(car)

print("\nРаспределение по годам выпуска:")
for year in sorted(years.keys()):
    print(f"  {year}: {len(years[year])} автомобилей")

# Группируем по объёму двигателя
volumes = {}
for car in all_cars:
    vol = car['engine_volume_ml']
    if vol is None:
        vol = 'Unknown'
    if vol not in volumes:
        volumes[vol] = []
    volumes[vol].append(car)

print("\nРаспределение по объёму двигателя:")
for vol in sorted(volumes.keys(), key=lambda x: x if isinstance(x, int) else 999999):
    print(f"  {vol} мл: {len(volumes[vol])} автомобилей")

# Статистика по утильсбору
unique_recycling_fees = {}
for car in all_cars:
    fee = car['recycling_fee_rub']
    vol = car['engine_volume_ml']
    power = car['power_kw']
    age_days = (datetime.now() - datetime.strptime(car['firstregshortdate'], '%Y-%m-%d')).days
    
    key = f"{fee}"
    if key not in unique_recycling_fees:
        unique_recycling_fees[key] = {
            'fee': fee,
            'count': 0,
            'volumes': set(),
            'powers': set(),
            'ages': set()
        }
    
    unique_recycling_fees[key]['count'] += 1
    unique_recycling_fees[key]['volumes'].add(vol)
    unique_recycling_fees[key]['powers'].add(power)
    unique_recycling_fees[key]['ages'].add(age_days)

print("\nУникальные значения утильсбора:")
for key in sorted(unique_recycling_fees.keys(), key=lambda x: unique_recycling_fees[x]['fee']):
    info = unique_recycling_fees[key]
    print(f"  {info['fee']:,} RUB: {info['count']} авто | Объёмы: {sorted(info['volumes'])} мл | Мощность: {sorted(info['powers'])} кВт")

print("\n" + "="*100)
print("АНАЛИЗ ЗАВЕРШЁН")
print("="*100)
