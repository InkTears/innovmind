import { createRouter } from 'next-connect';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'focused-secret-key-2025';

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

apiRoute.get(async (req, res) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Accès non autorisé' });
        }

        const token = authHeader.split(' ')[1];

        // Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Récupérer les informations de l'utilisateur
        const userResult = await pool.query(
            'SELECT id, email, prenom, nom, role, date_creation FROM utilisateurs WHERE id = $1',
            [decoded.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json(userResult.rows[0]);
    } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token invalide' });
        }
        res.status(500).json({ error: error.message });
    }
});

export default apiRoute.handler();