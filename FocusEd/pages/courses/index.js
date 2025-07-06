import Link from 'next/link';
import Layout from '../../components/Layout';
import { courses } from '../../mocks/courses';

export default function Courses() {
  return (
    <Layout>
      <div className="container">
        <h1>Cours</h1>
        <ul>
          {courses.map(c => (
            <li key={c.id}>
              <Link href={`/courses/${c.id}`}>{c.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
);
          }