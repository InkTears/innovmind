// pages/api/courses/index.js
import { getSession } from 'next-auth/react';
import db from '../../../lib/db';

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const courses = await db.query(`
            SELECT *
            FROM cours
            WHERE utilisateur_id = $1
            ORDER BY date_ajout DESC
            LIMIT 10
        `, [session.user.id]);


        // Format the courses data to match the expected structure
        const formattedCourses = courses.map(course => ({
            id: course.id,
            title: course.titre,
            date: course.date_ajout ? new Date(course.date_ajout).toISOString().split('T')[0] : null,
            content: {
                text: course.description || ''
            }
        }));

        return res.status(200).json(formattedCourses);
    } catch (error) {
        console.error('Erreur lors de la récupération des cours:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}
