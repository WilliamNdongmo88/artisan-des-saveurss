const express = require("express");
const upload = require("../middlewares/upload");
const cloudinary = require("../config/cloudinary");
const router = express.Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload d'une image
 *     description: Permet d’envoyer une image via multipart/form-data vers le serveur puis Cloudinary.
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image à envoyer
 *     responses:
 *       200:
 *         description: Image uploadée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL publique de l’image
 *       400:
 *         description: Aucun fichier ou fichier invalide
 *       500:
 *         description: Erreur serveur
 */
router.post("/", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier envoyé" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "artisan-des-saveurs/products"
    });

    res.json({
      message: "Image uploadée avec succès",
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
