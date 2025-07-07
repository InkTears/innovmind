// pages/api/courses/[id]/download.js
import { getSession } from 'next-auth/react';
import db from '../../../../lib/db';

export default async function handler(req, res) {
    const session = await getSession({ req });
    const { id } = req.query;

    if (!session) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const courses = await db.query(`
            SELECT id, titre, fichier_pdf
            FROM cours
            WHERE id = $1 AND utilisateur_id = $2
        `, [id, session.user.id]);

        if (courses.length === 0) {
            return res.status(404).json({ error: 'Cours non trouvé' });
        }

        const course = courses[0];

        if (!course.fichier_pdf) {
            return res.status(404).json({ error: 'Aucun fichier PDF trouvé pour ce cours' });
        }

        // Set the appropriate headers for a PDF file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${course.titre.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`);

        // Convert the BYTEA data to a Buffer and send it
        const buffer = Buffer.from(course.fichier_pdf, 'base64');
        res.send(buffer);
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier du cours:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}
