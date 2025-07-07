import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Register = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        prenom: '',
        nom: '',
        role: 'etudiant',
        mot_de_passe: '',
        confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation basique
        if (!formData.email || !formData.prenom || !formData.nom || !formData.mot_de_passe) {
            setError('Tous les champs sont obligatoires');
            return;
        }

        if (formData.mot_de_passe !== formData.confirmation) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const response = await axios.post('/api/auth/register', {
                email: formData.email,
                prenom: formData.prenom,
                nom: formData.nom,
                role: formData.role,
                mot_de_passe: formData.mot_de_passe
            });

            // Redirection vers la page de connexion après inscription réussie
            router.push('/login');
        } catch (error) {
            setError(error.response?.data?.error || 'Une erreur est survenue lors de l\'inscription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h1>Créer un compte</h1>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input
                        type="text"
                        id="nom"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="role">Rôle</label>
                    <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="etudiant">Étudiant</option>
                        <option value="professeur">Professeur</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="mot_de_passe">Mot de passe</label>
                    <input
                        type="password"
                        id="mot_de_passe"
                        name="mot_de_passe"
                        value={formData.mot_de_passe}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmation">Confirmer le mot de passe</label>
                    <input
                        type="password"
                        id="confirmation"
                        name="confirmation"
                        value={formData.confirmation}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                </button>
            </form>
        </div>
    );
};

export default Register;