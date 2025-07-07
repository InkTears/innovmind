// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const loading = status === 'loading';
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            setUser(session.user);
        } else {
            setUser(null);
        }
    }, [session]);

    const login = async (email, mot_de_passe) => {
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password: mot_de_passe
        });

        if (result?.error) {
            throw new Error(result.error);
        }

        return result;
    };

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
    }
    return context;
};
