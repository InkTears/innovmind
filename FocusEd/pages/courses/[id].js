import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { courses } from '../../mocks/courses';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const course = courses.find(c => c.id === parseInt(id));
  const [text, setText] = useState(course?.content.text || '');
  const [images, setImages] = useState(course?.content.images || []);
  const [pdf, setPdf] = useState(null);

  if (!course) return <Layout><p>Cours non trouvé</p></Layout>;

  const handleImage = e => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setImages([...images, url]);
  };
  const handlePdf = e => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setPdf(url);
  };

  return (
    <Layout>
      <div className="container">
        <h1>{course.title}</h1>
        <p><em>{course.date}</em></p>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={6} />
        <div>
          <h3>Images</h3>
          {images.map((src, i) => <img key={i} src={src} alt="" style={{maxWidth:'100%', marginBottom:'1rem'}} />)}
          <input type="file" accept="image/*" onChange={handleImage} />
        </div>
        <div>
          <h3>PDF</h3>
          {pdf && <iframe src={pdf} width="100%" height="400px" title="pdf" />}
          <input type="file" accept="application/pdf" onChange={handlePdf} />
        </div>
      </div>
    </Layout>
);
  }