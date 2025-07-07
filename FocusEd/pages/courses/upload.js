import { useState } from 'react';
import { useRouter } from 'next/router';
import { coursService } from '../../services/api';

export default function UploadCourse() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // État du formulaire avec tous les champs nécessaires
  const [formData, setFormData] = useState({
    utilisateur_id: 1, // À remplacer par l'ID de l'utilisateur connecté
    titre: '',
    description: '',
    categorie: '',
    niveau_etude: '',
    fichier_pdf: null
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, fichier_pdf: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titre) {
      setError('Le titre est obligatoire');
      return;
    }

    try {
      setLoading(true);
      await coursService.addCours(formData);
      router.push('/courses'); // Redirection vers la liste des cours
    } catch (err) {
      setError("Une erreur est survenue lors de l'enregistrement du cours");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="container">
          <h1>Ajouter un cours</h1>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="titre"
                placeholder="Titre du cours"
                value={formData.titre}
                onChange={handleChange}
                required
            />

            <textarea
                name="description"
                placeholder="Description du cours"
                value={formData.description}
                onChange={handleChange}
            ></textarea>

            <input
                type="text"
                name="categorie"
                placeholder="Catégorie"
                value={formData.categorie}
                onChange={handleChange}
            />

            <select
                name="niveau_etude"
                value={formData.niveau_etude}
                onChange={handleChange}
            >
              <option value="">Sélectionnez un niveau</option>
              <option value="Primaire">Primaire</option>
              <option value="Collège">Collège</option>
              <option value="Lycée">Lycée</option>
              <option value="Licence">Licence</option>
              <option value="Master">Master</option>
              <option value="Doctorat">Doctorat</option>
            </select>

            <input
                type="file"
                name="fichier_pdf"
                accept=".pdf"
                onChange={handleFileChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Chargement...' : 'Ajouter'}
            </button>
          </form>
        </div>
  );
}