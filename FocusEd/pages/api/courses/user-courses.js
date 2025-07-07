// pages/api/courses/user-courses.js
import { getSession } from 'next-auth/react';
import db from '../../../lib/db';

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    try {
        const courses = await db.query(`
            SELECT c.*
            FROM cours c
            WHERE c.utilisateur_id = $1
        `, [session.user.id]);

        return res.status(200).json(courses);
    } catch (error) {
        console.error('Erreur lors de la récupération des cours:', error);
        return res.status(500).json({ error: 'Erreur serveur' });
    }
}
