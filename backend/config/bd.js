// config/db.js
// Utilisation d'un pool de connexions (recommandée en production) 
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  port: process.env.DATABASE_PORT || 3306,
  user: process.env.DATABASE_USERNAME || 'root',
  password: process.env.DATABASE_PASSWORD || 'dev-root',
  database: process.env.DATABASE_NAME || 'dev_artisan_des_saveurs_db',
  waitForConnections: true,
  connectionLimit: 10,
});

console.log('✅ Pool MySQL initialisé');

module.exports = pool;
