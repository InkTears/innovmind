// pages/api/cours/index.js
import { createRouter } from 'next-connect';
import multer from 'multer';
import { Pool } from 'pg';

// Configuration de la connexion à PostgreSQL
const pool = new Pool({
    user: 'focuseduser',
    host: '82.165.231.72',
    database: 'innov_pro',
    password: 'FocusEd2025!!',
    port: 5432,
});

// Configuration pour désactiver le bodyParser par défaut
export const config = {
    api: {
        bodyParser: false,
    },
};

// Création du middleware multer
const upload = multer({
    storage: multer.memoryStorage()
});

// Utiliser createRouter au lieu de nextConnect
const apiRoute = createRouter({
    onError(error, req, res) {
        res.status(501).json({ error: `Une erreur est survenue! ${error.message}` });
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Méthode '${req.method}' non autorisée` });
    },
});

// Middleware pour gérer le fichier PDF
apiRoute.use(upload.single('fichier_pdf'));

// Gestionnaire POST pour ajouter un cours
apiRoute.post(async (req, res) => {
    try {
        // Récupérez l'ID utilisateur depuis la requête ou utilisez celui que vous avez créé
        // Remplacez 2 par l'ID retourné lors de la création de votre utilisateur
        const utilisateur_id = req.body.utilisateur_id || 1; // ID de l'utilisateur que vous venez de créer

        const {
            titre,
            description,
            categorie,
            niveau_etude
        } = req.body;

        let fichierPdf = null;
        if (req.file) {
            fichierPdf = req.file.buffer;
        }

        const query = `
            INSERT INTO cours (utilisateur_id, titre, description, fichier_pdf, categorie, niveau_etude)
            VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, utilisateur_id, titre, description, categorie, niveau_etude, date_ajout
        `;

        const values = [
            utilisateur_id,
            titre,
            description || '',
            fichierPdf,
            categorie || '',
            niveau_etude || ''
        ];

        const { rows } = await pool.query(query, values);

        res.status(201).json(rows[0]);
    } catch (err) {
        console.error("Erreur lors de l'ajout d'un cours:", err);
        res.status(500).json({ error: err.message });
    }
});

// Gestionnaire GET pour récupérer les cours
apiRoute.get(async (req, res) => {
    try {
        const { categorie, date_debut, date_fin } = req.query;

        let query = 'SELECT id, utilisateur_id, titre, description, categorie, niveau_etude, date_ajout FROM cours WHERE 1=1';
        const params = [];

        // Filter by user ID if provided
        if (req.query.utilisateur_id) {
            params.push(req.query.utilisateur_id);
            query += ` AND utilisateur_id = $${params.length}`;
        }

        if (categorie) {
            params.push(categorie);
            query += ` AND categorie = $${params.length}`;
        }

        if (date_debut) {
            params.push(date_debut);
            query += ` AND date_ajout >= $${params.length}`;
        }

        if (date_fin) {
            params.push(date_fin);
            query += ` AND date_ajout <= $${params.length}`;
        }

        query += ' ORDER BY date_ajout DESC';

        const { rows } = await pool.query(query, params);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur lors de la récupération des cours:", err);
        res.status(500).json({ error: err.message });
    }
});

export default apiRoute.handler();
