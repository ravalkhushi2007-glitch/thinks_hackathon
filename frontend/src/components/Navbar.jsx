import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, GraduationCap } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!token) return null;

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
                        <GraduationCap className="h-8 w-8" />
                        <span>OptiHire</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-700">
                            <User className="h-5 w-5" />
                            <span className="font-medium">{user.name} ({user.role})</span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
