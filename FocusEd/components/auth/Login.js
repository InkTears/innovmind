// components/auth/Login.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        mot_de_passe: ''
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
        if (!formData.email || !formData.mot_de_passe) {
            setError('Tous les champs sont obligatoires');
            return;
        }

        try {
            setLoading(true);
            setError('');

            await login(formData.email, formData.mot_de_passe);
            router.push('/');
        } catch (error) {
            setError(error.response?.data?.error || 'Identifiants invalides');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Connexion</h1>

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

                <button type="submit" disabled={loading}>
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
            </form>
        </div>
    );
};

export default Login;