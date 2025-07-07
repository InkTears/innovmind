import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const [course, setCourse] = useState(null);
  const [setLoading] = useState(true);
  const [setError] = useState(null);
  const [text, setText] = useState('');
  const [pdf, setPdf] = useState(null);

  useEffect(() => {
    if (!id || status !== 'authenticated') return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${id}`);

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setCourse(data);
        setText(data.content.text || '');
      } catch (err) {
        console.error('Erreur lors de la récupération du cours:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, status]);

  if (!course) return <p>Cours non trouvé</p>;
  const handlePdf = e => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setPdf(url);
  };

  return (
    <div className="container">
      <h1>{course.title}</h1>
      <p><em>{course.date}</em></p>
      <div className="course-actions">
        <a href={`/api/courses/${id}/download`} className="download-btn" target="_blank" rel="noopener noreferrer">
          Télécharger le PDF
        </a>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={6} />
      <div>
        <h3>PDF</h3>
        {pdf && <iframe src={pdf} width="100%" height="400px" title="pdf" />}
        <input type="file" accept="application/pdf" onChange={handlePdf} />
      </div>
    </div>
  );
  }
