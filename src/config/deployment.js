// Този файл съдържа конфигурация за различни среди (dev, production)

// Настройки за API URL за различни среди
export const API_CONFIG = {
  development: {
    API_URL: 'http://localhost:3030/api',
  },
  production: {
    API_URL: 'https://e-commerce-api-txuw.onrender.com/api',
  },
};

// Определяне на текущата среда
export const ENV = process.env.NODE_ENV || 'development';

// Експортиране на настройки според средата
export const config = API_CONFIG[ENV];

// Базов URL за API заявки
export const API_URL = config.API_URL; 