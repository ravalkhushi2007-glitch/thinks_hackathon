import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/admin" element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            } />

            <Route path="/student" element={
              <PrivateRoute role="student">
                <StudentDashboard />
              </PrivateRoute>
            } />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
