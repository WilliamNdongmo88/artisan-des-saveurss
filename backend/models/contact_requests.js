const pool = require('../config/bd');

const initContactRequestsModels = async () => {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS CONTACT_REQUESTS(
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            subject VARCHAR(100) NOT NULL,
            message VARCHAR(2000) NOT NULL,
            email_sent BOOLEAN NOT NULL DEFAULT FALSE,
            whatsapp_sent BOOLEAN NOT NULL DEFAULT FALSE,
            email_sent_at TIMESTAMP,
            whatsapp_sent_at TIMESTAMP,
            processed_at TIMESTAMP,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_contact_user FOREIGN KEY (user_id) REFERENCES USERS(id)
        )`
    );
    console.log('✅ Table CONTACT_REQUESTS prête !');
};

const createContactRequests = async ({
    user_id,
    subject,
    message
    }) => {
        const [user] = await pool.query(`SELECT `);
        const [result] = await pool.query(`INSERT INTO 
            USERS (first_name, last_name, username, email, phone, password)
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [first_name, last_name,username, email, phone, password]
        );
    return result.insertId;
};

module.exports = {initContactRequestsModels}