import { useState } from 'react';
import Layout from '../../components/Layout';

export default function UploadCourse() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const handleSubmit = e => {
    e.preventDefault();
    alert(`Nouveau cours: ${title} le ${date}`);
  };
  return (
    <Layout>
      <div className="container">
        <h1>Ajouter un cours</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Titre du cours" value={title} onChange={e => setTitle(e.target.value)} required/>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required/>
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </Layout>
);
  }