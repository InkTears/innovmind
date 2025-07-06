import Layout from '../components/Layout';
import { courses } from '../mocks/courses';
import { deadlines } from '../mocks/deadlines';
import { quizzes } from '../mocks/quizzes';

export default function Dashboard() {
  const upcoming = deadlines.filter(d => new Date(d.date) >= new Date());
  return (
    <Layout>
      <div className="dashboard-grid">
        <section className="container">
          <h2>Mes cours</h2>
          <ul>
            {courses.slice(0, 3).map(c => (
              <li key={c.id}>{c.title}</li>
            ))}
          </ul>
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
    </Layout>
);
            }