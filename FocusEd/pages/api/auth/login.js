import { createRouter } from 'next-connect';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'focused-secret-key-2025';
const JWT_EXPIRES_IN = '7d';

const pool = new Pool({
    user: 'focuseduser',
    host: '82.165.231.72',
    database: 'innov_pro',
    password: 'FocusEd2025!!',
    port: 5432,
});

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
        const { email, mot_de_passe } = req.body;

        // Vérifier si l'utilisateur existe
        const userResult = await pool.query(
            'SELECT * FROM utilisateurs WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Identifiants invalides' });
        }

        const user = userResult.rows[0];

        // Vérifier le mot de passe
        const passwordIsValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

        if (!passwordIsValid) {
            return res.status(400).json({ error: 'Identifiants invalides' });
        }

        // Créer le token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Envoyer la réponse sans le mot de passe
        const { mot_de_passe: _, ...userWithoutPassword } = user;

        res.status(200).json({
            message: 'Connexion réussie',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        res.status(500).json({ error: error.message });
    }
});

export default apiRoute.handler();