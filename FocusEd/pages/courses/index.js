import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Courses() {
    const { status } = useSession();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (status !== 'authenticated') return;

        const fetchCourses = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/courses');

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                setCourses(data);
            } catch (err) {
                console.error('Erreur lors de la récupération des cours:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [status]);

    return (
        <>
            <h1>Cours disponibles</h1>
            {loading ? (
                <p>Chargement des cours...</p>
            ) : error ? (
                <p>Erreur: {error}</p>
            ) : courses.length === 0 ? (
                <p>Aucun cours trouvé</p>
            ) : (
                <div className="courses-grid">
                    {courses.map(course => (
                        <div key={course.id} className="course-card">
                            <h3>{course.title}</h3>
                            <p>{course.content?.text}</p>
                            <div className="course-actions">
                                <Link href={`/courses/${course.id}`}>
                                    Voir le détail
                                </Link>
                                <a href={`/api/courses/${course.id}/download`} target="_blank" rel="noopener noreferrer">
                                    Télécharger le PDF
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
