// pages/api/courses/[id].js
import { getSession } from 'next-auth/react';
import db from '../../../lib/db';

export default async function handler(req, res) {
    const session = await getSession({ req });
    const { id } = req.query;

    if (!session) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const courses = await db.query(`
            SELECT *
            FROM cours
            WHERE id = $1 AND utilisateur_id = $2
        `, [id, session.user.id]);

        if (courses.length === 0) {
            return res.status(404).json({ error: 'Cours non trouvé' });
        }


        // Format the course data to match the expected structure
        const course = courses[0];
        const formattedCourse = {
            id: course.id,
            title: course.titre,
            date: course.date_ajout ? new Date(course.date_ajout).toISOString().split('T')[0] : null,
            content: {
                text: course.description || ''
            }
        };

        return res.status(200).json(formattedCourse);
    } catch (error) {
        console.error('Erreur lors de la récupération du cours:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}
