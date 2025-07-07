// components/Layout.js
import { useState } from 'react';
import Link from 'next/link';
import { FiBell } from 'react-icons/fi';
import NotificationPopover from './NotificationPopover';
import { useSession, signOut } from 'next-auth/react'; // Remplacement de useAuth par useSession
import { useRouter } from 'next/router';

export default function Layout({ children }) {
    const [open, setOpen] = useState(false);
    const { data: session } = useSession(); // Utilisation directe de useSession de next-auth
    const user = session?.user;
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <div className="layout">
            <header>
                <h1 style={{ color: 'var(--color-secondary)' }}>FocusEd</h1>
                <nav>
                    {user ? (
                        <>
                            <Link href="/">Dashboard</Link>
                            <Link href="/courses">Cours</Link>
                            <Link href="/courses/upload">Ajouter un cours</Link>
                            <Link href="/calendar">Calendrier</Link>
                            <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
                            <span className="user-name">Bonjour, {user.name || 'utilisateur'}</span>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Connexion</Link>
                            <Link href="/register">S'inscrire</Link>
                        </>
                    )}
                </nav>
                {user && (
                    <div className="notification-icon" onClick={() => setOpen(!open)}>
                        <FiBell />
                    </div>
                )}
                {user && <NotificationPopover isOpen={open} />}
            </header>
            <main className="container-page">{children}</main>
        </div>
    );
}