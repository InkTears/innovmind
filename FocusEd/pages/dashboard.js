// pages/dashboard.js
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { deadlines } from '../mocks/deadlines';
import { quizzes } from '../mocks/quizzes';

export default function Dashboard() {
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

  const upcoming = deadlines.filter(d => new Date(d.date) >= new Date());
  return (
      <div className="dashboard-grid">
        <section className="container">
          <h2>Mes cours</h2>
          {loading ? (
            <p>Chargement des cours...</p>
          ) : error ? (
            <p>Erreur: {error}</p>
          ) : courses.length === 0 ? (
            <p>Aucun cours trouvé</p>
          ) : (
            <ul>
              {courses.slice(0, 3).map(c => (
                  <li key={c.id}>
                    <div className="dashboard-course-item">
                      <span>{c.title}</span>
                      <div className="dashboard-course-actions">
                        <Link href={`/courses/${c.id}`}>
                          Voir le détail
                        </Link>
                        <a href={`/api/courses/${c.id}/download`} target="_blank" rel="noopener noreferrer">
                          Télécharger
                        </a>
                      </div>
                    </div>
                  </li>
              ))}
            </ul>
          )}
        </section>
        <section className="container">
          <h2>Échéances à venir</h2>
          <ul>
            {upcoming.map(d => (
                <li key={d.id}>{d.date}: {d.title}</li>
            ))}
          </ul>
        </section>
        <section className="container">
          <h2>Résultats des quiz</h2>
          <ul>
            {quizzes.map(q => (
                <li key={q.id}>{q.topic}: {q.score}/20</li>
            ))}
          </ul>
        </section>
        <section className="container">
          <h2>Suggestions de révisions</h2>
          <ul>
            {quizzes.map(q => (
                <li key={q.id}>Réviser {q.topic}</li>
            ))}
          </ul>
        </section>
      </div>
  );
}
