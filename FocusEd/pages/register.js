// pages/register.js
import Register from '../components/auth/Register';

export default function RegisterPage() {
    return <Register />;
}

// Ne pas utiliser le Layout par défaut pour cette page
RegisterPage.getLayout = (page) => page;