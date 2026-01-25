/**
 * Тестовый скрипт для проверки API
 * Запуск: node test_api.js
 */

const API_BASE = 'http://localhost:8000';

async function testAPI() {
  console.log('🧪 Тестирование API...\n');

  // Тест 1: Health check
  console.log('1️⃣ Проверка /health');
  try {
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    console.log('✅ Health:', healthData);
  } catch (error) {
    console.error('❌ Health failed:', error.message);
  }

  // Тест 2: Получение списка машин (без фильтров)
  console.log('\n2️⃣ Проверка /cars (без фильтров)');
  try {
    const carsRes = await fetch(`${API_BASE}/cars?limit=10&offset=0`);
    if (!carsRes.ok) {
      const errorText = await carsRes.text();
      console.error('❌ Status:', carsRes.status);
      console.error('❌ Response:', errorText);
      return;
    }
    const carsData = await carsRes.json();
    console.log('✅ Получено машин:', carsData.cars.length);
    console.log('✅ Всего в базе:', carsData.total);
    console.log('✅ Первая машина:', carsData.cars[0]);
  } catch (error) {
    console.error('❌ Cars failed:', error.message);
  }

  // Тест 3: Фильтр по бренду
  console.log('\n3️⃣ Проверка фильтра по бренду (mercedes-benz)');
  try {
    const brandRes = await fetch(`${API_BASE}/cars?brand=mercedes-benz&limit=5`);
    if (!brandRes.ok) {
      const errorText = await brandRes.text();
      console.error('❌ Status:', brandRes.status);
      console.error('❌ Response:', errorText);
      return;
    }
    const brandData = await brandRes.json();
    console.log('✅ Найдено Mercedes:', brandData.total);
    console.log('✅ Пример:', brandData.cars[0]?.brand);
  } catch (error) {
    console.error('❌ Brand filter failed:', error.message);
  }

  // Тест 4: Статистика
  console.log('\n4️⃣ Проверка /stats');
  try {
    const statsRes = await fetch(`${API_BASE}/stats`);
    if (!statsRes.ok) {
      const errorText = await statsRes.text();
      console.error('❌ Status:', statsRes.status);
      console.error('❌ Response:', errorText);
      return;
    }
    const statsData = await statsRes.json();
    console.log('✅ Статистика:', statsData);
  } catch (error) {
    console.error('❌ Stats failed:', error.message);
  }

  console.log('\n✨ Тесты завершены!');
}

testAPI();
