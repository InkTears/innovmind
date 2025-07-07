// contexts/CourseContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CourseContext = createContext();

export function CourseProvider({ children }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session, status } = useSession();

    const fetchUserCourses = async () => {
        if (status !== 'authenticated') {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('/api/courses/user-courses');

            if (response.status === 401) {
                console.log('Utilisateur non authentifié');
                setLoading(false);
                return;
            }

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

    useEffect(() => {
        if (status === 'authenticated') {
            fetchUserCourses();
        }
    }, [status]);

    return (
        <CourseContext.Provider value={{ courses, loading, error, fetchUserCourses }}>
            {children}
        </CourseContext.Provider>
    );
}

export const useCourses = () => useContext(CourseContext);