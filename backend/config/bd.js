// config/db.js
// Utilisation d'un pool de connexions (recommandée en production) 
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'dev-root',
  database: process.env.MYSQL_DATABASE || 'dev_artisan_des_saveurs_db',
  waitForConnections: true,
  connectionLimit: 10,
  charset: "utf8mb4",
});

console.log('✅ Pool MySQL initialisé');

module.exports = pool;
