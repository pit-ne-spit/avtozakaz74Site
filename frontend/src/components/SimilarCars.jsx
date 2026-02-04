import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCars } from '../lib/api';
import CarCard from './CarCard';
import { getDisplayBrandName, getApiBrandName } from '../lib/brandMapping';

/**
 * Компонент для отображения похожих автомобилей
 * @param {Object} currentCar - Текущий автомобиль
 * @param {Object} exchangeRates - Курсы валют
 */
export default function SimilarCars({ currentCar, exchangeRates }) {
  const [similarCars, setSimilarCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSimilarCars = async () => {
      if (!currentCar?.brandname) return;

      try {
        setLoading(true);
        
        // Сначала пытаемся найти автомобили той же марки и модели
        let similarCarsList = [];
        
        // Если есть модель, сначала ищем по марке и модели
        if (currentCar.seriesname) {
          const sameModelData = await fetchCars({
            brandname: currentCar.brandname,
            seriesname: currentCar.seriesname,
            limit: 15,
            sort_by: 'infoid',
            sort_direction: 'DESC'
          });
          
          // Исключаем текущий автомобиль и берем до 8
          similarCarsList = (sameModelData.cars || []).filter(
            car => car.infoid !== currentCar.infoid
          ).slice(0, 8);
        }
        
        // Если не хватило автомобилей той же модели, добавляем автомобили той же марки
        if (similarCarsList.length < 8) {
          const sameBrandData = await fetchCars({
            brandname: currentCar.brandname,
            limit: 20, // Запрашиваем больше, чтобы после фильтрации осталось достаточно
            sort_by: 'infoid',
            sort_direction: 'DESC'
          });
          
          // Исключаем текущий автомобиль и уже добавленные
          const existingIds = new Set([currentCar.infoid, ...similarCarsList.map(c => c.infoid)]);
          const additionalCars = (sameBrandData.cars || []).filter(
            car => !existingIds.has(car.infoid)
          );
          
          // Добавляем до 8 автомобилей всего
          similarCarsList = [...similarCarsList, ...additionalCars].slice(0, 8);
        }

        setSimilarCars(similarCarsList);
      } catch (error) {
        console.error('Error loading similar cars:', error);
        setSimilarCars([]);
      } finally {
        setLoading(false);
      }
    };

    loadSimilarCars();
  }, [currentCar?.brandname, currentCar?.seriesname, currentCar?.infoid]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие автомобили</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-96"></div>
          ))}
        </div>
      </div>
    );
  }

  if (similarCars.length === 0) {
    return null;
  }

  const brandName = getDisplayBrandName(currentCar?.brandname);

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Похожие автомобили {brandName}
        </h2>
        <button
          onClick={() => {
            // Переходим на главную страницу с фильтром по марке и модели через state
            const apiBrandName = getApiBrandName(brandName);
            const filters = {
              brandname: [apiBrandName]
            };
            
            // Добавляем модель, если она есть
            if (currentCar?.seriesname) {
              filters.seriesname = currentCar.seriesname;
            }
            
            navigate('/', {
              state: {
                filters: filters,
                autoSearch: true // Флаг для автоматического запуска поиска
              }
            });
          }}
          className="text-blue-700 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
        >
          Смотреть все
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {similarCars.map((car) => (
          <CarCard
            key={car.infoid}
            car={car}
            exchangeRates={exchangeRates}
          />
        ))}
      </div>
    </div>
  );
}
