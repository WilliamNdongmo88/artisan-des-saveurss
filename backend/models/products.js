const pool = require('../config/bd');
const { cloudinary, removeFromCloudinary } = require("../utils/cloudinary");
const {createFiles} = require('../models/files');
const {updateFiles} = require('../models/files');

const initProductModel = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS PRODUCTS (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(1000),
            recette VARCHAR(255),
            price NUMERIC(10,2) NOT NULL CHECK (price > 0),
            category VARCHAR(50),
            files_id BIGINT,
            is_available BOOLEAN DEFAULT TRUE,
            stock_quantity INTEGER DEFAULT 20,
            unit VARCHAR(50) DEFAULT 'Kg',
            is_featured BOOLEAN DEFAULT FALSE,
            origin VARCHAR(50) DEFAULT 'Île Maurice',
            preparation VARCHAR(3000),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
    );
};

// Fonction pour créer un produit
const createProduct = async (data, file) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            name, description, recette, price, category, origin, preparation,
            is_available, stock_quantity, unit, is_featured
        } = data;

        const availableFlag = is_available ? 1 : 0;
        const featuredFlag = is_featured ? 1 : 0;

        // Insertion du produit
        const [productResult] = await connection.query(
            `INSERT INTO PRODUCTS (name, description, recette, price, category, origin, preparation, 
                                   is_available, stock_quantity, unit, is_featured, files_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
            [name, description, recette, price, category, origin, preparation,
             availableFlag, stock_quantity, unit, featuredFlag]
        );

        const productId = productResult.insertId;

        // Création du fichier (avec la même connexion)
        const resultFile = await createFiles(connection, productId, file);
        const fichier = {
            id: resultFile.insertId,
            image_url: resultFile.file_path,
            public_id: resultFile.public_id
        };
        uploadedImagePublicId = fichier.public_id;
        console.log("resultFile :: ", resultFile);

        // Mise à jour du produit avec le fichier
        await connection.query(
            `UPDATE PRODUCTS SET files_id = ? WHERE id = ?`,
            [resultFile.insertId, productId]
        );

        await connection.commit();

        // Retourner toutes les infos pertinentes
        if (resultFile.success) {
            return { success: true, productId, file: fichier };
        } else {
            return { success: false, error: resultFile.error};
        }
    } catch (error) {
        await connection.rollback();
        console.error("❌ Transaction échouée :", error.message);
        return { success: false, error: error.message };
    } finally {
        connection.release();
    }
};


const getAllProducts = async () => {
    const [result] = await pool.query(`SELECT * FROM PRODUCTS`);
    return result;
}

const getAvailableProduct = async () => {
    const [result] = await pool.query(`SELECT * FROM PRODUCTS WHERE is_available = true`);
    return result;
};

const getProductById = async (id) => {
    const [result] = await pool.query(`SELECT * FROM PRODUCTS WHERE id = ?`, [id]);
    if(!result.length)return null;
    return result[0];
}

// async function updateProduct(id, product) {
//     const fields = [];
//     const values = [];

//     const addField = (key, value) => {
//         fields.push(`${key} = ?`);
//         values.push(value);
//     };

//     if(product.name !== undefined) addField("name", product.name);
//     if(product.description !== undefined) addField("description", product.description);
//     if(product.price !== undefined) addField("price", product.price);
//     if(product.category !== undefined) addField("category", product.category);
//     if(product.recette !== undefined) addField("recette", product.recette);
//     if(product.preparation !== undefined) addField("preparation", product.preparation);
//     if(product.stock_quantity !== undefined) addField("stock_quantity", product.stock_quantity);
//     if(product.unit !== undefined) addField("unit", product.unit);
//     if(product.origin !== undefined) addField("origin", product.origin);

//     if(product.is_available !== undefined) addField("is_available", Number(product.is_available));
//     if(product.is_featured !== undefined) addField("is_featured", Number(product.is_featured));

//     if(fields.length === 0) return false;

//     values.push(id);
//     const [result] = await pool.query(`UPDATE PRODUCTS SET ${fields.join(', ')} WHERE id = ?`, values);

//     return result.affectedRows > 0;
// }

async function updateProduct(productId, data, file) {
    const connection = await pool.getConnection();
    let uploadedImagePublicId = null;
    let checkIfFileUpdateSuccess = null;
    let globalCheckError = null;
    let fileIdToUpdate = null;
    let fichier = {};
    try {
        await connection.beginTransaction();

        const [filesRows] = await connection.query("SELECT * FROM FILES WHERE product_id = ?", [productId]);
        console.log("[filesRows Id :: ", filesRows[0].id);
        if (filesRows.length === 0) {
            return { found: false };
        }

        const fileId = filesRows[0].id
        const oldImageId = filesRows[0].public_id;

        if (file) {
            // Création du fichier (avec la même connexion)
            const resultFile = await updateFiles(connection, productId, fileId, file);
            fichier = {
                image_url: resultFile.file_path,
                public_id: resultFile.public_id
            };
            uploadedImagePublicId = fichier.public_id;
            console.log("resultFile :: ", resultFile);
            checkIfFileUpdateSuccess = resultFile.success;
            globalCheckError = resultFile.error;
        }

        const {
            name, description, recette, price, category, origin, 
            preparation, is_available, stock_quantity, unit, is_featured
        } = data;

        // safer conversions
        const availableFlag = is_available === undefined ? 0 : (Number(is_available) ? 1 : 0);
        const featuredFlag = is_featured === undefined ? 0 : (Number(is_featured) ? 1 : 0);

        console.log("fileIdToUpdate :: ", fileIdToUpdate);
        const [result] = await connection.query(`
            UPDATE PRODUCTS SET 
            name=?, description=?, recette=?, price=?, category=?, origin=?,preparation=?, 
            is_available=?, stock_quantity=?, unit=?, is_featured=?, files_id=? WHERE id=?`, 
            [ name, description, recette, price, category, origin, preparation, 
                availableFlag, stock_quantity, unit, featuredFlag, fileId, productId ]
        );

        // attempt to remove old image but don't fail the whole update if removal fails
        if (file && oldImageId) {
            try {
            await removeFromCloudinary(oldImageId);
            } catch (err) {
            console.warn("Warning: suppression de l'ancienne image échouée:", err.message);
            // on ne throw pas, car la mise à jour DB est faite.
            }
        }

        await connection.commit();
        console.log("checkIfFileUpdateSuccess :: ", checkIfFileUpdateSuccess);
        if (checkIfFileUpdateSuccess) {
            return { found: true, success: true, affectedRows: result.affectedRows, productId:productId, file: fichier };
        } else {
            return { found: true, success: true, affectedRows: result.affectedRows, error: globalCheckError };
        }
    } catch (error) {
        await connection.rollback();
        // 🔥 Si Cloudinary a déjà reçu un fichier, on le supprime
        if (uploadedImagePublicId) {
            try {
                await cloudinary.uploader.destroy(uploadedImagePublicId);
                console.log("🧹 Image supprimée de Cloudinary suite à échec de transaction");
            } catch (cloudErr) {
                console.error("⚠️ Impossible de supprimer sur Cloudinary :", cloudErr.message);
            }
        }
        console.error("❌ Transaction échouée :", error.message);
        return { success: false, error: error.message };
    } finally {
        connection.release();
    }
}


async function deleteProduct(id) {
    const [result] = await pool.query(`DELETE FROM PRODUCTS WHERE id = ?`, [id]);
    return result.affectedRows > 0;
}

module.exports = {
  initProductModel,
  createProduct, 
  getAllProducts,
  getAvailableProduct,
  getProductById,
  updateProduct,
  deleteProduct
};