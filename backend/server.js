import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import { generateReferences } from './scripts/updateReferences.js';

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

// Proxy endpoint for search_car
app.post('/api/search_car', async (req, res) => {
  try {
    console.log('Proxying search_car request');
    
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
      console.error('API Error:', response.status, data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Proxy endpoint for get_car_info
app.post('/api/get_car_info', async (req, res) => {
  try {
    console.log('Proxying get_car_info request for infoid:', req.body.infoid);
    
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
      console.error('API Error:', response.status, data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Proxy endpoint for getAvailableFilters
app.post('/api/getAvailableFilters', async (req, res) => {
  try {
    console.log('Proxying getAvailableFilters request');
    
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
      console.error('API Error:', response.status, data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
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
    console.error('Error reading brands:', error);
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
    console.error('Error reading models:', error);
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
    console.error('Error reading metadata:', error);
    res.status(404).json({ 
      status: 'error', 
      message: 'No metadata found' 
    });
  }
});

// Generate sitemap.xml
app.get('/api/sitemap', async (req, res) => {
  try {
    console.log('Generating sitemap.xml...');
    
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
      console.error('API Error generating sitemap:', response.status, data);
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
    
    console.log(`Found ${cars.length} cars (total: ${totalCars}) for sitemap`);
    
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
    
    // Если автомобилей больше, чем мы получили, можно добавить примечание
    if (totalCars > maxCars) {
      console.warn(`Warning: Total cars (${totalCars}) exceeds sitemap limit (${maxCars}). Only first ${maxCars} cars included.`);
    }
    
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Кеш на 1 час
    res.send(sitemap);
    
    console.log(`Sitemap generated successfully with ${cars.length + 1} URLs`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
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
    console.log('Manual references update triggered');
    
    // Запустить обновление в фоне
    generateReferences()
      .then(metadata => {
        console.log('References updated successfully:', metadata);
      })
      .catch(error => {
        console.error('Failed to update references:', error);
      });
    
    res.json({ 
      status: 'success', 
      message: 'Update started in background' 
    });
  } catch (error) {
    console.error('Error triggering update:', error);
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
  console.log('[CRON] Starting scheduled references update...');
  try {
    const metadata = await generateReferences();
    console.log('[CRON] References updated successfully:', metadata);
  } catch (error) {
    console.error('[CRON] Failed to update references:', error.message);
  }
}, {
  timezone: 'Europe/Moscow'
});

console.log('Cron job scheduled: daily at 3:00 AM Moscow time');

app.listen(PORT, () => {
  console.log(`Backend proxy server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
