import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
} from 'chart.js';
import { Upload, FileText, BarChart, TrendingUp, Users } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
);

const AdminDashboard = () => {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [stats, setStats] = useState(null);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get('http://localhost:5001/api/analytics', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(data);
        } catch (error) {
            console.error("Error fetching stats");
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploadStatus('Uploading...');
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/api/upload', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setUploadStatus('Upload Successful!');
            fetchStats(); // Refresh stats
            setFile(null);
        } catch (error) {
            setUploadStatus('Upload Failed');
            console.error(error);
        }
    };

    // Chart Data Preparation
    const companyChartData = stats ? {
        labels: stats.topCompanies.map(c => c._id),
        datasets: [{
            label: 'Hires',
            data: stats.topCompanies.map(c => c.count),
            backgroundColor: 'rgba(79, 70, 229, 0.6)',
        }]
    } : null;

    const skillChartData = stats ? {
        labels: stats.topSkills.map(s => s._id),
        datasets: [{
            label: 'Demand',
            data: stats.topSkills.map(s => s.count),
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
            ],
        }]
    } : null;

    const salaryTrendData = stats?.salaryTrends ? {
        labels: stats.salaryTrends.map(t => t.year),
        datasets: [{
            label: 'Avg Package (LPA)',
            data: stats.salaryTrends.map(t => t.salary),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.4
        }]
    } : null;

    const branchData = stats?.branchTrends ? {
        labels: stats.branchTrends.map(t => t.branch),
        datasets: [{
            label: 'Students Placed',
            data: stats.branchTrends.map(t => t.count),
            backgroundColor: 'rgba(245, 158, 11, 0.6)',
        }]
    } : null;

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium">
                    Total Placements: {stats?.totalPlacements || 0}
                </div>
            </header>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <Upload className="text-indigo-600" />
                    <h2 className="text-lg font-semibold">Upload Placement Data (CSV)</h2>
                </div>
                <form onSubmit={handleUpload} className="flex gap-4 items-center">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
                    />
                    <button
                        type="submit"
                        disabled={!file}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                        Upload
                    </button>
                </form>
                {uploadStatus && <p className="mt-2 text-sm text-gray-600">{uploadStatus}</p>}
            </div>

            {/* Analytics Section */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart className="text-indigo-600" />
                            <h3 className="font-semibold">Top Hiring Companies</h3>
                        </div>
                        {companyChartData && <Bar data={companyChartData} />}
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="text-pink-600" />
                            <h3 className="font-semibold">In-Demand Skills</h3>
                        </div>
                        <div className="w-full max-w-xs mx-auto">
                            {skillChartData && <Pie data={skillChartData} />}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-green-600" />
                            <h3 className="font-semibold">Average Salary Trends (Year-over-Year)</h3>
                        </div>
                        <div className="h-64">
                            {salaryTrendData && <Line data={salaryTrendData} options={{ maintainAspectRatio: false }} />}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-orange-600" />
                            <h3 className="font-semibold">Branch-wise Placement Distribution</h3>
                        </div>
                        <div className="h-64">
                            {branchData && <Bar data={branchData} options={{ maintainAspectRatio: false }} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
