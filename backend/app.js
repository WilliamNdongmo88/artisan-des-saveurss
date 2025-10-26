const express = require('express');
const pool = require('./config/bd');
const { initModels } = require('./models');
const { createDefaultAdmin } = require('./models/users');
const { apiLimiter } = require('./middlewares/rateLimiter');
const userRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const app = express();
const PORT = process.env.PORT || 3001;

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger");



app.use(express.json());
app.use(apiLimiter); // protège toute l’API
app.use('/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
console.log("📄 Swagger docs: http://localhost:" + PORT + "/api-docs");

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

    app.listen(PORT, () => {
      console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur au démarrage :', err.message);
  }
};

startServer();
