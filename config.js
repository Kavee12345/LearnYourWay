/**
 * Application Configuration
 * Centralized config for all ports and URLs
 * 
 * To change ports, only edit the values below and restart servers
 */

const config = {
  // Backend Server
  backend: {
    port: process.env.BACKEND_PORT || 5000,
    host: 'localhost',
    url: () => `http://${config.backend.host}:${config.backend.port}`
  },

  // Frontend Server
  frontend: {
    port: process.env.FRONTEND_PORT || 3000,
    host: 'localhost',
    url: () => `http://${config.frontend.host}:${config.frontend.port}`
  },

  // API Configuration
  api: {
    timeout: 60000, // 60 seconds
    retries: 3
  },

  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'learn_your_way'
  }
};

module.exports = config;
