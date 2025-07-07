// pages/login.js
import Login from '../components/auth/Login';

export default function LoginPage() {
    return <Login />;
}

// Ne pas utiliser le Layout par défaut pour cette page
LoginPage.getLayout = (page) => page;