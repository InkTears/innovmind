// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import db from '../../../lib/db';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" }
            },
            async authorize(credentials) {
                try {
                    const users = await db.query('SELECT * FROM utilisateurs WHERE email = $1', [credentials.email]);

                    if (!users || users.length === 0) {
                        return null;
                    }

                    const user = users[0];
                    const passwordMatch = await bcrypt.compare(credentials.password, user.mot_de_passe);

                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: user.id,
                        name: `${user.prenom} ${user.nom}`,
                        email: user.email,
                        role: user.role
                    };
                } catch (error) {
                    console.error('Erreur d\'authentification:', error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            return session;
        }
    },
    pages: {
        signIn: '/login',
        error: '/login'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // 30 jours
    },
    secret: process.env.NEXTAUTH_SECRET
});
