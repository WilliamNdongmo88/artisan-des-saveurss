const express = require('express');
const ProductController = require('../controllers/products.controller');
const { authenticateToken, requireRole } = require('../middlewares/jwtFillter');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits
 */

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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', authenticateToken, requireRole('admin'), ProductController.create_P);


/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Chipolatas"
 *         description:
 *           type: string
 *           example: "Fine saucisse de porc idéale pour le barbecue."
 *         price:
 *           type: number
 *           format: float
 *           example: 15.50
 *         category:
 *           type: string
 *           example: "saucisses-et-variantes"
 *         recette:
 *           type: string
 *           example: "porc, épices..."
 *         is_available:
 *           type: boolean
 *           example: true
 *         stock_quantity:
 *           type: integer
 *           example: 30
 *         unit:
 *           type: string
 *           example: "Kg"
 *         is_featured:
 *           type: boolean
 *           example: false
 *         origin:
 *           type: string
 *           example: "France"
 *         preparation:
 *           type: string
 *           example: "Griller 10 min à feu moyen."
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
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
 *     summary: Modifier un produit existant
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
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
router.put('/:id', authenticateToken, requireRole('admin'), ProductController.update_P);


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