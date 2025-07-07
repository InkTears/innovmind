import { useState } from 'react';
import Link from 'next/link';

export default function Courses() {
    const [courses, setCourses] = useState([/* vos données */]);

    return (
        <>
            <h1>Cours disponibles</h1>
            <div className="courses-grid">
                {courses.map(course => (
                    <div key={course.id} className="course-card">
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <Link href={`/courses/${course.id}`}>
                            Voir le détail
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}