const pool = require('../config/bd');
const { cloudinary, removeFromCloudinary } = require("../utils/cloudinary");

const initFilesModels = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS FILES(
            id INT AUTO_INCREMENT PRIMARY KEY,
            file_path VARCHAR(500),
            public_id VARCHAR(500),
            product_id INT,
            CONSTRAINT fk_file_product FOREIGN KEY (product_id) REFERENCES PRODUCTS(id) ON DELETE CASCADE
        )`
    );
    console.log('✅ Table FILES prête !');
};

const createFiles = async (connection, productId, file) => {
    let uploadedImagePublicId = null;
    try {
        let fileUrl = null;
        let fileId = null;
        if (file && productId) {
            const uploadedImage = await cloudinary.uploader.upload(file.path, {
                folder: "artisan-des-saveurs/products"
            });
            fileUrl = uploadedImage.secure_url;
            fileId = uploadedImage.public_id;
            uploadedImagePublicId = uploadedImage.public_id;
        }
        const [result] = await connection.query(`INSERT INTO 
            FILES (file_path, public_id, product_id) VALUES (?, ?, ?)`, 
            [fileUrl, fileId, productId]
        );
        return {
            success: true,
            insertId: result.insertId,
            file_path: fileUrl,
            public_id: fileId
        };
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
};

const updateFiles = async (connection, productId, fileIdToUpdate, file) => {
    let uploadedImagePublicId = null;
    try {
        let fileUrl = null;
        let fileId = null;
        if (file) {
            const uploadedImage = await cloudinary.uploader.upload(file.path, {
                folder: "artisan-des-saveurs/products"
            });
            fileUrl = uploadedImage.secure_url;
            fileId = uploadedImage.public_id;
            uploadedImagePublicId = uploadedImage.public_id;
        }
        const [result] = await connection.query(`UPDATE FILES 
            SET file_path = ?, public_id = ?, product_id = ? WHERE id = ?`, 
            [fileUrl, fileId, productId, fileIdToUpdate]
        );
        return {
            success: true,
            file_path: fileUrl,
            public_id: fileId
        };
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
};

module.exports = {initFilesModels, createFiles, updateFiles}