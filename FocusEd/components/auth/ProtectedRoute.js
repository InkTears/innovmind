// components/auth/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

// Routes accessibles sans authentification
const publicRoutes = ['/login', '/register'];

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Si chargement terminé et utilisateur non connecté
        if (!loading && !user) {
            // Vérifier si on est déjà sur une route publique
            if (!publicRoutes.includes(router.pathname)) {
                // Rediriger vers login
                router.push('/login');
            }
        }
    }, [loading, user, router]);

    // Pendant le chargement, on peut afficher un indicateur
    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    // Retourner les enfants (contenu de la page)
    return <>{children}</>;
};

export default ProtectedRoute;