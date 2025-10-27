const pool = require('../config/bd');
const bcrypt = require('bcryptjs');

// Initialisation du modèle User
const initUserModel = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS USERS (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      refresh_token TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table USERS prête !');
};

// Create default user
async function createDefaultAdmin() {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM USERS WHERE role = 'admin' LIMIT 1"
        );

        if (rows.length > 0) {
            console.log("Admin already exists");
            return;
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        await pool.query(
            "INSERT INTO USERS (name, email, password, role) VALUES (?, ?, ?, ?)",
            [process.env.ADMIN_NAME ,process.env.ADMIN_EMAIL, hashedPassword, "admin"]
        );

        console.log("Default admin created successfully ✅");
    } catch (error) {
        console.error("Error creating default admin:", error.message);
    }
}

async function getUserByFk(id) {
  const [user] = await pool.query(`SELECT * FROM USERS WHERE id=?`, [id]);
  return user.length ? user[0] : null;
}

// Fonction pour créer un utilisateur
// const createUser = async ({
//     first_name,
//     last_name,
//     username,
//     email,
//     phone,
//     password}) => {
//         const [result] = await pool.query(`INSERT INTO 
//             USERS (first_name, last_name, username, email, phone, password)
//             VALUES (?, ?, ?, ?, ?, ?)`, 
//             [first_name, last_name,username, email, phone, password]
//         );
//     return result.insertId;
// };

async function createUser({ name, email, password, role = 'user' }) {
  const hashed = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    `INSERT INTO USERS (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [name, email, hashed, role]
  );
  return result.insertId;
}

async function getUserByEmail(email) {
  const [rows] = await pool.query(`SELECT * FROM USERS WHERE email = ?`, [email]);
  return rows.length ? rows[0] : null;
}

async function getUserById(id) {
  const [rows] = await pool.query(`SELECT * FROM USERS WHERE id = ?`, [id]);
  return rows.length ? rows[0] : null;
}

async function saveRefreshToken(userId, token) {
  await pool.query(`UPDATE USERS SET refresh_token = ? WHERE id = ?`, [token, userId]);
}

async function clearRefreshToken(userId) {
  await pool.query(`UPDATE USERS SET refresh_token = NULL WHERE id = ?`, [userId]);
}

module.exports = {
  initUserModel,
  createDefaultAdmin,
  createUser,
  getUserByFk,
  getUserByEmail,
  getUserById,
  saveRefreshToken,
  clearRefreshToken
};