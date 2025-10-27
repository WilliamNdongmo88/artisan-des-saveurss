
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.test' });

const dbConfig = {
  host: process.env.MYSQLHOST,
  port: process.env.MYSQLPORT,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
};

const TEST_DB_NAME = process.env.MYSQL_DATABASE;

// Connexion sans spécifier de base de données pour créer/supprimer la base de données de test
let connection;

beforeAll(async () => {
  // 1. Connexion au serveur MySQL
  connection = await mysql.createConnection(dbConfig);
  
  // 2. Supprimer la base de données de test si elle existe
  await connection.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`);
  
  // 3. Créer la base de données de test
  await connection.query(`CREATE DATABASE ${TEST_DB_NAME}`);
  
  // 4. Se connecter à la nouvelle base de données de test
  await connection.changeUser({ database: TEST_DB_NAME });
  
  // 5. Fermer la connexion temporaire utilisée pour la création de la DB
  await connection.end();
});

afterAll(async () => {
  // 1. Recréer une connexion pour supprimer la base de données
  const connectionAfter = await mysql.createConnection(dbConfig);
  await connectionAfter.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`);
  await connectionAfter.end();

  // Le pool de connexion de l'application sera fermé dans le test après l'exécution.
});
