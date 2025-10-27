const { startServer } = require('./backend/app');

startServer().catch(err => {
  console.error("Erreur fatale lors du démarrage du serveur:", err);
  process.exit(1);
});