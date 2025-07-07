// services/api.js
import axios from 'axios';

const API_URL = '/api'; // Pas besoin de spécifier le domaine pour les routes API internes

export const coursService = {
    // Récupérer tous les cours (avec filtres optionnels)
    getCours: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.categorie) params.append('categorie', filters.categorie);
        if (filters.date_debut) params.append('date_debut', filters.date_debut);
        if (filters.date_fin) params.append('date_fin', filters.date_fin);

        const response = await axios.get(`${API_URL}/cours?${params.toString()}`);
        return response.data;
    },

    // Récupérer un cours par ID
    getCoursById: async (id) => {
        const response = await axios.get(`${API_URL}/cours/${id}`);
        return response.data;
    },

    // Ajouter un nouveau cours (vous avez déjà cette méthode)
    addCours: async (coursData) => {
        const formData = new FormData();

        // Ajout des champs textuels
        Object.keys(coursData).forEach(key => {
            if (key !== 'fichier_pdf' || !coursData[key]) {
                formData.append(key, coursData[key]);
            }
        });

        // Ajout du fichier PDF s'il existe
        if (coursData.fichier_pdf) {
            formData.append('fichier_pdf', coursData.fichier_pdf);
        }

        const response = await axios.post(`${API_URL}/cours`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Supprimer un cours
    deleteCours: async (id) => {
        const response = await axios.delete(`${API_URL}/cours/${id}`);
        return response.data;
    }
};