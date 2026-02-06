import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { generateReferences } from './scripts/updateReferences.js';
import { calculatePriceWithDrom } from './scripts/dromPriceCalculator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.API_TOKEN || 'che168-Onh9OZEJchYMZgdXy';
const CHE168_API_URL = 'https://api-centr.ru/che168';
const DATA_DIR = path.join(__dirname, 'data');

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Proxy endpoint for search_car with drom.ru price calculation
app.post('/api/search_car', async (req, res) => {
  try {
    const response = await fetch(`${CHE168_API_URL}/search_car`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': API_TOKEN
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
    
    // If we have cars and rates, calculate prices using drom.ru API
    if (data.status === 'success' && data.data?.cars && Array.isArray(data.data.cars) && data.data.rates) {
      
      const rates = data.data.rates;
      const originalCars = [...data.data.cars]; // Save original array
      
      // Process cars with price calculation (with timeout per car: 5 seconds)
      const carsWithPrices = await Promise.allSettled(
        originalCars.map(async (car) => {
          const dromResult = await calculatePriceWithDrom(car, rates, 5000);
          
          if (dromResult) {
            // Add calculated price data to car object
            return {
              ...car,
              drom_price_calculation: {
                totalPrice: dromResult.totalPrice,
                details: dromResult.details
              }
            };
          }
          
          // If calculation failed, return car as-is
          return car;
        })
      );
      
      // Extract values from Promise.allSettled results
      // If promise failed, use original car from original array
      data.data.cars = carsWithPrices.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          // If calculation failed, return original car
          return originalCars[index] || {};
        }
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Proxy endpoint for get_car_info
app.post('/api/get_car_info', async (req, res) => {
  try {
    const response = await fetch(`${CHE168_API_URL}/get_car_info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': API_TOKEN
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Proxy endpoint for getAvailableFilters
app.post('/api/getAvailableFilters', async (req, res) => {
  try {
    const response = await fetch(`${CHE168_API_URL}/getAvailableFilters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': API_TOKEN
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Get brands reference
app.get('/api/brands', async (req, res) => {
  try {
    const brandsPath = path.join(DATA_DIR, 'brands.json');
    const data = await fs.readFile(brandsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to load brands reference' 
    });
  }
});

// Get models reference
app.get('/api/models', async (req, res) => {
  try {
    const modelsPath = path.join(DATA_DIR, 'models.json');
    const data = await fs.readFile(modelsPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to load models reference' 
    });
  }
});

// Get last update metadata
app.get('/api/references/metadata', async (req, res) => {
  try {
    const metadataPath = path.join(DATA_DIR, 'last-update.json');
    const data = await fs.readFile(metadataPath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(404).json({ 
      status: 'error', 
      message: 'No metadata found' 
    });
  }
});

// Generate sitemap.xml
app.get('/api/sitemap', async (req, res) => {
  try {
    const SITE_URL = 'https://avtozakaz74.ru';
    const today = new Date().toISOString().split('T')[0];
    
    // Получаем все автомобили (делаем запрос с большим limit)
    // Если автомобилей больше 10000, можно использовать пагинацию
    const maxCars = 10000; // Максимальное количество автомобилей в sitemap
    
    const response = await fetch(`${CHE168_API_URL}/search_car`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': API_TOKEN
      },
      body: JSON.stringify({
        filters: {},
        pagination: {
          limit: maxCars,
          offset: 0
        },
        sorting: {
          sort_by: 'infoid',
          sort_direction: 'DESC'
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok || data.status !== 'success') {
      // Возвращаем базовый sitemap с главной и статическими страницами
      const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cookie-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;
      
      res.setHeader('Content-Type', 'application/xml');
      return res.send(basicSitemap);
    }

    const cars = data.data?.cars || [];
    const totalCars = data.data?.count?.filtered || 0;
    
    // Генерируем XML sitemap
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Главная страница -->
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Статические страницы -->
  <url>
    <loc>${SITE_URL}/about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_URL}/cookie-policy</loc>
    <lastmod>${today}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.5</priority>
  </url>
`;

    // Добавляем страницы автомобилей (убираем дубликаты по ID)
    const uniqueCarIds = new Set();
    cars.forEach(car => {
      if (car.infoid && !uniqueCarIds.has(car.infoid)) {
        uniqueCarIds.add(car.infoid);
        // Используем канонический URL без trailing slash
        const carUrl = `${SITE_URL}/car/${car.infoid}`;
        sitemap += `  <url>
    <loc>${carUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
      }
    });

    sitemap += `</urlset>`;
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Кеш на 1 час
    res.send(sitemap);
  } catch (error) {
    // Возвращаем базовый sitemap в случае ошибки
    const SITE_URL = 'https://avtozakaz74.ru';
    const today = new Date().toISOString().split('T')[0];
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    res.setHeader('Content-Type', 'application/xml');
    res.send(basicSitemap);
  }
});

// Trigger manual update of references (admin only)
app.post('/api/references/update', async (req, res) => {
  try {
    // Запустить обновление в фоне
    generateReferences()
      .then(() => {
        // Update completed
      })
      .catch(() => {
        // Update failed
      });
    
    res.json({ 
      status: 'success', 
      message: 'Update started in background' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Failed to trigger update' 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Endpoint not found' 
  });
});

// Запланированное обновление справочников (ежедневно в 3:00)
cron.schedule('0 3 * * *', async () => {
  try {
    await generateReferences();
  } catch (error) {
    // Update failed silently
  }
}, {
  timezone: 'Europe/Moscow'
});

app.listen(PORT, () => {
  // Server started
});
