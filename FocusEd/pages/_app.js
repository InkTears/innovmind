// pages/_app.js
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../contexts/AuthContext';
import { CourseProvider } from '../contexts/CourseContext';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
    const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

    return (
        <SessionProvider session={pageProps.session}>
            <AuthProvider>
                <CourseProvider>
                    {getLayout(<Component {...pageProps} />)}
                </CourseProvider>
            </AuthProvider>
        </SessionProvider>
    );
}

export default MyApp;