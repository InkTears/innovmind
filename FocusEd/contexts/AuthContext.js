// contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
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

    const logout = async () => {
        await signOut({ redirect: false });
        router.push('/auth/signin');
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
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