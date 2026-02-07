import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));

            if (data.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/student');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <div className="flex justify-center mb-6">
                    <GraduationCap className="h-12 w-12 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Login to OptiHire</h2>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                    >
                        Sign In
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
