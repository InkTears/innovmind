// routes/cours.js
const express = require('express');
const router = express.Router();
const pool = require('../lib/db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuration de multer pour le stockage temporaire des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Récupérer tous les cours (avec filtres optionnels)
router.get('/', async (req, res) => {
    try {
        const { categorie, date_debut, date_fin } = req.query;

        let query = 'SELECT c.*, u.prenom, u.nom FROM cours c JOIN utilisateurs u ON c.utilisateur_id = u.id WHERE 1=1';
        const params = [];

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
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Récupérer un cours par ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT * FROM cours WHERE id = $1', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ajouter un nouveau cours avec fichier PDF
router.post('/', upload.single('fichier_pdf'), async (req, res) => {
    try {
        const { utilisateur_id, titre, description, categorie, niveau_etude } = req.body;

        let fichierPdf = null;
        if (req.file) {
            // Lire le fichier PDF et le convertir en buffer
            fichierPdf = fs.readFileSync(req.file.path);
        }

        const query = `
      INSERT INTO cours (utilisateur_id, titre, description, fichier_pdf, categorie, niveau_etude)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

        const values = [utilisateur_id, titre, description, fichierPdf, categorie, niveau_etude];
        const { rows } = await pool.query(query, values);

        // Supprimer le fichier temporaire
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mettre à jour un cours
router.put('/:id', upload.single('fichier_pdf'), async (req, res) => {
    try {
        const { id } = req.params;
        const { titre, description, categorie, niveau_etude } = req.body;

        let query = 'UPDATE cours SET ';
        const params = [id];
        const setValues = [];

        if (titre) {
            params.push(titre);
            setValues.push(`titre = $${params.length}`);
        }

        if (description) {
            params.push(description);
            setValues.push(`description = $${params.length}`);
        }

        if (categorie) {
            params.push(categorie);
            setValues.push(`categorie = $${params.length}`);
        }

        if (niveau_etude) {
            params.push(niveau_etude);
            setValues.push(`niveau_etude = $${params.length}`);
        }

        if (req.file) {
            const fichierPdf = fs.readFileSync(req.file.path);
            params.push(fichierPdf);
            setValues.push(`fichier_pdf = $${params.length}`);

            // Supprimer le fichier temporaire
            fs.unlinkSync(req.file.path);
        }

        query += setValues.join(', ') + ` WHERE id = $1 RETURNING *`;

        const { rows } = await pool.query(query, params);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un cours
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('DELETE FROM cours WHERE id = $1 RETURNING *', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cours non trouvé' });
        }

        res.json({ message: 'Cours supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Télécharger un PDF
router.get('/:id/telecharger', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('SELECT fichier_pdf, titre FROM cours WHERE id = $1', [id]);

        if (rows.length === 0 || !rows[0].fichier_pdf) {
            return res.status(404).json({ message: 'PDF non trouvé' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${rows[0].titre}.pdf"`);
        res.send(rows[0].fichier_pdf);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;