const {createProduct} = require('../models/products');
const {getAllProducts} = require('../models/products')
const {getAvailableProduct} = require('../models/products');
const {getProductById} = require('../models/products');
const {updateProduct} = require('../models/products');
const {deleteProduct} = require('../models/products');

const create_P = async (req, res) => {
    try {
        const { name,
                description,
                price,
                category,
                preparation, recette} = req.body;
        if (!name || !price) {
            return res.status(400).json({error: "Le nom et le prix  sont requis."})
        }
        const product = await createProduct(req.body, req.file);
        console.log("###product :: ", product);
        // Vérification du succès
        if (!product.success) {
            return res.status(500).json({
                error: product.error || "Erreur lors de la création du produit."
            });
        }
        res.status(201).json({
            product: {id: product.productId, name, description, price, category, preparation, recette, file: product.file}
        })
    } catch (error) {
        console.error("### [Controller] CREATE PRODUCT ERROR : ", error.message);
        res.status(500).json({error: "[Controller] Erreur serveur lors de la création du produit"})
    }
}

const getAll = async (req, res) => {
    try {
        const product = await getAllProducts();
        res.json(product);
    } catch (error) {
        console.error("### [Controller] GET ALL PRODUCT ERROR : ", error.message);
        // res.status(500).json({error: "[Controller] Erreur serveur lors de la récupération des produits"})
        next(error);
    }
}

const getAvailable_P = async (req, res) => {
    try {
        const product = await getAvailableProduct();
        res.json(product);
    } catch (error) {
        console.error("### [Controller] GET PRODUCT ERROR : ", error.message);
        // res.status(500).json({error: "[Controller] Erreur serveur lors de la récupération du produit"})
        next(error);
    }
}

const getOne_P = async (req, res) => {
    console.log("params.id : ", req.params.id);
    try {
        const product = await getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        console.error("### [Controller] GET PARTICULA PRODUCT ERROR : ", error.message);
        // res.status(500).json({error: "[Controller] Erreur serveur lors de la récupération du produit"})
        next(error);
    }
}

async function update_P(req, res) {
  try {
    const productId = req.params.id;
    const result = await updateProduct(productId, req.body, req.file);
    console.log("result :: ", result)
    if (!result.found) {
      return res.status(404).json({ message: "Produit introuvable" });
    }

    if (result.affectedRows > 0) {
        // ✅ Vérification du succès
        if (!result.success) {
            return res.status(500).json({
                error: result.error || "Erreur lors de la mise à jour du produit."
            });
        }
        return res.json({ 
            message: "Produit mis à jour avec succès",
            productId: result.productId,
            file: result.file
         });
    } else {
      return res.status(400).json({ message: "Aucune modification effectuée" });
    }
  } catch (error) {
    console.error("### [Controller] UPDATE PRODUCT ERROR : ", error);
    return res.status(500).json({ error: "Erreur serveur lors de la mise à jour du produit" });
  }
}

async function delete_P(req, res) {
    try {
        const product = await deleteProduct(req.params.id);
        if(!product) return res.status(404).json({message: `Product not found`})
        res.json({message: 'Produit supprimé'})
    } catch (error) {
        console.error("### [Controller] DELETE PRODUCT ERROR : ", error.message);
        // res.status(500).json({error: "[Controller] Erreur serveur lors de la suppression du produit"});
        next(error);
    }
}

module.exports = {create_P, getAll, getAvailable_P, getOne_P, update_P, delete_P}