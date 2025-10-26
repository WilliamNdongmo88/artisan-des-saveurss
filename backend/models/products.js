const pool = require('../config/bd');

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
const createProduct = async ({
    name,
    description,
    price,
    category,
    preparation,
    recette}) => {
        const [result] = await pool.query(`INSERT INTO 
            PRODUCTS (name, description,price, category, preparation, recette)
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [name, description,price, category, preparation, recette]
        );
    return result.insertId;
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

async function updateProduct(id, product) {
    const fields = [];
    const values = [];

    const addField = (key, value) => {
        fields.push(`${key} = ?`);
        values.push(value);
    };

    if(product.name !== undefined) addField("name", product.name);
    if(product.description !== undefined) addField("description", product.description);
    if(product.price !== undefined) addField("price", product.price);
    if(product.category !== undefined) addField("category", product.category);
    if(product.recette !== undefined) addField("recette", product.recette);
    if(product.preparation !== undefined) addField("preparation", product.preparation);
    if(product.stock_quantity !== undefined) addField("stock_quantity", product.stock_quantity);
    if(product.unit !== undefined) addField("unit", product.unit);
    if(product.origin !== undefined) addField("origin", product.origin);

    if(product.is_available !== undefined) addField("is_available", Number(product.is_available));
    if(product.is_featured !== undefined) addField("is_featured", Number(product.is_featured));

    if(fields.length === 0) return false;

    values.push(id);
    const [result] = await pool.query(`UPDATE PRODUCTS SET ${fields.join(', ')} WHERE id = ?`, values);

    return result.affectedRows > 0;
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