// components/UserCourses.js
import React from 'react';
import { useCourses } from '../contexts/CourseContext';
import { useSession } from 'next-auth/react';

function UserCourses() {
    const { courses, loading, error } = useCourses();
    const { status } = useSession();

    if (status === 'loading' || loading) return <div>Chargement des cours...</div>;
    if (status === 'unauthenticated') return <div>Veuillez vous connecter</div>;
    if (error) return <div>Erreur: {error}</div>;
    if (courses.length === 0) return <div>Aucun cours trouvé</div>;

    return (
        <div>
            <h2>Mes cours</h2>
            <ul>
                {courses.map(course => (
                    <li key={course.id}>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserCourses;