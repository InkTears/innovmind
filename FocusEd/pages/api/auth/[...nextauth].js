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
                    const user = await db.query('SELECT * FROM users WHERE email = ?', [credentials.email]);

                    if (!user || user.length === 0) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(credentials.password, user[0].password);

                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: user[0].id,
                        name: user[0].name,
                        email: user[0].email
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
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error'
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 // 30 jours
    },
    secret: process.env.NEXTAUTH_SECRET
});