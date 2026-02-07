import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(userStr);

        // Check if token is expired
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return <Navigate to="/login" replace />;
        }

        if (role && user.role !== role) {
            // Redirect to correct dashboard based on actual role
            return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />;
        }

        return children;
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default PrivateRoute;
