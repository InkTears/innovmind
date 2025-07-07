// pages/api/cours/[id].js
import { createRouter } from 'next-connect';
import { Pool } from 'pg';
import multer from 'multer';

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
    user: 'focuseduser',
    host: '82.165.231.72',
    database: 'innov_pro',
    password: 'FocusEd2025!!',
    port: 5432,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const upload = multer({
    storage: multer.memoryStorage()
});

const apiRoute = createRouter({
    onError(error, req, res) {
        res.status(501).json({ error: `Une erreur est survenue! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Méthode '${req.method}' non autorisée` });
    },
});

apiRoute.use(upload.single('fichier_pdf'));

// Récupérer un cours par ID
apiRoute.get(async (req, res) => {
    try {
        const { id } = req.query;
        const { rows } = await pool.query(
            'SELECT id, utilisateur_id, titre, description, categorie, niveau_etude, date_ajout FROM cours WHERE id = $1',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error("Erreur lors de la récupération du cours:", err);
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un cours
apiRoute.delete(async (req, res) => {
    try {
        const { id } = req.query;
        const { rows } = await pool.query('DELETE FROM cours WHERE id = $1 RETURNING id', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        res.status(200).json({ message: 'Cours supprimé avec succès' });
    } catch (err) {
        console.error("Erreur lors de la suppression du cours:", err);
        res.status(500).json({ error: err.message });
    }
});

export default apiRoute.handler();