const express = require('express');
const ProductController = require('../controllers/products.controller');
const { authenticateToken, requireRole } = require('../middlewares/jwtFillter');
const upload = require("../middlewares/upload");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits
 */

// Pour avoir la possibilité de charger un fichier depuis l'interface swagger, 
// changer le type de content et file respectivement par :
// - multipart/form-data et string
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Ajouter un nouveau produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
*               $ref: '#/components/schemas/ProductData'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', authenticateToken, requireRole('admin'), upload.single("file"), ProductController.create_P);


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupère tous les produits
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Tous les produits récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/' , ProductController.getAll);

/**
 * @swagger
 * /api/products/available:
 *   get:
 *     summary: Récupère la liste des produits disponibles (is_available = true)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste filtrée récupérée avec succès
 *       500:
 *         description: Erreur serveur
 */
router.get('/available', ProductController.getAvailable_P);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupère un produit via son ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit trouvé
 *       404:
 *         description: Produit introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', ProductController.getOne_P);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Modifier un produit existant (avec option upload image)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []  # <-- JWT est requis
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           $ref: '#/components/schemas/ProductData'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Produit introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', authenticateToken, requireRole('admin'), upload.single("file"), ProductController.update_P);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produit supprimé
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/:id', authenticateToken, requireRole('admin'), ProductController.delete_P);

module.exports = router;