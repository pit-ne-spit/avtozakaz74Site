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
