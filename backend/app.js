const express = require('express');
const pool = require('./config/bd');
const { initModels } = require('./models');
const { createDefaultAdmin } = require('./models/users');
const errorHandler = require('./middlewares/errorHandler');
const { apiLimiter } = require('./middlewares/rateLimiter');
const userRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const uploadRoutes = require("./routes/uploads.routes");
// const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger");


app.use(express.json());
app.use(apiLimiter); // protège toute l’API
// app.use(cors({ origin: "*" }));
app.use('/users', userRoutes);
app.use('/api/products', productRoutes);
app.use("/api/upload", uploadRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("📄 Swagger docs: http://localhost:" + PORT + "/api-docs");

let server; // Pour stocker l'instance du serveur HTTP

const startServer = async () => {
  try {
    // 1️⃣ Vérifier la connexion à MySQL
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('🕐 MySQL test query result:', rows[0]);

    // 2️⃣ Initialiser toutes les tables
    await initModels();
    await createDefaultAdmin();

    // 3️⃣ Démarrer le serveur
    app.get('/', (req, res) => {
      res.send('🚀 Node.js + MySQL connectés et initialisés !');
    });

    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    });
    return server; // Retourne l'instance du serveur
  } catch (err) {
    console.error('❌ Erreur au démarrage :', err.message);
    // Le pool est géré par le module bd.js, pas besoin de le fermer ici
    throw err; // Relance l'erreur pour que l'appelant puisse la gérer
  }
};

const closeServer = async () => {
  try {
    if (server) {
      await new Promise(resolve => server.close(resolve));
      console.log('✅ Serveur HTTP fermé');
    }
    // Fermer le pool de connexions
    await pool.end();
    console.log('✅ Pool MySQL fermé');
  } catch (err) {
    console.error('❌ Erreur lors de la fermeture du serveur/pool MySQL :', err.message);
    throw err;
  }
};

// L'appel de startServer() n'est pas faite ici pour permettre à Jest de contrôler le démarrage.

module.exports = { app, startServer, closeServer, pool }; // Exporter l'application, les fonctions de contrôle et le pool pour les tests

