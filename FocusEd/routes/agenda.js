// routes/agenda.js
const express = require('express');
const router = express.Router();
const pool = require('../lib/db');

// Récupérer tous les événements d'un utilisateur
router.get('/utilisateur/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { date_debut, date_fin } = req.query;

        let query = 'SELECT * FROM agenda WHERE utilisateur_id = $1';
        const params = [id];

        if (date_debut) {
            params.push(date_debut);
            query += ` AND date_debut >= $${params.length}`;
        }

        if (date_fin) {
            params.push(date_fin);
            query += ` AND date_debut <= $${params.length}`;
        }

        query += ' ORDER BY date_debut ASC';

        const { rows } = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ajouter un événement
router.post('/', async (req, res) => {
    try {
        const { utilisateur_id, evenement, description, date_debut, date_fin, rappel } = req.body;

        const query = `
      INSERT INTO agenda (utilisateur_id, evenement, description, date_debut, date_fin, rappel)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

        const values = [utilisateur_id, evenement, description, date_debut, date_fin, rappel];
        const { rows } = await pool.query(query, values);

        // Créer une notification si rappel est activé
        if (rappel) {
            const message = `Rappel: ${evenement} le ${new Date(date_debut).toLocaleString()}`;
            await pool.query(
                'INSERT INTO notifications (utilisateur_id, message) VALUES ($1, $2)',
                [utilisateur_id, message]
            );
        }

        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Mettre à jour un événement
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { evenement, description, date_debut, date_fin, rappel } = req.body;

        const query = `
      UPDATE agenda 
      SET evenement = $1, description = $2, date_debut = $3, date_fin = $4, rappel = $5
      WHERE id = $6
      RETURNING *
    `;

        const values = [evenement, description, date_debut, date_fin, rappel, id];
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        // Mettre à jour la notification si rappel est activé
        if (rappel) {
            const message = `Rappel: ${evenement} le ${new Date(date_debut).toLocaleString()}`;
            await pool.query(
                'DELETE FROM notifications WHERE message LIKE $1 AND utilisateur_id = $2',
                [`Rappel: %${id}%`, rows[0].utilisateur_id]
            );
            await pool.query(
                'INSERT INTO notifications (utilisateur_id, message) VALUES ($1, $2)',
                [rows[0].utilisateur_id, message]
            );
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Supprimer un événement
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { rows } = await pool.query('DELETE FROM agenda WHERE id = $1 RETURNING *', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Événement non trouvé' });
        }

        // Supprimer les notifications associées
        await pool.query(
            'DELETE FROM notifications WHERE message LIKE $1 AND utilisateur_id = $2',
            [`Rappel: %${rows[0].evenement}%`, rows[0].utilisateur_id]
        );

        res.json({ message: 'Événement supprimé avec succès' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;