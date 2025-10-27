// config/db.js
// Utilisation d'un pool de connexions (recommandée en production) 
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  port: process.env.MYSQLPORT || 3306,
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || 'dev-root',
  database: process.env.MYSQL_DATABASE || 'dev_artisan_des_saveurs_db',
  waitForConnections: true,
  connectionLimit: 10,
});

console.log('✅ Pool MySQL initialisé');

module.exports = pool;
