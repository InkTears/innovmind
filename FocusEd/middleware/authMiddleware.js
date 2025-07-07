import jwt from 'jsonwebtoken';
import { Pool } from 'pg';

const JWT_SECRET = process.env.JWT_SECRET || 'focused-secret-key-2025';

const pool = new Pool({
    user: 'focuseduser',
    host: '82.165.231.72',
    database: 'innov_pro',
    password: 'FocusEd2025!!',
    port: 5432,
});

export const authMiddleware = async (req, res, next) => {
    try {
        // Récupérer le token du header Authorization
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Accès non autorisé' });
        }

        const token = authHeader.split(' ')[1];

        // Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Vérifier si l'utilisateur existe toujours en base de données
        const userResult = await pool.query(
            'SELECT id, email, prenom, nom, role FROM utilisateurs WHERE id = $1',
            [decoded.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        // Ajouter l'utilisateur à la requête
        req.user = userResult.rows[0];

        // Passer au prochain middleware ou à la route
        next();
    } catch (error) {
        console.error("Erreur d'authentification:", error);
        return res.status(401).json({ error: 'Token invalide' });
    }
};