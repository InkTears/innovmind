import { createRouter } from 'next-connect';
import bcrypt from 'bcryptjs';
import db from '../../../lib/db';

const apiRoute = createRouter({
    onError(error, req, res) {
        res.status(500).json({ error: `Une erreur est survenue! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Méthode '${req.method}' non autorisée` });
    },
});

apiRoute.post(async (req, res) => {
    try {
        const { email, prenom, nom, role, mot_de_passe } = req.body;

        // Vérifier si l'email existe déjà
        const userCheck = await db.query(
            'SELECT * FROM utilisateurs WHERE email = $1',
            [email]
        );

        if (userCheck.length > 0) {
            return res.status(400).json({ error: 'Cet email est déjà utilisé' });
        }

        // Hasher le mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

        // Insérer l'utilisateur dans la base de données
        const newUser = await db.query(
            `INSERT INTO utilisateurs (email, prenom, nom, role, mot_de_passe)
            VALUES ($1, $2, $3, $4, $5) RETURNING id, email, prenom, nom, role, date_creation`,
            [email, prenom, nom, role, hashedPassword]
        );

        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: newUser[0]
        });
    } catch (error) {
        console.error("Erreur lors de l'inscription:", error);
        res.status(500).json({ error: error.message });
    }
});

export default apiRoute.handler();
