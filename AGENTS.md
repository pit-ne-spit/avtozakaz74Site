# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Avtozakaz74 - веб-приложение для поиска автомобилей с китайского рынка che168.com. React SPA с прямым подключением к внешнему API через Vite proxy.

## Development Commands

### Frontend Development
All commands should be run from the `frontend/` directory:

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

No linting, testing, or type-checking is configured in this project.

## Architecture

### API Integration Pattern

**Critical**: This app uses **external API** (https://api-centr.ru/che168/) through Vite's development proxy. The proxy configuration in `vite.config.js` rewrites `/api/*` to `/che168/*` on the external server.

#### Filter Transformation
The API expects a specific format that differs from the UI state:
- **Text filters** (brandname, fuel_type): Must be arrays even for single values
- **Range filters** (year, price, mileage, engine_volume_ml, power_kw): Must be `[min, max]` arrays, not objects
- Empty filters should be omitted from the request

The transformation logic is in `frontend/src/lib/api.js` function `transformFiltersToApiFormat()`. When modifying filters:
1. Update UI state in `App.jsx` defaultFilters
2. Update filter transformation in `api.js`
3. Update Filters component to match new fields

#### Response Structure
API returns nested data:
```javascript
{
  status: "success",
  data: {
    cars: [...],           // Array of car objects
    rates: {CNY, EUR},     // Exchange rates from API
    count: {total, filtered},
    tariff_info: {...}
  }
}
```

The `fetchCars()` function flattens this to `{cars, total, rates, tariff_info}` for easier consumption.

### Car Data Model

Car objects use specific field names that differ from typical conventions:
- `infoid` - Primary key (not `id`)
- `brandname` - Brand (not `brand`)
- `seriesname` - Model (not `model`)
- `firstregyear` - Year (not `year`)
- `engine_volume_ml` - Engine volume in milliliters (convert to liters for display: `/ 1000`)
- `power_kw` - Power in kilowatts (not horsepower)
- `imageurl` - Single image URL (not `photos` array)
- `total_price_rub` - Pre-calculated total price with all fees from API

### State Management

**No state management library**. Uses React hooks with:
- `filters` - User's current filter selections
- `items` - Current page of car results
- `total` - Total count for pagination
- `exchangeRate` - Extracted from API response on each search
- `page` - Current page number

Pagination is **offset-based**: `offset = (page - 1) * pageSize`

### Styling

Uses **Tailwind CSS** with utility classes. No custom CSS modules or styled-components.

## API Authentication

**Security Note**: API token is hardcoded in `frontend/src/lib/api.js` as `const API_TOKEN`. This is temporary for development. For production:
- Move token to environment variable
- Add backend proxy instead of direct API calls
- Never commit real tokens to public repositories

Current token format: `che168-XXXXXXXXXXXXX` in Authorization header.

## Key Files to Understand

- `frontend/src/lib/api.js` - **API client**: Contains all API interaction logic and filter transformation
- `frontend/src/App.jsx` - **Main orchestrator**: State, pagination, filter handling
- `frontend/vite.config.js` - **Proxy configuration**: Maps `/api/*` to external API
- `api_specification.json` - **OpenAPI spec**: Full API documentation

## Common Patterns

### Adding New Filter
1. Add field to `defaultFilters` in `App.jsx`
2. Add transformation logic in `api.js` `transformFiltersToApiFormat()`
3. Add UI control in `Filters.jsx`
4. For static options: Update `staticOptions` in `App.jsx`
5. For dynamic options: Use `fetchAvailableFilters()` in useEffect hook

### Dynamic Filters
Brands and models are loaded dynamically from API:
- `brands` - Loaded on component mount from `/che168/getAvailableFilters`
- `models` - Loaded when brand changes, filtered by selected brand
- Model filter resets automatically when brand changes
- Loading states shown in dropdowns during fetch

### Working with Car Data
Always use the correct field names:
- `car.infoid` (not `car.id`)
- `car.brandname` (not `car.brand`)
- `car.seriesname` (not `car.model`)
- `car.imageurl` (not `car.photos[0]`)

### Price Display
Prices come **pre-calculated** from API in `total_price_rub` field. The `currency.js` utility just formats them - it doesn't calculate. API provides:
- `total_price_rub` - Final price with all fees
- `customs_fee_rub` - Customs duty
- `recycling_fee_rub` - Recycling fee
- `price_cny` - Base price in Chinese Yuan

## Windows Development Notes

This project is developed on Windows with PowerShell. Git line endings are CRLF.
