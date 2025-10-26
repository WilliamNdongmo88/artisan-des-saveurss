const {createUser} = require('../models/users');

const createU = async (req, res) => {
    try {
        const {last_name, first_name, username, email, phone, password} = req.body;
        if (!last_name || !email || !password) {
            return res.status(400).json({error: "last_nane, email et password sont requis."})
        }
        const userId = await createUser({last_name, first_name, username, email, phone, password});
        res.status(201).json({
            // message: "---Utilisateur créé avec succès---",
            user: {id: userId, username, email}
        })
    } catch (error) {
        console.error("### [Controller] CREATE USER ERROR : ", error.message);
        res.status(500).json({error: "Erreur serveur lors de la création de l'utilisateur"})
    }
}

module.exports = {createU}